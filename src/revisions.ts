import {validateArtefact} from './validate.js';
import {canonical, digest, fail} from './portable.js';
/** Validate a proposed successor; persistence and complete history belong to the host. */
export function verifySuccessor(previous: unknown, next: unknown): void {
  const before = validateArtefact(previous), after = validateArtefact(next);
  if (before.contract !== after.contract || before.id !== after.id) fail('$revision', 'contract/artefact identity changed');
  const parent = after.revision.parent;
  if (!parent || parent.id !== before.id || parent.revision !== before.revision.id || parent.digest !== digest(before) || after.revision.id === before.revision.id) fail('$revision', 'parent revision/digest mismatch or reused revision');
  if (before.contract === 'n8r.surface/0.2' && after.contract === 'n8r.surface/0.2') {
    if (before.kind !== after.kind) fail('$revision', 'description kind changed');
    for (const n of after.nodes) {
      const old = before.nodes.find(x => x.id === n.id);
      if (old && canonical(old.type) !== canonical(n.type)) fail('$revision', 'retained node type changed');
    }
    if (before.kind === 'capability' && after.kind === 'capability') {
      for (const c of after.capabilities) {
        const old = before.capabilities.find(x => x.id === c.id);
        if (old && (old.from !== c.from || old.to !== c.to || canonical(old.type) !== canonical(c.type))) fail('$revision', 'retained capability endpoints/type changed');
      }
    }
    if (before.kind === 'bound' && after.kind === 'bound') {
      if (before.instance.id !== after.instance.id || before.capability.id !== after.capability.id) fail('$revision', 'instance/capability identity changed');
      for (const b of after.bindings) {
        const old = before.bindings.find(x => x.id === b.id);
        if (old && old.capability !== b.capability) fail('$revision', 'retained binding slot changed');
      }
    }
  }
  if (before.contract === 'n8r.surface/0.3' && after.contract === 'n8r.surface/0.3') {
    if (before.kind !== after.kind) fail('$revision', 'description kind changed');
    for (const n of after.nodes) {
      const old = before.nodes.find(x => x.id === n.id);
      if (old && canonical(old.type) !== canonical(n.type)) fail('$revision', 'retained node type changed');
    }
    for (const edge of after.relationships) {
      const old = before.relationships.find(x => x.id === edge.id);
      if (old && (old.from !== edge.from || old.to !== edge.to || canonical(old.type) !== canonical(edge.type))) fail('$revision', 'retained relationship endpoints/type changed');
    }
    if (before.kind === 'bound' && after.kind === 'bound' &&
        (before.instance.id !== after.instance.id || before.capability.id !== after.capability.id)) fail('$revision', 'instance/capability identity changed');
  }
  if (before.contract === 'n8r.surface/0.1' && after.contract === 'n8r.surface/0.1') {
    for (const edge of after.relationships) {
      const old = before.relationships.find(x => x.id === edge.id);
      if (old && (old.from !== edge.from || old.to !== edge.to || canonical(old.type) !== canonical(edge.type))) fail(edge.id, 'retained relationship identity has different endpoints/type');
    }
  }
}
