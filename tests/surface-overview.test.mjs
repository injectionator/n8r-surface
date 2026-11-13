import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {checkSurfaceBom,property} from '../dist/surface-bom.js';
import {renderSurface} from '../dist/surface-view.js';
const fixture=()=>JSON.parse(fs.readFileSync('examples/researcher/surface-bom/initial.cdx.json','utf8'));
function described(){
 const b=fixture();b.components[0].description='A synthetic assistant connects conversations to inference and storage.';
 b.components[0].properties=[property('presentation',{boundary:'internal',area:'Conversation',focus:true,evidence:['evidence-support']})];
 b.services[0].properties=[property('presentation',{boundary:'external',area:'Persistence',evidence:['evidence-support']})];
 b.properties.push(property('entry',{id:'storage-finding',kind:'finding',title:'Stored conversations need an access policy',text:'Four supported stores are available.',reason:'Store choice determines where conversation records are retained.',access:'Selected configuration',status:'done',evidence:['evidence-support'],at:'2026-11-13T12:00:00Z'}));
 return b;
}
test('presentation hints check evidence applicability, focus uniqueness and shape without inferring old boundaries',()=>{
 assert.deepEqual(Object.keys(checkSurfaceBom(fixture()).presentation),[]);
 assert.equal(checkSurfaceBom(described()).presentation.app.boundary,'internal');
 for(const mutate of [
 b=>b.components[0].properties.push(b.components[0].properties[0]),
 b=>b.components[0].properties[0].value=JSON.stringify({boundary:'internal',area:'Chat',evidence:[]}),
 b=>b.components[0].properties[0].value=JSON.stringify({boundary:'internal',area:'Chat',evidence:['missing']}),
 b=>b.services[0].properties[0].value=JSON.stringify({boundary:'external',area:'Stores',evidence:['decision-1']}),
 b=>b.services[0].properties[0].value=JSON.stringify({boundary:'external',area:'Stores',focus:true,evidence:['evidence-support']}),
 b=>b.components[0].properties[0].value='null'
 ]){const b=described();mutate(b);assert.throws(()=>checkSurfaceBom(b));}
});
test('brief leads with application meaning and linked implications; mechanics and repeated edge notes stay underneath',()=>{
 const b=described();const {['brief.md']:brief,['surface.html']:page}=renderSurface(checkSurfaceBom(b));
 assert(brief.indexOf(b.components[0].description)<brief.indexOf('BOM revision'));
 assert.match(brief,/Stored conversations need an access policy/);
 assert.match(brief,/Store choice determines where conversation records are retained/);
 assert.match(brief,/surface.html#ev-evidence-support/);
 assert.match(brief,/intended model connections, identity, stores and enabled tools/);
 assert(!brief.includes('Supported; selection is unknown'));
 assert(page.indexOf('id="overview"')<page.indexOf('id="edge-0"'));
 assert.match(page,/not a comprehensive dependency SBOM/);
});
test('connected overview retains each identity once and every directed edge, including loops, parallel and disconnected nodes',()=>{
 const b=described();const edge=JSON.parse(b.properties.find(p=>p.name==='n8r:surface:relationship').value);
 for(const [id,from,to] of [['parallel',edge.from,edge.to],['reverse',edge.to,edge.from],['loop','app','app']])b.properties.push(property('relationship',{...edge,id,from,to}));
 b.components.push({'bom-ref':'lonely',type:'library',name:'Disconnected name that is deliberately much longer than a small node box can hold'});
 const s=checkSurfaceBom(b),page=renderSurface(s)['surface.html'];
 const overview=page.slice(page.indexOf('<svg'),page.indexOf('</svg>'));
 assert.equal((overview.match(/data-node=/g)||[]).length,7);
 assert.equal((overview.match(/data-edge=/g)||[]).length,8);
 for(const n of [...b.components,...b.services])assert(overview.includes(`data-node="${n['bom-ref']}"`));
 assert.match(page,/Unclassified/);assert.match(page,/Disconnected name that is deliberately/);
 assert(!overview.includes('NaN'));
});
test('no evidence-backed finding is fabricated for old or empty records; all annotations and edge exceptions remain inspectable',()=>{
 const b=fixture();const p=b.properties.find(p=>p.name==='n8r:surface:relationship');const e=JSON.parse(p.value);e.note='Important exception: this route bypasses the backend.';p.value=JSON.stringify(e);
 let files=renderSurface(checkSurfaceBom(b));assert.match(files['brief.md'],/No evidence-backed findings recorded/);assert.match(files['surface.html'],/Important exception/);
 for(const a of b.annotations)assert(files['surface.html'].includes(a.text));
 b.components=[];b.services=[];b.annotations=[];b.dependencies=[];b.citations=[];
 b.properties=b.properties.filter(p=>!['relationship','evidence','entry'].some(k=>p.name==='n8r:surface:'+k));
 files=renderSurface(checkSurfaceBom(b));assert.match(files['surface.html'],/No components recorded yet/);
});
test('overview content and generated links keep hostile source strings inert',()=>{
 const b=described();b.components[0].name='<script>alert(1)</script>';b.components[0].description='<img src=x onerror=alert(1)>';
 const p=JSON.parse(b.components[0].properties[0].value);p.area='</text><script>bad</script>';b.components[0].properties[0].value=JSON.stringify(p);
 const page=renderSurface(checkSurfaceBom(b))['surface.html'];
 assert(!page.includes('<script>'));assert(!page.includes('<img src=x'));assert.match(page,/&lt;script&gt;/);assert.match(page,/default-src 'none'/);
});
test('parallel routes and self-loops have distinct geometry rather than covered links',()=>{
 const b=described(),edge=JSON.parse(b.properties.find(p=>p.name==='n8r:surface:relationship').value);
 for(let i=0;i<8;i++)for(const [kind,to] of [['parallel','db-a'],['loop','app']])b.properties.push(property('relationship',{...edge,id:kind+i,to}));
 const page=renderSurface(checkSurfaceBom(b))['surface.html'];
 const paths=[...page.matchAll(/data-edge="[^"]+" d="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(paths).size,paths.length);
});
test('punctuation-bearing evidence IDs produce working Markdown and HTML fragment targets',()=>{
 const b=described(),id='finding)1 #é';
 b.annotations.push({...b.annotations[0],'bom-ref':id});b.properties.push(property('evidence',{id,basis:'source',sources:[{index:0,locator:'synthetic:1'}],applicability:'Synthetic only'}));
 const p=b.properties.find(p=>p.name==='n8r:surface:entry'&&JSON.parse(p.value).id==='storage-finding');const e=JSON.parse(p.value);e.evidence=[id];p.value=JSON.stringify(e);
 const files=renderSurface(checkSurfaceBom(b));
 const target=files['brief.md'].match(/\]\(surface.html#(ev-[^\s)]+)\)/)?.[1];
 assert(target);assert(files['surface.html'].includes(`id="${decodeURIComponent(target)}"`));
});
test('grouping based on a human decision is visibly identified as user evidence in brief and node detail',()=>{
 const b=described(),p=JSON.parse(b.components[0].properties[0].value);p.evidence=['decision-1'];b.components[0].properties[0].value=JSON.stringify(p);
 const files=renderSurface(checkSurfaceBom(b));
 for(const f of ['brief.md','surface.html']){assert.match(files[f],/user intent/);assert(!files[f].includes('Grouping describes source architecture'));}
 assert.match(files['brief.md'],/decision-1/);
});
