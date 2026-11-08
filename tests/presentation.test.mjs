import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {saveBundle,readBundle} from '../dist/skill-artifacts.js';
import {readResearchHtml} from '../dist/html.js';
const fixture=n=>JSON.parse(fs.readFileSync(`examples/researcher/relationships/${n}.json`,'utf8'));
const bundle=()=>({research:fixture('research-r1'),surface:fixture('bound-r1'),dependencies:[fixture('capability'),fixture('research-r1')]});
test('saved report explains connections, evidence, decisions and unknowns without changing data',()=>{
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'human-report-')));
 try{
 const b=bundle(), snapshot=structuredClone(b);saveBundle(b,path.join(root,'report'));
 const html=fs.readFileSync(path.join(root,'report/research.html'),'utf8'),brief=fs.readFileSync(path.join(root,'report/brief.md'),'utf8');
 for(const text of [html,brief])for(const heading of ['What changed','Why it matters','Evidence','What remains unknown','Decisions'])assert(text.includes(heading),heading);
 assert.match(brief,/sources.md/);assert.match(brief,/conflicting|conflict/i);assert.match(brief,/Synthetic human preference/);
 assert.match(html,/<details>/);assert(!html.includes('<h2>extensions</h2>'));
 assert.deepEqual(readBundle(path.join(root,'report')),snapshot);assert.deepEqual(b,snapshot);assert.deepEqual(readResearchHtml(html),b.research);
 assert.throws(()=>readResearchHtml(html.replace('Why it matters','Invented impact')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('reads frozen presentation 0 files and makes a successor without changing the originals',()=>{
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'human-successor-')));
 try{
 const legacy='tests/fixtures/skill-presentation/legacy';const before=fs.readdirSync(legacy).map(n=>[n,fs.readFileSync(path.join(legacy,n))]);
 assert.deepEqual(readBundle(legacy),bundle());
 const next={research:fixture('research-r2'),surface:fixture('bound-r2'),dependencies:[fixture('capability'),fixture('research-r1')]};
 saveBundle(next,path.join(root,'next'),legacy);
 assert.deepEqual(readBundle(path.join(root,'next')),next);
 for(const [n,bytes]of before)assert.deepEqual(fs.readFileSync(path.join(legacy,n)),bytes);
 const brief=fs.readFileSync(path.join(root,'next/brief.md'),'utf8');assert.match(brief,/Unchanged from the previous research revision/);assert.match(brief,/MongoDB Atlas was the previously recorded target; Self-hosted MongoDB is the configured target/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('presentation escapes source markup and rejects edited prose even with updated manifest hashes',async()=>{
 const {renderBundleHtml}=await import('../dist/skill-presentation.js');const {createHash}=await import('node:crypto');
 const b=bundle(); b.surface.title='<img src=x onerror=alert(1)>';
 const html=renderBundleHtml(b);assert(!html.includes('<img'));assert.match(html,/&lt;img/);assert.deepEqual(readResearchHtml(html),b.research);
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'human-conflict-')));
 try{
 const out=path.join(root,'report');saveBundle(bundle(),out);
 const edited=fs.readFileSync(path.join(out,'research.html'),'utf8').replace('Why it matters','No problems here');fs.writeFileSync(path.join(out,'research.html'),edited);
 const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json')));manifest.files['research.html']='sha256:'+createHash('sha256').update(edited).digest('hex');fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest));assert.throws(()=>readBundle(out));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('manifest 1 cannot disguise a new presentation with different Surface context',async()=>{
 const {renderBundleHtml}=await import('../dist/skill-presentation.js');const {createHash}=await import('node:crypto');
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'human-version-')));
 try{
 const out=path.join(root,'report');fs.cpSync('tests/fixtures/skill-presentation/legacy',out,{recursive:true});
 const changed=bundle();changed.surface.title='A different Surface';const html=renderBundleHtml(changed);fs.writeFileSync(path.join(out,'research.html'),html);
 const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json')));manifest.files['research.html']='sha256:'+createHash('sha256').update(html).digest('hex');fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest));assert.throws(()=>readBundle(out));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('target changes use identity even when labels are identical',async()=>{
 const {renderBrief}=await import('../dist/skill-presentation.js');
 const b={research:fixture('research-r2'),surface:fixture('bound-r2'),dependencies:[fixture('capability'),fixture('research-r1')]};
 for(const node of b.surface.nodes)if(['urn:target:atlas','urn:target:mongodb'].includes(node.id))node.label='Database';
 const brief=renderBrief(b);assert(!brief.includes('target remains Database'));assert.match(brief,/urn:target:atlas/);assert.match(brief,/urn:target:mongodb/);
});
test('Capability prose preserves conditions and mutually exclusive alternatives',async()=>{
 const {renderBrief}=await import('../dist/skill-presentation.js');
 const b={research:fixture('research-r1'),surface:fixture('capability'),dependencies:[]};b.surface.relationships[0].conditions=['Only when storage is enabled'];
 const brief=renderBrief(b);assert.match(brief,/Only when storage is enabled/);assert.match(brief,/Mutually exclusive alternatives/);assert.match(brief,/OIDC/);assert.match(brief,/SAML/);
});
