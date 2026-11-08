import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkBundle, saveBundle, readBundle} from '../dist/skill-artifacts.js';
const fixture=n=>JSON.parse(fs.readFileSync(`examples/researcher/relationships/${n}.json`,'utf8'));
const bundle=(rev='r1')=>({research:fixture(`research-${rev}`),surface:fixture(`bound-${rev}`),dependencies:[fixture('capability'),fixture('research-r1')]});
test('saves checked standalone Bound files and preserves predecessor on revision',()=>{
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'surface-skill-')));
 try {
  const first=path.join(root,'first'),second=path.join(root,'second');
  saveBundle(bundle(),first);
  const before=fs.readFileSync(path.join(first,'surface.json'));
  assert.equal(readBundle(first).surface.kind,'bound');
  saveBundle(bundle('r2'),second,first);
  assert.deepEqual(fs.readFileSync(path.join(first,'surface.json')),before);
  assert.match(fs.readFileSync(path.join(second,'brief.md'),'utf8'),/configured/);
  assert.throws(()=>saveBundle(bundle(),first));
  fs.appendFileSync(path.join(second,'research.html'),'edited');
  assert.throws(()=>readBundle(second));
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
test('rejects missing reference and initial orphan predecessor',()=>{
 const b=bundle(); b.dependencies=[]; assert.throws(()=>checkBundle(b));
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'surface-skill-')));
 try {assert.throws(()=>saveBundle(bundle('r2'),path.join(root,'orphan')));assert.deepEqual(fs.readdirSync(root),[]);}
 finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('privacy gate rejects URL, address and credential-like text without echoing input',()=>{
 for(const sentinel of ['https://private.invalid/value','192.0.2.44','password=synthetic-secret']){
 const b=bundle(); b.research.notes.push({by:'researcher',at:'2026-11-08T10:00:00Z',text:sentinel});
 assert.throws(()=>checkBundle(b),e=>!e.message.includes(sentinel));
 }
});
test('standalone bundle runs without checkout modules and saves Capability',async()=>{
 const {spawnSync}=await import('node:child_process');
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'surface-skill-')));
 try{
  fs.copyFileSync('plugins/n8r-surface/skills/research/scripts/artifacts.mjs',path.join(root,'artifacts.mjs'));
  const b={research:fixture('research-r1'),surface:fixture('capability'),dependencies:[]};
  fs.writeFileSync(path.join(root,'bundle.json'),JSON.stringify(b));
  const result=spawnSync(process.execPath,['artifacts.mjs','save','bundle.json','saved'],{cwd:root,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr); assert.match(result.stdout,/saved-and-read-back/);
  assert.equal(readBundle(path.join(root,'saved')).surface.kind,'capability');
  fs.symlinkSync(path.join(root,'saved'),path.join(root,'linked'));
  assert.throws(()=>readBundle(path.join(root,'linked')));
  fs.writeFileSync(path.join(root,'bad.json'),'{"private-sentinel":"x"}');
  const bad=spawnSync(process.execPath,['artifacts.mjs','check','bad.json'],{cwd:root,encoding:'utf8'});
  assert.equal(bad.status,1);assert(!bad.stderr.includes('private-sentinel'));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('lost decisions and changed identity are refused before saving',()=>{
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'surface-skill-')));
 try{
  saveBundle(bundle(),path.join(root,'first'));
  const b=bundle('r2');b.research.decisions=[];
  assert.throws(()=>saveBundle(b,path.join(root,'bad'),path.join(root,'first')));
  assert(!fs.existsSync(path.join(root,'bad')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('opaque research extensions cannot retain secret fields',async()=>{
 const {digest}=await import('../dist/index.js');const b={research:fixture('research-r1'),surface:fixture('capability'),dependencies:[]};
 b.research.extensions={'urn:private:credentials':{username:'SYNTHETIC_USER_SENTINEL',password:'SYNTHETIC_PASSWORD_SENTINEL'}};
 b.surface.records[0].digest=digest(b.research);
 assert.throws(()=>checkBundle(b));
});
test('successor cannot rewrite an already pinned revision',async()=>{
 const {digest}=await import('../dist/index.js');
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'surface-skill-')));
 try{
  saveBundle(bundle(),path.join(root,'first'));
  const b=bundle('r2');b.dependencies[0].title='Changed pinned revision';b.surface.capability.digest=digest(b.dependencies[0]);
  assert.throws(()=>saveBundle(b,path.join(root,'bad'),path.join(root,'first')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('standalone input rejects duplicate keys before discarding claims',async()=>{
 const {spawnSync}=await import('node:child_process');
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'surface-skill-')));
 try{
 const b={research:fixture('research-r1'),surface:fixture('capability'),dependencies:[]};
 fs.writeFileSync(path.join(root,'bad.json'),JSON.stringify(b).replace('"kind":"capability"','"kind":"bound","kind":"capability"'));
 const r=spawnSync(process.execPath,['plugins/n8r-surface/skills/research/scripts/artifacts.mjs','check',path.join(root,'bad.json')],{encoding:'utf8'});
 assert.equal(r.status,1);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('exported digest does not echo unsafe property names in errors',async()=>{
 const {digest}=await import('../dist/skill-artifacts.js');
 const value=Object.defineProperty({},'SYNTHETIC_PRIVATE_KEY',{enumerable:true,get(){throw Error('must not run');}});
 assert.throws(()=>digest(value),e=>!e.message.includes('SYNTHETIC_PRIVATE_KEY'));
});
