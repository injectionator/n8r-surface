import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateArtefact, encode, decode, verifyReferences, verifySuccessor, digest, renderResearchHtml, readResearchHtml} from '../dist/index.js';
const root = new URL('../examples/researcher/descriptions/', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const fixture = name => JSON.parse(read(name + '.json'));
const bundle = () => ['research-r1', 'research-r2', 'capability'].map(fixture);

test('JSON descriptions preserve possibilities, configured targets, unknowns and unresolved conflicts', () => {
  for (const name of ['capability', 'bound-r1', 'bound-r2']) {
    const a = fixture(name);
    assert.deepEqual(decode(encode(a, 'json'), 'json'), a);
    verifyReferences(a, bundle());
    assert.throws(() => encode(a, 'yaml'), /JSON/);
    assert.throws(() => decode(JSON.stringify(a), 'yaml'), /JSON/);
  }
  assert.deepEqual(fixture('capability').capabilities.map(x => x.state), ['possible','possible','possible','unknown']);
  assert.deepEqual(fixture('bound-r1').bindings.map(x => x.state), ['configured','conflicting','unknown']);
  const r = fixture('research-r1');
  assert.deepEqual(readResearchHtml(renderResearchHtml(r)), r);
  assert.equal(r.sources[0].digest, 'sha256:' + createHash('sha256').update(read('sources.md')).digest('hex'));
});

test('closed descriptions reject invented state, missing evidence, ambiguous targets and dangling references', () => {
  const changes = [b => b.bindings[0].state='exercised', b => b.bindings[0].claims=[],
    b => b.bindings[0].claims[0].basis=[], b => b.bindings[2].claims=b.bindings[0].claims,
    b => b.bindings[1].claims.pop(), b => b.bindings[1].claims[1].target=b.bindings[1].claims[0].target,
    b => b.nodes.push(b.nodes[0]), b => b.bindings[0].claims[0].target='urn:missing:node',
    b => b.nodes[0].type.vocabulary='urn:missing:vocab', b => b.records=[],
    b => b.extensions={'urn:settings:value':'SYNTHETIC_PRIVATE_SENTINEL'},
    b => b.bindings[0].settings={password:'SYNTHETIC_PRIVATE_SENTINEL'}];
  for (const change of changes) { const b=fixture('bound-r1'); change(b); assert.throws(() => validateArtefact(b)); }
  const c=fixture('capability');c.exclusiveGroups[0].members=['urn:cap:missing'];assert.throws(() => validateArtefact(c));
});

test('exact context, source facts and decisions cannot be substituted for one another', () => {
  const b=fixture('bound-r1');
  assert.throws(() => verifyReferences(b, []));
  const context=bundle();context[2].title='Changed';assert.throws(() => verifyReferences(b, context));
  for (const change of [b => b.bindings[0].capability='urn:cap:missing',
    b => b.bindings[0].claims[0].basis[0].items=['urn:decision:oidc'],
    b => b.bindings[0].claims[0].basis[0].items=['urn:f:oidc'],
    b => b.bindings[1].decisions[0].items=['urn:f:identity'],
    b => {b.bindings[1].state='configured';b.bindings[1].claims.pop();}]) {
    const changed=structuredClone(b);change(changed);assert.throws(() => verifyReferences(changed,bundle()));
  }
});

test('exclusive capabilities cannot both become configured', () => {
  const b=fixture('bound-r1'), r=fixture('research-r1');
  b.bindings[1].state='configured';b.bindings[1].claims.pop();
  r.findings[4].state='known';r.findings[4].claims.pop();
  const other=structuredClone(b.bindings[1]);other.id='urn:binding:saml';other.capability='urn:cap:saml';
  other.claims[0].target='urn:target:saml';other.claims[0].basis[0].items=['urn:f:saml-bound'];b.bindings.push(other);
  const f=structuredClone(r.findings[4]);f.id='urn:f:saml-bound';f.property='urn:cap:saml';f.claims[0].value='urn:target:saml';r.findings.push(f);
  b.records[0].digest=digest(r);
  // Pin a capability whose own evidence resolves to the updated research revision.
  const c=fixture('capability');c.records[0].digest=digest(r);b.capability.digest=digest(c);
  const single=structuredClone(b);single.bindings.pop();
  assert.doesNotThrow(() => verifyReferences(single,[r,c]));
  assert.throws(() => verifyReferences(b,[r,c]));
});

test('successors preserve instance and slot identity while allowing an evidenced changed target', () => {
  const before=fixture('bound-r1'), after=fixture('bound-r2'), original=JSON.stringify(before);
  verifySuccessor(before,after);verifyReferences(after,bundle());
  assert.equal(after.bindings[0].id,before.bindings[0].id);
  assert.equal(after.bindings[0].claims[0].target,'urn:target:mongodb');
  assert.equal(before.bindings[0].claims[0].target,'urn:target:atlas');
  assert.equal(JSON.stringify(before),original);
  for (const change of [b=>b.instance.id='urn:instance:other',b=>b.bindings[0].capability='urn:cap:oidc',
    b=>b.revision.parent.digest='sha256:'+'0'.repeat(64),b=>b.kind='capability',
    b=>b.nodes[0].type.term='different']) {
    const b=structuredClone(after);change(b);assert.throws(()=>verifySuccessor(before,b));
  }
  const c=fixture('capability'), c2=structuredClone(c);
  c2.revision={...c.revision,id:'r2',parent:{id:c.id,revision:'r1',digest:digest(c)}};
  c2.capabilities[0].to='urn:node:oidc';assert.throws(()=>verifySuccessor(c,c2));
});

test('malformed description diagnostics never echo supplied secret sentinels', () => {
  const sentinel='SYNTHETIC_PRIVATE_SENTINEL';
  for (const change of [b=>b[sentinel]=true,b=>b.bindings[0].claims[0].target=sentinel,
    b=>b.id=sentinel,b=>b.extensions={[sentinel]:sentinel}]) {
    const b=fixture('bound-r1');change(b);
    for (const operation of [validateArtefact,x=>encode(x,'json'),x=>decode(JSON.stringify(x),'json'),x=>verifyReferences(x,bundle())]) {
      assert.throws(()=>operation(b),e=>!e.message.includes(sentinel));
    }
  }
  assert.throws(()=>decode('{"contract":"n8r.surface/0.2", "'+sentinel+'":','json'),e=>!e.message.includes(sentinel));
});


test('JSON parser and portable-value failures do not disclose malformed input keys', () => {
  const b=fixture('bound-r1'), sentinel='SYNTHETIC_PRIVATE_SENTINEL';
  const json=JSON.stringify(b).replace('"extensions":{}', '"extensions":{"'+sentinel+'":"\\ud800"}');
  assert.throws(()=>decode(json,'json'),e=>!e.message.includes(sentinel));
});

test('a configured binding cannot omit contradictory findings in its referenced research', () => {
  const r=fixture('research-r1'), c=fixture('capability'), b=fixture('bound-r1');
  const contrary=structuredClone(r.findings[3]);
  contrary.id='urn:f:contrary';contrary.claims[0].value='urn:target:mongodb';
  r.findings.push(contrary);
  c.records[0].digest=digest(r);b.records[0].digest=digest(r);b.capability.digest=digest(c);
  assert.throws(()=>verifyReferences(b,[r,c]));
  b.bindings[0].state='conflicting';
  b.nodes.push({id:'urn:target:mongodb',label:'Self-hosted MongoDB',type:b.nodes[0].type});
  b.bindings[0].claims.push({target:'urn:target:mongodb',basis:[{record:r.id,revision:'r1',items:[contrary.id]}]});
  assert.doesNotThrow(()=>verifyReferences(b,[r,c]));
});
