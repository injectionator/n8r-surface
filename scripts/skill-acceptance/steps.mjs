import assert from 'node:assert/strict';
import {Given, When, Then, Before, After, setDefaultTimeout} from '@cucumber/cucumber';
import {readFileSync, writeFileSync} from 'node:fs';
import {basename, join} from 'node:path';
import {suite} from './state.mjs';
import {Host} from './host.mjs';
import {Blocked, inventory, checkCreated, checkUnchanged, checkTurn, requirePredecessor} from './checks.mjs';

setDefaultTimeout(150000);
Before(function({pickle}) { this.name=pickle.name;this.review=[];this.started=Date.now();if(suite.timedOut)throw new Blocked('Suite time limit exceeded'); });
function save(name,value) {writeFileSync(join(suite.evidence,name),JSON.stringify(value,null,2)+'\n',{mode:0o600});}
async function start(fresh=false) {
  const old=suite.host?.thread.thread.id;
  if(fresh)await suite.host.close();
  const logFile=join(suite.evidence,fresh?'reopen.jsonl':'setup.jsonl');
  const deniedPaths=[join(suite.evidence,'history-canary.txt')];
  if(fresh)deniedPaths.push(join(suite.evidence,'setup.jsonl'));
  suite.host=await Host.start({...suite,onHost:host=>{suite.host=host;},logFile,deniedPaths,previousThreadId:fresh?old:undefined});
  if(fresh)assert.notEqual(suite.host.thread.thread.id,old);
}
Given('a verified fresh supported Codex session with the identified skill installed',async function(){await start();});
Given('an empty writable destination selected by the user',function(){assert.deepEqual(inventory(suite.directory),{});});
Given('no existing n8r workspace or prior n8r conversation',function(){assert.equal(suite.host.thread.thread.turns.length,0);});
When('the user asks:',async function(text){
  // The only context supplied is the explicit destination and canonical request.
  this.turn=await suite.host.turn(`Selected destination: ${suite.directory}\n\n${text}`);
  suite.current=this.turn;
  save(`${suite.results.length+1}-turn.json`,this.turn);
});
When('the user answers necessary setup questions using their scenario facts',function(){
  // Empty destination and purpose are supplied up front. No simulated user loop.
  try {readFileSync(join(suite.directory,'.n8r/workspace.json'));}
  catch {throw new Blocked('Setup did not produce metadata in one turn; inspect response for a question or execution blocker');}
});
Then('a Surface workspace exists at the selected destination',function(){
  suite.record=JSON.parse(readFileSync(join(suite.directory,'.n8r/workspace.json'),'utf8'));
  suite.afterCreate=inventory(suite.directory);
  checkCreated(suite.record,suite.afterCreate,basename(suite.directory));
  save('create-inventory.json',suite.afterCreate);
});
Then('its identity and format version are independently readable',function(){
  checkTurn({...this.turn,record:suite.record,directory:suite.directory,helper:suite.helper,status:'created'});
});
Given('the workspace has been created and contains a user-owned note',function(){
  requirePredecessor(suite.results[0]?.automated);
  writeFileSync(join(suite.directory,'user-note.md'),'# Synthetic user note\n\nUser-owned fixture; no research findings.\n',{flag:'wx'});
  suite.beforeRepeat=inventory(suite.directory);save('repeat-before.json',suite.beforeRepeat);
});
When('the user asks to set up the workspace at that location again',async function(){
  this.turn=await suite.host.turn(`Selected destination: ${suite.directory}\n\nSet up this n8r workspace here again.`);
  save('2-turn.json',this.turn);
});
Then('the original workspace identity and user note remain unchanged',function(){
  const after=inventory(suite.directory);save('repeat-after.json',after);checkUnchanged(suite.beforeRepeat,after);
  assert.deepEqual(JSON.parse(readFileSync(join(suite.directory,'.n8r/workspace.json'),'utf8')),suite.record);
});
Then('the assistant recognizes the workspace rather than recreating it',function(){
  checkTurn({...this.turn,record:suite.record,directory:suite.directory,helper:suite.helper,status:'recognized'});
  this.review.push('No unnecessary repeat initialization permission question; recognition is clear to a user.');
});
Given('a fresh supported session with no access to the setup conversation',async function(){
  requirePredecessor(suite.results[1]?.automated);await start(true);
});
Given('the user has made the created workspace available',function(){suite.beforeReopen=inventory(suite.directory);save('reopen-before.json',suite.beforeReopen);});
Then('the assistant recognizes the same workspace identity and format version',function(){
  checkTurn({...this.turn,record:JSON.parse(readFileSync(join(suite.directory,'.n8r/workspace.json'),'utf8')),directory:suite.directory,helper:suite.helper,status:'recognized'});
});
Then('it does not start research or rewrite the workspace',function(){
  const after=inventory(suite.directory);save('reopen-after.json',after);checkUnchanged(suite.beforeReopen,after);
  this.review.push('No research was started: inspect all tool activity and response, not only file preservation.');
});
// These semantic assertions require a person; the After hook marks the scenario
// PENDING rather than allowing registered steps to imply full acceptance.
for(const text of [
  'the assistant identifies the actual location and how to continue',
  'it distinguishes workspace creation from app project attachment',
  'it does not require a Lab, source repository or Git repository',
  'it does not start research or request private instance credentials',
  'unrelated files and global vault settings are unchanged',
  'it explains the next available action from the saved workspace',
  'it does not claim that LibreChat has already been researched'
]) Then(text,function(){this.review.push(text);});
After(async function({result}){
  const automated=result.status==='PASSED'?'passed':result.message?.includes('Blocked')?'blocked':'failed';
  const row={name:this.name,automated,gherkin:automated==='passed'?'pending-human-review':automated,durationMs:Date.now()-this.started,reviewRequired:this.review,error:result.message??null};
  suite.results.push(row);save('results.json',suite.results);
  await this.attach(JSON.stringify(row,null,2),'application/json');
  console.log(`\n${this.name}: automated=${automated}; full scenario=${row.gherkin}`);
  if(automated==='passed')return 'pending';
});
