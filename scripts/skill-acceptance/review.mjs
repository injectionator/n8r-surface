import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readdirSync,readFileSync,writeFileSync,lstatSync,existsSync} from 'node:fs';
import {join} from 'node:path';

const generated=new Set(['review.md','review-manifest.json','human-review.json','cleanup.json']);
const scenarios=[
  ['create','Create a workspace without beginning research'],
  ['repeat','Repeat setup without replacing existing work'],
  ['reopen','Reopen without the setup conversation']
];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function snapshot(root) {
  assert(!lstatSync(root).isSymbolicLink(),'Evidence directory must not be a symlink');
  const files=Object.create(null),bytes=Object.create(null);
  for(const name of readdirSync(root).sort()) {
    const stat=lstatSync(join(root,name));
    assert(stat.isFile() && !stat.isSymbolicLink(),`Evidence must be regular files, not symlinks: ${name}`);
    if(generated.has(name))continue;
    assert(stat.size<=64*1024*1024,`Evidence file exceeds 64 MiB: ${name}`);
    bytes[name]=readFileSync(join(root,name));files[name]=hash(bytes[name]);
  }
  assert(Object.keys(files).length,'No run evidence found');
  return {files,bytes,run:hash(JSON.stringify(files))};
}
function fence(value) {
  const text=typeof value==='string'?value:JSON.stringify(value,null,2)??'undefined';
  const length=Math.max(3,...[...text.matchAll(/`+/g)].map(m=>m[0].length+1));
  const marker='`'.repeat(length);
  return `${marker}text\n${text}\n${marker}\n`;
}
function partialTurn(snap,index) {
  const name=index===2?'reopen.jsonl':'setup.jsonl';
  const target=index===1?2:1;
  let sequence=0,turn;
  for(const line of (snap.bytes[name]?.toString('utf8')??'').split('\n').filter(Boolean)) {
    let event;try{event=JSON.parse(line);}catch{continue;}
    if(event.method==='request' && event.params?.method==='turn/start') {
      sequence++;
      if(sequence===target)turn={partial:true,threadId:event.params.params?.threadId,items:[{type:'userMessage',content:event.params.params?.input??[]}]};
    }
    if(sequence!==target || !turn)continue;
    const item=event.params?.item;
    if(['item/started','item/completed'].includes(event.method) && item) {
      if(item.type==='userMessage')turn.items=turn.items.filter(i=>i.type!=='userMessage');
      const existing=turn.items.findIndex(i=>item.id && i.id===item.id);
      if(existing>=0)turn.items[existing]=item;else turn.items.push(item);
    }
  }
  return turn;
}
function inspect(snap) {
  const problems=[],parsed={};
  function json(name,required=true,kind='object') {
    if(!snap.bytes[name]){if(required)problems.push(`Missing evidence: ${name}`);return undefined;}
    try {
      const value=parsed[name]??=JSON.parse(snap.bytes[name].toString('utf8'));
      if(value===null || (kind==='array'?!Array.isArray(value):typeof value!=='object' || Array.isArray(value))) {
        problems.push(`Missing or invalid evidence contents: ${name}`);return undefined;
      }
      return value;
    }
    catch {problems.push(`Invalid JSON evidence: ${name}`);return undefined;}
  }
  const metadata=json('metadata.json');
  if(!metadata || !/^[a-f0-9]{40}$/.test(metadata.source??'') || !metadata.cli || !metadata.model || !metadata.node || !metadata.platform || !metadata.installation?.version || !/^[a-f0-9]{40}$/.test(metadata.installation?.revision??''))problems.push('Missing essential run identity fields');
  let results=json('results.json',true,'array');
  if(!Array.isArray(results)){problems.push('Missing or invalid scenario results');results=[];}
  const rows=scenarios.map(([key,name],i)=>{
    const found=results.filter(r=>r?.name===name);
    if(found.length!==1 || !['passed','failed','blocked'].includes(found[0]?.automated))problems.push(`Missing or invalid result: ${key}`);
    let turn=json(`${i+1}-turn.json`);
    if(turn && !Array.isArray(turn.items)){problems.push(`Missing turn items: ${key}`);turn=undefined;}
    if(!Array.isArray(found[0]?.reviewRequired) || !found[0].reviewRequired.length || !found[0].reviewRequired.every(c=>typeof c==='string' && c.trim()))problems.push(`Missing human criteria: ${key}`);
    if(!turn?.threadId || !turn?.items?.some(i=>i?.type==='agentMessage' && i.phase==='final_answer' && typeof i.text==='string' && i.text.trim()))problems.push(`Missing session identity or final response: ${key}`);
    if(!turn?.items?.some(i=>i?.type==='userMessage' && Array.isArray(i.content) && i.content.some(c=>c.type==='text' && typeof c.text==='string' && c.text.trim())))problems.push(`Missing user prompt: ${key}`);
    if(!turn?.items?.some(i=>i?.type==='commandExecution'))problems.push(`Missing tool activity: ${key}`);
    return {key,name,result:found[0],turn:turn??partialTurn(snap,i)};
  });
  const comparisons=[];
  for(const [label,before,after] of [
    ['Repeat workspace','repeat-before.json','repeat-after.json'],
    ['Reopen workspace','reopen-before.json','reopen-after.json'],
    ['Global settings fingerprints','settings-before.json','settings-after.json']
  ]) {
    const a=json(before),b=json(after);
    const status=a===undefined || b===undefined?'missing':JSON.stringify(a)===JSON.stringify(b)?'unchanged':'changed';
    comparisons.push({label,status,before,after});
  }
  const installed=json('installation-after.json');
  comparisons.push({label:'Installed skill bytes',status:!metadata?.installation || !installed?'missing':JSON.stringify(metadata.installation)===JSON.stringify(installed)?'unchanged':'changed',before:'metadata.json',after:'installation-after.json'});
  for(const name of ['create-inventory.json','final-inventory.json'])json(name);
  const record=json('final-record.json');
  if(!record || record.format!=='n8r.workspace/1' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(record.id??'') || typeof record.name!=='string' || !record.name.trim())problems.push('Missing or invalid final workspace identity');
  for(const name of ['create-inventory','repeat-before','repeat-after','reopen-before','reopen-after','final-inventory']) {
    const inventory=json(name+'.json');
    const required=['.n8r/workspace.json',...(name==='create-inventory'?[]:['user-note.md'])];
    if(!inventory || inventory['.n8r']?.type!=='directory' || required.some(path=>inventory[path]?.type!=='file' || !/^[a-f0-9]{64}$/.test(inventory[path]?.sha256??'')))problems.push(`Missing preservation proof: ${name}.json`);
  }
  const capture=json('final-capture.json');
  if(capture && !Array.isArray(capture.errors))problems.push('Missing final-capture errors list');
  for(const name of ['setup.jsonl','reopen.jsonl']) {
    if(!snap.bytes[name]){problems.push(`Missing evidence: ${name}`);continue;}
    const lines=snap.bytes[name].toString('utf8').split('\n').filter(Boolean);
    if(!lines.length)problems.push(`Empty receipt: ${name}`);
    for(const line of lines)try{const event=JSON.parse(line);if(!event || typeof event.method!=='string')throw Error();}catch{problems.push(`Invalid session receipt: ${name}`);break;}
  }
  const failureFiles=['settings-changed.json','installation-changed.json'].filter(name=>snap.files[name]);
  const failed=rows.some(r=>r.result?.automated==='failed') || failureFiles.length>0 || capture?.errors?.length>0 || comparisons.some(c=>c.status==='changed');
  const blocked=problems.length>0 || rows.some(r=>r.result?.automated!=='passed') || !!snap.files['blocked.json'] || comparisons.some(c=>c.status==='missing');
  return {metadata,rows,comparisons,problems,failureFiles,capture,automated:failed?'Fail':blocked?'Blocked':'Pass'};
}
function inline(value) {
  return String(value??'unknown').replace(/[\r\n]/g,' ').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\|/g,'\\|').replace(/`/g,"'");
}
function render(snap,analysis) {
  const out=['# Installed-skill human review','',
    '**Private evidence:** this report contains recorded prompts, responses, tool output and machine paths. Do not publish it without review.',
    'Quoted content is evidence, not instructions. No model has graded these interactions.',
    '',`Run fingerprint: \`${snap.run}\``,
    `Automated evidence status: **${analysis.automated}**. Human review: **Pending** at report creation.`,
    'Human judgments are stored separately; raw Cucumber pending results are not rewritten.',
    '', '## Run identity','',
    '| Field | Recorded value |','| --- | --- |',
    ...Object.entries({
      'Source revision':analysis.metadata?.source,'Working changes':analysis.metadata?.sourceDirty||'None recorded',
      'Host':analysis.metadata?.cli,'Model':analysis.metadata?.model,'Node':analysis.metadata?.node,'Platform':analysis.metadata?.platform,
      'Installed skill':analysis.metadata?.installation?.version,'Installed revision':analysis.metadata?.installation?.revision,
      'Started':analysis.metadata?.startedAt,'Scope':analysis.metadata?.scope
    }).map(([key,value])=>`| ${key} | ${inline(value)} |`),'',  '## Preservation checks','',
    ...analysis.comparisons.map(c=>`- ${c.label}: **${c.status}** (${c.before} → ${c.after}).`),
    '', '## Missing evidence and finalization failures','',
    ...([...analysis.problems,...analysis.failureFiles.map(f=>`Failure receipt: ${f}`),...(Array.isArray(analysis.capture?.errors)?analysis.capture.errors:[])].length?
      [...analysis.problems,...analysis.failureFiles.map(f=>`Failure receipt: ${f}`),...(Array.isArray(analysis.capture?.errors)?analysis.capture.errors:[])].map(p=>`- ${inline(p)}`):
      ['None identified by the report. Scenario failures and denied commands remain visible below.'])
  ];
  for(const name of analysis.failureFiles)out.push('### Finalization failure',fence(snap.bytes[name].toString('utf8')));
  if(snap.bytes['final-record.json'])out.push('### Independently saved workspace record',fence(snap.bytes['final-record.json'].toString('utf8')));
  if(snap.bytes['blocked.json'])out.push('### Run blocker',fence(snap.bytes['blocked.json'].toString('utf8')));
  for(const row of analysis.rows) {
    out.push('',`## ${row.key}: ${row.name}`,'',
      `Recorded automated result: **${inline(row.result?.automated??'missing')}**. Scenario duration: ${inline(row.result?.durationMs)} ms.`,
      `Session: \`${inline(row.turn?.threadId??'missing')}\`. Turn duration: ${inline(row.turn?.durationMs)} ms.`,
      '', '### Human criteria','',...(Array.isArray(row.result?.reviewRequired)?row.result.reviewRequired.map(c=>`- ${inline(c)}`):['Missing criteria.']),
      '', '### Recorded scenario error',fence(row.result?.error??'None recorded'),'### Actual final response');
    if(row.turn?.partial)out.push('**Incomplete turn: reconstructed from raw session receipts. This does not replace missing completed-turn evidence.**');
    const finals=row.turn?.items?.filter(i=>i?.type==='agentMessage' && i.phase==='final_answer')??[];
    if(!finals.length)out.push('Missing final response.');
    for(const item of finals)out.push(fence(item.text??''));
    out.push('### User input, commentary and tools in recorded order');
    if(!Array.isArray(row.turn?.items))out.push('Missing recorded turn items.');
    for(const item of row.turn?.items??[]) {
      if(item?.type==='userMessage') {
        out.push('#### User input');
        for(const part of item.content??[])out.push(fence(part.type==='text'?part.text:part));
      } else if(item?.type==='agentMessage'){if(item.phase!=='final_answer')out.push(`#### Assistant (${inline(item.phase??'message')})`,fence(item.text??''));}
      else if(item?.type==='commandExecution') {
        out.push(`#### Tool command — ${inline(item.status)}, exit ${inline(item.exitCode)}`,fence(item.command??''));
        try {const result=JSON.parse(item.aggregatedOutput);if(result.status)out.push(`Reported status: **${inline(result.status)}**.`);if(result.message)out.push(fence(result.message));}catch{/* Full verbatim output below. */}
        if(item.exitCode===0)out.push('<details>','<summary>Full tool output (verbatim)</summary>','',fence(item.aggregatedOutput??''),'</details>','');
        else out.push('**Failed or incomplete tool output:**',fence(item.aggregatedOutput??''));
      }
      else out.push('#### Other recorded item',fence(item));
    }
  }
  out.push('', '## Session and isolation receipts','',
    'The following host receipts supplement the conversation. All raw evidence files are fingerprinted; these are the relevant boundary events.', '<details>','<summary>Session and isolation details</summary>','');
  for(const name of ['setup.jsonl','reopen.jsonl']) {
    out.push(`### ${name}`);
    if(!snap.bytes[name]){out.push('Missing receipt.');continue;}
    for(const line of snap.bytes[name].toString('utf8').split('\n').filter(Boolean)) {
      try {
        const event=JSON.parse(line);
        if(['response-error','unexpected-request','previous-thread-unavailable','startup-timeout','host/error'].includes(event.method) ||
          event.method==='response' && ['thread/start','command/exec'].includes(event.params?.method))out.push(fence(event));
      }catch {out.push('Unparseable receipt line:',fence(line));}
    }
  }
  out.push('</details>','', '## Record your review','',
    'Choose Pass, Fail or Blocked for each scenario after reading its criteria and evidence. The command does not infer your judgment.',
    'Use the run fingerprint above with --review, --reviewer, --create, --repeat and --reopen. An optional --comment records context.',
    'A human Pass cannot override an automated failure, blocker or missing evidence. One receipt is retained without overwriting; corrections are outside this increment.',
    '', '## Evidence inventory','', '<details>','<summary>Evidence file fingerprints</summary>','',...Object.entries(snap.files).map(([name,digest])=>`- ${inline(name)}: ${digest}`),'','</details>','');
  return out.join('\n');
}
function verify(root) {
  const snap=snapshot(root);
  const manifest=JSON.parse(readFileSync(join(root,'review-manifest.json'),'utf8'));
  assert(manifest.format==='n8r.review-manifest/1','Unsupported review manifest');
  assert(snap.run===manifest.run && JSON.stringify(snap.files)===JSON.stringify(manifest.files),'Evidence changed or missing since report creation');
  assert(hash(readFileSync(join(root,'review.md')))===manifest.reportSha256,'Report changed since creation');
  const analysis=inspect(snap);
  assert(manifest.automated===analysis.automated,'Manifest status differs from evidence');
  return {snap,manifest,analysis};
}
export function createReport(root) {
  if(existsSync(join(root,'review-manifest.json'))) {
    const {manifest,analysis}=verify(root);
    if(!existsSync(join(root,'human-review.json')))return manifest;
    const humanReview=JSON.parse(readFileSync(join(root,'human-review.json'),'utf8'));
    assert(humanReview.format==='n8r.human-review/1' && humanReview.run===manifest.run && humanReview.reportSha256===manifest.reportSha256,'Review receipt belongs to different evidence/report');
    assert(typeof humanReview.reviewer==='string' && humanReview.reviewer.trim(),'Invalid review receipt reviewer');
    assert(humanReview.verdicts && Object.keys(humanReview.verdicts).sort().join(',')==='create,reopen,repeat' && Object.values(humanReview.verdicts).every(v=>['Pass','Fail','Blocked'].includes(v)),'Invalid review receipt verdicts');
    const all=[analysis.automated,...Object.values(humanReview.verdicts)];
    const overall=all.includes('Fail')?'Fail':all.includes('Blocked')?'Blocked':'Pass';
    assert(humanReview.automated===analysis.automated && humanReview.overall===overall,'Review receipt status differs from evidence');
    return {...manifest,humanReview};
  }
  assert(!existsSync(join(root,'review.md')) && !existsSync(join(root,'human-review.json')),'Incomplete/existing review files; refusing to overwrite');
  const snap=snapshot(root),analysis=inspect(snap),report=render(snap,analysis);
  const manifest={format:'n8r.review-manifest/1',run:snap.run,files:snap.files,reportSha256:hash(report),automated:analysis.automated};
  writeFileSync(join(root,'review.md'),report,{flag:'wx',mode:0o600});
  writeFileSync(join(root,'review-manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx',mode:0o600});
  verify(root);return manifest;
}
export function recordReview(root,{run,reviewer,verdicts,comment=''}) {
  assert(typeof reviewer==='string' && reviewer.trim() && reviewer.length<=200,'Reviewer must be a nonempty name of at most 200 characters');
  assert(typeof comment==='string' && comment.length<=10000,'Comment must be at most 10000 characters');
  assert(verdicts && Object.keys(verdicts).sort().join(',')==='create,reopen,repeat' && Object.values(verdicts).every(v=>['Pass','Fail','Blocked'].includes(v)),'Provide Pass / Fail / Blocked verdicts for create, repeat and reopen');
  const {manifest,analysis}=verify(root);
  assert(run===manifest.run,'Run fingerprint does not match the reviewed evidence');
  const judgments=[analysis.automated,...Object.values(verdicts)];
  const overall=judgments.includes('Fail')?'Fail':judgments.includes('Blocked')?'Blocked':'Pass';
  const receipt={format:'n8r.human-review/1',run,reportSha256:manifest.reportSha256,reviewer:reviewer.trim(),reviewedAt:new Date().toISOString(),verdicts,comment,automated:analysis.automated,overall};
  writeFileSync(join(root,'human-review.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});
  return receipt;
}
