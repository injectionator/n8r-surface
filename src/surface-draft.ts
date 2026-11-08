import {checkBundle, verifyBundleSuccessor, type Bundle} from './skill-artifacts.js';
import {renderBrief} from './skill-presentation.js';
import {randomUUID} from 'node:crypto';
import type {ResearchRecord, SurfaceDefinition, Artefact} from './contracts.js';
import {canonical, digest} from './portable.js';
import {validateArtefact, verifyReferences} from './validate.js';
import {verifySuccessor} from './revisions.js';
import {InspectionError} from './settings.js';

export type LegacyDraft = {research: ResearchRecord; surface: SurfaceDefinition};
export type SurfaceDraft = LegacyDraft | Bundle;
export const isBundle = (draft: SurfaceDraft): draft is Bundle => draft.surface.contract === 'n8r.surface/0.3';
export type DraftContext = {createdAt?: string; previous?: SurfaceDraft};
export const revisionRef = (a: Artefact) => ({id:a.id,revision:a.revision.id,digest:digest(a)});
const error = (s: string): never => { throw new InspectionError(s); };
function retained(before: {id:string}[], after: {id:string}[], label: string) {
  for (const old of before) if (!after.some(x=>x.id===old.id)) error(`Preserve ${label} identity ${old.id}; deletion is outside this increment`);
}
/** Preservation beyond the library's bounded lineage checks. */
export function verifyPairSuccessor(before: SurfaceDraft, after: SurfaceDraft) {
  if(isBundle(before) && isBundle(after)) {verifyBundleSuccessor(before,after);return;}
  verifySuccessor(before.research,after.research); verifySuccessor(before.surface,after.surface);
  for (const key of ['sources','findings','alternatives','decisions','questions'] as const) retained(before.research[key],after.research[key],key);
  retained(before.surface.nodes,after.surface.nodes,'component');
  for (const source of before.research.sources) {
    if (canonical(source)!==canonical(after.research.sources.find(x=>x.id===source.id))) error(`Preserve historical source ${source.id}; add a new source identity for new evidence`);
  }
  for (const finding of before.research.findings) {
    const next=after.research.findings.find(x=>x.id===finding.id)!;
    for (const claim of finding.claims) if (!next.claims.some(c=>canonical(c)===canonical(claim))) error(`Preserve historical claim in ${finding.id}`);
    if (next.subject!==finding.subject || next.property!==finding.property) error(`Retained finding changed subject/property: ${finding.id}`);
  }
  for (const note of before.research.notes) if (!after.research.notes.some(n=>canonical(n)===canonical(note))) error('Preserve historical research note; append corrections');
  for (const decision of before.research.decisions) if (after.research.decisions.find(x=>x.id===decision.id)!.alternative!==decision.alternative) error(`Retained decision changed alternative: ${decision.id}`);
  for (const node of before.surface.nodes) if (canonical(after.surface.nodes.find(x=>x.id===node.id)!.type)!==canonical(node.type)) error(`Retained component changed type: ${node.id}`);
  for (const key of ['research','surface'] as const) for (const [name,value] of Object.entries(before[key].extensions)) {
    if (!Object.hasOwn(after[key].extensions,name) || canonical(value)!==canonical(after[key].extensions[name])) error(`Preserve opaque extension ${name}`);
  }
}
/** New bundles use the shared skill checker; legacy content keeps host-owned envelopes. */
export function prepareSurfaceDraft(input: unknown, context: DraftContext = {}): SurfaceDraft {
  canonical(input); // bound size/depth and reject non-data before inspecting it
  const raw=input as any;
  if (!raw || typeof raw!=='object' || Array.isArray(raw) || !['research,surface','dependencies,research,surface'].includes(Object.keys(raw).sort().join(','))) error('Expected research and surface content objects');
  if (raw?.surface?.contract === 'n8r.surface/0.3') {
    const bundle=checkBundle(JSON.parse(JSON.stringify(raw)));
    if(context.previous) {
      verifyPairSuccessor(context.previous,bundle);
    }
    return bundle;
  }
  const data=JSON.parse(JSON.stringify(raw));
  const createdAt=context.createdAt ?? new Date().toISOString().replace(/\.\d{3}Z$/,'Z');
  for (const key of ['research','surface'] as const) {
    const value=data[key];
    if (!value || typeof value!=='object' || Array.isArray(value)) error(`Invalid ${key} content`);
    for (const reserved of ['id','revision','contract',...(key==='surface'?['records']:[])]) if (Object.hasOwn(value,reserved)) error(`Host owns ${key}.${reserved}; supply content only`);
    const prior=context.previous?.[key];
    value.contract=key==='research'?'n8r.research/0.1':'n8r.surface/0.1';
    value.id=prior?.id ?? `urn:n8r:${key}:${randomUUID()}`;
    value.revision={id:randomUUID(),parent:prior?revisionRef(prior):null,createdAt,author:'n8r-surface Researcher',reason:prior?'Human-requested revision':'Generated from research'};
  }
  const research=validateArtefact(data.research) as ResearchRecord;
  data.surface.records=[revisionRef(research)];
  for (const entity of [...(data.surface.nodes ?? []),...(data.surface.relationships ?? [])]) {
    if (!Array.isArray(entity.basis) || !entity.basis.length) error('Each entity needs a nonempty structured basis array');
    for (const basis of entity.basis) {
      if (!basis || Object.keys(basis).join(',')!=='items') error('Supply each basis as {items: [finding or decision IDs]}; the host owns record/revision');
      basis.record=research.id;basis.revision=research.revision.id;
    }
  }
  const surface=validateArtefact(data.surface) as SurfaceDefinition;
  verifyReferences(surface,[research]);
  const draft={research,surface};
  if(context.previous) verifyPairSuccessor(context.previous,draft);
  return draft;
}
export function previewSurface(draft: SurfaceDraft): string {
  if(isBundle(draft)) return renderBrief(draft)+'\nNot saved. Enter /save surface to save exactly this preview.';
  const {research:r,surface:s}=draft;
  return ['Validated partial Surface preview (declared only; not runtime proof)',s.title,
    'Components:',...s.nodes.map(n=>`  ${n.id} | ${n.label}`),
    'Declared connections:',...s.relationships.map(e=>`  ${e.id}: ${e.from} -> ${e.to} (${e.type.term})`),
    'Human decisions:',...r.decisions.map(d=>`  ${d.id}: ${d.choice} ${r.alternatives.find(a=>a.id===d.alternative)?.title} — ${d.reason}`),
    'Requirements:',...s.requirements.map(q=>`  ${q.id}: ${q.state} — ${q.description}`),
    'Coverage:',...s.coverage.map(x=>`  ${x}`),'Unknowns and gaps:',...s.gaps.map(x=>`  ${x}`),
    'Evidence:',...r.findings.map(f=>`  ${f.id}: ${f.state} — ${f.note}; ${f.claims.flatMap(c=>c.evidence.map(e=>`${e.source} ${e.locator}`)).join('; ')}`),
    'Not saved. Enter /save surface to save exactly this preview.'].join('\n');
}
