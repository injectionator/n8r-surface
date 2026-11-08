import type {Artefact, ResearchRecord, SurfaceDefinition, SurfaceDescription} from './contracts.js';
import {canonical, digest, fail, portable} from './portable.js';
type Check = (v: unknown, p: string) => void;
const text: Check = (v, p) => { if (typeof v !== 'string' || !v.trim()) fail(p, 'requires nonempty string'); };
const match = (pattern: RegExp, label: string): Check => (v, p) => { text(v, p); if (!pattern.test(v as string)) fail(p, label); };
const id = match(/^[a-z][a-z0-9+.-]*:[^\s]+$/i, 'requires namespaced identifier');
const token = match(/^[A-Za-z0-9][A-Za-z0-9._-]*$/, 'requires revision/version token');
const hash = match(/^sha256:[a-f0-9]{64}$/, 'requires SHA-256 digest');
const time: Check = (v, p) => {
  text(v, p);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(v as string) || !Number.isFinite(Date.parse(v as string)) || new Date(v as string).toISOString() !== (v as string).replace('Z', '.000Z')) fail(p, 'requires real UTC timestamp with seconds');
};
const oneOf = (...values: string[]): Check => (v, p) => { if (!values.includes(v as string)) fail(p, `expected ${values.join('|')}`); };
const array = (check: Check, min = 0): Check => (v, p) => {
  if (!Array.isArray(v) || v.length < min) fail(p, `requires array with at least ${min} entries`);
  v.forEach((x, i) => check(x, `${p}[${i}]`));
};
function object(v: unknown, p: string): Record<string, unknown> {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) fail(p, 'requires object');
  return v as Record<string, unknown>;
}
const shape = (required: Record<string, Check>, optional: Record<string, Check> = {}): Check => (v, p) => {
  const data = object(v, p);
  for (const [key, check] of Object.entries(required)) {
    if (!Object.hasOwn(data, key)) fail(`${p}.${key}`, 'required');
    check(data[key], `${p}.${key}`);
  }
  for (const key of Object.keys(data)) {
    if (Object.hasOwn(required, key)) continue;
    if (!Object.hasOwn(optional, key)) fail(`${p}.${key}`, 'unsupported field; preserve additions in extensions');
    optional[key]!(data[key], `${p}.${key}`);
  }
};
const dictionary = (keyCheck: Check, valueCheck: Check): Check => (v, p) => {
  for (const [k, value] of Object.entries(object(v, p))) { keyCheck(k, `${p} key`); valueCheck(value, `${p}.${k}`); }
};
const value: Check = (v, p) => portable(v, p);
const state = oneOf('known', 'unknown', 'omitted', 'redacted', 'absent', 'out-of-scope');
const ref = shape({id, revision: token, digest: hash});
const revision = shape({id: token, parent: (v, p) => { if (v !== null) ref(v, p); }, createdAt: time, author: text, reason: text});
const common = {id, title: text, revision, scope: text, extensions: dictionary(id, value)};
const evidence = shape({source: id, locator: text});
const location: Check = (v, p) => {
  text(v, p); const s = v as string;
  if (/^https?:\/\//.test(s)) {
    const url = new URL(s); if (url.username || url.password) fail(p, 'credentials in source URL'); return;
  }
  if (s.startsWith('urn:')) { id(v, p); return; }
  if (s.startsWith('/') || /[\\:?#%]/.test(s) || s.split('/').some(part => !part || part === '.' || part === '..')) fail(p, 'requires portable relative path or http(s)/urn reference');
};
const finding: Check = (v, p) => {
  shape({id, subject: id, property: text, state: oneOf('known', 'unknown', 'omitted', 'redacted', 'absent', 'out-of-scope', 'conflicting'), note: text,
    claims: array(shape({value, evidence: array(evidence, 1)}))})(v, p);
  const f = v as ResearchRecord['findings'][number];
  const distinct = new Set(f.claims.map(c => canonical(c.value))).size;
  if ((f.state === 'known' || f.state === 'absent') && distinct !== 1) fail(p, 'known/absent requires one agreed claim value');
  if (f.state === 'conflicting' && distinct < 2) fail(p, 'conflicting requires differing sourced claims');
  if (['unknown', 'omitted', 'redacted', 'out-of-scope'].includes(f.state) && f.claims.length) fail(p, 'non-value state must not carry claims');
};
const research = shape({
  ...common, contract: oneOf('n8r.research/0.1'),
  sources: array(shape({id, location, version: text, digest: hash, inspectedAt: time,
    coverage: array(shape({path: text, status: oneOf('inspected', 'missing', 'unreadable', 'excluded', 'truncated', 'unsupported'), note: text}), 1)})),
  findings: array(finding),
  alternatives: array(shape({id, title: text, findings: array(id), requirements: array(text)})),
  decisions: array(shape({id, alternative: id, choice: oneOf('selected', 'rejected', 'deferred'), reason: text, by: text, at: time})),
  questions: array(shape({id, text, findings: array(id)})),
  notes: array(shape({by: text, at: time, text}))
});
const fact: Check = (v, p) => {
  shape({state, note: text}, {value})(v, p);
  const f = object(v, p);
  if ((f.state === 'known') !== Object.hasOwn(f, 'value')) fail(p, 'only known facts require a value');
};
const entity = {id, type: shape({vocabulary: id, term: text}), attributes: dictionary(text, fact),
  basis: array(shape({record: id, revision: token, items: array(id, 1)})), requirements: array(id)};
const surface = shape({
  ...common, contract: oneOf('n8r.surface/0.1'), kind: oneOf('definition'), records: array(ref),
  vocabularies: array(shape({id, version: token})),
  nodes: array(shape({...entity, label: text})),
  relationships: array(shape({...entity, from: id, to: id, claim: oneOf('declared')})),
  requirements: array(shape({id, kind: oneOf('secret', 'resource', 'configuration'), description: text, state})),
  coverage: array(text), gaps: array(text)
});
function unique(ids: string[], p: string): Set<string> {
  if (new Set(ids).size !== ids.length) fail(p, 'duplicate identity/reference');
  return new Set(ids);
}
function references(ids: string[], available: Set<string>, p: string): void {
  unique(ids, p);
  for (const item of ids) if (!available.has(item)) fail(p, `unresolved reference ${item}`);
}
// Inspect only a data descriptor; never invoke an untrusted getter to dispatch.
function isDescription(input: unknown): boolean {
  return input !== null && typeof input === 'object' &&
    Object.getOwnPropertyDescriptor(input, 'contract')?.value === 'n8r.surface/0.2';
}
export function validateArtefact(input: unknown): Artefact {
  try { return validate(input); }
  catch (error) {
    if (isDescription(input)) fail('$description', 'invalid structure, identity, state or reference');
    throw error;
  }
}
function validate(input: unknown): Artefact {
  canonical(input); // checks portable values, depth and logical size before field access
  const data = object(input, '$');
  if (data.contract === 'n8r.research/0.1') {
    research(input, '$'); const r = input as ResearchRecord;
    unique([r.id, ...r.sources.map(x => x.id), ...r.findings.map(x => x.id), ...r.alternatives.map(x => x.id), ...r.decisions.map(x => x.id), ...r.questions.map(x => x.id)], '$');
    const sources = new Set(r.sources.map(x => x.id)), findings = new Set(r.findings.map(x => x.id)), alternatives = new Set(r.alternatives.map(x => x.id));
    for (const f of r.findings) for (const c of f.claims) for (const e of c.evidence) references([e.source], sources, f.id);
    for (const a of [...r.alternatives, ...r.questions]) references(a.findings, findings, a.id);
    for (const d of r.decisions) references([d.alternative], alternatives, d.id);
    unique(r.decisions.map(d => d.alternative), '$.decisions'); // one current decision per option; old decisions stay in prior revisions
  } else if (data.contract === 'n8r.surface/0.1') {
    surface(input, '$'); const s = input as SurfaceDefinition;
    unique([s.id, ...s.nodes.map(x => x.id), ...s.relationships.map(x => x.id), ...s.requirements.map(x => x.id)], '$');
    const nodes = new Set(s.nodes.map(x => x.id)), vocab = unique(s.vocabularies.map(x => x.id), '$.vocabularies');
    const requirements = new Set(s.requirements.map(x => x.id));
    const records = unique(s.records.map(x => JSON.stringify([x.id, x.revision])), '$.records');
    for (const e of [...s.nodes, ...s.relationships]) {
      references([e.type.vocabulary], vocab, e.id);
      references(e.requirements, requirements, e.id);
      for (const b of e.basis) {
        references([JSON.stringify([b.record, b.revision])], records, e.id);
        unique(b.items, e.id);
      }
    }
    for (const e of s.relationships) {
      references([e.from], nodes, e.id); references([e.to], nodes, e.id);
    }
  } else if (data.contract === 'n8r.surface/0.2') {
    validateDescription(input);
  } else fail('$.contract', 'unsupported contract/version');
  const a = input as Artefact;
  if (a.revision.parent && (a.revision.parent.id !== a.id || a.revision.parent.revision === a.revision.id)) fail('$.revision.parent', 'requires earlier revision of the same artefact');
  return a;
}
/** Explicit offline bundle verification. Missing external context is an error here. */
export function verifyReferences(input: unknown, context: unknown[]): void {
  try { verifyContext(input, context); }
  catch (error) {
    if (isDescription(input)) fail('$description', 'invalid or unavailable evidence, capability or exclusive selection');
    throw error;
  }
}
function verifyContext(input: unknown, context: unknown[]): void {
  const a = validateArtefact(input);
  const records = context.map(validateArtefact);
  unique(records.map(r => JSON.stringify([r.id, r.revision.id])), '$context');
  if (a.contract === 'n8r.surface/0.2') { verifyDescriptionContext(a, records); return; }
  if (a.contract !== 'n8r.surface/0.1') return;
  for (const ref of a.records) {
    const r = records.find(x => x.id === ref.id && x.revision.id === ref.revision);
    if (!r || r.contract !== 'n8r.research/0.1') fail(ref.id, 'research revision unavailable');
    if (digest(r) !== ref.digest) fail(ref.id, 'research digest mismatch');
    const items = new Set([...r.findings, ...r.alternatives, ...r.decisions, ...r.questions].map(x => x.id));
    for (const e of [...a.nodes, ...a.relationships]) for (const b of e.basis) {
      if (b.record === ref.id && b.revision === ref.revision) references(b.items, items, e.id);
    }
  }
}


const basis = shape({record: id, revision: token, items: array(id, 1)});
const descriptionType = shape({vocabulary: id, term: text});
const descriptionCommon = {
  ...common, contract: oneOf('n8r.surface/0.2'), extensions: shape({}),
  records: array(ref), vocabularies: array(shape({id, version: token})),
  nodes: array(shape({id, label: text, type: descriptionType})),
  coverage: array(text), gaps: array(text)
};
const capabilityShape = shape({
  ...descriptionCommon, kind: oneOf('capability'),
  capabilities: array(shape({id, from: id, to: id, type: descriptionType,
    state: oneOf('possible', 'unknown', 'omitted', 'redacted', 'absent', 'out-of-scope', 'conflicting'),
    basis: array(basis), conditions: array(text), note: text})),
  exclusiveGroups: array(shape({id, members: array(id, 2)}))
});
const boundShape = shape({
  ...descriptionCommon, kind: oneOf('bound'), capability: ref,
  instance: shape({id, label: text}),
  bindings: array(shape({id, capability: id,
    state: oneOf('configured', 'unknown', 'omitted', 'redacted', 'out-of-scope', 'conflicting'),
    claims: array(shape({target: id, basis: array(basis, 1)})), decisions: array(basis), note: text}))
});
function descriptionBases(a: SurfaceDescription) {
  return a.kind === 'capability' ? a.capabilities.flatMap(c => c.basis) :
    a.bindings.flatMap(b => [...b.decisions, ...b.claims.flatMap(c => c.basis)]);
}
function validateDescription(input: unknown): void {
  const data = object(input, '$');
  (data.kind === 'capability' ? capabilityShape : boundShape)(input, '$');
  const a = input as SurfaceDescription;
  const entries = a.kind === 'capability' ? [...a.capabilities, ...a.exclusiveGroups] : a.bindings;
  unique([a.id, ...a.nodes.map(n => n.id), ...entries.map(e => e.id), ...(a.kind === 'bound' ? [a.instance.id] : [])], '$');
  const nodes = new Set(a.nodes.map(n => n.id));
  const vocab = unique(a.vocabularies.map(v => v.id), '$.vocabularies');
  const records = unique(a.records.map(r => JSON.stringify([r.id, r.revision])), '$.records');
  for (const n of a.nodes) references([n.type.vocabulary], vocab, '$.nodes');
  for (const b of descriptionBases(a)) {
    references([JSON.stringify([b.record, b.revision])], records, '$.basis'); unique(b.items, '$.basis.items');
  }
  if (a.kind === 'capability') {
    for (const c of a.capabilities) {
      references([c.from], nodes, '$.capabilities.from'); references([c.to], nodes, '$.capabilities.to');
      references([c.type.vocabulary], vocab, '$.capabilities.type');
      if (['possible', 'absent', 'conflicting'].includes(c.state) && !c.basis.length) fail('$', 'evidence required');
    }
    for (const group of a.exclusiveGroups) references(group.members, new Set(a.capabilities.map(c => c.id)), '$.exclusiveGroups');
  } else {
    unique(a.bindings.map(b => b.capability), '$.bindings.capability');
    for (const b of a.bindings) {
      const count = b.claims.length;
      if (b.state === 'configured' ? count !== 1 : b.state === 'conflicting' ? count < 2 : count !== 0) fail('$', 'state/claims mismatch');
      references(b.claims.map(c => c.target), nodes, '$.bindings.targets');
    }
  }
}
function verifyDescriptionContext(a: SurfaceDescription, context: Artefact[]): void {
  const research = a.records.map(ref => {
    const r = context.find(r => r.id === ref.id && r.revision.id === ref.revision);
    if (!r || r.contract !== 'n8r.research/0.1' || digest(r) !== ref.digest) fail('$', 'research revision/digest unavailable');
    return r;
  });
  const items = (bases: import('./contracts.js').Basis[], decisions = false) => bases.flatMap(b => {
    const r = research.find(r => r.id === b.record && r.revision.id === b.revision)!;
    return b.items.map(id => {
      const item = (decisions ? r.decisions : r.findings).find(f => f.id === id);
      if (!item) fail('$', 'wrong or missing evidence item kind');
      return item;
    });
  });
  const findings = (bases: import('./contracts.js').Basis[]) => items(bases) as ResearchRecord['findings'];
  if (a.kind === 'capability') {
    for (const c of a.capabilities) {
      const fs = findings(c.basis);
      if (fs.some(f => f.subject !== c.from || f.property !== 'supports')) fail('$', 'capability evidence subject/property mismatch');
      if (c.state === 'possible' && (!fs.length || fs.some(f => f.state !== 'known' || f.claims.some(cl => cl.value !== c.to)))) fail('$', 'possible requires supported target evidence');
      if (c.state === 'absent' && (!fs.length || fs.some(f => f.state !== 'absent' || f.claims.some(cl => cl.value !== c.to)))) fail('$', 'absent requires scoped absence evidence');
      if (c.state === 'conflicting' && !fs.some(f => f.state === 'conflicting')) fail('$', 'conflicting requires conflicting finding');
    }
    return;
  }
  const ref = a.capability;
  const c = context.find(c => c.id === ref.id && c.revision.id === ref.revision);
  if (!c || c.contract !== 'n8r.surface/0.2' || c.kind !== 'capability' || digest(c) !== ref.digest) fail('$', 'capability revision/digest unavailable');
  verifyDescriptionContext(c, context);
  // A shared node ID denotes the same component; an instance is a distinct identity.
  if ([c.id, ...c.nodes.map(n => n.id), ...c.capabilities.map(e => e.id)].includes(a.instance.id)) fail('$', 'instance identity reused');
  for (const n of a.nodes) {
    const old = c.nodes.find(x => x.id === n.id);
    if (old && canonical(old.type) !== canonical(n.type)) fail('$', 'shared component type changed');
  }
  for (const b of a.bindings) {
    const capability = c.capabilities.find(c => c.id === b.capability);
    if (!capability) fail('$', 'unknown capability');
    if (b.state === 'configured' && capability.state !== 'possible') fail('$', 'configured requires established possibility');
    items(b.decisions, true);
    const targets = new Set(b.claims.map(cl => cl.target));
    if (b.claims.length) {
      // Do not allow an author to hide contrary evidence by omitting a basis item.
      // Only this Bound snapshot's records apply; the pinned Capability may use
      // older research revisions which must not override the current binding.
      const matching = research.flatMap(r => r.findings).filter(f =>
        f.subject === a.instance.id && f.property === b.capability &&
        ['known', 'conflicting'].includes(f.state));
      for (const f of matching) {
        if (f.claims.some(cl => typeof cl.value !== 'string' || !targets.has(cl.value)) ||
            (b.state === 'configured' && f.state === 'conflicting')) fail('$', 'omitted contradictory configuration evidence');
      }
    }
    for (const claim of b.claims) {
      const fs = findings(claim.basis);
      for (const f of fs) {
        if (f.subject !== a.instance.id || f.property !== b.capability ||
            !['known', 'conflicting'].includes(f.state) ||
            !f.claims.some(cl => cl.value === claim.target) ||
            f.claims.some(cl => typeof cl.value !== 'string' || !targets.has(cl.value))) fail('$', 'binding evidence mismatch or suppressed conflict');
        if (b.state === 'configured' && f.state !== 'known') fail('$', 'conflict cannot establish configured');
      }
    }
  }
  for (const group of c.exclusiveGroups) {
    if (a.bindings.filter(b => b.state === 'configured' && group.members.includes(b.capability)).length > 1) fail('$', 'exclusive capabilities configured together');
  }
}
