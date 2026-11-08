import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, lstatSync, realpathSync, existsSync, rmSync} from 'node:fs';
import {join, dirname, basename} from 'node:path';
import {tmpdir} from 'node:os';

export class Blocked extends Error {
  constructor(message) { super(message); this.name='Blocked'; }
}
export function requirePredecessor(status) {
  if (status !== 'passed') throw new Blocked('Scenario prerequisite did not pass');
}
export function inventory(root) {
  const result = {};
  function visit(relative = '') {
    for (const name of readdirSync(join(root, relative)).sort()) {
      const path = relative ? `${relative}/${name}` : name;
      const stat = lstatSync(join(root, path), {bigint:true});
      assert(!stat.isSymbolicLink(), 'Fixture must not contain symlinks');
      if (stat.isDirectory()) { result[path] = {type:'directory',mtime:String(stat.mtimeNs),ctime:String(stat.ctimeNs)}; visit(path); }
      else {
        assert(stat.isFile(), 'Fixture must contain only regular files/directories');
        result[path] = {type:'file',sha256:createHash('sha256').update(readFileSync(join(root,path))).digest('hex'),mtime:String(stat.mtimeNs),ctime:String(stat.ctimeNs)};
      }
    }
  }
  visit(); return result;
}
export function checkCreated(record, files, name) {
  assert.deepEqual(Object.keys(files).sort(), ['.n8r','.n8r/workspace.json'], 'Create must leave only metadata');
  assert.equal(record.format, 'n8r.workspace/1');
  assert.match(record.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, 'Expected UUID v4');
  assert.equal(record.name, name);
  assert.match(record.purpose, /investigat\w* LibreChat/i, 'Saved purpose must reflect supplied intent');
}
export function checkUnchanged(before, after) {
  assert.deepEqual(after, before, 'Workspace entries, bytes or file timestamps changed');
}
export function checkTurn({items, record, directory, helper, status}) {
  const calls = items.filter(i => i.type === 'commandExecution' && i.command.includes(helper));
  const receipts = calls.filter(i => i.exitCode === 0 && i.status === 'completed').flatMap(i => {
    try { return [JSON.parse(i.aggregatedOutput.trim())]; } catch { return []; }
  });
  const receipt = receipts.find(r => r.status === status && r.directory === directory);
  assert(receipt, 'Missing successful installed helper receipt for destination/status');
  assert.deepEqual(receipt.record, record, 'Helper identity must match independent readback');
  assert(!calls.some(i=>i.exitCode !== 0), 'Installed helper failed during this turn');
  const final = items.filter(i=>i.type === 'agentMessage' && i.phase === 'final_answer').map(i=>i.text).join('\n');
  assert(final.includes(record.id), 'Response identity differs from saved identity');
  assert(final.includes(record.format), 'Response must identify saved format');
  if(status==='created')assert(final.includes(directory), 'Response must identify actual destination');
  assert(/LibreChat/i.test(final), 'Response must reflect saved purpose');
  assert(!items.some(i=>i.type === 'fileChange'), 'Unexpected direct file edit');
  return {helperReceipts:receipts, final};
}
export function checkProvider(config) {
  if (config.model_provider && config.model_provider !== 'openai') throw new Blocked('Custom model provider is unsupported');
  if (config.model_providers?.openai) throw new Blocked('Custom OpenAI provider configuration is unsupported');
  for (const [key, expected] of [['chatgpt_base_url','https://chatgpt.com/backend-api'],['openai_base_url','https://api.openai.com/v1']]) {
    if (config[key] && config[key].replace(/\/$/,'') !== expected) throw new Blocked('Custom provider endpoint is unsupported');
  }
}

export function cleanupFixture(evidence) {
  const owner=JSON.parse(readFileSync(join(evidence,'ownership.json'),'utf8'));
  assert(!lstatSync(owner.root).isSymbolicLink(), 'Fixture root must not be a symlink');
  const root=realpathSync(owner.root);
  assert(dirname(root)===realpathSync(tmpdir()) && basename(root).startsWith('n8r-skill-acceptance-'), 'Not an owned fixture root');
  assert.equal(readFileSync(join(root,'.owner'),'utf8'),owner.token,'Ownership token differs');
  assert(existsSync(join(evidence,'final-inventory.json')),'Final evidence is required before cleanup');
  rmSync(root,{recursive:true});
  return root;
}
export function isMissingThread(error,id) {
  return error.code===-32600 && error.message===`thread not loaded: ${id}`;
}
export function captureFinal(root) {
  const result={inventory:{},errors:[]};
  function visit(dir,relative='') {
    try {
      for(const name of readdirSync(dir).sort()) {
        const path=join(dir,name),key=relative+name,stat=lstatSync(path,{bigint:true});
        if(stat.isSymbolicLink()){result.inventory[key]={type:'symlink'};result.errors.push(`Unexpected symlink: ${key}`);}
        else if(stat.isDirectory()){result.inventory[key]={type:'directory'};visit(path,key+'/');}
        else if(stat.isFile()){result.inventory[key]={type:'file',sha256:createHash('sha256').update(readFileSync(path)).digest('hex'),mtime:String(stat.mtimeNs),ctime:String(stat.ctimeNs)};}
        else {result.inventory[key]={type:'unsupported'};result.errors.push(`Unsupported entry: ${key}`);}
      }
    }catch(error){result.errors.push(error.message);}
  }
  visit(root);
  const metadata=join(root,'.n8r/workspace.json');
  // Never follow a metadata or parent symlink while collecting failure evidence.
  if(result.inventory['.n8r']?.type==='directory' && result.inventory['.n8r/workspace.json']?.type==='file') {
    try{result.rawMetadata=readFileSync(metadata,'utf8');result.record=JSON.parse(result.rawMetadata);}
    catch(error){result.errors.push(`Metadata: ${error.message}`);}
  }
  return result;
}
