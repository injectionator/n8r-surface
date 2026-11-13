import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {saveBundle} from '../dist/skill-artifacts.js';
const api=await import('../dist/skill-cyclonedx.js');
const fixture=n=>JSON.parse(fs.readFileSync(`examples/researcher/relationships/${n}.json`,'utf8'));
const bundle=(rev='r1')=>({research:fixture(`research-${rev}`),surface:fixture(`bound-${rev}`),dependencies:[fixture('capability'),fixture('research-r1')]});
const mapping=b=>({nodes:b.surface.nodes.map(n=>({id:n.id,kind:n.id==='urn:node:app'?'component':'service',...(n.id==='urn:node:app'?{type:'application'}:{}),rationale:'Synthetic classification for this fixture.'})),dependencies:['urn:cap:database']});
function ready(){assert.equal(typeof api.projectBundle,'function','checked CycloneDX projection must be implemented');}
function temporary(fn){const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'surface-cdx-')));try{return fn(root);}finally{fs.rmSync(root,{recursive:true,force:true});}}
test('projects service inventory and configured concrete target instead of role or conflicting identity',()=>{
 ready();const b=bundle(),{bom,report}=api.projectBundle(b,mapping(b));
 assert.equal(bom.specVersion,'1.7');assert.equal(bom.components[0].name,'Assistant');
 assert.equal(bom.services.find(x=>x['bom-ref']==='urn:target:atlas').name,'MongoDB Atlas');
 assert.deepEqual(bom.dependencies,[{ref:'urn:node:app',dependsOn:['urn:target:atlas']}]);
 assert.equal(bom.compositions[0].aggregate,'unknown');assert.equal(bom.metadata.lifecycles,undefined);
 assert.equal(report.relationships.length,3);assert.equal(report.relationships.find(x=>x.id==='urn:cap:oidc').projected,false);
 assert.match(report.losses.join(' '),/purpose/i);api.validateBom(bom);
});
test('requires exact node mapping and rejects fabricated, ambiguous or unsafe projection metadata',()=>{
 ready();const b=bundle();
 for(const mutate of [m=>m.nodes.pop(),m=>m.nodes.push(m.nodes[0]),m=>m.nodes[0].type='bogus',m=>m.nodes[0].version='invented',m=>m.nodes[0].rationale='password=private-sentinel',m=>m.dependencies.push('missing'),m=>m.dependencies.push('urn:cap:oidc'),m=>m.dependencies.push('urn:cap:inference')]){
 const m=mapping(b);mutate(m);assert.throws(()=>api.projectBundle(b,m),e=>!e.message.includes('private-sentinel'));
 }
});
test('Capability alternatives remain evidence rather than concrete dependency links',()=>{
 ready();const b={research:fixture('research-r1'),surface:fixture('capability'),dependencies:[]};const m=mapping(b);
 assert.throws(()=>api.projectBundle(b,m));m.dependencies=[];
 const {bom}=api.projectBundle(b,m);assert.equal(bom.dependencies,undefined);assert.match(bom.components[0].description,/capability/i);
});
test('schema and reference validation reject malformed model type and unresolved dependency',()=>{
 ready();const b=bundle(),{bom}=api.projectBundle(b,mapping(b));
 const bad=structuredClone(bom);bad.components[0].type='not-a-type';assert.throws(()=>api.validateBom(bad));
 const dangling=structuredClone(bom);dangling.dependencies[0].dependsOn=['missing'];assert.throws(()=>api.validateBom(dangling));
 const version=structuredClone(bom);version.specVersion='1.6';assert.throws(()=>api.validateBom(version));
});
test('exchange saves beside native bundle, retains lineage and rejects tampering or overwrites',()=>temporary(root=>{
 ready();const b=bundle(),b2=bundle('r2');const native=path.join(root,'native'),native2=path.join(root,'native2');
 saveBundle(b,native);saveBundle(b2,native2,native);
 const before=fs.readFileSync(path.join(native,'manifest.json'));
 const first=path.join(root,'export1'),second=path.join(root,'export2');
 api.saveExchange(native,mapping(b),first);const prior=fs.readFileSync(path.join(first,'manifest.json'));
 api.saveExchange(native2,mapping(b2),second,first);
 const a=api.readExchange(first),z=api.readExchange(second);
 assert.equal(a.bom.serialNumber,z.bom.serialNumber);assert.equal(z.bom.version,2);
 assert.deepEqual(z.bom.dependencies,[{ref:'urn:node:app',dependsOn:['urn:target:mongodb']}]);
 assert.deepEqual(fs.readFileSync(path.join(first,'manifest.json')),prior);assert.deepEqual(fs.readFileSync(path.join(native,'manifest.json')),before);
 assert.throws(()=>api.saveExchange(native,mapping(b),first));
 fs.appendFileSync(path.join(second,'surface.cdx.json'),' ');assert.throws(()=>api.readExchange(second));
}));
test('orphan native successor and symlink output cannot be exported as an initial lineage',()=>temporary(root=>{
 ready();const first=path.join(root,'native'),second=path.join(root,'next');saveBundle(bundle(),first);saveBundle(bundle('r2'),second,first);
 assert.throws(()=>api.saveExchange(second,mapping(bundle('r2')),path.join(root,'orphan')));
 fs.symlinkSync(root,path.join(root,'link'));assert.throws(()=>api.saveExchange(first,mapping(bundle()),path.join(root,'link','bad')));
 assert(!fs.existsSync(path.join(root,'bad')));
}));
test('standalone exchange helper runs outside checkout without node_modules or native CLI side effects',async()=>{
 const {spawnSync}=await import('node:child_process');
 temporary(root=>{
  const source='plugins/n8r-surface/skills/research/scripts/cyclonedx.mjs';
  assert(fs.existsSync(source),'standalone exchange helper must be bundled');
  fs.copyFileSync(source,path.join(root,'cyclonedx.mjs'));
  const b=bundle();saveBundle(b,path.join(root,'native'));fs.writeFileSync(path.join(root,'map.json'),JSON.stringify(mapping(b)));
  const result=spawnSync(process.execPath,['cyclonedx.mjs','export','native','map.json','exchange'],{cwd:root,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).status,'saved-and-read-back');
  assert.equal(api.readExchange(path.join(root,'exchange')).bom.specVersion,'1.7');
 });
});
