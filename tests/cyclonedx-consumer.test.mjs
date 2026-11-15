import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const fixture=()=>JSON.parse(fs.readFileSync('examples/researcher/surface-bom/initial.cdx.json','utf8'));
test('public CycloneDX consumer validates, renders and persists with immutable revision checks',async()=>{
 const api=await import((process.env.N8R_CDX_PACKAGE||'n8r-surface')+'/cyclonedx').catch(()=>({}));
 assert.equal(typeof api.checkSurfaceBom,'function','public CycloneDX entry is consumable');
 const bom=fixture(),surface=api.checkSurfaceBom(bom);
 assert.equal(surface.relationships.length,5);
 const invalid=fixture();invalid.annotations.pop();assert.throws(()=>api.checkSurfaceBom(invalid));
 bom.components[0].name='<script>bad()</script>';
 assert(!api.renderSurface(api.checkSurfaceBom(bom))['surface.html'].includes('<script>bad()</script>'));
 const root=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'cdx-consumer-'));
 try {
  const first=path.join(root,'001');api.saveSurface(bom,first);
  assert.deepEqual(api.readSurface(first).bom,bom);
  const bytes=fs.readFileSync(path.join(first,'surface.cdx.json'));
  const next=structuredClone(bom);next.version=2;
  next.properties.push(api.property('predecessor-digest',api.byteDigest(bytes)));
  next.externalReferences.push({type:'bom',url:`urn:cdx:${bom.serialNumber.slice(9)}/1`});
  api.saveSurface(next,path.join(root,'002'),first);
  assert.equal(api.readSurface(path.join(root,'002')).bom.version,2);
  fs.appendFileSync(path.join(first,'surface.cdx.json'),' ');
  assert.throws(()=>api.saveSurface(next,path.join(root,'tampered'),first));
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
