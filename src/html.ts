import type {ResearchRecord, Value} from './contracts.js';
import {decode, encode, decodeJsonValue} from './codec.js';
import {checkSize, fail, canonical} from './portable.js';
import {validateArtefact, verifyReferences} from './validate.js';
import {renderBundleHtml} from './skill-presentation.js';
import type {Bundle} from './skill-artifacts.js';
const escape = (text: string): string => text.replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]!));
function display(value: Value): string {
  if (Array.isArray(value)) return value.length ? `<ol>${value.map(item => `<li>${display(item)}</li>`).join('')}</ol>` : '<p class="empty">No entries recorded.</p>';
  if (value !== null && typeof value === 'object') return `<dl>${Object.entries(value).map(([key, item]) => `<dt>${escape(key)}</dt><dd>${display(item)}</dd>`).join('')}</dl>`;
  return `<span>${escape(typeof value === 'string' ? value : JSON.stringify(value))}</span>`;
}
/** The template is part of profile 0.1. Changing it requires a versioned reader. */
export function renderResearchHtml(input: unknown): string {
  const record = validateArtefact(input);
  if (record.contract !== 'n8r.research/0.1') fail('$', 'HTML requires a research record');
  const data = encode(record, 'json').trimEnd().replace(/[<>&\u2028\u2029]/g, c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
  const sections = Object.entries(record).filter(([key]) => key !== 'title').map(([key, value]) => `<section><h2>${escape(key)}</h2>${display(value as Value)}</section>`).join('\n');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>${escape(record.title)}</title>
<style>body{font:17px/1.55 system-ui,sans-serif;max-width:72rem;margin:3rem auto;padding:0 1.5rem;color:#18252d;background:#faf9f5}h1{line-height:1.2}h2{font-size:1.2rem;border-bottom:1px solid #b8c8c9;padding-bottom:.3rem}section{margin:2rem 0}dt{font-weight:650;color:#234c54}dd{margin:0 0 .6rem 1.3rem}li{margin:.75rem 0}span{white-space:pre-wrap;overflow-wrap:anywhere}.empty{color:#56656c;font-style:italic}header p{max-width:55rem}</style>
</head>
<body>
<header><p>Research record · experimental 0.1</p><h1>${escape(record.title)}</h1><p>Source research describes possibilities. It does not establish a running integration. The embedded data owns the facts; visible edits require review before continuation.</p></header>
${sections}
<script type="application/json" id="n8r-record">${data}</script>
</body>
</html>
`;
  checkSize(html); return html;
}
/** Extract only to verify; no DOM execution and no permissive HTML repair. */
export function readResearchHtml(html: string): ResearchRecord {
  checkSize(html);
  const blocks = [...html.matchAll(/<script type="application\/json" id="n8r-record">([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 1) fail('$html', 'requires exactly one research data block');
  const record = decode(blocks[0]![1]!, 'json');
  if (record.contract !== 'n8r.research/0.1') fail('$html', 'requires research record');
  if (html.includes('<meta name="n8r-presentation" content="1">')) {
    const contexts = [...html.matchAll(/<script type="application\/json" id="n8r-context">([\s\S]*?)<\/script>/g)];
    if (contexts.length !== 1) fail('$html', 'requires exactly one presentation context');
    const context = decodeJsonValue(contexts[0]![1]!) as Pick<Bundle, 'surface' | 'dependencies'>;
    if (!context || Object.keys(context).sort().join(',') !== 'dependencies,surface' || !Array.isArray(context.dependencies)) fail('$html', 'invalid presentation context');
    const surface = validateArtefact(context.surface);
    if (surface.contract !== 'n8r.surface/0.3') fail('$html', 'requires Surface 0.3');
    const dependencies = context.dependencies.map(validateArtefact);
    const all = [record, surface, ...dependencies].filter((a,i,items)=>{
      const first=items.findIndex(x=>x.id===a.id&&x.revision.id===a.revision.id);
      if(canonical(items[first])!==canonical(a))fail('$html','ambiguous presentation revision');
      return first===i;
    });
    for (const item of all) verifyReferences(item, all);
    if (renderBundleHtml({research:record, surface, dependencies}) !== html) fail('$html', 'HTML/data conflict');
    return record;
  }
  if (renderResearchHtml(record) !== html) fail('$html', 'HTML/data conflict; preserve bytes and review the edit before regenerating');
  return record;
}
