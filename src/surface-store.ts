import fs from 'node:fs';
import {readBundle,saveBundle} from './skill-artifacts.js';
import {basename,dirname,join,resolve,relative,sep} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {decode,encode} from './codec.js';
import {readResearchHtml,renderResearchHtml} from './html.js';
import {verifyReferences} from './validate.js';
import {canonical} from './portable.js';
import {type SurfaceDraft,verifyPairSuccessor,isBundle} from './surface-draft.js';
import {type Note,type NoteContext} from './notes.js';
import {InspectionError,readBytes} from './settings.js';

const LIMIT=8*1024*1024;
const HASH=/^sha256:[a-f0-9]{64}$/;
const MEMBERS=['research.html','surface.json','manifest.json'] as const;
const hash=(bytes:Buffer|string)=>`sha256:${createHash('sha256').update(bytes).digest('hex')}`;
type Manifest={version:1|2;files:Record<string,string>;provenance?:NoteContext;note?:{file:string;digest:string};predecessor?:{directory:string;manifestDigest:string}|string|null};
export type SavedSurfacePair=SurfaceDraft & {directory:string;researchPath:string;surfacePath:string;manifest:Manifest;briefPath?:string;bytes:Record<string,Buffer>};
function fail(message:string):never{throw new InspectionError(message);}
function safeName(value:unknown):value is string{return typeof value==='string' && !!value && value!=='.' && value!=='..' && !/[\\/\x00-\x1f]/.test(value);}
function checkProvenance(p: any): asserts p is NoteContext {
  if (!p || typeof p.model!=='string' || typeof p.researcher?.version!=='string' || !HASH.test(p.researcher?.digest)
    || !Array.isArray(p.evidence) || p.evidence.length>1000 || p.evidence.some((e:any)=>!e || typeof e.path!=='string' || !HASH.test(e.digest)
    || typeof e.inspectedAt!=='string' || !Number.isSafeInteger(e.startLine) || !Number.isSafeInteger(e.endLine))) fail('Invalid pair provenance');
}
function manifest(value:any): asserts value is Manifest {
  canonical(value);
  if(!value || value.version!==1 || !value.files || Object.keys(value.files).sort().join(',')!=='research.html,surface.json'
    || !HASH.test(value.files['research.html']) || !HASH.test(value.files['surface.json'])
    || Object.keys(value).some(k=>!['version','files','provenance','note','predecessor'].includes(k))
    || (value.note && (!safeName(value.note.file)||!HASH.test(value.note.digest)))
    || (value.predecessor && (!safeName(value.predecessor.directory)||!HASH.test(value.predecessor.manifestDigest)))) fail('Invalid Surface pair manifest');
  checkProvenance(value.provenance);
}
/** No symlink ancestry; stable directory topology is required during synchronous operations. */
function checkDirectories(directory:string, stamps?:Map<string,string>) {
  const paths:string[]=[];
  for(let p=directory;;p=dirname(p)){paths.unshift(p);if(dirname(p)===p)break;}
  for(const p of paths){
    let stat;try{stat=fs.lstatSync(p);}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT'&&!stamps?.has(p))continue;throw e;}
    if(!stat.isDirectory()||stat.isSymbolicLink())fail('Surface directory is occupied or a symbolic link');
    const stamp=`${stat.dev}:${stat.ino}`,old=stamps?.get(p);if(old&&old!==stamp)fail('Surface directory changed; reopen before saving');stamps?.set(p,stamp);
  }
}
function read(path:string,limit=LIMIT):Buffer {
  if(fs.lstatSync(path).isSymbolicLink())fail('Pair member cannot be a symbolic link');
  return readBytes(path,limit);
}
function utf8(bytes:Buffer):string{try{return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{fail('Pair is not UTF-8');}}
export function readSurfacePair(path:string):SavedSurfacePair {
  path=resolve(path);if(!['research.html','surface.json'].includes(basename(path)))fail('Select research.html or surface.json from a saved pair');
  const directory=dirname(path);checkDirectories(directory);
  const bytes:Record<string,Buffer>={};bytes['manifest.json']=read(join(directory,'manifest.json'),512*1024);
  let m:any;try{m=JSON.parse(utf8(bytes['manifest.json']));}catch{fail('Invalid pair manifest JSON');}
  if(m?.files?.['dependencies.json']) {
    const bundle=readBundle(directory);
    for(const name of Object.keys(m.files)) bytes[name]=read(join(directory,name));
    // Standalone skill manifests have no runner receipt. Re-read recorded sources
    // on reopening; they remain historical evidence, not a fresh tool result.
    if(m.provenance)checkProvenance(m.provenance);
    return {...bundle,directory,researchPath:join(directory,'research.html'),surfacePath:join(directory,'surface.json'),briefPath:join(directory,'brief.md'),manifest:m,bytes};
  }
  manifest(m);
  for(const name of ['research.html','surface.json'] as const){bytes[name]=read(join(directory,name));if(hash(bytes[name]!)!==m.files[name])fail('Pair bytes conflict with manifest hash; preserve edits and reopen an accepted revision');}
  const research=readResearchHtml(utf8(bytes['research.html']!)),surface=decode(utf8(bytes['surface.json']!),'json');
  if(surface.contract!=='n8r.surface/0.1')fail('Expected Surface definition');
  if(surface.records.length!==1 || surface.records[0]!.id!==research.id)fail('This host reopens one linked research record per pair');
  verifyReferences(surface,[research]);
  return {research,surface,directory,researchPath:join(directory,'research.html'),surfacePath:join(directory,'surface.json'),manifest:m,bytes};
}
export class SurfaceStore {
  readonly directory:string;
  previous:SavedSurfacePair|undefined;
  private stamps=new Map<string,string>();
  constructor(vault:string,source:string,previous?:SavedSurfacePair,private note?:Note){
    source=fs.realpathSync(source);const slug=basename(source).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'source';
    this.directory=previous?dirname(previous.directory):join(fs.realpathSync(vault),'surfaces',slug);
    const rel=relative(source,this.directory);
    if(fs.statSync(source).isDirectory()&&(!rel || (rel!=='..'&&!rel.startsWith(`..${sep}`)&&!rel.startsWith(sep))))fail('Surface cannot be saved inside selected source');
    this.previous=previous;checkDirectories(this.directory,this.stamps);
  }
  private unchanged(){
    checkDirectories(this.directory,this.stamps);
    if(this.note&&!read(this.note.path,256*1024).equals(Buffer.from(this.note.text)))fail('Original note changed; reopen before saving');
    if(this.previous)for(const name of Object.keys(this.previous.bytes))if(!read(join(this.previous.directory,name)).equals(this.previous.bytes[name]!))fail('Predecessor changed; reopen before saving');
  }
  save(draft:SurfaceDraft,provenance:NoteContext):SavedSurfacePair {
    this.unchanged();checkProvenance(provenance);
    if(isBundle(draft)) {
      if(this.previous)verifyPairSuccessor(this.previous,draft);
      fs.mkdirSync(this.directory,{recursive:true,mode:0o700});checkDirectories(this.directory,this.stamps);
      const names=fs.readdirSync(this.directory);
      if(names.length>10000)fail('Too many Surface revisions');
      const max=names.reduce((n,name)=>Math.max(n,Number(/^surface-(\d+)$/.exec(name)?.[1]??0)),0);
      if(!Number.isSafeInteger(max+1))fail('Surface numbering limit reached');
      const target=join(this.directory,`surface-${String(max+1).padStart(3,'0')}`);
      saveBundle(draft,target,this.previous?.directory);
      const manifestPath=join(target,'manifest.json');
      const receipt=JSON.parse(utf8(read(manifestPath)));
      fs.writeFileSync(manifestPath,JSON.stringify({...receipt,provenance,...(this.note?{note:{file:basename(this.note.path),digest:this.note.digest}}:this.previous?.manifest.note?{note:this.previous.manifest.note}:{})},null,2)+'\n',{mode:0o600});
      const saved=readSurfacePair(join(target,'surface.json'));
      this.unchanged();this.previous=saved;return saved;
    }
    verifyReferences(draft.surface,[draft.research]);
    if(this.previous)verifyPairSuccessor(this.previous,draft);
    else if(draft.research.revision.parent||draft.surface.revision.parent)fail('Initial pair cannot have an unavailable predecessor');
    const html=renderResearchHtml(draft.research),json=encode(draft.surface,'json');
    if(Buffer.byteLength(html)>LIMIT)fail('Research HTML exceeds host size limit');
    const m:Manifest={version:1,files:{'research.html':hash(html),'surface.json':hash(json)},provenance,
      ...(this.note?{note:{file:basename(this.note.path),digest:this.note.digest}}:this.previous?.manifest.note?{note:this.previous.manifest.note}:{}),
      ...(this.previous?{predecessor:{directory:basename(this.previous.directory),manifestDigest:hash(this.previous.bytes['manifest.json']!)}}:{})};manifest(m);
    const data={'research.html':html,'surface.json':json,'manifest.json':JSON.stringify(m,null,2)+'\n'};
    if(Buffer.byteLength(data['manifest.json'])>512*1024)fail('Pair manifest exceeds size limit');
    fs.mkdirSync(this.directory,{recursive:true,mode:0o700});checkDirectories(this.directory,this.stamps);
    const names=fs.readdirSync(this.directory);if(names.length>10000)fail('Too many Surface revisions');
    const max=names.reduce((n,name)=>Math.max(n,Number(/^surface-(\d+)$/.exec(name)?.[1]??0)),0);
    if(!Number.isSafeInteger(max+1))fail('Surface numbering limit reached');
    const target=join(this.directory,`surface-${String(max+1).padStart(3,'0')}`);
    const temporary=fs.mkdtempSync(join(this.directory,'.surface-'));
    try{
      for(const name of MEMBERS){const fd=fs.openSync(join(temporary,name),'wx',0o600);try{fs.writeFileSync(fd,data[name]);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
      readSurfacePair(join(temporary,'surface.json'));this.unchanged();
      // Under the stable-topology assumption, never replace any occupied destination.
      if(fs.existsSync(target))fail('Surface destination occupied');
      fs.renameSync(temporary,target);
      const saved=readSurfacePair(join(target,'surface.json'));
      for(const name of MEMBERS)if(!saved.bytes[name]!.equals(Buffer.from(data[name])))fail('Saved pair readback differs; inspect output before retrying');
      this.previous=saved;return saved;
    }finally{if(fs.existsSync(temporary))fs.rmSync(temporary,{recursive:true});}
  }
}
