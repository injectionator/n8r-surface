/** Standalone installed-skill entry point; separate from the product CLI. */
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {checkSurfaceBom} from './surface-bom.js';
import {readJson,readSurface,saveSurface,byteDigest,readBytes} from './skill-surface-store.js';
export function main(args:string[]){
 const [op,file,dest,previous]=args;
 if(op==='help'&&args.length===1){console.log('Surface helper: check BOM.json | read BOM.json_OR_DIRECTORY | save BOM.json NEW_DIRECTORY [PREVIOUS_BOM_OR_DIRECTORY] | reconcile BOM.json NEW_DIRECTORY PREVIOUS_DIRECTORY. CycloneDX 1.7 Surface profile 1. New saves have one BOM authority and generated brief, journal and HTML map. Reconcile only reviewed view edits; it requires a reconciliation explanation in the BOM. Offline; Node 22/24/26; no product CLI or runtime install.');return;}
 if(op==='check'&&args.length===2){const s=checkSurfaceBom(readJson(file!));console.log(JSON.stringify({status:'checked',relationships:s.relationships.length,entries:s.entries.length}));return;}
 if(op==='read'&&args.length===2){const s=readSurface(file!);console.log(JSON.stringify({status:'checked',...s},null,2));return;}
 if((op==='save'&&(args.length===3||args.length===4))||(op==='reconcile'&&args.length===4)){
  const s=saveSurface(readJson(file!),dest!,previous,op==='reconcile');console.log(JSON.stringify({status:'saved-and-read-back',serialNumber:s.bom.serialNumber,version:s.bom.version,bomDigest:byteDigest(readBytes(resolve(dest!,'surface.cdx.json'))),files:['surface.html','brief.md','investigation.md','surface.cdx.json']}));return;
 }
 throw Error('Arguments refused; run help.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{main(process.argv.slice(2));}catch(e){console.error(e instanceof Error?e.message:'Surface operation failed; no success claimed.');process.exitCode=1;}}
