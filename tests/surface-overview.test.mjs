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
 assert.match(brief,/Source-only research needs no running services/);
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
 b.properties.push(property('relationship',{...edge,id:'reverse-route',from:edge.to,to:edge.from}));
 const page=renderSurface(checkSurfaceBom(b))['surface.html'];
 const paths=[...page.matchAll(/data-edge="[^"]+" d="([^"]+)"/g)].map(m=>m[1]);
 const geometry=paths.map(d=>{const nums=d.match(/-?\d+(?:\.\d+)?/g);const points=[];for(let i=0;i<nums.length;i+=2)points.push(nums.slice(i,i+2).join(','));return [points.join(' '),points.reverse().join(' ')].sort()[0];});
 assert.equal(new Set(geometry).size,paths.length);
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
test('an explicitly unclassified node with no evidence says placement basis is not recorded',()=>{
 const b=described();b.services[0].properties=[property('presentation',{boundary:'unknown',area:'Persistence',evidence:[]})];
 const brief=renderSurface(checkSurfaceBom(b))['brief.md'];assert.match(brief,/Placement basis: Not recorded/);
});

test('superseded findings and actions leave current views but remain in history',()=>{
 const b=described();
 const old=JSON.parse(b.properties.find(p=>p.name==='n8r:surface:entry'&&JSON.parse(p.value).id==='storage-finding').value);
 b.properties.push(property('entry',{...old,id:'replacement',title:'Current storage finding',supersedes:old.id}));
 const action={...old,id:'old-action',kind:'next',status:'open',title:'Start unavailable daemon'};
 b.properties.push(property('entry',action),property('entry',{...action,id:'new-action',title:'Trace source authorization',supersedes:action.id}));
 const f=renderSurface(checkSurfaceBom(b));
 assert(!f['brief.md'].includes(old.title));assert(!f['brief.md'].includes(action.title));
 assert(f['brief.md'].includes('Current storage finding'));
 const current=f['surface.html'].split('<section id="journey">')[0];
 assert(!current.includes(old.title));assert(!current.includes(action.title));
 assert(f['investigation.md'].includes(old.title));assert(f['investigation.md'].includes(action.title));
});
test('brief bounds growing lists, prefers the active action and preserves full detail elsewhere',()=>{
 const b=described();
 const entry=JSON.parse(b.properties.find(p=>p.name==='n8r:surface:entry'&&JSON.parse(p.value).id==='storage-finding').value);
 for(let i=0;i<12;i++)b.properties.push(property('entry',{...entry,id:'finding-'+i,title:'Observation '+i,text:'Conditional finding '+i+'; runtime remains unverified.'}));
 for(let i=0;i<8;i++)b.properties.push(property('entry',{...entry,id:'action-'+i,kind:'next',status:i===7?'active':'open',title:'Action '+i}));
 for(let i=0;i<20;i++){b.properties.push(property('coverage','Coverage '+i),property('gap','Gap '+i));b.components.push({'bom-ref':'extra-'+i,type:'library',name:'Extra node '+i});}
 const f=renderSurface(checkSurfaceBom(b)),brief=f['brief.md'];
 assert.equal((brief.match(/\*\*Observation /g)||[]).length,5);
 assert(brief.includes('Conditional finding 11; runtime remains unverified.'));
 assert.equal((brief.match(/\*\*Action /g)||[]).length,1);assert(brief.includes('Action 7'));
 assert(!brief.includes('Coverage 19'));assert(!brief.includes('Gap 19'));assert(!brief.includes('Extra node 19'));
 assert.match(brief,/additional/);assert.match(brief,/surface.html#findings/);assert.match(brief,/surface.html#next/);
 for(const value of ['Observation 0','Action 0','Coverage 19','Gap 19','Extra node 19'])assert(f['surface.html'].includes(value));
 assert(!brief.includes('Describe your intended model connections'));
});
