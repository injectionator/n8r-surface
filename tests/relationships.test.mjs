import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {decode, encode, digest, validateArtefact, verifyReferences, verifySuccessor} from '../dist/index.js';
const root=new URL('../examples/researcher/relationships/',import.meta.url);
const read=name=>readFileSync(new URL(name,root),'utf8');
const fixture=name=>JSON.parse(read(name+'.json'));
const context=()=>['research-r1','research-r2','capability'].map(fixture);
const pin=(a,r)=>{a.records=[{id:r.id,revision:r.revision.id,digest:digest(r)}];};

test('both descriptions expose the same explainable, evidenced relationship graph',()=>{
 for(const name of ['capability','bound-r1','bound-r2']){
  const a=fixture(name);assert.deepEqual(decode(encode(a,'json'),'json'),a);verifyReferences(a,context());
  const edge=a.relationships[0];
  assert.equal(edge.from,'urn:node:app');assert.equal(edge.to,'urn:node:mongodb');
  assert.equal(edge.type.term,'persists-data');
  assert.equal(edge.purpose.claims[0].value,'Persist conversation history and user profiles.');
  assert.equal(edge.integration.claims[0].value,'MongoDB client driver using the MongoDB wire protocol.');
  assert.deepEqual(edge.configuration.claims[0].value,[{owner:'urn:node:app',mechanism:'environment-variable',key:'CHAT_STORE_URI',location:'config/assistant.env.example'}]);
  assert.equal(a.relationships.at(-1).purpose.state,'unknown');
  assert.equal(a.relationships.at(-1).configuration.claims.length,0);
  assert.throws(()=>encode(a,'yaml'),/JSON/);
 }
 const r=fixture('research-r1');for(const source of r.sources) assert.equal(source.digest,'sha256:'+createHash('sha256').update(read(source.location)).digest('hex'));
 assert.match(read('config/assistant.env.example'),/CHAT_STORE_URI/);
});

test('known details require matching relationship/property/value source evidence, not decisions',()=>{
 for(const change of [e=>e.purpose.claims[0].basis=[],e=>e.purpose.claims[0].basis[0].items=['urn:decision:oidc'],
  e=>e.purpose.claims[0].basis[0].items=['urn:f:database-integration'],e=>e.purpose.claims[0].value='Unsupported purpose',
  e=>e.purpose.state='conflicting',e=>e.purpose.state='unknown',e=>delete e.configuration,
  e=>e.configuration.claims[0].value[0].owner='urn:node:missing',
  e=>e.configuration.claims[0].value[0].value='SYNTHETIC_PRIVATE_SENTINEL',
  e=>e.configuration.claims[0].value[0].location='/private/SYNTHETIC_PRIVATE_SENTINEL']){
  for(const name of ['capability','bound-r1']){
   const a=fixture(name);change(a.relationships[0]);
   assert.throws(()=>verifyReferences(a,context()),err=>!err.message.includes('SYNTHETIC_PRIVATE_SENTINEL'));
  }
 }
});

test('Bound edges resolve locally and agree with the pinned Capability endpoints and type',()=>{
 for(const change of [e=>e.from='urn:node:missing',e=>e.to='urn:target:atlas',e=>e.type.term='unrelated',e=>e.id='urn:edge:missing']){
  const b=fixture('bound-r1');change(b.relationships[0]);assert.throws(()=>verifyReferences(b,context()));
 }
 const b=fixture('bound-r1');b.relationships.push(structuredClone(b.relationships[0]));assert.throws(()=>validateArtefact(b));
});

test('contradictory relationship metadata stays visible, including uncited findings',()=>{
 const b=fixture('bound-r1'),r=fixture('research-r1');
 const other=structuredClone(r.findings.find(f=>f.id==='urn:f:database-purpose'));
 other.id='urn:f:other-purpose';other.claims[0].value='Persist audit events only.';r.findings.push(other);pin(b,r);
 assert.throws(()=>verifyReferences(b,[r,fixture('capability')]));
 // Capability still pins the original research snapshot; use a separately identified
 // research record for the revised Bound evidence to avoid ambiguous same revisions.
 r.id='urn:demo:other-research';
 const replace=x=>{if(Array.isArray(x))x.forEach(replace);else if(x&&typeof x==='object'){if(x.record)x.record=r.id;Object.values(x).forEach(replace);}};
 replace(b.relationships);pin(b,r);
 assert.throws(()=>verifyReferences(b,[r,...context()]));
 const detail=b.relationships[0].purpose;detail.state='conflicting';
 detail.claims.push({value:other.claims[0].value,basis:[{record:r.id,revision:'r1',items:[other.id]}]});
 verifyReferences(b,[r,...context()]);
 const collapsed=structuredClone(b);collapsed.relationships[0].purpose.state='known';collapsed.relationships[0].purpose.claims.pop();
 assert.throws(()=>verifyReferences(collapsed,[r,...context()]));
});

test('successors keep shared edge identities and metadata while changing configured targets',()=>{
 const before=fixture('bound-r1'),after=fixture('bound-r2'),bytes=JSON.stringify(before);
 verifySuccessor(before,after);verifyReferences(after,context());
 assert.equal(after.relationships[0].id,before.relationships[0].id);
 assert.deepEqual(after.relationships[0].purpose.claims[0].value,before.relationships[0].purpose.claims[0].value);
 assert.equal(after.relationships[0].binding.claims[0].target,'urn:target:mongodb');
 assert.equal(before.relationships[0].binding.claims[0].target,'urn:target:atlas');assert.equal(JSON.stringify(before),bytes);
 for(const change of [a=>a.relationships[0].to='urn:target:atlas',a=>a.relationships[0].from='urn:node:oidc',a=>a.instance.id='urn:instance:other']){
  const changed=structuredClone(after);change(changed);assert.throws(()=>verifySuccessor(before,changed));
 }
});

test('relationship detail conflicts retain known versus absent assertions, even with the same value',()=>{
 for(const contraryValue of ['No conversation history is persisted.','Persist conversation history and user profiles.']){
  const c=fixture('capability'),r=fixture('research-r1'),detail=c.relationships[0].purpose;
  const contrary=structuredClone(r.findings.find(f=>f.id==='urn:f:database-purpose'));
  contrary.id='urn:f:absent-purpose';contrary.state='absent';contrary.claims[0].value=contraryValue;
  r.findings.push(contrary);pin(c,r);detail.state='conflicting';
  detail.claims.push({value:contraryValue,basis:[{record:r.id,revision:'r1',items:[contrary.id]}]});
  assert.doesNotThrow(()=>verifyReferences(c,[r]));
  if(contraryValue===detail.claims[0].value){
   contrary.state='known';pin(c,r);
   assert.throws(()=>verifyReferences(c,[r])); // two agreeing sources do not establish conflict
  }
 }
});

test('scoped absence metadata requires absence evidence rather than an unsupported assertion',()=>{
 const c=fixture('capability'),r=fixture('research-r1');c.relationships[0].purpose.state='absent';
 assert.throws(()=>verifyReferences(c,[r]));
 r.findings.find(f=>f.id==='urn:f:database-purpose').state='absent';pin(c,r);
 assert.doesNotThrow(()=>verifyReferences(c,[r]));
});
