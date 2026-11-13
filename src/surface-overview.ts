/** Deterministic, offline overview. Layout hints never establish deployed boundaries. */
import type {Surface} from './surface-bom.js';
export const escapeHtml=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
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
 for(const g of groups){
  const col=columns.indexOf(g.boundary),x=25+col*370;let y=heights[col]!;
  const areaLines=wrap(g.area);labels+=`<text x="${x}" y="${y}" class="area-label">${areaLines.map((line,i)=>`<tspan x="${x}" dy="${i?18:0}">${h(line)}</tspan>`).join('')}</text>`;
  y+=areaLines.length*18+12;
  for(const n of g.nodes){const lines=wrap(n.name),height=Math.max(54,lines.length*18+24);positions.set(n['bom-ref'],{x,y,height,n,lines});y+=height+24;}
  heights[col]=y+22;
 }
 const edges=s.relationships.map((e,i)=>{
  const a=positions.get(e.from)!,b=positions.get(e.to)!;
  const ay=a.y+a.height/2,by=b.y+b.height/2;
  let d:string;
  if(e.from===e.to)d=`M${a.x+280} ${ay-9} C${a.x+330} ${ay-65} ${a.x+330} ${ay+65} ${a.x+280} ${ay+9}`;
  else if(a.x===b.x){const lane=a.x+300+(i%6)*8;d=`M${a.x+280} ${ay} C${lane} ${ay} ${lane} ${by} ${b.x+280} ${by}`;}
  else {const right=b.x>a.x,ax=a.x+(right?280:0),bx=b.x+(right?0:280),bend=(ax+bx)/2;const offset=(i%5-2)*9;d=`M${ax} ${ay} C${bend+offset} ${ay+offset} ${bend+offset} ${by+offset} ${bx} ${by}`;}
  return `<a href="#edge-${i}"><path data-edge="${h(e.id)}" d="${d}" class="${e.selection==='selected'?'selected':'possible'}" marker-end="url(#arrow)"><title>${h(a.n.name+' → '+b.n.name+': '+e.purpose+'; support '+e.support+'; selection '+e.selection)}</title></path></a>`;
 }).join('');
 const nodes=[...positions].map(([id,p])=>`<a href="#node-${encodeURIComponent(id)}"><g data-node="${h(id)}"><title>${h(p.n.name)}</title><rect x="${p.x}" y="${p.y}" width="280" height="${p.height}" rx="6"/><text x="${p.x+12}" y="${p.y+24}">${p.lines.map((line,i)=>`<tspan x="${p.x+12}" dy="${i?18:0}">${h(line)}</tspan>`).join('')}</text></g></a>`).join('');
 return `<div class="map"><svg role="img" aria-label="Connected application overview; full relationships follow" viewBox="0 0 1120 ${Math.max(...heights)+20}"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64746d"/></marker></defs>${columns.map((c,i)=>`<text x="${25+i*370}" y="30" class="boundary-label">${h(boundaryNames[c as keyof typeof boundaryNames])}</text>`).join('')}${labels}${edges}${nodes}</svg></div>`;
}
