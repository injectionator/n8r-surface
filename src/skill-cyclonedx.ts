/** Bounded offline exchange alongside checked native records. No source inspection. */
import fs from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {Ajv} from 'ajv';
import formats from 'ajv-formats';
import extendedFormats from 'ajv-formats-draft2019';
import bomSchema from './cyclonedx-schemas/bom-1.7.schema.json' with {type:'json'};
import cryptoSchema from './cyclonedx-schemas/cryptography-defs.schema.json' with {type:'json'};
import spdxSchema from './cyclonedx-schemas/spdx.schema.json' with {type:'json'};
import jsfSchema from './cyclonedx-schemas/jsf-0.82.schema.json' with {type:'json'};
import {checkBundle,readBundle,privacy,digest} from './skill-artifacts.js';
import type {Bundle} from './skill-artifacts.js';
import {canonical} from './portable.js';
import {decodeJsonValue} from './codec.js';
import {verifySuccessor} from './revisions.js';

export interface MappingNode {id:string;kind:'component'|'service';type?:string;rationale:string}
export interface Mapping {nodes:MappingNode[];dependencies:string[]}
type Bom = Record<string,any>;
export interface Exchange {bundle:Bundle;mapping:Mapping;bom:Bom;report:Record<string,any>;predecessor:string|null}
const members=['surface.cdx.json','surface-records.json','mapping.json','README.md'] as const;
const hash=(x:string|Buffer)=>`sha256:${createHash('sha256').update(x).digest('hex')}`;
const json=(x:unknown)=>JSON.stringify(x,null,2)+'\n';
function refuse():never {throw Error('CycloneDX exchange refused: check contracts, mapping, privacy, lineage and saved bytes.');}
function guard<T>(fn:()=>T):T {try{return fn();}catch{return refuse();}}
const ajv=new Ajv({strict:false,allErrors:false,validateFormats:true});
// ajv-formats CJS interop is normalized by Node and the standalone bundler.
(formats as unknown as (a:Ajv)=>void)(ajv);
(extendedFormats as unknown as (a:Ajv)=>void)(ajv);
ajv.addSchema(spdxSchema);ajv.addSchema(jsfSchema);ajv.addSchema(cryptoSchema);
const schemaCheck=ajv.compile(bomSchema);
export function validateBom(bom:unknown):void {
 guard(()=>{
  if(!schemaCheck(bom))refuse();const b=bom as Bom;
  if(b.bomFormat!=='CycloneDX'||b.specVersion!=='1.7')refuse();
  const refs=new Set<string>();
  for(const n of [...(b.components??[]),...(b.services??[])]){
   if(typeof n['bom-ref']!=='string'||refs.has(n['bom-ref']))refuse();refs.add(n['bom-ref']);
  }
  for(const d of b.dependencies??[])if(!refs.has(d.ref)||d.dependsOn?.some((r:string)=>!refs.has(r)))refuse();
 });
}
function mappingFor(input:unknown,b:Bundle):Mapping {
 privacy(input);
 if(!input||typeof input!=='object'||Object.keys(input).sort().join(',')!=='dependencies,nodes')refuse();
 const m=input as Mapping;if(!Array.isArray(m.nodes)||!Array.isArray(m.dependencies))refuse();
 const ids=new Set(b.surface.nodes.map(n=>n.id));
 if(m.nodes.length!==ids.size)refuse();
 for(const n of m.nodes){
  if(!n||!ids.delete(n.id)||!['component','service'].includes(n.kind)||typeof n.rationale!=='string'||!n.rationale.trim())refuse();
  const keys=Object.keys(n).sort().join(',');
  if(n.kind==='component'?(keys!=='id,kind,rationale,type'||typeof n.type!=='string'):keys!=='id,kind,rationale')refuse();
 }
 if(new Set(m.dependencies).size!==m.dependencies.length||m.dependencies.some(x=>typeof x!=='string'))refuse();
 return m;
}
function serial(id:string) {
 const h=createHash('sha256').update('n8r.surface.cyclonedx/1\0'+id).digest('hex');
 return `urn:uuid:${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
}
function checkPrevious(b:Bundle,m:Mapping,prev:Exchange) {
 const old=prev.bundle;
 for(const key of ['research','surface'] as const){
  if(digest(old[key])!==digest(b[key])){
   verifySuccessor(old[key],b[key]);
   if(b[key].revision.parent?.digest!==digest(old[key]))refuse();
  }
 }
 for(const a of [old.research,old.surface,...old.dependencies]){
  const next=[b.research,b.surface,...b.dependencies].find(n=>n.id===a.id&&n.revision.id===a.revision.id);
  if(next&&digest(a)!==digest(next))refuse();
 }
 for(const n of old.surface.nodes)if(!b.surface.nodes.some(x=>x.id===n.id))refuse();
 for(const d of old.research.decisions)if(!b.research.decisions.some(x=>canonical(x)===canonical(d)))refuse();
 for(const n of prev.mapping.nodes){const next=m.nodes.find(x=>x.id===n.id);if(!next||next.kind!==n.kind||next.type!==n.type)refuse();}
}
export function projectBundle(input:unknown,mapping:unknown,previous?:Exchange):{bom:Bom;report:Record<string,any>} {
 return guard(()=>{
  const b=checkBundle(input),m=mappingFor(mapping,b),s=b.surface;
  if(previous)checkPrevious(b,m,previous);
  const components:Bom[]=[],services:Bom[]=[];
  for(const n of s.nodes){const t=m.nodes.find(x=>x.id===n.id)!;
   const item:Bom={'bom-ref':n.id,name:n.label,description:`${s.kind} Surface node; classification: ${t.rationale} This inventory does not establish deployment or runtime use.`};
   if(t.kind==='component'){item.type=t.type;components.push(item);}else services.push(item);
  }
  const selected=new Set(m.dependencies),deps=new Map<string,Set<string>>();
  const relationships=s.relationships.map(e=>{
   const projected=selected.delete(e.id);
   if(projected){
    if(!('binding' in e)||e.binding.state!=='configured'||e.binding.claims.length!==1)refuse();
    const targets=deps.get(e.from)??new Set<string>();targets.add(e.binding.claims[0]!.target);deps.set(e.from,targets);
   }
   return {id:e.id,projected,reason:projected?'Explicit configured dependency projection; detailed semantics retained in native snapshot.':'Not projected as a dependency; see native relationship and evidence.',relationship:e};
  });
  if(selected.size)refuse();
  const bom:Bom={bomFormat:'CycloneDX',specVersion:'1.7',serialNumber:previous?.bom.serialNumber??serial(s.id),version:previous?previous.bom.version+1:1,
   metadata:{timestamp:s.revision.createdAt},...(components.length?{components}:{}),...(services.length?{services}:{}),
   ...(deps.size?{dependencies:[...deps].map(([ref,targets])=>({ref,dependsOn:[...targets].sort()}))}:{}),
   compositions:[{aggregate:'unknown'}],externalReferences:[{type:'other',url:'surface-records.json',comment:'Exact checked native research/Surface snapshot. Required for evidence and Surface meanings.'},{type:'other',url:'mapping.json',comment:'Mapping and explicit semantic losses; not a lossless BOM-only representation.'}]};
  validateBom(bom);
  const report={profile:'n8r.cyclonedx-exchange/1',standard:'CycloneDX 1.7',surface:{id:s.id,revision:s.revision.id,digest:digest(s),kind:s.kind},research:{id:b.research.id,revision:b.research.revision.id,digest:digest(b.research)},mapping:m,relationships,
   losses:['Dependency projection does not encode purpose, integration mechanism, configuration evidence, binding states, alternatives or decisions; retained in surface-records.json and relationship report.', 'Node versions, package identifiers, upstream SBOM contents and transitive dependency completeness are not inferred from labels.', 'No runtime, control conformance, complete inventory or round-trip compatibility claim. Native records remain authoritative.'],gaps:s.gaps};
  return {bom,report};
 });
}
function safeDirectory(directory:string){for(let p=resolve(directory);;p=dirname(p)){
 try{const stat=fs.lstatSync(p);if(stat.isSymbolicLink()||!stat.isDirectory())refuse();}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
 if(p===dirname(p))break;
}}
function read(file:string){const fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);try{const s=fs.fstatSync(fd);if(!s.isFile()||s.size>8*1024*1024)refuse();return new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(fd));}finally{fs.closeSync(fd);}}
function readJson(file:string):any {return decodeJsonValue(read(file));}
function description(b:Bundle,bom:Bom){return `# CycloneDX exchange\n\nCycloneDX 1.7 · BOM version ${bom.version} · ${b.surface.kind} Surface.\n\nOpen surface.cdx.json in a compatible consumer. Keep surface-records.json and mapping.json with it: they preserve the native evidence and explain the projection/losses. Configured dependencies do not establish runtime use. Coverage remains unknown.\n\nUse the standalone helper read operation to verify this directory before continuation. Prior files must stay unchanged.\n`;}
export function readExchange(directory:string):Exchange {
 return guard(()=>{
  directory=resolve(directory);safeDirectory(directory);
  if(fs.readdirSync(directory).sort().join(',')!==[...members,'manifest.json'].sort().join(','))refuse();
  const manifest=readJson(join(directory,'manifest.json'));
  if(manifest.version!==1||Object.keys(manifest).sort().join(',')!=='files,predecessor,version'||Object.keys(manifest.files??{}).sort().join(',')!==[...members].sort().join(','))refuse();
  if(manifest.predecessor!==null&&!/^sha256:[a-f0-9]{64}$/.test(manifest.predecessor))refuse();
  for(const f of members)if(hash(read(join(directory,f)))!==manifest.files[f])refuse();
  const bundle=checkBundle(readJson(join(directory,'surface-records.json'))),report=readJson(join(directory,'mapping.json')),bom=readJson(join(directory,'surface.cdx.json'));
  const mapping=mappingFor(report.mapping,bundle),expected=projectBundle(bundle,mapping);
  validateBom(bom);
  if(!Number.isSafeInteger(bom.version)||bom.version<1||(bom.version===1)!==(manifest.predecessor===null))refuse();
  expected.bom.version=bom.version;
  if(canonical(expected.bom)!==canonical(bom)||canonical(expected.report)!==canonical(report)||read(join(directory,'README.md'))!==description(bundle,bom))refuse();
  return {bundle,mapping,bom,report,predecessor:manifest.predecessor};
 });
}
export function saveExchange(bundleDirectory:string,mapping:unknown,destination:string,previousDirectory?:string):Exchange {
 return guard(()=>{
  const bundle=readBundle(bundleDirectory),m=mappingFor(mapping,bundle);
  const previous=previousDirectory?readExchange(previousDirectory):undefined;
  const prevBytes=previousDirectory?read(join(previousDirectory,'manifest.json')):undefined;
  if(!previous&&(bundle.surface.revision.parent||bundle.research.revision.parent))refuse();
  const {bom,report}=projectBundle(bundle,m,previous);
  const files={'surface.cdx.json':json(bom),'surface-records.json':json(bundle),'mapping.json':json(report),'README.md':description(bundle,bom)};
  const manifest={version:1,predecessor:prevBytes?hash(prevBytes):null,files:Object.fromEntries(members.map(n=>[n,hash(files[n])]))};
  destination=resolve(destination);safeDirectory(dirname(destination));fs.mkdirSync(destination,{mode:0o700});
  for(const [name,bytes] of Object.entries({...files,'manifest.json':json(manifest)}))fs.writeFileSync(join(destination,name),bytes,{flag:'wx',mode:0o600});
  const saved=readExchange(destination);
  if(previousDirectory){readExchange(previousDirectory);if(read(join(previousDirectory,'manifest.json'))!==prevBytes)refuse();}
  readBundle(bundleDirectory);return saved;
 });
}
function main(args:string[]){
 if(args.length===1&&args[0]==='help'){console.log('CycloneDX 1.7 exchange helper: export BUNDLE_DIRECTORY MAPPING.json NEW_DIRECTORY [PREVIOUS_EXCHANGE] | read DIRECTORY. Requires checked native records. Mapping: {nodes:[{id,kind,type?,rationale}],dependencies:[relationshipId]}. No network, source reads, runtime package install or product CLI.');return;}
 if(args[0]==='read'&&args.length===2){const e=readExchange(args[1]!);console.log(json({status:'checked',bom:e.bom,report:e.report}));return;}
 if(args[0]==='export'&&(args.length===4||args.length===5)){const e=saveExchange(args[1]!,readJson(args[2]!),args[3]!,args[4]);console.log(json({status:'saved-and-read-back',serialNumber:e.bom.serialNumber,version:e.bom.version}));return;}
 refuse();
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{main(process.argv.slice(2));}catch{console.error('CycloneDX exchange failed. Check mapping, native records, privacy, predecessor and destination; no success claimed.');process.exitCode=1;}}
