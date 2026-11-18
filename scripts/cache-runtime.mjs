// Networked preparation for the offline consumer check; never installs or runs packages.
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const lock=JSON.parse(readFileSync(new URL('../package-lock.json',import.meta.url),'utf8'));
if(lock.lockfileVersion!==3)throw Error('Runtime cache preparation requires lockfile v3');
const specs=[...new Set(Object.entries(lock.packages)
  .filter(([location,pkg])=>location.includes('node_modules/')&&!pkg.dev)
  .map(([location,pkg])=>`${location.split('node_modules/').at(-1)}@${pkg.version}`))];
if(!specs.length)throw Error('No locked runtime dependencies found');
execFileSync(process.platform==='win32'?'npm.cmd':'npm',['cache','add',...specs],{stdio:'inherit'});
console.log(`Cached metadata and archives for ${specs.length} locked runtime dependencies.`);
