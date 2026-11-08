/** Experimental bounded contracts, not a universal AI Surface Model schema. */
export type Value = null | boolean | number | string | Value[] | {[key: string]: Value};
export type State = 'known' | 'unknown' | 'omitted' | 'redacted' | 'absent' | 'out-of-scope';
export interface RevisionRef { id: string; revision: string; digest: string }
export interface Revision {
  id: string; parent: RevisionRef | null; createdAt: string; author: string; reason: string;
}
export interface Envelope {
  id: string; title: string; revision: Revision; scope: string; extensions: {[namespace: string]: Value};
}
export interface Source {
  id: string; location: string; version: string; digest: string; inspectedAt: string;
  coverage: {path: string; status: 'inspected' | 'missing' | 'unreadable' | 'excluded' | 'truncated' | 'unsupported'; note: string}[];
}
export interface Finding {
  id: string; subject: string; property: string; state: State | 'conflicting'; note: string;
  claims: {value: Value; evidence: {source: string; locator: string}[]}[];
}
export interface ResearchRecord extends Envelope {
  contract: 'n8r.research/0.1'; sources: Source[]; findings: Finding[];
  alternatives: {id: string; title: string; findings: string[]; requirements: string[]}[];
  decisions: {id: string; alternative: string; choice: 'selected' | 'rejected' | 'deferred'; reason: string; by: string; at: string}[];
  questions: {id: string; text: string; findings: string[]}[];
  notes: {by: string; at: string; text: string}[];
}
export interface Fact { state: State; value?: Value; note: string }
export interface Basis { record: string; revision: string; items: string[] }
export interface Entity {
  id: string; type: {vocabulary: string; term: string};
  attributes: {[property: string]: Fact}; basis: Basis[]; requirements: string[];
}
export interface SurfaceDefinition extends Envelope {
  contract: 'n8r.surface/0.1'; kind: 'definition'; records: RevisionRef[];
  vocabularies: {id: string; version: string}[];
  nodes: (Entity & {label: string})[];
  relationships: (Entity & {from: string; to: string; claim: 'declared'})[];
  requirements: {id: string; kind: 'secret' | 'resource' | 'configuration'; description: string; state: State}[];
  coverage: string[]; gaps: string[];
}
/** JSON-only descriptions; no settings values or opaque extensions in this profile. */
export interface DescriptionNode {
  id: string; label: string; type: {vocabulary: string; term: string};
}
export interface DescriptionEnvelope extends Envelope {
  contract: 'n8r.surface/0.2'; records: RevisionRef[];
  vocabularies: {id: string; version: string}[]; nodes: DescriptionNode[];
  coverage: string[]; gaps: string[];
}
export interface CapabilitySurface extends DescriptionEnvelope {
  kind: 'capability';
  capabilities: {
    id: string; from: string; to: string; type: {vocabulary: string; term: string};
    state: 'possible' | Exclude<State, 'known'> | 'conflicting';
    basis: Basis[]; conditions: string[]; note: string;
  }[];
  exclusiveGroups: {id: string; members: string[]}[];
}
export interface BoundSurface extends DescriptionEnvelope {
  kind: 'bound'; capability: RevisionRef; instance: {id: string; label: string};
  bindings: {
    id: string; capability: string;
    state: 'configured' | Exclude<State, 'known' | 'absent'> | 'conflicting';
    claims: {target: string; basis: Basis[]}[];
    decisions: Basis[]; note: string;
  }[];
}
export type SurfaceDescription = CapabilitySurface | BoundSurface;
/** Shared node/edge contract; setting names and safe locations, never values. */
export interface ConfigurationReference {
  owner: string; mechanism: 'environment-variable' | 'file-key' | 'argument' | 'admin-setting' | 'code';
  key: string; location: string;
}
export interface RelationshipDetail<T> {
  state: State | 'conflicting'; claims: {value: T; basis: Basis[]}[]; note: string;
}
export interface DescriptionRelationship {
  id: string; from: string; to: string; type: DescriptionNode['type'];
  purpose: RelationshipDetail<string>; integration: RelationshipDetail<string>;
  configuration: RelationshipDetail<ConfigurationReference[]>;
  basis: Basis[]; conditions: string[]; note: string;
}
export interface GraphEnvelope extends Omit<DescriptionEnvelope, 'contract'> {
  contract: 'n8r.surface/0.3';
}
export interface CapabilityGraph extends GraphEnvelope {
  kind: 'capability';
  relationships: (DescriptionRelationship & {state: CapabilitySurface['capabilities'][number]['state']})[];
  exclusiveGroups: CapabilitySurface['exclusiveGroups'];
}
export interface BoundGraph extends GraphEnvelope {
  kind: 'bound'; capability: RevisionRef; instance: BoundSurface['instance'];
  relationships: (DescriptionRelationship & {binding: Omit<BoundSurface['bindings'][number], 'id' | 'capability'>})[];
}
export type SurfaceGraph = CapabilityGraph | BoundGraph;
export type Artefact = ResearchRecord | SurfaceDefinition | SurfaceDescription | SurfaceGraph;
