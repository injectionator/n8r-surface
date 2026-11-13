/** Standalone installed-skill persistence. No CLI, runner, network or source reads. */
import fs from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {createHash} from 'node:crypto';
import {decode, encode, decodeJsonValue} from './codec.js';
import {validateArtefact, verifyReferences} from './validate.js';
import {digest as artifactDigest, canonical} from './portable.js';
import {readResearchHtml, renderResearchHtml} from './html.js';
import {renderBrief, renderBundleHtml} from './skill-presentation.js';
import {verifySuccessor} from './revisions.js';
import type {Artefact, ResearchRecord, SurfaceGraph} from './contracts.js';
export interface Bundle {research: ResearchRecord; surface: SurfaceGraph; dependencies: Artefact[]}
const members=['research.html','surface.json','dependencies.json','brief.md'] as const;
const hash=(s:string|Buffer)=>`sha256:${createHash('sha256').update(s).digest('hex')}`;
function fail(code:string):never {throw new Error(`Surface operation refused: ${code}. No input values are included.`);}
function guarded<T>(code:string,fn:()=>T):T {try{return fn();}catch{ return fail(code);}}
/** Conservative defense in depth; host must omit sensitive values before staging. */
export function privacy(value:unknown) {
 const text=canonical(value);
 if (/(?:https?|mongodb(?:\+srv)?|postgres(?:ql)?):\/\/|\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[a-f0-9]{1,4}:){2,}[a-f0-9:]+\b|(?:password|passwd|token|secret|username|api[_-]?key)\s*[=:]\s*[^\s"},]+|(?:\/Users\/|\/home\/|[A-Z]:\\\\)|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text)) fail('privacy review required');
}
export function checkBundle(input:unknown):Bundle {
 return guarded('bundle validation or privacy check',()=>{
  if(!input || typeof input!=='object' || Object.keys(input).sort().join(',')!=='dependencies,research,surface') fail('bundle shape');
  const b=input as Bundle;
  privacy(b);
  const research=validateArtefact(b.research), surface=validateArtefact(b.surface);
  if(research.contract!=='n8r.research/0.1'||surface.contract!=='n8r.surface/0.3'||!Array.isArray(b.dependencies)||b.dependencies.length>100)fail('contracts');
  const context:Artefact[]=[];
  for(const a of [research,surface,...b.dependencies.map(validateArtefact)]){
   if(Object.keys(a.extensions).length)fail('opaque extensions unsupported by this host');
   const old=context.find(x=>x.id===a.id&&x.revision.id===a.revision.id);
   if(old && digest(old)!==digest(a))fail('ambiguous revision');
   if(!old)context.push(a);
  }
  if(!surface.records.some(r=>r.id===research.id&&r.revision===research.revision.id&&r.digest===digest(research)))fail('unlinked research');
  for(const a of context)verifyReferences(a,context);
  return {research,surface,dependencies:b.dependencies};
 });
}
function directories(dir:string) {
 for(let p=resolve(dir);;p=dirname(p)){
  if(fs.existsSync(p)){const s=fs.lstatSync(p);if(s.isSymbolicLink()||!s.isDirectory())fail('unsafe directory');}
  else {try{fs.lstatSync(p);fail('unsafe directory');}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}}
  if(p===dirname(p))break;
 }
}
function read(path:string):string {
 const fd=fs.openSync(path,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW);
 try {const stat=fs.fstatSync(fd);if(!stat.isFile()||stat.size>8*1024*1024)fail('file size/type');return new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(fd));}
 finally{fs.closeSync(fd);}
}
const plain=(s:string)=>s.replace(/[\r\n]/g,' ').replace(/[<>\[\]`|]/g,'');
function brief(b:Bundle):string {
 const s=b.surface, name=(id:string)=>plain(s.nodes.find(n=>n.id===id)?.label??id);
 return `# ${plain(s.title)}\n\n${s.kind==='bound'?'Bound':'Capability'} Surface · ${plain(s.revision.id)}\n\n${plain(s.scope)}\n\n`+
 s.relationships.map(e=>{
 const state='binding' in e?e.binding.state:e.state;
 const target='binding' in e?e.binding.claims.map(c=>name(c.target)).join(', '):'supported possibility';
 const detail=(d:typeof e.purpose)=>`${d.state}: ${d.claims.map(c=>plain(c.value)).join(' / ')||plain(d.note)}`;
 return `- **${name(e.from)} → ${name(e.to)}** (role endpoints; ${state})\n  Target: ${target||'unknown'}. Purpose: ${detail(e.purpose)}. Integration: ${detail(e.integration)}.\n`;
 }).join('')+`\n## Evidence and decisions\n\nSee research.html for exact sources, findings, competing claims and human decisions; surface.json retains property-level evidence and configuration references. Configured does not establish runtime use.\n\n## Gaps\n\n${s.gaps.map(g=>'- '+plain(g)).join('\n')||'No additional gaps recorded; coverage remains bounded.'}\n\n## Recommended next steps\n\n${b.research.questions.map(q=>'- '+plain(q.text)).join('\n')||'Review the evidence and confirm the next question before expanding coverage.'}\n`;
}
export function readBundle(directory:string):Bundle {
 return guarded('saved-byte verification',()=>{
  directory=resolve(directory);directories(directory);
  const m=JSON.parse(read(join(directory,'manifest.json')));
  if(![1,2].includes(m.version) || Object.keys(m.files??{}).sort().join(',')!==[...members].sort().join(','))fail('manifest');
  if(fs.readdirSync(directory).sort().join(',')!==[...members,'manifest.json'].sort().join(','))fail('unexpected members');
  const data=Object.fromEntries(members.map(n=>{const text=read(join(directory,n));if(hash(text)!==m.files[n])fail('changed bytes');return [n,text];}));
  const b=checkBundle({research:readResearchHtml(data['research.html']!),surface:decode(data['surface.json']!,'json'),dependencies:decodeJsonValue(data['dependencies.json']!)});
  if(data['brief.md']!==(m.version===1?brief(b):renderBrief(b)))fail('brief conflict');
  if(data['research.html']!==(m.version===1?renderResearchHtml(b.research):renderBundleHtml(b)))fail('presentation context conflict');
  return b;
 });
}
export function saveBundle(input:unknown,destination:string,predecessor?:string):Bundle {
 return guarded('save validation, predecessor or destination check',()=>{
  const b=checkBundle(input);destination=resolve(destination);directories(dirname(destination));
  const parent=predecessor?readBundle(predecessor):undefined;
  const previousBytes=predecessor?read(join(predecessor,'manifest.json')):undefined;
  if(parent){
   for(const old of [parent.research,parent.surface,...parent.dependencies]){
    const next=[b.research,b.surface,...b.dependencies].find(a=>a.id===old.id&&a.revision.id===old.revision.id);
    if(next && digest(next)!==digest(old))fail('rewritten pinned revision');
   }
   verifySuccessor(parent.research,b.research);verifySuccessor(parent.surface,b.surface);
   for(const d of parent.research.decisions)if(!b.research.decisions.some(n=>canonical(n)===canonical(d)))fail('lost human decision');
   for(const n of parent.surface.nodes)if(!b.surface.nodes.some(x=>x.id===n.id))fail('lost component identity');
  }else if(b.research.revision.parent||b.surface.revision.parent)fail('predecessor required');
  const data={'research.html':renderBundleHtml(b),'surface.json':encode(b.surface,'json'),'dependencies.json':JSON.stringify(b.dependencies,null,2)+'\n','brief.md':renderBrief(b)};
  const manifest=JSON.stringify({version:2,files:Object.fromEntries(members.map(n=>[n,hash(data[n])])),predecessor:previousBytes?hash(previousBytes):null},null,2)+'\n';
  // Parent must exist; exclusive mkdir never replaces an occupied destination.
  fs.mkdirSync(destination,{mode:0o700});
  try {
   for(const [name,bytes] of Object.entries({...data,'manifest.json':manifest}))fs.writeFileSync(join(destination,name),bytes,{flag:'wx',mode:0o600});
   const result=readBundle(destination);
   if(predecessor){readBundle(predecessor);if(read(join(predecessor,'manifest.json'))!==previousBytes)fail('predecessor changed');}
   return result;
  }catch(e){
   // Retain incomplete output for inspection; never call it a successful save.
   throw e;
  }
 });
}
export function main(args:string[]) {
 const [op,file,destination,previous]=args;
 if(op==='help' && args.length===1){console.log('Standalone Surface helper: check BUNDLE.json | save BUNDLE.json NEW_DIRECTORY [PREDECESSOR_DIRECTORY] | read DIRECTORY. JSON bundle: {research,surface,dependencies}. Save only with user authorization. Node 22/24/26; no network or n8r-surface CLI.');return;}
 if(op==='read' && args.length===2){const b=readBundle(file!);console.log(JSON.stringify({status:'checked',kind:b.surface.kind,research:b.research,surface:b.surface,dependencies:b.dependencies},null,2));return;}
 if((op==='check'&&args.length===2)||(op==='save'&&(args.length===3||args.length===4))){
  const b=checkBundle(decodeJsonValue(read(file!)));
  if(op==='save')saveBundle(b,destination!,previous);
  console.log(JSON.stringify({status:op==='save'?'saved-and-read-back':'checked',kind:b.surface.kind,researchDigest:digest(b.research),surfaceDigest:digest(b.surface)}));return;
 }
 fail('arguments; run help');
}

/** Same canonical digest, with value-free diagnostics at the skill boundary. */
export function digest(value:unknown):string {return guarded('digest input',()=>artifactDigest(value));}
