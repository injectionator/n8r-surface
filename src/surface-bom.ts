/** Bounded Surface profile over CycloneDX 1.7; no parallel native authority. */
import {validateBom} from './cyclonedx-validation.js';
import {privacy} from './skill-artifacts.js';
import {canonical} from './portable.js';
import {decodeJsonValue} from './codec.js';
export type Bom = Record<string,any>;
export interface Relationship {
 id:string;from:string;to:string;kind:'dependency'|'integration'|'hosting'|'data-flow';
 optionality:'required'|'optional'|'alternative'|'unknown';group:string;
 support:'supported'|'unknown'|'absent'|'conflicting'|'out-of-scope';
 selection:'selected'|'unknown'|'not-selected'|'conflicting';
 observations:{at:string;evidence:string[];note:string}[];
 evidence:string[];selectionEvidence:string[];purpose:string;mechanism:string;
 configuration:string[];conditions:string[];note:string;
}
export interface Entry {
 id:string;kind:'next'|'question'|'decision'|'diversion'|'finding';title:string;text:string;
 status:'open'|'active'|'done'|'deferred'|'superseded';reason:string;access:string;
 evidence:string[];at:string;parent?:string;supersedes?:string;
}
export interface Evidence {
 id:string;basis:'source'|'configuration'|'observation'|'user';
 sources:{index:number;locator:string}[];applicability:string;
}
export interface Surface {
 bom:Bom;objective:string;scope:string;relationships:Relationship[];entries:Entry[];
 evidence:Evidence[];coverage:string[];gaps:string[];
 presentation:Record<string,Presentation>;
}
export interface Presentation {
 boundary:'internal'|'external'|'unknown';area:string;focus?:boolean;evidence:string[];
}
export const prefix='n8r:surface:';
export const property=(name:string,value:unknown)=>({name:prefix+name,value:typeof value==='string'?value:JSON.stringify(value)});
function fail(reason:string):never {throw Error(`Surface BOM refused: ${reason}. Input values withheld.`);}
function requireThat(ok:unknown,reason:string):asserts ok {if(!ok)fail(reason);}
const nonempty=(x:unknown):x is string=>typeof x==='string'&&x.trim().length>0;
const strings=(x:unknown):x is string[]=>Array.isArray(x)&&x.every(nonempty)&&new Set(x).size===x.length;
const date=(x:unknown)=>typeof x==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x)&&Number.isFinite(Date.parse(x));
const keys=(x:any,required:string[],optional:string[]=[])=>x&&typeof x==='object'&&!Array.isArray(x)&&required.every(k=>Object.hasOwn(x,k))&&Object.keys(x).every(k=>[...required,...optional].includes(k));
const unique=(xs:string[])=>new Set(xs).size===xs.length;
export function projectDependencies(edges:Relationship[]) {
 const map=new Map<string,Set<string>>();
 for(const e of edges)if(e.kind==='dependency'&&e.selection==='selected'){
  const targets=map.get(e.from)??new Set<string>();targets.add(e.to);map.set(e.from,targets);
 }
 return [...map].sort(([a],[b])=>a.localeCompare(b)).map(([ref,to])=>({ref,dependsOn:[...to].sort()}));
}
/** Parses only the documented profile, checking references and projection consistency. */
export function checkSurfaceBom(input:unknown):Surface {
 validateBom(input);const b=structuredClone(input) as Bom;
 requireThat(nonempty(b.serialNumber)&&Number.isSafeInteger(b.version)&&b.version>0&&date(b.metadata?.timestamp),'revision identity');
 // Safe profile does not carry endpoints/connection values. Public source URLs are
 // supported only as externalReferences; source content itself is not persisted.
 const safe=structuredClone(b);for(const r of safe.externalReferences??[]){
  requireThat(!r.url.startsWith('file:')&&!r.url.includes('@')&&!/[?]/.test(r.url),'source locator privacy');
  if(/^https:\/\//.test(r.url)){const u=new URL(r.url);requireThat(!u.username&&!u.password&&!/^\d/.test(u.hostname)&&!['localhost'].includes(u.hostname),'source locator privacy');r.url='urn:public-source';}
 }
 privacy(safe);
 const refs=new Set<string>();
 function visit(x:any){if(!x||typeof x!=='object')return;if(!Array.isArray(x)&&Object.hasOwn(x,'bom-ref')){requireThat(nonempty(x['bom-ref'])&&!refs.has(x['bom-ref']),'unique BOM references');refs.add(x['bom-ref']);}for(const v of Object.values(x))visit(v);}
 visit(b);
 const nodes=new Set<string>([...(b.components??[]),...(b.services??[])].map(n=>n['bom-ref']));
 const annotations=new Map<string,any>((b.annotations??[]).map((a:any)=>[a['bom-ref'],a]));
 for(const a of annotations.values())requireThat(nonempty(a['bom-ref'])&&a.subjects.length>0&&a.subjects.every((id:string)=>refs.has(id)),'annotation subjects');
 for(const c of b.citations??[]){
  requireThat(c.pointers&&!c.expressions&&refs.has(c.attributedTo)&&!c.process,'citation attribution');
  for(const p of c.pointers){requireThat(typeof p==='string'&&p.startsWith('/'),'citation pointer');let v:any=b;for(const k of p.slice(1).split('/').map((k:string)=>k.replace(/~1/g,'/').replace(/~0/g,'~'))){requireThat(v!==null&&typeof v==='object'&&Object.hasOwn(v,k),'citation pointer target');v=v[k];}}
 }
 const allowed=['profile','objective','scope','relationship','entry','evidence','coverage','gap','predecessor-digest','reconciliation','migration'];
 const ps=b.properties??[];
 for(const p of ps)requireThat(p.name.startsWith(prefix)&&allowed.includes(p.name.slice(prefix.length)),'profile property');
 const values=(key:string)=>ps.filter((p:any)=>p.name===prefix+key).map((p:any)=>p.value);
 const one=(key:string)=>{const vs=values(key);requireThat(vs.length===1&&nonempty(vs[0]),'single '+key);return vs[0] as string;};
 requireThat(one('profile')==='1','supported profile version');
 for(const key of ['predecessor-digest','reconciliation','migration'])requireThat(values(key).length<=1,'single '+key);
 const parsed=<T>(key:string):T[]=>values(key).map((s:string)=>{try{return decodeJsonValue(s) as T;}catch{return fail('profile JSON');}});
 const evidence=parsed<Evidence>('evidence'),relationships=parsed<Relationship>('relationship'),entries=parsed<Entry>('entry');
 requireThat(unique(evidence.map(e=>e.id))&&unique(relationships.map(e=>e.id))&&unique(entries.map(e=>e.id)),'unique profile IDs');
 const evidenceIds=new Set(evidence.map(e=>e.id));
 for(const e of evidence){
  requireThat(keys(e,['id','basis','sources','applicability'])&&annotations.has(e.id)&&['source','configuration','observation','user'].includes(e.basis)&&nonempty(e.applicability)&&Array.isArray(e.sources),'evidence record');
  requireThat(e.basis==='user'||e.sources.length>0,'source-backed evidence');
  for(const s of e.sources)requireThat(keys(s,['index','locator'])&&Number.isSafeInteger(s.index)&&s.index>=0&&b.externalReferences?.[s.index]&&nonempty(s.locator),'source reference');
 }
 const evidenceFor=(ids:unknown,subjects:string[],basis?:string[])=>strings(ids)&&ids.every(id=>evidenceIds.has(id)&&subjects.every(n=>annotations.get(id).subjects.includes(n))&&(!basis||basis.includes(evidence.find(e=>e.id===id)!.basis)));
 const presentation:Record<string,Presentation>=Object.create(null);
 for(const n of [...(b.components??[]),...(b.services??[])]){
  const hints=(n.properties??[]).filter((p:any)=>p.name===prefix+'presentation');
  requireThat(hints.length<=1,'single node presentation');
  if(!hints.length)continue;
  let p:Presentation;try{p=decodeJsonValue(hints[0].value) as Presentation;}catch{return fail('node presentation JSON');}
  requireThat(keys(p,['boundary','area','evidence'],['focus'])&&['internal','external','unknown'].includes(p.boundary)&&nonempty(p.area)&&(p.focus===undefined||typeof p.focus==='boolean'),'node presentation shape');
  requireThat(evidenceFor(p.evidence,[n['bom-ref']])&&(p.boundary==='unknown'||p.evidence.length>0),'node presentation evidence');
  presentation[n['bom-ref']]=p;
 }
 requireThat(Object.values(presentation).filter(p=>p.focus).length<=1,'single focus application');
 const edgeKeys=['id','from','to','kind','optionality','group','support','selection','observations','evidence','selectionEvidence','purpose','mechanism','configuration','conditions','note'];
 for(const e of relationships){
  requireThat(keys(e,edgeKeys)&&nonempty(e.id)&&nodes.has(e.from)&&nodes.has(e.to),'relationship endpoints/shape');
  requireThat(['dependency','integration','hosting','data-flow'].includes(e.kind)&&['required','optional','alternative','unknown'].includes(e.optionality)&&typeof e.group==='string','relationship kind/optionality');
  requireThat(e.optionality!=='alternative'||nonempty(e.group),'alternative group');
  requireThat(['supported','unknown','absent','conflicting','out-of-scope'].includes(e.support)&&['selected','unknown','not-selected','conflicting'].includes(e.selection),'relationship states');
  requireThat([e.purpose,e.mechanism,e.note].every(nonempty)&&strings(e.configuration)&&strings(e.conditions),'relationship detail');
  requireThat(evidenceFor(e.evidence,[e.from,e.to])&&evidenceFor(e.selectionEvidence,[e.from,e.to],['configuration','user']),'relationship evidence');
  requireThat(!['supported','absent','conflicting'].includes(e.support)||e.evidence.length>0,'support evidence');
  requireThat(e.selection==='unknown'||e.selectionEvidence.length>0,'selection evidence');
  requireThat(e.selection!=='selected'||!e.configuration.some(x=>/\$\{|<[^>]+>|placeholder/i.test(x)),'placeholder selection');
  requireThat(Array.isArray(e.observations),'observations');
  for(const o of e.observations)requireThat(keys(o,['at','evidence','note'])&&date(o.at)&&nonempty(o.note)&&o.evidence.length>0&&evidenceFor(o.evidence,[e.from,e.to],['observation']),'dated observed evidence');
 }
 const entryIds=new Set(entries.map(e=>e.id));
 for(const e of entries){
  requireThat(keys(e,['id','kind','title','text','status','reason','access','evidence','at'],['parent','supersedes'])&&[e.id,e.title,e.text,e.reason,e.access].every(nonempty)&&date(e.at),'investigation entry');
  requireThat(['next','question','decision','diversion','finding'].includes(e.kind)&&['open','active','done','deferred','superseded'].includes(e.status),'investigation state');
  requireThat(strings(e.evidence)&&e.evidence.every(id=>evidenceIds.has(id)),'investigation evidence');
  requireThat(e.kind!=='decision'||e.evidence.some(id=>evidence.find(x=>x.id===id)?.basis==='user'),'decision provenance');
  for(const id of [e.parent,e.supersedes])requireThat(id===undefined||(entryIds.has(id)&&id!==e.id),'investigation links');
 }
 const deps=(b.dependencies??[]).map((d:any)=>({ref:d.ref,dependsOn:[...(d.dependsOn??[])].sort()})).sort((a:any,z:any)=>a.ref.localeCompare(z.ref));
 requireThat((b.dependencies??[]).every((d:any)=>!d.provides)&&canonical(deps)===canonical(projectDependencies(relationships)),'selected dependency projection');
 requireThat(b.compositions?.some((c:any)=>c.aggregate==='unknown'),'bounded coverage declaration');
 const coverage=values('coverage'),gaps=values('gap');requireThat(strings(coverage)&&strings(gaps),'coverage/gaps');
 return {bom:b,objective:one('objective'),scope:one('scope'),relationships,entries,evidence,coverage,gaps,presentation};
}
