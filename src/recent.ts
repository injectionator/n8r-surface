/** Local navigation metadata only; never included in portable research artifacts. */
import fs from 'node:fs';
import {join,resolve,relative,sep} from 'node:path';
import {randomUUID} from 'node:crypto';
import {InspectionError,readBytes} from './settings.js';
export type RecentWork={id:string;title:string;source:string;path:string;model:string};
function location(home:string) {
  const directory=join(fs.realpathSync(home),'.n8r');
  try {const stat=fs.lstatSync(directory);if(!stat.isDirectory()||stat.isSymbolicLink())throw new InspectionError('Recent-work folder is not a regular directory');}
  catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}
  return {directory,file:join(directory,'recent.json')};
}
function valid(item:any):item is RecentWork {
  return item && ['id','title','source','path','model'].every(k=>typeof item[k]==='string'&&item[k].length>0&&item[k].length<16000)
    && resolve(item.source)===item.source && resolve(item.path)===item.path;
}
export function recentWork(home:string):RecentWork[] {
  const {file}=location(home);
  let bytes;try{bytes=readBytes(file,1024*1024);}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}
  let value;try{value=JSON.parse(bytes.toString('utf8'));}catch{throw new InspectionError('Recent-work list is damaged; saved research is unchanged');}
  if(!Array.isArray(value)||value.length>100||!value.every(valid))throw new InspectionError('Invalid recent-work list; saved research is unchanged');
  return value;
}
export function rememberWork(home:string,item:RecentWork):void {
  if(!valid(item))throw new InspectionError('Invalid saved-work reference');
  const {directory,file}=location(home);
  const rel=relative(item.source,directory);
  if(!rel||(!rel.startsWith(`..${sep}`)&&rel!=='..'&&!rel.startsWith(sep)))throw new InspectionError('Recent-work list cannot be written inside the research source');
  fs.mkdirSync(directory,{recursive:true,mode:0o700});
  const lock=file+'.lock';const fd=fs.openSync(lock,'wx',0o600);
  const temporary=file+'.'+randomUUID();
  try {
    const previous=recentWork(home);
    const next=[item,...previous.filter(p=>p.id!==item.id)].slice(0,100);
    fs.writeFileSync(temporary,JSON.stringify(next,null,2)+'\n',{flag:'wx',mode:0o600});
    // Check again while holding our lock; refuse user edits during this save.
    if(JSON.stringify(recentWork(home))!==JSON.stringify(previous))throw new InspectionError('Recent-work list changed; saved research is unchanged');
    fs.renameSync(temporary,file);
  } finally {fs.closeSync(fd);fs.unlinkSync(lock);if(fs.existsSync(temporary))fs.unlinkSync(temporary);}
}
