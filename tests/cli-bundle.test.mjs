import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {prepareSurfaceDraft,previewSurface} from '../dist/surface-draft.js';
import {SurfaceStore,readSurfacePair} from '../dist/surface-store.js';
import {readBundle,saveBundle} from '../dist/skill-artifacts.js';
const fixture=n=>JSON.parse(fs.readFileSync(`examples/researcher/relationships/${n}.json`,'utf8'));
const bundle=(r='r1')=>({research:fixture(`research-${r}`),surface:fixture(`bound-${r}`),dependencies:[fixture('capability'),fixture('research-r1')]});
const provenance={researcher:{version:'0.1.11',digest:'sha256:'+'a'.repeat(64)},model:'fixture',evidence:[]};
test('CLI saves skill-readable bundles and fresh reopen preserves dependencies and predecessors',t=>{
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'cli-bundle-')));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const vault=path.join(root,'vault'),source=path.join(root,'source');fs.mkdirSync(vault);fs.mkdirSync(source);
 const draft=prepareSurfaceDraft(bundle());
 assert.match(previewSurface(draft),/Bound/);
 const first=new SurfaceStore(vault,source).save(draft,provenance);
 assert.equal(readBundle(first.directory).surface.contract,'n8r.surface/0.3');
 const bytes=Object.fromEntries(fs.readdirSync(first.directory).map(n=>[n,fs.readFileSync(path.join(first.directory,n))]));
 const reopened=readSurfacePair(first.researchPath);
 assert.deepEqual(reopened.dependencies,bundle().dependencies);
 const next=prepareSurfaceDraft(bundle('r2'),{previous:reopened});
 const second=new SurfaceStore(vault,source,reopened).save(next,provenance);
 assert.equal(readSurfacePair(second.surfacePath).surface.revision.id,'r2');
 assert.deepEqual(Object.fromEntries(fs.readdirSync(first.directory).map(n=>[n,fs.readFileSync(path.join(first.directory,n))])),bytes);
 fs.appendFileSync(path.join(second.directory,'dependencies.json'),' ');
 assert.throws(()=>readSurfacePair(second.surfacePath));
});
test('bundle staging rejects missing dependencies and lost human decisions',()=>{
 const b=bundle(); b.dependencies=[];assert.throws(()=>prepareSurfaceDraft(b));
 const next=bundle('r2');next.research.decisions=[];
 assert.throws(()=>prepareSurfaceDraft(next,{previous:prepareSurfaceDraft(bundle())}));
});

test('CLI reopens a standalone skill bundle without inventing runner provenance',t=>{
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'cli-skill-')));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const b=bundle();
 saveBundle(b,path.join(root,'saved'));
 const saved=readSurfacePair(path.join(root,'saved/surface.json'));
 assert.equal(saved.manifest.provenance,undefined);
 assert.deepEqual(saved.dependencies,b.dependencies);
});
test('fresh reopen compares sources of pinned dependency research too',async()=>{
 const {ResearchConversation}=await import('../dist/codex.js');
 const {SourceTools}=await import('../dist/source-tools.js');
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'cli-evidence-')));
 try {
  const b=bundle('r2');
  b.research.sources.forEach(s=>s.location='bound.txt');
  b.dependencies.filter(a=>a.contract==='n8r.research/0.1').forEach(r=>r.sources.forEach(s=>s.location='capability.txt'));
  fs.writeFileSync(path.join(root,'bound.txt'),'Current bound evidence');
  const session=Object.create(ResearchConversation.prototype);
  session.source=new SourceTools(root);session.evidence=[];
  const output=[];session.output=s=>output.push(s);
  // Only inference is replaced; source comparison uses the actual filesystem.
  session.runTurn=async()=>{};
  await session.reopenSurface({...b,manifest:{}});
  assert(output.some(s=>s.includes('bound.txt: changed')));
  assert(output.some(s=>s.includes('capability.txt: unavailable')));
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
