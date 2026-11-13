import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {CodexRpc, runnerConfiguration, researcherInstructions} from '../dist/codex.js';

function server(script) {
  return spawn(process.execPath, ['--input-type=module', '-e', script], {stdio: ['pipe', 'pipe', 'pipe']});
}
test('RPC correlates responses and handles server tool calls before a response', async () => {
  const child = server(`import readline from 'node:readline';
    readline.createInterface({input:process.stdin}).on('line', l=>{
      const x=JSON.parse(l); if(x.method==='test') {
        console.log(JSON.stringify({id:'tool-1',method:'item/tool/call',params:{tool:'source_read',arguments:{path:'a'}}}));
        console.log(JSON.stringify({id:x.id,result:{ok:true}}));
      } else if(x.id==='tool-1') console.log(JSON.stringify({method:'tool-result',params:x.result}));
    });`);
  const calls=[]; const rpc = new CodexRpc(child, (method, params) => calls.push([method,params]), async () => ({success:true}));
  try { assert.deepEqual(await rpc.request('test', {}), {ok:true});
    await new Promise(r=>setTimeout(r,30)); assert.equal(calls[0][0],'tool-result');
  } finally { await rpc.close(); }
});
test('RPC rejects pending calls when the child exits or sends malformed JSON', async () => {
  for(const script of ['process.exit(3)', 'console.log("not json")']) {
    const rpc = new CodexRpc(server(script),()=>{}, async()=>({}));
    await assert.rejects(rpc.request('test',{}), /Codex|protocol/i); await rpc.close();
  }
});
test('RPC request timeout and close cannot strand pending promises', async () => {
  const rpc = new CodexRpc(server('process.stdin.resume()'),()=>{},async()=>({}));
  await assert.rejects(rpc.request('test',{},30),/timed out/i);
  const pending=assert.rejects(rpc.request('next',{}),/closed/i); await rpc.close(); await pending;
});
test('runner config disables inherited MCPs, requires ChatGPT and a complete permission profile', () => {
  const cfg=runnerConfiguration({mcp_servers:{sample:{enabled:true}}});
  assert.equal(cfg['mcp_servers.sample.enabled'],false);
  assert.equal(cfg.default_permissions,'n8r_source_tools');
  assert.deepEqual(cfg['permissions.n8r_source_tools'],{filesystem:{},network:{enabled:false}});
  assert.equal(cfg.forced_login_method,'chatgpt');
  assert.throws(()=>runnerConfiguration({model_provider:'another'}), /provider/i);
  assert.throws(()=>runnerConfiguration({chatgpt_base_url:'https://example.test'}), /endpoint/i);
});
test('bundled Researcher contains canonical instructions and references with a digest', () => {
  const instructions=researcherInstructions();
  assert.equal(instructions.version,'0.1.14');
  assert.match(instructions.digest,/^sha256:[a-f0-9]{64}$/);
  assert.match(instructions.text,/Skeleton Surface/);
  assert.match(instructions.text,/Recommended next steps/);
});
test('a preexisting reserved permission profile cannot widen the research profile by merging', () => {
  assert.throws(()=>runnerConfiguration({permissions:{n8r_source_tools:{filesystem:{'/':'read'}}}}), /reserved.*profile/i);
});

test('reopen retains unavailable historical evidence and compares it after restoration', async () => {
  const {ResearchConversation} = await import('../dist/codex.js');
  const hash='sha256:'+'a'.repeat(64), changed='sha256:'+'b'.repeat(64);
  const old={path:'removed.md',digest:hash,inspectedAt:'2026-01-01',startLine:1,endLine:1};
  let missing=true, context='';
  const session=Object.assign(Object.create(ResearchConversation.prototype),{
    evidence:[],output:()=>{},source:{read:path=>{if(missing)throw new Error('missing');return {...old,path,digest:changed};}},
    runTurn:async text=>{context=text;}
  });
  await session.reopen({text:'Saved app-1',digest:hash,metadata:{evidence:[old]}});
  assert.deepEqual(session.evidence,[old]);
  missing=false;
  await session.reopen({text:'Continued app-1',digest:hash,metadata:{evidence:session.evidence.slice()}});
  assert.match(context,/changed/);
  assert.ok(session.evidence.some(e=>e.digest===hash));
  assert.ok(session.evidence.some(e=>e.digest===changed));
});
test('reopen accepts 101 saved evidence files without embedding full source text', async () => {
  const {ResearchConversation} = await import('../dist/codex.js');
  const entries=Array.from({length:101},(_,n)=>({path:`file-${n}.md`,digest:'sha256:'+'a'.repeat(64),inspectedAt:'2026-01-01',startLine:1,endLine:200}));
  let context='';
  const session=Object.assign(Object.create(ResearchConversation.prototype),{
    evidence:[],output:()=>{},source:{read:path=>({...entries.find(e=>e.path===path),text:'x'.repeat(32000)})},
    runTurn:async text=>{context=text;}
  });
  await session.reopen({text:'Saved app-1',digest:'sha256:'+'a'.repeat(64),metadata:{evidence:entries}});
  assert.ok(Buffer.byteLength(context)<512*1024);
  assert.ok(!context.includes('x'.repeat(1000)));
  assert.equal(session.evidence.length,101);
});

test('Surface tool validates, permits repair and promotes only successful completed turns', async()=>{
  const {ResearchConversation}=await import('../dist/codex.js');const {content}=await import('./surface-fixture.mjs');
  const session=Object.assign(Object.create(ResearchConversation.prototype),{ready:Promise.resolve(),turnId:'t1',threadId:'thread',active:{resolve(){},reject(){},timer:setTimeout(()=>{},10000)},evidence:[],output:()=>{}});
  const call=args=>session.serve('item/tool/call',{threadId:'thread',turnId:'t1',tool:'surface_draft',arguments:args});
  try {
    const invalid=await call({research:{},surface:{}});assert.equal(invalid.success,false);assert.match(invalid.contentItems[0].text,/required/);
    const valid=content();session.evidence=[{path:'guide.md',digest:'sha256:'+'a'.repeat(64),inspectedAt:'2026-11-05T12:00:00Z',startLine:1,endLine:2}];
    const result=await call(valid);assert.equal(result.success,true,JSON.stringify(result));
    assert.equal(session.surfaceDraft,undefined);
    session.finish();assert.equal(session.surfaceDraft.surface.nodes[0].id,'urn:node:app');
  }finally{if(session.active)session.finish(new Error('cleanup'));}
});
test('failed or cancelled Surface turns cannot expose staged data', async()=>{
  const {ResearchConversation}=await import('../dist/codex.js');const {content}=await import('./surface-fixture.mjs');
  const session=Object.assign(Object.create(ResearchConversation.prototype),{ready:Promise.resolve(),turnId:'t1',threadId:'thread',active:{resolve(){},reject(){},timer:setTimeout(()=>{},10000)},evidence:[],output:()=>{}});
  session.evidence=[{path:'guide.md',digest:'sha256:'+'a'.repeat(64),inspectedAt:'2026-11-05T12:00:00Z',startLine:1,endLine:2}];
  const result=await session.serve('item/tool/call',{threadId:'thread',turnId:'t1',tool:'surface_draft',arguments:content()});
  assert.equal(result.success,true);session.finish(new Error('cancelled'));assert.equal(session.surfaceDraft,undefined);
});
test('fresh pair reopen retains historical evidence and bounds complete context',async()=>{
  const {ResearchConversation}=await import('../dist/codex.js');const {prepareSurfaceDraft}=await import('../dist/surface-draft.js');const {content}=await import('./surface-fixture.mjs');
  const draft=prepareSurfaceDraft(content());let text='';
  const old={path:'removed.md',digest:'sha256:'+'a'.repeat(64),inspectedAt:'2026-01-01',startLine:1,endLine:1};
  const session=Object.assign(Object.create(ResearchConversation.prototype),{evidence:[],source:{read(){throw new Error('missing');}},output(){},runTurn:async t=>{text=t;}});
  assert.equal(typeof session.reopenSurface,'function');
  await session.reopenSurface({...draft,manifest:{provenance:{evidence:[old]}}});
  assert.match(text,/unavailable/);assert.match(text,/urn:node:app/);assert.deepEqual(session.evidence,[old]);
  const huge=structuredClone(draft);huge.research.notes=[{by:'human',at:'2026-11-05T12:00:00Z',text:'x'.repeat(512*1024)}];
  await assert.rejects(session.reopenSurface({...huge,manifest:{provenance:{evidence:[old]}}}),/context.*512/i);
});
test('a rejected replacement draft cannot leave the earlier candidate eligible for saving',async()=>{
  const {ResearchConversation}=await import('../dist/codex.js');const {content}=await import('./surface-fixture.mjs');
  const session=Object.assign(Object.create(ResearchConversation.prototype),{ready:Promise.resolve(),turnId:'t1',threadId:'thread',active:{resolve(){},reject(){},timer:setTimeout(()=>{},10000)},evidence:[{path:'guide.md',digest:'sha256:'+'a'.repeat(64),inspectedAt:'2026-11-05T12:00:00Z',startLine:1,endLine:2}],output(){}});
  const call=args=>session.serve('item/tool/call',{threadId:'thread',turnId:'t1',tool:'surface_draft',arguments:args});
  try{assert.equal((await call(content())).success,true);assert.equal((await call({})).success,false);session.finish();assert.equal(session.surfaceDraft,undefined);}finally{if(session.active)session.finish(new Error('cleanup'));}
});
test('Markdown save turns cannot stage a Surface that the CLI never previews',async()=>{
  const {ResearchConversation}=await import('../dist/codex.js');const {content}=await import('./surface-fixture.mjs');
  const session=Object.assign(Object.create(ResearchConversation.prototype),{saving:true,ready:Promise.resolve(),turnId:'t1',threadId:'thread',active:{resolve(){},reject(){},timer:setTimeout(()=>{},10000)},evidence:[{path:'guide.md',digest:'sha256:'+'a'.repeat(64),inspectedAt:'2026-11-05T12:00:00Z',startLine:1,endLine:2}],output(){}});
  try{const result=await session.serve('item/tool/call',{threadId:'thread',turnId:'t1',tool:'surface_draft',arguments:content()});assert.equal(result.success,false);session.finish();assert.equal(session.surfaceDraft,undefined);}finally{if(session.active)session.finish(new Error('cleanup'));}
});
