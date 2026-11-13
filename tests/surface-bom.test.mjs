import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const fixture=()=>JSON.parse(fs.readFileSync('examples/researcher/surface-bom/initial.cdx.json','utf8'));
const module=await import('../dist/surface-bom.js').catch(()=>({}));
const check=b=>{assert.equal(typeof module.checkSurfaceBom,'function','BOM-only Surface profile checker must exist');return module.checkSurfaceBom(b);};
test('BOM alone recovers four alternatives, one selected dependency, evidence, choices and investigation',()=>{
 const s=check(fixture());assert.equal(s.relationships.length,5);assert.equal(s.relationships.filter(e=>e.selection==='selected').length,1);
 assert.equal(s.relationships.filter(e=>e.support==='supported').length,4);assert.equal(s.entries.find(e=>e.kind==='decision').evidence[0],'decision-1');
 assert.equal(s.bom.annotations.length,3);assert.match(s.objective,/storage/);
});
test('rejects dangling evidence, misleading dependency projection and unsupported profile versions',()=>{
 check(fixture());
 for(const mutate of [b=>b.annotations.pop(),b=>b.dependencies[0].dependsOn.push('db-a'),b=>b.properties[0].value='2',b=>b.citations[0].pointers=['/missing']]){
  const b=fixture();mutate(b);assert.throws(()=>check(b));
 }
});
test('selected and observed states require independent applicable evidence; placeholders cannot select',()=>{
 check(fixture());
 const change=fn=>{const b=fixture();const p=b.properties.find(p=>p.name==='n8r:surface:relationship');const e=JSON.parse(p.value);fn(e);p.value=JSON.stringify(e);return b;};
 assert.throws(()=>check(change(e=>e.selection='selected')));
 assert.throws(()=>check(change(e=>e.observations=[{at:'yesterday',evidence:['evidence-support'],note:'Observed'}])));
 assert.throws(()=>check(change(e=>{e.selection='selected';e.selectionEvidence=['evidence-support'];e.configuration=['${DATABASE_URL}'];})));
});
const persistence=await import('../dist/skill-surface-store.js').catch(()=>({}));
const views=await import('../dist/surface-view.js').catch(()=>({}));
import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
function temporary(fn){const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'surface-bom-')));try{fn(root);}finally{fs.rmSync(root,{recursive:true,force:true});}}
const hash=x=>'sha256:'+createHash('sha256').update(x).digest('hex');
function successor(b,bytes){const n=structuredClone(b);n.version++;n.properties.push({name:'n8r:surface:predecessor-digest',value:hash(bytes)});n.externalReferences.push({type:'bom',url:`urn:cdx:${b.serialNumber.slice(9)}/${b.version}`,comment:'Predecessor revision'});return n;}
test('saves only BOM authority and generated views; copied BOM reopens without siblings',()=>temporary(root=>{
 assert.equal(typeof persistence.saveSurface,'function');const dir=path.join(root,'001');persistence.saveSurface(fixture(),dir);
 assert.deepEqual(fs.readdirSync(dir).sort(),['brief.md','investigation.md','manifest.json','surface.cdx.json','surface.html']);
 const bomPath=path.join(dir,'surface.cdx.json'),bytes=fs.readFileSync(bomPath);fs.writeFileSync(path.join(root,'only.json'),bytes);
 assert.equal(persistence.readSurface(path.join(root,'only.json')).relationships.length,5);
 persistence.saveSurface(successor(fixture(),bytes),path.join(root,'002'),dir);
 assert.deepEqual(fs.readFileSync(bomPath),bytes);assert.throws(()=>persistence.saveSurface(fixture(),dir));
}));
test('changed journal blocks ordinary continuation; explicit reconciliation preserves edits and requires recorded decision',()=>temporary(root=>{
 assert.equal(typeof persistence.saveSurface,'function');const dir=path.join(root,'001');persistence.saveSurface(fixture(),dir);
 const bytes=fs.readFileSync(path.join(dir,'surface.cdx.json'));const next=successor(fixture(),bytes);
 fs.appendFileSync(path.join(dir,'investigation.md'),'\nPlease investigate inference first.\n');const edited=fs.readFileSync(path.join(dir,'investigation.md'));
 assert.throws(()=>persistence.saveSurface(next,path.join(root,'blocked'),dir));
 assert.throws(()=>persistence.saveSurface(next,path.join(root,'refused'),dir,true));
 next.properties.push({name:'n8r:surface:reconciliation',value:'Reviewed the edited journal with the user; retained the proposal and recorded choice-1 as the accepted decision.'});
 persistence.saveSurface(next,path.join(root,'002'),dir,true);assert.deepEqual(fs.readFileSync(path.join(dir,'investigation.md')),edited);
}));
test('refuses changed predecessor BOM, lost decisions and symlink destination',()=>temporary(root=>{
 assert.equal(typeof persistence.saveSurface,'function');const dir=path.join(root,'001');persistence.saveSurface(fixture(),dir);
 const bytes=fs.readFileSync(path.join(dir,'surface.cdx.json'));const next=successor(fixture(),bytes);
 next.properties=next.properties.filter(p=>!p.value.includes('choice-1'));assert.throws(()=>persistence.saveSurface(next,path.join(root,'lost'),dir));
 fs.symlinkSync(root,path.join(root,'link'));assert.throws(()=>persistence.saveSurface(fixture(),path.join(root,'link','bad')));
 fs.appendFileSync(path.join(dir,'surface.cdx.json'),' ');assert.throws(()=>persistence.saveSurface(successor(fixture(),bytes),path.join(root,'tampered'),dir,true));
}));
test('HTML exposes possible/selected paths, evidence and journal without executable source content',()=>{
 assert.equal(typeof views.renderSurface,'function');const b=fixture();b.components[0].name='<script>alert(1)</script>';
 const files=views.renderSurface(check(b));assert.match(files['surface.html'],/stroke-dasharray/);assert.match(files['surface.html'],/Selected/);
 assert.match(files['surface.html'],/evidence-selection/);assert(!files['surface.html'].includes('<script>alert(1)</script>'));
 assert.match(files['investigation.md'],/Which service hosts inference/);
});
test('observed flow and selected hosting retain their meanings without fabricating dependencies',()=>{
 const b=fixture();const a={...b.annotations[1],'bom-ref':'runtime-evidence',text:'Synthetic dated runtime record.'};b.annotations.push(a);
 b.properties.push({name:'n8r:surface:evidence',value:JSON.stringify({id:'runtime-evidence',basis:'observation',sources:[{index:0,locator:'runtime.txt:1'}],applicability:'Synthetic observation only.'})});
 const p=b.properties.find(p=>p.name==='n8r:surface:relationship'&&JSON.parse(p.value).to==='db-b');const e=JSON.parse(p.value);e.kind='hosting';e.observations=[{at:'2026-11-13T12:00:00Z',evidence:['runtime-evidence'],note:'Observed once.'}];p.value=JSON.stringify(e);b.dependencies=[];
 assert.equal(check(b).relationships.find(e=>e.to==='db-b').observations.length,1);
});
test('rejects duplicate reference IDs, invalid investigation links and nonspecific selection evidence',()=>{
 check(fixture());for(const mutate of [b=>b.annotations.push(b.annotations[0]),b=>{const p=b.properties.find(p=>p.name==='n8r:surface:entry');const e=JSON.parse(p.value);e.parent='missing';p.value=JSON.stringify(e);},b=>b.annotations[1].subjects=['app']]){const b=fixture();mutate(b);assert.throws(()=>check(b));}
});
test('standalone Surface helper saves outside repository without node_modules',async()=>{
 const {spawnSync}=await import('node:child_process');temporary(root=>{
  fs.copyFileSync('plugins/n8r-surface/skills/research/scripts/surface.mjs',path.join(root,'surface.mjs'));fs.writeFileSync(path.join(root,'input.json'),JSON.stringify(fixture()));
  const r=spawnSync(process.execPath,['surface.mjs','save','input.json','001'],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).status,'saved-and-read-back');
  const read=spawnSync(process.execPath,['surface.mjs','read','001/surface.cdx.json'],{cwd:root,encoding:'utf8'});assert.equal(read.status,0,read.stderr);assert.equal(JSON.parse(read.stdout).relationships.length,5);
 });
});
test('initial investigation plan saves before any source findings exist',()=>temporary(root=>{
 const b=fixture();b.components=[];b.services=[];b.dependencies=[];b.annotations=[];b.citations=[];b.externalReferences=[];
 b.properties=b.properties.filter(p=>!['n8r:surface:relationship','n8r:surface:evidence','n8r:surface:entry'].includes(p.name));
 b.properties.push({name:'n8r:surface:entry',value:JSON.stringify({id:'start',kind:'next',title:'Read supplied sources',text:'Map AI paths from the selected source.',status:'open',reason:'Initial orientation',access:'Supplied checkout',evidence:[],at:'2026-11-13T12:00:00Z'})});
 persistence.saveSurface(b,path.join(root,'001'));assert.equal(persistence.readSurface(path.join(root,'001')).entries.length,1);
}));
test('successors retain relationship identity, source references and historical evidence',()=>temporary(root=>{
 const dir=path.join(root,'001');persistence.saveSurface(fixture(),dir);const bytes=fs.readFileSync(path.join(dir,'surface.cdx.json'));
 for(const mutate of [b=>b.properties=b.properties.filter(p=>!(p.name==='n8r:surface:relationship'&&JSON.parse(p.value).id==='inference')),b=>b.annotations[0].text='Silently rewritten evidence',b=>b.externalReferences[0].comment='Changed source applicability']){const next=successor(fixture(),bytes);mutate(next);assert.throws(()=>persistence.saveSurface(next,path.join(root,'next'),dir));}
}));
test('canonical BOM path checks sibling edited views; a copied standalone BOM remains independent',()=>temporary(root=>{
 const dir=path.join(root,'001');persistence.saveSurface(fixture(),dir);const file=path.join(dir,'surface.cdx.json'),bytes=fs.readFileSync(file);
 fs.appendFileSync(path.join(dir,'investigation.md'),'\nEdited proposal\n');assert.throws(()=>persistence.readSurface(dir));assert.throws(()=>persistence.readSurface(file));
 assert.throws(()=>persistence.saveSurface(successor(fixture(),bytes),path.join(root,'002'),file));
 fs.writeFileSync(path.join(root,'copy.json'),bytes);assert.equal(persistence.readSurface(path.join(root,'copy.json')).relationships.length,5);
}));
test('unconnected identified components remain inspectable in brief and HTML',()=>{
 const b=fixture();b.components.push({'bom-ref':'isolated-model',type:'machine-learning-model',name:'Model with unknown serving path'});
 const files=views.renderSurface(check(b));for(const name of ['brief.md','surface.html']){assert.match(files[name],/Model with unknown serving path/);assert.match(files[name],/machine-learning-model/);assert.match(files[name],/isolated-model/);}
});
test('successors cannot drop historical observation date, note or relationship association',()=>temporary(root=>{
 const b=fixture();b.annotations.push({...b.annotations[1],'bom-ref':'observation-1',text:'Synthetic observed runtime call.'});b.properties.push({name:'n8r:surface:evidence',value:JSON.stringify({id:'observation-1',basis:'observation',sources:[{index:0,locator:'trace.txt:1'}],applicability:'One synthetic run'})});
 const p=b.properties.find(p=>p.name==='n8r:surface:relationship'&&JSON.parse(p.value).to==='db-b');const e=JSON.parse(p.value);e.observations=[{at:'2026-11-13T12:00:00Z',note:'One synthetic observed call',evidence:['observation-1']}];p.value=JSON.stringify(e);
 const dir=path.join(root,'001');persistence.saveSurface(b,dir);const next=successor(b,fs.readFileSync(path.join(dir,'surface.cdx.json')));const np=next.properties.find(p=>p.name==='n8r:surface:relationship'&&JSON.parse(p.value).to==='db-b');const ne=JSON.parse(np.value);ne.observations=[];np.value=JSON.stringify(ne);assert.throws(()=>persistence.saveSurface(next,path.join(root,'002'),dir));
}));
