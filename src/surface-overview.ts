/** Deterministic, offline overview. Layout hints never establish deployed boundaries. */
import type {Surface} from './surface-bom.js';
export const escapeHtml=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
// No percent escapes in IDs: browsers decode fragment URLs before lookup.
// Escape underscores too so literal and encoded identifiers cannot collide.
export const fragmentId=(kind:string,id:string)=>kind+'-'+Array.from(id).map(c=>/[a-zA-Z0-9-]/.test(c)?c:'_'+c.codePointAt(0)!.toString(16)+'_').join('');
export const boundaryNames={internal:'Inside the application',external:'External integrations',unknown:'Unclassified'};
export function nodeGroups(s:Surface){
 const groups=new Map<string,{boundary:keyof typeof boundaryNames;area:string;nodes:any[]}>();
 for(const n of [...(s.bom.components??[]),...(s.bom.services??[])]){
  const p=s.presentation[n['bom-ref']],boundary=p?.boundary??'unknown',area=p?.area??'Placement not researched';
  const key=JSON.stringify([boundary,area]);if(!groups.has(key))groups.set(key,{boundary,area,nodes:[]});groups.get(key)!.nodes.push(n);
 }
 return [...groups.values()].sort((a,b)=>Object.keys(boundaryNames).indexOf(a.boundary)-Object.keys(boundaryNames).indexOf(b.boundary));
}
function wrap(text:string){
 // Wrap long tokens too; preserve the full label in the accessible title.
 const lines:string[]=[];let line='';
 for(const word of text.split(/\s+/)){
  if(line&&(line+' '+word).length>30){lines.push(line);line='';}
  let rest=word;while(rest.length>30){lines.push(rest.slice(0,30));rest=rest.slice(30);}
  line+=(line?' ':'')+rest;
 }
 if(line)lines.push(line);return lines;
}
export function renderOverview(s:Surface){
 const h=escapeHtml,groups=nodeGroups(s);
 if(!groups.length)return '<p>No components recorded yet. Continue the source investigation.</p>';
 const positions=new Map<string,{x:number;y:number;height:number;n:any;lines:string[]}>();
 const columns=Object.keys(boundaryNames);const heights=[65,65,65];let labels='';
 const counts=new Map<string,number>();
 for(const e of s.relationships){const key=JSON.stringify([e.from,e.to]);counts.set(key,(counts.get(key)??0)+1);}
 const columnWidth=370+Math.max(0,...counts.values())*12,canvasWidth=columnWidth*3+10;
 const lanes=new Map<string,number>();
 for(const g of groups){
  const col=columns.indexOf(g.boundary),x=25+col*columnWidth;let y=heights[col]!;
  const areaLines=wrap(g.area);labels+=`<text x="${x}" y="${y}" class="area-label">${areaLines.map((line,i)=>`<tspan x="${x}" dy="${i?18:0}">${h(line)}</tspan>`).join('')}</text>`;
  y+=areaLines.length*18+12;
  for(const n of g.nodes){const lines=wrap(n.name),height=Math.max(54,lines.length*18+24);positions.set(n['bom-ref'],{x,y,height,n,lines});y+=height+24;}
  heights[col]=y+22;
 }
 const edges=s.relationships.map((e,i)=>{
  const a=positions.get(e.from)!,b=positions.get(e.to)!;
  const ay=a.y+a.height/2,by=b.y+b.height/2;
  const key=JSON.stringify([e.from,e.to]),rank=lanes.get(key)??0;lanes.set(key,rank+1);
  let d:string;
  if(e.from===e.to)d=`M${a.x+280} ${ay-9} C${a.x+330+rank*12} ${ay-28} ${a.x+330+rank*12} ${ay+28} ${a.x+280} ${ay+9}`;
  else if(a.x===b.x){const lane=a.x+300+rank*12;d=`M${a.x+280} ${ay} C${lane} ${ay} ${lane} ${by} ${b.x+280} ${by}`;}
  else {const right=b.x>a.x,ax=a.x+(right?280:0),bx=b.x+(right?0:280),bend=(ax+bx)/2;const offset=(rank+1)*12;d=`M${ax} ${ay} C${bend+offset} ${ay+offset} ${bend+offset} ${by+offset} ${bx} ${by}`;}
  return `<a href="#edge-${i}"><path data-edge="${h(e.id)}" d="${d}" class="${e.selection==='selected'?'selected':'possible'}" marker-end="url(#arrow)"><title>${h(a.n.name+' → '+b.n.name+': '+e.purpose+'; support '+e.support+'; selection '+e.selection)}</title></path></a>`;
 }).join('');
 const nodes=[...positions].map(([id,p])=>`<a href="#${fragmentId('node',id)}"><g data-node="${h(id)}"><title>${h(p.n.name)}</title><rect x="${p.x}" y="${p.y}" width="280" height="${p.height}" rx="6"/><text x="${p.x+12}" y="${p.y+24}">${p.lines.map((line,i)=>`<tspan x="${p.x+12}" dy="${i?18:0}">${h(line)}</tspan>`).join('')}</text></g></a>`).join('');
 return `<div class="map"><svg role="img" aria-label="Connected application overview; full relationships follow" viewBox="0 0 ${canvasWidth} ${Math.max(...heights)+20}"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64746d"/></marker></defs>${columns.map((c,i)=>`<text x="${25+i*columnWidth}" y="30" class="boundary-label">${h(boundaryNames[c as keyof typeof boundaryNames])}</text>`).join('')}${labels}${edges}${nodes}</svg></div>`;
}
