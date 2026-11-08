import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync,unlinkSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createReport,recordReview} from '../scripts/skill-acceptance/review.mjs';

const names=['Create a workspace without beginning research','Repeat setup without replacing existing work','Reopen without the setup conversation'];
function fixture(t) {
 const root=mkdtempSync(join(tmpdir(),'n8r-review-test-'));t.after(()=>rmSync(root,{recursive:true,force:true}));
 const put=(name,value)=>writeFileSync(join(root,name),JSON.stringify(value));
 put('metadata.json',{source:'a'.repeat(40),cli:'codex-cli 0.166.0',model:'synthetic',node:'v22',platform:'synthetic',installation:{version:'0.1.9',revision:'b'.repeat(40)}});
 put('results.json',names.map(name=>({name,automated:'passed',durationMs:10,reviewRequired:['Useful next step'],error:null})));
 const text='Actual response\n```\n# Not report instructions\n<script>do not execute</script>';
 for(let n=1;n<=3;n++)put(`${n}-turn.json`,{threadId:n===3?'fresh':'setup',durationMs:10,items:[{type:'userMessage',content:[{type:'text',text:'Set up here.'}]},{type:'agentMessage',phase:'final_answer',text},{type:'commandExecution',command:'cat /unrelated/skill',exitCode:1,status:'failed',aggregatedOutput:'Operation not permitted'},{type:'commandExecution',command:'node /installed/workspace.mjs inspect /fixture',exitCode:0,status:'completed',aggregatedOutput:'{"status":"recognized"}'}]});
 for(const f of ['create-inventory','repeat-before','repeat-after','reopen-before','reopen-after','final-inventory','final-record','settings-before','settings-after'])put(f+'.json',{});
 const created={'.n8r':{type:'directory'},'.n8r/workspace.json':{type:'file',sha256:'a'.repeat(64),mtime:'1',ctime:'1'}};
 put('create-inventory.json',created);
 for(const name of ['repeat-before','repeat-after','reopen-before','reopen-after','final-inventory'])put(name+'.json',{...created,'user-note.md':{type:'file',sha256:'b'.repeat(64),mtime:'2',ctime:'2'}});
 put('final-record.json',{format:'n8r.workspace/1',id:'12345678-1234-4123-8123-123456789abc',name:'workspace',purpose:'Investigate LibreChat'});
 put('final-capture.json',{inventory:{},errors:[]});
 put('installation-after.json',{version:'0.1.9',revision:'b'.repeat(40)});
 for(const f of ['setup','reopen'])writeFileSync(join(root,f+'.jsonl'),JSON.stringify({method:'response',params:{method:'command/exec',result:{exitCode:0,stdout:'denied evidence reads'}}})+'\n');
 return {root,put,text};
}
const verdicts={create:'Pass',repeat:'Pass',reopen:'Pass'};
const review=(root,run,extra={})=>recordReview(root,{run,reviewer:'Synthetic reviewer',verdicts,comment:'Synthetic test, not human acceptance',...extra});

test('report includes literal prompts/responses, denied activity and preservation evidence',t=>{
 const {root,text}=fixture(t);const r=createReport(root);const md=readFileSync(join(root,'review.md'),'utf8');
 assert(md.includes(text));assert(md.includes('Operation not permitted'));assert(md.includes('exit 1'));assert(md.includes('Set up here.'));assert(md.includes('Useful next step'));assert(md.includes('unchanged'));assert.match(r.run,/^[a-f0-9]{64}$/);
 assert(md.includes('````text\n'+text+'\n````'));
});
test('record binds reviewer and verdicts to evidence/report without rewriting results',t=>{
 const {root}=fixture(t);const before=readFileSync(join(root,'results.json'));const r=createReport(root);const result=review(root,r.run);
 assert.equal(result.overall,'Pass');assert.equal(result.run,r.run);assert.equal(result.reviewer,'Synthetic reviewer');assert.match(result.reportSha256,/^[a-f0-9]{64}$/);
 assert(readFileSync(join(root,'results.json')).equals(before));assert.throws(()=>review(root,r.run),/already|exist/i);
});
for(const change of ['modify','remove','add','report'])test(`reject ${change} after sealing`,t=>{
 const {root,put}=fixture(t);const r=createReport(root);
 if(change==='modify')put('1-turn.json',{changed:true});
 if(change==='remove')unlinkSync(join(root,'1-turn.json'));
 if(change==='add')put('unexpected.json',{});
 if(change==='report')writeFileSync(join(root,'review.md'),'changed');
 assert.throws(()=>review(root,r.run),/changed|missing|differ/i);
});
test('wrong fingerprint, invalid/missing verdicts and blank reviewer fail',t=>{
 const {root}=fixture(t);const r=createReport(root);
 assert.throws(()=>review(root,'0'.repeat(64)),/fingerprint|run/i);
 assert.throws(()=>review(root,r.run,{verdicts:{...verdicts,create:'Maybe'}}),/verdict/i);
 assert.throws(()=>review(root,r.run,{verdicts:{create:'Pass'}}),/verdict/i);
 assert.throws(()=>review(root,r.run,{reviewer:' '}),/reviewer/i);
});
test('failed final checks cannot be overridden by human Pass',t=>{
 const {root,put}=fixture(t);put('installation-changed.json',{message:'changed'});const r=createReport(root);
 assert.equal(review(root,r.run).overall,'Fail');
});
test('missing evidence remains blocked, even with human Pass',t=>{
 const {root}=fixture(t);unlinkSync(join(root,'3-turn.json'));const r=createReport(root);
 assert(readFileSync(join(root,'review.md'),'utf8').includes('Missing'));
 assert.equal(review(root,r.run).overall,'Blocked');
});
test('human Fail and Blocked remain distinct',t=>{
 for(const verdict of ['Fail','Blocked']){const {root}=fixture(t);const r=createReport(root);assert.equal(review(root,r.run,{verdicts:{...verdicts,reopen:verdict}}).overall,verdict);}
});
test('symlinks refused, cleanup receipt does not invalidate reviewed evidence',t=>{
 const {root,put}=fixture(t);const r=createReport(root);put('cleanup.json',{removed:'owned fixture'});assert.equal(createReport(root).run,r.run);
 symlinkSync(join(root,'results.json'),join(root,'linked.json'));assert.throws(()=>review(root,r.run),/regular|symlink/i);
});

test('offline CLI generates report and records verdict without Codex or inference',async t=>{
 const {spawnSync}=await import('node:child_process');const {root}=fixture(t);
 const command=['scripts/skill-acceptance/run.mjs'];
 const run=(args)=>spawnSync(process.execPath,[...command,...args],{encoding:'utf8',env:{...process.env,PATH:'/no-codex'}});
 let result=run(['--report','--evidence',root]);assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/Run fingerprint:/);
 const manifest=JSON.parse(readFileSync(join(root,'review-manifest.json'),'utf8'));
 result=run(['--review','--evidence',root,'--run',manifest.run,'--reviewer','Synthetic CLI reviewer','--create','Pass','--repeat','Pass','--reopen','Blocked','--comment','Synthetic rehearsal']);
 assert.equal(result.status,2,result.stderr);assert.match(result.stdout,/Overall: Blocked/);
 result=run(['--live','--review','--evidence',root]);assert.equal(result.status,2);assert.match(result.stderr,/exactly one mode/);
});

test('corrupt session receipts cannot become a passing review',t=>{
 const {root}=fixture(t);writeFileSync(join(root,'setup.jsonl'),'not json\n');const r=createReport(root);assert.equal(review(root,r.run).overall,'Blocked');
});

test('report exposes an existing human verdict separately from raw pending output',t=>{
 const {root}=fixture(t);const r=createReport(root);review(root,r.run);
 assert.equal(createReport(root).humanReview.overall,'Pass');
});

test('null evidence and missing final responses or criteria are blocked',t=>{
 for(const name of ['1-turn.json','final-capture.json','final-record.json','repeat-before.json','metadata.json']) {
  const {root,put}=fixture(t);put(name,null);const r=createReport(root);assert.equal(review(root,r.run).overall,'Blocked',name);
 }
 for(const missing of ['response','criteria']) {
  const {root,put}=fixture(t);
  if(missing==='response')put('1-turn.json',{items:[{type:'userMessage',content:[]}],threadId:'setup'});
  else put('results.json',names.map(name=>({name,automated:'passed'})));
  const r=createReport(root);assert.equal(review(root,r.run).overall,'Blocked');
 }
});
test('failed partial turns show their prompts and failed tools from raw session receipts',t=>{
 const {root}=fixture(t);unlinkSync(join(root,'3-turn.json'));
 const events=[{method:'request',params:{method:'turn/start',params:{threadId:'fresh',input:[{type:'text',text:'Actual interrupted prompt'}]}}},{method:'item/completed',params:{item:{type:'commandExecution',command:'cat /denied',status:'failed',exitCode:1,aggregatedOutput:'Actual denied output'}}}];
 writeFileSync(join(root,'reopen.jsonl'),events.map(e=>JSON.stringify(e)).join('\n'));
 createReport(root);const report=readFileSync(join(root,'review.md'),'utf8');
 assert(report.includes('Actual interrupted prompt'));assert(report.includes('Actual denied output'));assert(report.includes('cat /denied'));assert(report.includes('Incomplete turn'));
});

test('empty inventories are missing preservation proof, not unchanged success',t=>{
 const {root,put}=fixture(t);
 for(const name of ['create-inventory','repeat-before','repeat-after','reopen-before','reopen-after','final-inventory'])put(name+'.json',{});
 const r=createReport(root);assert.equal(review(root,r.run).overall,'Blocked');
});

test('every extra evidence filename is fingerprinted, including object-property names',t=>{
 const {root}=fixture(t);writeFileSync(join(root,'__proto__'),'original');const r=createReport(root);
 writeFileSync(join(root,'__proto__'),'changed');assert.throws(()=>review(root,r.run),/changed|missing/);
});
