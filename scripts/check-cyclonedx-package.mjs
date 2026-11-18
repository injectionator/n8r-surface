import {mkdtempSync,mkdirSync,copyFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {packCandidates} from './pack-candidates.mjs';
const root=resolve(import.meta.dirname,'..'),temp=mkdtempSync(join(tmpdir(),'n8r-cdx-package-'));
try {
 const candidates=join(temp,'candidates'),report=packCandidates(candidates),consumer=join(temp,'consumer');
 mkdirSync(consumer);writeFileSync(join(consumer,'package.json'),'{"private":true,"type":"module"}\n');
 execFileSync('npm',['install','--omit=dev','--ignore-scripts','--no-audit','--no-fund',join(candidates,report.packages[0].filename)],{cwd:consumer,stdio:'pipe'});
 mkdirSync(join(consumer,'examples/researcher/surface-bom'),{recursive:true});
 copyFileSync(join(root,'examples/researcher/surface-bom/initial.cdx.json'),join(consumer,'examples/researcher/surface-bom/initial.cdx.json'));
 copyFileSync(join(root,'tests/cyclonedx-consumer.test.mjs'),join(consumer,'consumer.test.mjs'));
 execFileSync(process.execPath,['--test','consumer.test.mjs'],{cwd:consumer,env:{...process.env,N8R_CDX_PACKAGE:report.packages[0].name},stdio:'inherit'});
}finally{rmSync(temp,{recursive:true,force:true});}
