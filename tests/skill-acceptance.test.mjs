import test from 'node:test';
import assert from 'node:assert/strict';
import {checkTurn, checkUnchanged, checkCreated, requirePredecessor} from '../scripts/skill-acceptance/checks.mjs';

const record = {format:'n8r.workspace/1', id:'12345678-1234-4123-8123-123456789abc', name:'workspace', purpose:'Investigate LibreChat'};
const inventory = {'.n8r':{type:'directory'}, '.n8r/workspace.json':{type:'file',sha256:'a',mtime:'1'}, 'user-note.md':{type:'file',sha256:'b',mtime:'2'}};
const helper = '/installed/skills/research/scripts/workspace.mjs';
const receipt = {type:'commandExecution',command:`node '${helper}' inspect '/fixture/workspace'`,exitCode:0,status:'completed',aggregatedOutput:JSON.stringify({status:'recognized',directory:'/fixture/workspace',record})};
const final = {type:'agentMessage',phase:'final_answer',text:`Ready at /fixture/workspace: ${record.id}, ${record.format}, Investigate LibreChat. Research is a next step.`};
const evidence = {items:[receipt,final],record,directory:'/fixture/workspace',helper,status:'recognized'};

test('actual helper receipt and response agree with independent identity',()=>assert.doesNotThrow(()=>checkTurn(evidence)));
test('synthetic wrong helper identity fails',()=>{
 const altered=structuredClone(evidence);altered.items[0].aggregatedOutput=JSON.stringify({status:'recognized',directory:evidence.directory,record:{...record,id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'}});
 assert.throws(()=>checkTurn(altered),/identity/);
});
test('synthetic wrong response identity fails',()=>assert.throws(()=>checkTurn({...evidence,items:[receipt,{...final,text:final.text.replace(record.id,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')}]}),/identity/));
test('missing or failed installed helper cannot pass',()=>{
 assert.throws(()=>checkTurn({...evidence,items:[final]}),/helper/);
 assert.throws(()=>checkTurn({...evidence,items:[{...receipt,exitCode:1},final]}),/helper/);
 assert.throws(()=>checkTurn({...evidence,items:[{...receipt,command:'node /checkout/workspace.mjs inspect /fixture/workspace'},final]}),/helper/);
});
test('changed note and added entries fail preservation',()=>{
 assert.doesNotThrow(()=>checkUnchanged(inventory,structuredClone(inventory)));
 const altered=structuredClone(inventory);altered['user-note.md'].sha256='changed';
 assert.throws(()=>checkUnchanged(inventory,altered),/changed/);
 assert.throws(()=>checkUnchanged(inventory,{...inventory,extra:{type:'file'}}),/changed/);
 const rewritten=structuredClone(inventory);rewritten['user-note.md'].mtime='3';
 assert.throws(()=>checkUnchanged(inventory,rewritten),/changed/);
});
test('create is exactly metadata with independent UUID, format, name and purpose',()=>{
 const created={'.n8r':{type:'directory'},'.n8r/workspace.json':{type:'file'}};
 assert.doesNotThrow(()=>checkCreated(record,created,'workspace'));
 assert.throws(()=>checkCreated(record,inventory,'workspace'),/only/);
 assert.throws(()=>checkCreated({...record,id:'wrong'},created,'workspace'),/UUID/);
 assert.throws(()=>checkCreated({...record,purpose:'Other'},created,'workspace'),/purpose/);
});
test('dependent scenarios cannot pass after a failed or blocked predecessor',()=>{
 for(const status of [undefined,'failed','blocked'])assert.throws(()=>requirePredecessor(status),/prerequisite/);
 assert.doesNotThrow(()=>requirePredecessor('passed'));
});

test('standard configured endpoints are accepted; custom endpoints are blocked',async()=>{
 const {checkProvider}=await import('../scripts/skill-acceptance/checks.mjs');
 assert.doesNotThrow(()=>checkProvider({model_provider:'openai',chatgpt_base_url:'https://chatgpt.com/backend-api/',openai_base_url:'https://api.openai.com/v1'}));
 assert.throws(()=>checkProvider({chatgpt_base_url:'https://example.com'}),/endpoint/);
 assert.throws(()=>checkProvider({model_providers:{openai:{}}}),/provider/);
});

test('repeat can refer to the selected folder; create must identify its location',()=>{
 const selected={...final,text:final.text.replace('/fixture/workspace','your selected folder')};
 assert.doesNotThrow(()=>checkTurn({...evidence,items:[receipt,selected]}));
 const created={...receipt,aggregatedOutput:JSON.stringify({status:'created',directory:evidence.directory,record})};
 assert.throws(()=>checkTurn({...evidence,status:'created',items:[created,selected]}),/destination/);
});

test('cleanup requires final evidence and the owned fixture token',async()=>{
 const fs=await import('node:fs');const os=await import('node:os');const path=await import('node:path');
 const {cleanupFixture}=await import('../scripts/skill-acceptance/checks.mjs');
 const fixture=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'n8r-skill-acceptance-')));
 const evidenceDir=fs.mkdtempSync(path.join(os.tmpdir(),'n8r-checker-evidence-'));
 try {
  fs.writeFileSync(path.join(fixture,'.owner'),'owned');
  fs.writeFileSync(path.join(evidenceDir,'ownership.json'),JSON.stringify({root:fixture,token:'wrong'}));
  fs.writeFileSync(path.join(evidenceDir,'final-inventory.json'),'{}');
  assert.throws(()=>cleanupFixture(evidenceDir));assert(fs.existsSync(fixture));
  fs.writeFileSync(path.join(evidenceDir,'ownership.json'),JSON.stringify({root:fixture,token:'owned'}));
  fs.unlinkSync(path.join(evidenceDir,'final-inventory.json'));
  assert.throws(()=>cleanupFixture(evidenceDir));assert(fs.existsSync(fixture));
  fs.writeFileSync(path.join(evidenceDir,'final-inventory.json'),'{}');
  cleanupFixture(evidenceDir);assert(!fs.existsSync(fixture));assert(fs.existsSync(evidenceDir));
 } finally {fs.rmSync(fixture,{force:true,recursive:true});fs.rmSync(evidenceDir,{force:true,recursive:true});}
});

test('only the exact missing-thread protocol response proves nonavailability',async()=>{
 const {isMissingThread}=await import('../scripts/skill-acceptance/checks.mjs');
 const id='old-session';
 assert.equal(isMissingThread({code:-32600,message:`thread not loaded: ${id}`},id),true);
 for(const error of [new Error('timeout'),{code:-32600,message:'other error'},{code:-32000,message:`thread not loaded: ${id}`},{code:-32600,message:'thread not loaded: another'}])assert.equal(isMissingThread(error,id),false);
});

test('failure evidence records symlinks and malformed JSON without following them',async()=>{
 const fs=await import('node:fs');const os=await import('node:os');const path=await import('node:path');
 const {captureFinal}=await import('../scripts/skill-acceptance/checks.mjs');
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'n8r-final-check-'));
 try {
  fs.mkdirSync(path.join(root,'.n8r'));fs.writeFileSync(path.join(root,'.n8r/workspace.json'),'{bad');
  fs.symlinkSync('/nonexistent',path.join(root,'link'));
  const result=captureFinal(root);
  assert.equal(result.inventory.link.type,'symlink');assert.equal(result.rawMetadata,'{bad');assert(result.errors.length>=2);
  fs.rmSync(root,{recursive:true});assert(captureFinal(root).errors.length>0);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});

test('stdio adapter preserves RPC errors and rejects timeouts distinctly',async t=>{
 const {Rpc}=await import('../scripts/skill-acceptance/rpc.mjs');
 const {EventEmitter}=await import('node:events');const {PassThrough}=await import('node:stream');
 const child=new EventEmitter();child.stdout=new PassThrough();child.stdin=new PassThrough();child.stderr=new PassThrough();child.kill=()=>{};child.exitCode=0;
 const rpc=new Rpc(child,()=>{},async()=>{});
 const response=rpc.request('thread/read',{threadId:'old'});
 child.stdout.write(JSON.stringify({id:1,error:{code:-32600,message:'thread not loaded: old'}})+'\n');
 await assert.rejects(response,error=>error.code===-32600 && error.message==='thread not loaded: old');
 t.mock.timers.enable({apis:['setTimeout']});
 const timeout=rpc.request('thread/read',{threadId:'old'});t.mock.timers.tick(45001);
 await assert.rejects(timeout,error=>!error.code && /timeout/.test(error.message));
 await rpc.close();
});

test('session startup is owned immediately and times out before Cucumber',async t=>{
 const {Host}=await import('../scripts/skill-acceptance/host.mjs');
 t.mock.timers.enable({apis:['setTimeout']});
 let rejectInitialize,owned,closed=0;
 const fake={log(){},initialize(){return new Promise((resolve,reject)=>{rejectInitialize=reject;});},async close(){closed++;rejectInitialize(new Error('startup closed'));}};
 class DelayedHost extends Host {constructor(){return fake;}}
 const started=DelayedHost.start({directory:'/fixture',installation:{root:'/installed'},discovery:{extra:{}},logFile:'/unused',deniedPaths:[],onHost:host=>owned=host});
 assert.equal(owned,fake);
 t.mock.timers.tick(30001);
 await assert.rejects(started,/startup closed/);assert(closed>=1);assert.equal(owned,fake);
});
