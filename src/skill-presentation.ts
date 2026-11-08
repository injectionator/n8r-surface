/** Versioned, deterministic human presentation. Never adds research claims. */
import type {Bundle} from './skill-artifacts.js';
import type {Basis, ResearchRecord, Value} from './contracts.js';
import {canonical, checkSize, digest} from './portable.js';

const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const markdown=(s:string)=>s.replace(/[\r\n]+/g,' ').replace(/[\\`*_{}\[\]<>#!|]/g,'\\$&');
const embedded=(value:unknown)=>JSON.stringify(value,null,2).replace(/[<>&\u2028\u2029]/g,c=>`\\u${c.charCodeAt(0).toString(16).padStart(4,'0')}`);
interface Section {title:string; paragraphs:string[]}
export function reportSections(b:Bundle):Section[] {
 const {research:r,surface:s}=b;
 const records=[r,...b.dependencies.filter((a):a is ResearchRecord=>a.contract==='n8r.research/0.1')];
 const name=(id:string)=>s.nodes.find(n=>n.id===id)?.label.replace(/ \(role endpoint\)$/,'')??(s.kind==='bound'&&s.instance.id===id?s.instance.label:id);
 const value=(v:Value):string=>typeof v==='string'?name(v):Array.isArray(v)?v.map(value).join('; '):v&&typeof v==='object'?Object.entries(v).map(([k,x])=>`${k}: ${value(x)}`).join('; '):String(v);
 const citations=(basis:Basis[]):string[]=>basis.flatMap(ref=>{
  const record=records.find(x=>x.id===ref.record&&x.revision.id===ref.revision);
  return (record?.findings.filter(f=>ref.items.includes(f.id))??[]).flatMap(f=>f.claims.flatMap(c=>c.evidence.map(e=>{
   const source=record!.sources.find(x=>x.id===e.source);
   return `${e.locator.startsWith(source?.location??'\0')?e.locator:`${source?.location??e.source} — ${e.locator}`} (source revision ${source?.version??'unspecified'}; research ${record!.revision.id})`;
  })));
 });
 const previous=r.revision.parent&&records.find(x=>x.id===r.revision.parent!.id&&x.revision.id===r.revision.parent!.revision&&digest(x)===r.revision.parent!.digest);
 const summary:string[]=[],changes:string[]=[],impact:string[]=[],evidence:string[]=[],unknown=[...s.gaps];
 for(const edge of s.relationships){
  const connection=`${name(edge.from)} → ${name(edge.to)}`;
  const prefix=s.relationships.length>1?`${connection}: `:'';
  if('binding' in edge){
   const targets=edge.binding.claims.map(c=>name(c.target)).join(' / ');
   summary.push(edge.binding.state==='configured'?`${name(edge.from)} is configured to use ${targets}.`:edge.binding.state==='conflicting'?`${connection}: the configured target is disputed (${targets}). No single target is established.`:`${connection}: target ${edge.binding.state}. ${edge.binding.note}`);
   const prior=previous&&previous.findings.find(f=>s.kind==='bound'&&f.subject===s.instance.id&&f.property===edge.id);
   if(prior&&prior.state==='known'&&edge.binding.state==='configured'){
    const old=prior.claims.map(c=>value(c.value)).join(' / ');
    const same=canonical(prior.claims.map(c=>c.value).sort())===canonical(edge.binding.claims.map(c=>c.target).sort());
    const oldDisplay=old===targets&&!same?prior.claims.map(c=>`${value(c.value)} (${String(c.value)})`).join(' / '):old;
    const newDisplay=old===targets&&!same?edge.binding.claims.map(c=>`${name(c.target)} (${c.target})`).join(' / '):targets;
    changes.push(same?`${prefix}The recorded target remains ${targets}.`:`${prefix}${oldDisplay} was the previously recorded target; ${newDisplay} is the configured target in this revision.`);
   }
   evidence.push(...citations(edge.binding.claims.flatMap(c=>c.basis)).map(c=>`${prefix}Target selection: ${c}.`));
   if(edge.binding.state!=='configured')unknown.push(`${connection}: binding ${edge.binding.state}. ${edge.binding.note}`);
   if(edge.binding.state==='configured')impact.push(`${prefix}${targets} is the target to consider when reviewing this configured connection. Configuration alone does not establish reachability or actual use.`);
  }else{
   summary.push(edge.state==='possible'?`${name(edge.from)} can connect to ${name(edge.to)}, according to the documented capability. No instance target is established.`:`${connection}: capability ${edge.state}. ${edge.note}`);
   impact.push(`${connection}: this describes a product possibility, not an instance selection or an exercised connection.`);
  }
  if(edge.conditions.length)summary.push(`${connection} — Conditions: ${edge.conditions.join('; ')}`);
  for(const [label,detail] of [['Purpose',edge.purpose],['Integration',edge.integration]] as const){
   if(detail.claims.length)impact.push(`${prefix}${label}${detail.state==='known'?'':` (${detail.state})`}: ${detail.claims.map(c=>c.value).join(' / ')}`);
   if(detail.state!=='known')unknown.push(`${connection}: ${label.toLowerCase()} ${detail.state}. ${detail.note}`);
   evidence.push(...citations(detail.claims.flatMap(c=>c.basis)).map(c=>`${prefix}${label}: ${c}.`));
  }
  evidence.push(...citations(edge.basis).map(c=>`${prefix}Documented support: ${c}.`));
  evidence.push(...citations(edge.configuration.claims.flatMap(c=>c.basis)).map(c=>`${prefix}Configuration: ${c}.`));
  if(edge.configuration.state!=='known')unknown.push(`${connection}: configuration ${edge.configuration.state}. ${edge.configuration.note}`);
 }
 if(s.kind==='capability')for(const group of s.exclusiveGroups)summary.push(`Mutually exclusive alternatives: ${group.members.map(id=>{const edge=s.relationships.find(e=>e.id===id);return edge?`${name(edge.from)} → ${name(edge.to)}`:id;}).join(' / ')}. These are not jointly available selections.`);
 if(!changes.length)changes.push(r.revision.parent?'A successor is recorded. An exact previous target comparison is unavailable in this bundle.':'This is the first saved description; no earlier revision is being compared.');
 changes.push(`Reason recorded for this revision: ${r.revision.reason}.`);
 const decisions=r.decisions.map(d=>`${r.alternatives.find(a=>a.id===d.alternative)?.title??d.alternative} — ${d.choice}. ${d.reason} Recorded by ${d.by} on ${d.at}.${previous?.decisions.some(x=>canonical(x)===canonical(d))?' Unchanged from the previous research revision.':''}`);
 return [
  {title:'Current picture',paragraphs:summary.length?summary:['No connections have been described yet. This does not establish their absence.']},
  {title:'What changed',paragraphs:changes},
  {title:'Why it matters',paragraphs:impact.length?impact:['The recorded scope bounds what can be concluded. No operational impact has been established.']},
  {title:'Evidence',paragraphs:[...new Set(evidence)].length?[...new Set(evidence)]:['No connection evidence is recorded. Missing evidence does not establish absence.']},
  {title:'Decisions',paragraphs:decisions.length?decisions:['No human decisions are recorded.']},
  {title:'What remains unknown',paragraphs:[...new Set(unknown)].length?[...new Set(unknown)]:['No additional gaps are listed. This is not a completeness or runtime assurance claim.']},
  {title:'Questions to carry forward',paragraphs:r.questions.length?r.questions.map(q=>q.text):['No next investigation is recorded. Review the evidence and scope before extending the research.']}
 ];
}
export function renderBrief(b:Bundle):string {
 const sections=reportSections(b);
 return `# ${markdown(b.surface.title)}\n\n${sections[0]!.paragraphs.map(markdown).join('\n\n')}\n\n`+sections.slice(1).map(s=>`## ${s.title}\n\n${s.paragraphs.map(markdown).join('\n\n')}\n`).join('\n')+`\n## Scope\n\n${markdown(b.surface.scope)}\n`+'\n## Read further\n\n[Research and evidence](research.html) · [Checked Surface data](surface.json)\n';
}
export function renderBundleHtml(b:Bundle):string {
 const sections=reportSections(b),lead=sections[0]!;
 const section=(s:Section,i:number)=>`<section id="section-${i}"><h2>${s.title}</h2>${s.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</section>`;
 const records=[b.research,...b.dependencies.filter((a):a is ResearchRecord=>a.contract==='n8r.research/0.1')];
 const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="n8r-presentation" content="1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>${escape(b.surface.title)}</title>
<style>
:root{color-scheme:light;--ink:#172d46;--muted:#465c72;--blue:#2058a5;--wash:#edf4fc;--line:#c8d6e6;--paper:#fff}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:18px/1.65 'Avenir Next',Avenir,'Segoe UI',sans-serif}main{max-width:1120px;margin:auto;padding:48px 40px 72px}header{max-width:880px;margin-bottom:40px}h1{font-size:clamp(2rem,5vw,3.5rem);line-height:1.13;letter-spacing:-.035em;margin:16px 0 24px}h2{font-size:1.5rem;line-height:1.3;margin:0 0 20px}h3{font-size:1.1rem}p{max-width:72ch;margin:0 0 18px;overflow-wrap:anywhere}.meta,.scope,footer{color:var(--muted);font-size:.9rem}.lead{background:var(--wash);border-left:5px solid var(--blue);padding:24px 28px;margin:28px 0}.lead p{font-size:1.25rem;line-height:1.5}.lead p:last-child{margin-bottom:0}.layout{display:grid;grid-template-columns:190px minmax(0,1fr);gap:48px}nav{align-self:start;position:sticky;top:24px;font-size:.9rem}nav a{display:block;padding:7px 0}a{color:var(--blue);text-underline-offset:4px}a:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:4px}section{padding:0 0 28px;margin-bottom:32px;border-bottom:1px solid var(--line)}details{padding:20px 0;border-top:1px solid var(--line)}summary{cursor:pointer;font-weight:600}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.5 ui-monospace,monospace;background:#f3f6fa;padding:20px;max-height:36rem;overflow:auto}.source{margin:24px 0}footer{margin-top:40px} @media(max-width:720px){main{padding:28px 20px}.layout{display:block}nav{position:static;margin-bottom:32px;display:flex;flex-wrap:wrap;gap:4px 18px}.lead{padding:20px}h1{letter-spacing:-.02em}}@media print{main{padding:0}nav{display:none}.layout{display:block}details{break-inside:avoid}a{color:inherit}}
</style>
</head><body><main>
<header><p class="meta">${b.surface.kind==='bound'?'Configured system':'Product capability'} · Revision ${escape(b.surface.revision.id)}</p><h1>${escape(b.surface.title)}</h1><div class="lead">${lead.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</div><p class="scope">${escape(b.surface.scope)}</p></header>
<div class="layout"><nav aria-label="Report sections">${sections.slice(1).map((s,i)=>`<a href="#section-${i+1}">${s.title}</a>`).join('')}<a href="#sources">Source coverage</a></nav><article>
${sections.slice(1).map((s,i)=>section(s,i+1)).join('\n')}
<section id="sources"><h2>Source coverage</h2>${records.map(r=>`<details><summary>${escape(r.title)} — ${escape(r.revision.id)}${r.id===b.research.id&&r.revision.id===b.research.revision.id?' (current)':' (pinned evidence)'}</summary>${r.sources.map(s=>`<div class="source"><h3>${escape(s.location)}</h3><p>Source revision ${escape(s.version)}. Inspected ${escape(s.inspectedAt)}.</p>${s.coverage.map(c=>`<p>${escape(c.path)} — ${escape(c.status)}. ${escape(c.note)}</p>`).join('')}</div>`).join('')||'<p>No sources recorded.</p>'}</details>`).join('')}</section>
<details><summary>Technical record and exact evidence</summary><p>The complete checked data is retained below. IDs and hashes identify evidence; they do not establish runtime behavior.</p><pre>${escape(JSON.stringify(b,null,2))}</pre></details>
<footer><p><a href="brief.md">Read the brief</a> · <a href="surface.json">Surface JSON</a> · <a href="dependencies.json">Pinned evidence JSON</a></p><p>Presentation 1. Visible edits require review; they are never silently incorporated into the checked data.</p></footer>
</article></div>
<script type="application/json" id="n8r-record">${embedded(b.research)}</script>
<script type="application/json" id="n8r-context">${embedded({surface:b.surface,dependencies:b.dependencies})}</script>
</main></body></html>
`;
 checkSize(html);return html;
}
