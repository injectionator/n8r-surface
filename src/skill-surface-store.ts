/** Immutable BOM revisions, with disposable views and explicit edit reconciliation. */
import fs from 'node:fs';
import {resolve,dirname,join,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {canonical} from './portable.js';
import {decodeJsonValue} from './codec.js';
import {checkSurfaceBom,prefix,type Surface} from './surface-bom.js';
import {renderSurface} from './surface-view.js';
export const byteDigest=(bytes:string|Buffer)=>'sha256:'+createHash('sha256').update(bytes).digest('hex');
const refuse=(reason:string):never=>{throw Error(`Surface save/read refused: ${reason}. No input values shown.`);};
export function safeParents(directory:string){for(let p=resolve(directory);;p=dirname(p)){
 try{const s=fs.lstatSync(p);if(!s.isDirectory()||s.isSymbolicLink())refuse('unsafe directory');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
 if(p===dirname(p))break;
}}
export function readBytes(file:string){safeParents(dirname(file));const fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);try{const s=fs.fstatSync(fd);if(!s.isFile()||s.size>8*1024*1024)refuse('file type or size');return fs.readFileSync(fd);}finally{fs.closeSync(fd);}}
export const readJson=(file:string)=>decodeJsonValue(new TextDecoder('utf8',{fatal:true}).decode(readBytes(file)));
const prop=(s:Surface,key:string)=>s.bom.properties.find((p:any)=>p.name===prefix+key)?.value;
function location(file:string){safeParents(dirname(file));return fs.lstatSync(file).isDirectory()?join(file,'surface.cdx.json'):file;}
function savedDirectory(file:string):string|undefined {
 const p=resolve(file);if(fs.lstatSync(p).isDirectory())return p;
 if(basename(p)==='surface.cdx.json'&&fs.existsSync(join(dirname(p),'manifest.json')))return dirname(p);
 return undefined;
}
export function readSurface(file:string):Surface{const directory=savedDirectory(file);if(directory)checkViews(directory,false);return checkSurfaceBom(readJson(location(resolve(file))));}
function checkViews(directory:string,reconcile:boolean){
 const manifest=readJson(join(directory,'manifest.json')) as any;
 if(manifest.profile!=='n8r.surface-save/1'||Object.keys(manifest.files??{}).sort().join(',')!=='brief.md,investigation.md,surface.cdx.json,surface.html')refuse('manifest');
 for(const [name,hash] of Object.entries(manifest.files)){
  const changed=byteDigest(readBytes(join(directory,name)))!==hash;
  if(changed&&(name==='surface.cdx.json'||!reconcile))refuse(name==='surface.cdx.json'?'changed predecessor BOM':'edited generated view; reconcile proposals into a successor explicitly');
 }
}
export function saveSurface(input:unknown,destination:string,previous?:string,reconcile=false):Surface {
 const s=checkSurfaceBom(input);destination=resolve(destination);safeParents(dirname(destination));
 let prevFile:string|undefined,previousBytes:Buffer|undefined;
 if(previous){
  const prior=resolve(previous);prevFile=location(prior);previousBytes=readBytes(prevFile);
  const old=checkSurfaceBom(decodeJsonValue(previousBytes.toString('utf8')));
  const saved=savedDirectory(prior);if(saved)checkViews(saved,reconcile);
  if(s.bom.serialNumber!==old.bom.serialNumber||s.bom.version!==old.bom.version+1||prop(s,'predecessor-digest')!==byteDigest(previousBytes))refuse('revision identity/digest');
  const link=`urn:cdx:${old.bom.serialNumber.slice(9)}/${old.bom.version}`;
  if(!s.bom.externalReferences?.some((r:any)=>r.type==='bom'&&r.url===link))refuse('versioned predecessor BOM-Link');
  for(const n of [...(old.bom.components??[]),...(old.bom.services??[])])if(![...(s.bom.components??[]),...(s.bom.services??[])].some(x=>x['bom-ref']===n['bom-ref']))refuse('lost node identity');
  for(const e of old.relationships){const n=s.relationships.find(x=>x.id===e.id);if(!n||n.from!==e.from||n.to!==e.to||n.kind!==e.kind)refuse('lost or changed relationship identity');for(const o of e.observations)if(!n!.observations.some(x=>canonical(x)===canonical(o)))refuse('lost historical observation');}
  for(const e of old.entries)if(!s.entries.some(x=>x.id===e.id))refuse('lost investigation entry');
  for(const a of old.bom.annotations??[])if(!s.bom.annotations?.some((n:any)=>canonical(n)===canonical(a)))refuse('rewritten historical evidence');
  for(const [i,r] of (old.bom.externalReferences??[]).entries())if(canonical(s.bom.externalReferences?.[i])!==canonical(r))refuse('changed source reference');
  for(const e of old.evidence)if(!s.evidence.some(n=>canonical(n)===canonical(e)))refuse('changed evidence applicability');
  for(const e of old.entries.filter(e=>e.kind==='decision')){
   const next=s.entries.find(x=>x.id===e.id);
   if(!next||canonical({...next,status:e.status})!==canonical(e))refuse('lost or rewritten decision');
   if(next!.status!==e.status&&(next!.status!=='superseded'||!s.entries.some(x=>x.supersedes===e.id&&x.kind==='decision')))refuse('decision supersession');
   for(const id of e.evidence){const a=old.bom.annotations.find((a:any)=>a['bom-ref']===id);if(!s.bom.annotations.some((b:any)=>canonical(a)===canonical(b)))refuse('rewritten decision provenance');}
  }
 }else if(s.bom.version!==1||prop(s,'predecessor-digest')!==undefined)refuse('predecessor required');
 if(reconcile&&(!previous||!prop(s,'reconciliation')))refuse('reconciliation explanation required');
 const files={'surface.cdx.json':JSON.stringify(s.bom,null,2)+'\n',...renderSurface(s)};
 const manifest=JSON.stringify({profile:'n8r.surface-save/1',files:Object.fromEntries(Object.entries(files).map(([n,v])=>[n,byteDigest(v)]))},null,2)+'\n';
 fs.mkdirSync(destination,{mode:0o700});
 for(const [name,bytes] of Object.entries({...files,'manifest.json':manifest}))fs.writeFileSync(join(destination,name),bytes,{flag:'wx',mode:0o600});
 checkViews(destination,false);const saved=readSurface(destination);
 if(prevFile&&!readBytes(prevFile).equals(previousBytes!))refuse('predecessor changed during save');
 return saved;
}
