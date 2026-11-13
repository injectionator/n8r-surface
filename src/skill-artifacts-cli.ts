import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {main} from './skill-artifacts.js';
export * from './skill-artifacts.js';
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{main(process.argv.slice(2));}catch{console.error('Surface operation failed. Check input contracts, privacy, references, predecessor and destination; no success claimed.');process.exitCode=1;}
}
