import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const api=await import('../dist/recent.js').catch(()=>({}));
test('saved-work index reopens latest revision by title while retaining other work',t=>{
 assert.equal(typeof api.rememberWork,'function');
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'recent-'));t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
 const item={id:'urn:one',title:'Assistant connections',source:'/source',path:'/vault/one/surface.json',model:'chosen-model'};
 api.rememberWork(home,item);api.rememberWork(home,{...item,id:'urn:two',title:'Other work'});
 api.rememberWork(home,{...item,path:'/vault/two/surface.json'});
 assert.deepEqual(api.recentWork(home).map(x=>[x.id,x.path]),[['urn:one','/vault/two/surface.json'],['urn:two','/vault/one/surface.json']]);
 assert.deepEqual(api.recentWork(home)[0].title,'Assistant connections');
});
test('damaged or symlinked recent index is preserved and never silently replaced',t=>{
 assert.equal(typeof api.rememberWork,'function');
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'recent-'));t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
 fs.mkdirSync(path.join(home,'.n8r'));const file=path.join(home,'.n8r/recent.json');fs.writeFileSync(file,'human edits');
 assert.throws(()=>api.recentWork(home));
 assert.throws(()=>api.rememberWork(home,{id:'urn:one',title:'One',source:'/source',path:'/saved',model:'model'}));
 assert.equal(fs.readFileSync(file,'utf8'),'human edits');
 fs.unlinkSync(file);const target=path.join(home,'target');fs.writeFileSync(target,'[]');fs.symlinkSync(target,file);
 assert.throws(()=>api.rememberWork(home,{id:'urn:one',title:'One',source:'/source',path:'/saved',model:'model'}));
 assert.equal(fs.readFileSync(target,'utf8'),'[]');
});
