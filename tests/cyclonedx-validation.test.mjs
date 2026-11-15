import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBom} from '../dist/cyclonedx-validation.js';
const bom=url=>({bomFormat:'CycloneDX',specVersion:'1.7',version:1,externalReferences:[{type:'documentation',url}]});
test('accepts source URNs and existing IRI references without rewriting them',()=>{
 for(const url of ['urn:example:source-notes','URN:example:source/a%20b?+resolve?=query#part','urn:uuid:123e4567-e89b-12d3-a456-426614174000','urn:cdx:123e4567-e89b-12d3-a456-426614174000/1#node','../notes/source.md','https://example.org/資料'])assert.doesNotThrow(()=>validateBom(bom(url)),url);
});
test('rejects malformed URNs with useful value-free diagnostics',()=>{
 for(const url of ['urn:example:','urn:-bad:source','urn:example:private sentinel','urn:example:bad%ZZ','urn:example:source?bad','urn:example:source#one#two']){
  assert.throws(()=>validateBom(bom(url)),e=>e.message.includes('/externalReferences/0/url')&&e.message.includes('format')&&!e.message.includes(url));
 }
});
test('reports schema locations and reference failures without disclosing input values',()=>{
 const bad=bom('https://example.org');bad.components=[{type:'private-sentinel',name:'private-sentinel','bom-ref':'private-sentinel'}];
 assert.throws(()=>validateBom(bad),e=>e.message.includes('/components/0/type')&&e.message.includes('enum')&&!e.message.includes('private-sentinel'));
 bad.components=[{type:'application',name:'App','bom-ref':'app'}];bad.dependencies=[{ref:'app',dependsOn:['private-sentinel']}];
 assert.throws(()=>validateBom(bad),e=>e.message.includes('/dependencies/0/dependsOn/0')&&!e.message.includes('private-sentinel'));
 const injected=bom('https://example.org');injected['private-sentinel']='hidden';
 assert.throws(()=>validateBom(injected),e=>!e.message.includes('private-sentinel'));
});
