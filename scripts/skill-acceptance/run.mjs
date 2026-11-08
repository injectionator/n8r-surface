import {loadConfiguration, runCucumber} from '@cucumber/cucumber/api';
import {mkdirSync, mkdtempSync, writeFileSync, readFileSync, realpathSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join, resolve, relative} from 'node:path';
import {tmpdir, homedir} from 'node:os';
import {randomUUID, createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {captureFinal, cleanupFixture} from './checks.mjs';
import {suite} from './state.mjs';
import {Host, verifyInstallation} from './host.mjs';
import {createReport,recordReview} from './review.mjs';

const args=process.argv.slice(2);
const usage=`Usage: npm run acceptance:skill -- MODE --evidence DIRECTORY
Modes (choose one):
  --live       Run installed-skill scenarios and generate review.md
  --report     Generate/verify review.md from retained evidence; no inference
  --review     Record human verdicts; requires --run FINGERPRINT --reviewer NAME
               --create Pass|Fail|Blocked --repeat Pass|Fail|Blocked --reopen Pass|Fail|Blocked
               Optional: --comment TEXT
  --cleanup    Remove owned fixture, retain evidence and review
Live-only options: --installed PATH --revision FULL_COMMIT`;
if(args.length===1 && args[0]==='--help'){console.log(usage);process.exit(0);}
const modes=['--live','--report','--review','--cleanup'];
const values=['--evidence','--installed','--revision','--run','--reviewer','--create','--repeat','--reopen','--comment'];
const options={};
try {
  for(let i=0;i<args.length;i++){
    const key=args[i];
    if(Object.hasOwn(options,key))throw Error(`Duplicate option: ${key}`);
    if(modes.includes(key))options[key]=true;
    else if(values.includes(key) && i+1<args.length && !args[i+1].startsWith('--'))options[key]=args[++i];
    else throw Error(`Unknown option or missing value: ${key}`);
  }
  if(modes.filter(m=>options[m]).length!==1)throw Error('Choose exactly one mode');
  if(!options['--evidence'])throw Error('--evidence is required');
  for(const key of ['--installed','--revision'])if(options[key] && !options['--live'])throw Error(`${key} is live-only`);
  for(const key of ['--run','--reviewer','--create','--repeat','--reopen','--comment'])if(options[key] && !options['--review'])throw Error(`${key} is review-only`);
} catch(error){console.error(`${error.message}\n${usage}`);process.exit(2);}
const option=name=>options[name];
const evidence=option('--evidence');
const scenarioNames=[...readFileSync('tests/acceptance/skill-workspace.feature','utf8').matchAll(/@installed-workspace\s+Scenario: ([^\n]+)/g)].map(m=>m[1]);
suite.evidence=resolve(evidence);
if(options['--report'] || options['--review']) {
  try {
    if(options['--report']) {
      const report=createReport(suite.evidence);
      console.log(`Review report: ${join(suite.evidence,'review.md')}\nRun fingerprint: ${report.run}\nAutomated evidence: ${report.automated}`);
      if(report.humanReview){const r=report.humanReview;console.log(`Human: create=${r.verdicts.create}; repeat=${r.verdicts.repeat}; reopen=${r.verdicts.reopen}\nOverall: ${r.overall}`);}else console.log('Human review: Pending');
      process.exit(0);
    }
    const receipt=recordReview(suite.evidence,{run:option('--run'),reviewer:option('--reviewer'),verdicts:{create:option('--create'),repeat:option('--repeat'),reopen:option('--reopen')},comment:option('--comment')??''});
    console.log(`Review recorded: ${join(suite.evidence,'human-review.json')}\nAutomated: ${receipt.automated}\nHuman: create=${receipt.verdicts.create}; repeat=${receipt.verdicts.repeat}; reopen=${receipt.verdicts.reopen}\nOverall: ${receipt.overall}`);
    process.exit(receipt.overall==='Pass'?0:receipt.overall==='Fail'?1:2);
  } catch(error){console.error(`Review refused: ${error.message}`);process.exit(2);}
}
const globalFiles=[join(homedir(),'.n8r/n8r-surface.json'),resolve('.local/vault-path')];
const settingsSnapshot=()=>Object.fromEntries(globalFiles.map(path=>[path,existsSync(path)?createHash('sha256').update(readFileSync(path)).digest('hex'):null]));
const save=(name,value)=>writeFileSync(join(suite.evidence,name),JSON.stringify(value,null,2)+'\n',{mode:0o600});
if(args.includes('--cleanup')) {
  const root=cleanupFixture(suite.evidence);save('cleanup.json',{removed:root,time:new Date().toISOString()});console.log('Removed owned fixture only; evidence retained.');process.exit(0);
}
const relativeEvidence=relative(process.cwd(),suite.evidence);
if(!relativeEvidence.startsWith('..') && !relativeEvidence.startsWith('/'))execFileSync('git',['check-ignore','--quiet','--',suite.evidence]);
mkdirSync(suite.evidence,{mode:0o700});
let timer;
try {
  suite.settingsBefore=settingsSnapshot();save('settings-before.json',suite.settingsBefore);
  const root=realpathSync(mkdtempSync(join(tmpdir(),'n8r-skill-acceptance-')));
  const token=randomUUID();writeFileSync(join(root,'.owner'),token,{mode:0o600});
  suite.directory=join(root,'workspace');mkdirSync(suite.directory);
  save('ownership.json',{root,token,directory:suite.directory});
  writeFileSync(join(suite.evidence,'history-canary.txt'),'Private acceptance evidence; not model context.\n',{mode:0o600});
  const revision=option('--revision')??'3cb08f59a4a932121bdd1c742fbac724d12a6d74';
  const installed=option('--installed')??join(process.env.CODEX_HOME??join(homedir(),'.codex'),'plugins/cache/n8r-surface/n8r-surface/0.1.9');
  suite.installation=verifyInstallation(installed,revision);
  suite.helper=join(suite.installation.root,'skills/research/scripts/workspace.mjs');
  suite.discovery=await Host.discover(suite.directory,join(suite.evidence,'discovery.jsonl'));
  const skill=suite.discovery.skills.data?.flatMap(d=>d.skills).find(s=>s.path===join(suite.installation.root,'skills/research/SKILL.md') && s.enabled && s.pluginId==='n8r-surface@n8r-surface');
  if(!skill)throw Error('Identified installed plugin is not enabled/discovered');
  const harnessFiles=['package.json','package-lock.json','tests/acceptance/skill-workspace.feature',...['run','state','steps','host','checks','rpc','review'].map(n=>`scripts/skill-acceptance/${n}.mjs`)];
  const harnessDigests=Object.fromEntries(harnessFiles.map(path=>[path,createHash('sha256').update(readFileSync(path)).digest('hex')]));
  save('metadata.json',{harnessDigests,source:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceDirty:execFileSync('git',['status','--porcelain'],{encoding:'utf8'}),installation:suite.installation,cli:suite.discovery.version,model:suite.discovery.model,node:process.version,platform:process.platform,startedAt:new Date().toISOString(),skill,scope:'CLI app-server only; not desktop acceptance',limits:{turns:3,turnSeconds:120,totalSeconds:600},isolation:'Ephemeral threads; new process for reopen; memories/apps/MCP/history surfaces disabled; restricted filesystem with runtime and installed-skill reads; evidence denial checked before each session.'});
  timer=setTimeout(()=>{suite.timedOut=true;save('blocked.json',{status:'blocked',message:'600-second suite limit exceeded'});void suite.host?.close();},600000);
  const {runConfiguration}=await loadConfiguration({provided:{paths:['tests/acceptance/skill-workspace.feature'],import:['scripts/skill-acceptance/steps.mjs'],tags:'@installed-workspace',parallel:0,retry:0,order:'defined',format:['progress',`json:${join(suite.evidence,'cucumber.json')}`]}});
  await runCucumber(runConfiguration);
  if(suite.results.length!==3)throw Error('Expected exactly three selected scenarios');
  const failure=suite.results.some(r=>r.automated!=='passed');
  console.log(failure?'Automated checks failed/blocked.':'Automated checks passed for all three scenarios; human experience review remains pending.');
  // Full Gherkin acceptance includes semantic human judgments, never false-green.
  process.exitCode=failure?1:2;
} catch(error) {
  save('blocked.json',{status:'blocked',message:error.message});
  if(!suite.results.length) {
    suite.results=scenarioNames.map(name=>({name,automated:'blocked',gherkin:'blocked',error:error.message}));
    save('results.json',suite.results);
    for(const row of suite.results)console.error(`${row.name}: blocked by prerequisite`);
  }console.error(`BLOCKED: ${error.message}`);process.exitCode=2;
} finally {
  clearTimeout(timer);await suite.host?.close();
  for(const name of scenarioNames)if(!suite.results.some(r=>r.name===name))suite.results.push({name,automated:'blocked',gherkin:'blocked',error:'Run stopped before scenario completed'});
  save('results.json',suite.results);
  if(suite.directory){
    const final=captureFinal(suite.directory);save('final-inventory.json',final.inventory);save('final-capture.json',final);
    if(final.record)save('final-record.json',final.record);
    if(final.errors.length)process.exitCode=1;
  }
  if(suite.settingsBefore){try{const after=settingsSnapshot();save('settings-after.json',after);assert.deepEqual(after,suite.settingsBefore);}catch(error){save('settings-changed.json',{message:error.message});process.exitCode=1;}}
  if(suite.installation){try{save('installation-after.json',verifyInstallation(suite.installation.root,suite.installation.revision));}catch(error){save('installation-changed.json',{message:error.message});process.exitCode=1;}}
  try {
    const report=createReport(suite.evidence);
    console.log(`Review report: ${join(suite.evidence,'review.md')}\nRun fingerprint: ${report.run}`);
  } catch(error){console.error(`Report unavailable: ${error.message}`);process.exitCode=2;}
}
