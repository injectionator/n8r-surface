"""Offline terminal/protocol tests. Scripted Codex responses are NOT AI evidence."""
import errno
import json
import os
from pathlib import Path
import pty
import select
import signal
import subprocess
import sys
import tempfile
import time


def terminal(root, entry, node, mode, answers, expected):
    home = root / mode
    home.mkdir(exist_ok=True)
    (home / '.n8r').mkdir(exist_ok=True)
    vault = home / 'vault'
    for name in ['research', 'artifacts', 'surfaces']:
        (vault / name).mkdir(parents=True,exist_ok=True)
    settings = home / '.n8r/n8r-surface.json'
    settings.write_text(json.dumps({'version': 1, 'vaultRoot': str(vault)}))
    source = home / 'source'
    source.mkdir(exist_ok=True)
    source_file = source / 'case.md'
    source_file.write_text('ACTUAL_SYNTHETIC_SOURCE_BYTES\n')
    (home / 'outside.txt').write_text('OUTSIDE_SCOPE_SENTINEL')
    bin_dir = home / 'bin'
    bin_dir.mkdir(exist_ok=True)
    trace = home / 'trace.jsonl'
    surface_content = json.loads(subprocess.check_output([node, '--input-type=module', '-e', "const {content}=await import(process.argv[1]); console.log(JSON.stringify(content()));", (Path(__file__).resolve().parent/'surface-fixture.mjs').as_uri()]))
    surface_content['research']['sources'][0]['location'] = 'case.md'
    import hashlib
    surface_content['research']['sources'][0]['digest'] = 'sha256:' + hashlib.sha256(source_file.read_bytes()).hexdigest()
    program = r'''#!/usr/bin/env node
const fs=require('node:fs'), readline=require('node:readline');
const mode=MODE, trace=TRACE, surfaceContent=SURFACE_CONTENT;
if(process.env.OPENAI_API_KEY) throw new Error('API key inherited');
fs.appendFileSync(trace,JSON.stringify({pid:process.pid,args:process.argv.slice(2)})+'\n');
if(process.argv.includes('--version')) {console.log('codex-cli 0.166.0');process.exit(0);}
let thread, count=0, surfaceSave=false;
const send=x=>console.log(JSON.stringify(x));
readline.createInterface({input:process.stdin}).on('line',l=>{
 const x=JSON.parse(l);fs.appendFileSync(trace,JSON.stringify(x)+'\n');
 const result=r=>send({id:x.id,result:r});
 if(x.method==='initialize') result({});
 if(x.method==='account/read') result({account:{type:mode==='api-key'?'apiKey':'chatgpt'}});
 if(x.method==='config/read') result({config:{model:'fixture-model'}});
 if(x.method==='thread/start') {
  thread='fixture-thread';
  if(!x.params.developerInstructions.includes('Skeleton Surface')) throw new Error('instructions missing');
  if(x.params.config.default_permissions!=='n8r_source_tools') throw new Error('permissions missing');
  result({thread:{id:thread,ephemeral:true,environments:[]},model:'fixture-model',modelProvider:'openai',approvalPolicy:'never',activePermissionProfile:{id:'n8r_source_tools'},sandbox:{type:'readOnly',networkAccess:false}});
 }
 if(x.method==='turn/start') {
  count++;surfaceSave=x.params.input[0].text.startsWith('HOST_SURFACE_SAVE_REQUEST');
  if(mode==='malformed-start'){result({turn:{}});return;}
  if(mode==='stale' && count===2){
   send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-1',status:'completed'}}});
   send({id:'stale-tool',method:'item/tool/call',params:{threadId:thread,turnId:'turn-1',tool:'source_read',arguments:{path:'case.md'}}});
  }
  result({turn:{id:'turn-'+count}});
  if(mode==='auth-change'){send({method:'account/updated',params:{authMode:'apikey'}});return;}
  if(mode==='missing-event'){send({method:'turn/completed',params:{turn:{id:'turn-'+count,status:'completed'}}});return;}
  send({method:'turn/started',params:{threadId:thread,turn:{id:'turn-'+count}}});
  if(mode==='failure') {send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-'+count,status:'failed',error:{message:'PRIVATE_VALUE_MUST_NOT_APPEAR'}}}});return;}
  if(mode==='cancel'||mode==='eof-active') {send({method:'item/completed',params:{threadId:thread,turnId:'turn-'+count,item:{type:'agentMessage',text:'TEST_TURN_ACTIVE'}}});return;}
  if ((mode==='save'||mode==='failed-note'||mode==='cancel-draft'||mode.startsWith('reopen')) && x.params.input[0].text.includes('HOST_SAVE_REQUEST')) {
   send({id:'draft-'+count,method:'item/tool/call',params:{threadId:thread,turnId:'turn-'+count,tool:'research_note',arguments:{markdown:'# app-1\n\nHuman decision: no OIDC.\n\n## Recommended next steps\nInspect authentication.'}}});return;
  }
  if(mode==='unsolicited') {
   send({id:'draft-'+count,method:'item/tool/call',params:{threadId:thread,turnId:'turn-'+count,tool:'research_note',arguments:{markdown:'Unrequested write'}}});return;
  }
  send({id:'tool-'+count,method:'item/tool/call',params:{threadId:thread,turnId:'turn-'+count,tool:'source_read',arguments:{path:mode==='outside'?'../outside.txt':'case.md'}}});
 }
 if(String(x.id).startsWith('surface-')) {
  if(x.result.success!==true) throw new Error(JSON.stringify(x.result));
  send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-'+count,status:mode==='surface-failed'?'failed':'completed'}}});return;
 }
 if(String(x.id).startsWith('draft-')) {
  if(mode==='unsolicited' && x.result.success!==false) throw new Error('unsolicited draft accepted');
  if(mode!=='unsolicited' && x.result.success!==true) throw new Error('authorized draft rejected');
  if(mode==='cancel-draft'){send({method:'item/completed',params:{threadId:thread,turnId:'turn-'+count,item:{type:'agentMessage',text:'TEST_DRAFT_STAGED'}}});return;}
  send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-'+count,status:mode==='failed-note'?'failed':'completed'}}});
 }
 if(String(x.id).startsWith('tool-')) {
  const text=JSON.stringify(x.result);
  if(mode==='outside') {if(x.result.success!==false || text.includes('OUTSIDE_SCOPE_SENTINEL'))throw new Error('scope escaped');}
  else if(!text.includes('ACTUAL_SYNTHETIC_SOURCE_BYTES'))throw new Error('not actual source bytes');
  if((mode.startsWith('surface') && count===1) || (mode.startsWith('launcher') && surfaceSave)) {
   send({id:'surface-'+count,method:'item/tool/call',params:{threadId:thread,turnId:'turn-'+count,tool:'surface_draft',arguments:surfaceContent}});return;
  }
  send({method:'item/completed',params:{threadId:thread,turnId:'turn-'+count,item:{type:'agentMessage',text:'TEST_RESPONSE_'+count}}});
  send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-'+count,status:'completed'}}});
 }
 if(x.method==='turn/interrupt') {result({});send({method:'turn/completed',params:{threadId:thread,turn:{id:'turn-'+count,status:'interrupted'}}});}
});
'''.replace('SURFACE_CONTENT', json.dumps(surface_content)).replace('MODE', json.dumps(mode)).replace('TRACE', json.dumps(str(trace)))
    fake = bin_dir / 'codex'
    fake.write_text(program)
    fake.chmod(0o755)
    if mode.startswith('reopen'):
        notes = vault / 'research/source'
        notes.mkdir()
        metadata = {'version': 1, 'createdAt': '2026-01-01', 'source': {'name': 'source', 'kind': 'directory'},
                    'model': 'fixture-model', 'researcher': {'version': '0.1.8', 'digest': 'fixture'}, 'evidence': [{'path':'case.md','digest':'sha256:'+'0'*64,'inspectedAt':'2026-01-01','startLine':1,'endLine':1}]}
        old = notes / 'research-001.md'
        old.write_text('# Saved app-1\nHuman decision: no OIDC.\n<!-- n8r-note-v1 -->\n```json\n' + json.dumps(metadata) + '\n```\n')
        newer = notes / 'research-002.md'
        newer.write_bytes(old.read_bytes())
        os.utime(old, (2000000000, 2000000000))
        predecessor_bytes = old.read_bytes()
    if mode=='launcher-index-bad':
        (home/'.n8r/recent.json').write_text('human edits')
    before = settings.read_bytes(), source_file.read_bytes()
    master, slave = pty.openpty()
    env = {**os.environ, 'HOME': str(home), 'OPENAI_API_KEY': 'PRIVATE_VALUE_MUST_NOT_APPEAR',
           'PATH': os.pathsep.join([str(bin_dir), str(Path(node).parent), os.environ['PATH']])}
    before_saved={str(p):p.read_bytes() for p in vault.rglob('*') if p.is_file()}
    command = [] if mode.startswith('launcher') else ['discover', str(source)]
    if mode.startswith('reopen'):
        command = ['reopen', '--source', str(source)]
        if mode == 'reopen-explicit':
            command.insert(1, str(old))
    child = subprocess.Popen([node, entry, *command], env=env,
                             stdin=slave, stdout=slave, stderr=slave, cwd=home if mode=='launcher-parent' else source)
    os.close(slave)
    output = b''
    cursor = sent = 0
    deadline = time.monotonic() + 12
    try:
        while True:
            assert time.monotonic() < deadline, ('hung', mode, output.decode())
            if select.select([master], [], [], .05)[0]:
                try:
                    chunk = os.read(master, 65536)
                except OSError as error:
                    if error.errno == errno.EIO:
                        break
                    raise
                if not chunk:
                    break
                output += chunk
                if sent < len(answers):
                    at = output.find(answers[sent][0], cursor)
                    if at >= 0:
                        cursor = at + len(answers[sent][0])
                        answer = answers[sent][1]
                        if answer==b'/source SELECTED\n':
                            answer=('/source '+str(source)+'\n').encode()
                        if answer == 'SIGINT':
                            child.send_signal(signal.SIGINT)
                        else:
                            os.write(master, answer)
                        sent += 1
            elif child.poll() is not None:
                break
        assert child.wait(timeout=2) == expected, (mode, child.returncode, output.decode())
        assert sent == len(answers), (mode, output.decode())
        assert b'PRIVATE_VALUE_MUST_NOT_APPEAR' not in output
        assert b'OUTSIDE_SCOPE_SENTINEL' not in output
        assert (settings.read_bytes(), source_file.read_bytes()) == before
        files = list(vault.rglob('*.md'))
        if mode == 'save':
            assert len(files) == 1, (mode, output.decode())
            saved = files[0].read_text()
            assert 'Human decision: no OIDC.' in saved and 'case.md' in saved and 'sha256:' in saved
            assert b'Saved and read back:' in output
            assert b'Preparing note' in output
            assert b'Waiting for Codex' in output
        elif mode.startswith('launcher'):
            assert len(list(vault.rglob('surface.json')))==1+sum(p.endswith('/surface.json') for p in before_saved)
            assert all(Path(p).read_bytes()==data for p,data in before_saved.items())
            if mode=='launcher-index-bad':
                assert (home/'.n8r/recent.json').read_text()=='human edits'
                assert b'could not be updated' in output and b'Next time, open' not in output
            else:
                recent=json.loads((home/'.n8r/recent.json').read_text())
                assert len(recent)==1 and recent[0]['source']==str(source)
                assert Path(recent[0]['path']).exists()
            assert b'Saved' in output
        elif mode == 'surface':
            assert len(list(vault.rglob('surface.json'))) == 1, output.decode()
            assert len(list(vault.rglob('research.html'))) == 1
            assert b'Saved and read back:' in output and b'Validated partial Surface preview' in output
        elif mode.startswith('reopen'):
            assert old.read_bytes() == predecessor_bytes
            assert str(old).encode() in output
            assert len(files) == (2 if mode == 'reopen-refuse' else 3)
            if mode != 'reopen-refuse':
                assert (notes / 'research-003.md').exists()
                assert b'case.md: changed' in output
        else:
            assert not list(vault.rglob('*.*'))
        records = [json.loads(l) for l in trace.read_text().splitlines()] if trace.exists() else []
        if mode in ('refuse', 'reopen-refuse'):
            assert not records, 'runner launched before acceptance'
        if mode == 'api-key':
            assert not any(r.get('method') == 'thread/start' for r in records)
        if mode in ('continue', 'stale'):
            turns = [r for r in records if r.get('method') == 'turn/start']
            assert len(turns) == 2 and len({r['params']['threadId'] for r in turns}) == 1
            assert b'TEST_RESPONSE_2' in output
        if mode == 'stale':
            assert any(r.get('id') == 'stale-tool' and r.get('result', {}).get('success') is False for r in records)
        for record in records:
            if 'pid' in record:
                try:
                    os.kill(record['pid'], 0)
                except ProcessLookupError:
                    continue
                raise AssertionError(('runner still alive', record['pid']))
        print('PASS offline discovery terminal:', mode)
    finally:
        if child.poll() is None:
            child.kill()
            child.wait()
        os.close(master)


node = sys.argv[1]
entry = os.environ.get('N8R_TEST_ENTRY') or str(Path(os.environ['N8R_TEST_BIN_DIR']) / 'n8r-surface')
# Match the whole second prompt: the first selection prompt also contains [y/N].
confirm = b'Start research with OpenAI using Codex ChatGPT sign-in? [y/N]'
prompt = b'You>'
with tempfile.TemporaryDirectory(prefix='n8r-discovery-pty-') as temporary:
    root = Path(temporary).resolve()
    cases = [
        ('surface', [(confirm, b'y\n'), (prompt, b'create\n'), (prompt, b'/save surface\n'), (prompt, b'/exit\n')], 0),
        ('surface-stale', [(confirm, b'y\n'), (prompt, b'create\n'), (prompt, b'correction\n'), (prompt, b'/save surface\n'), (prompt, b'/exit\n')], 0),
        ('surface-failed', [(confirm, b'y\n'), (prompt, b'create\n')], 2),
        ('save', [(confirm, b'y\n'), (prompt, b'first\n'), (prompt, b'/save\n'), (prompt, b'/exit\n')], 0),
        ('unsolicited', [(confirm, b'y\n'), (prompt, b'first\n'), (prompt, b'/exit\n')], 0),
        ('cancel-draft', [(confirm, b'y\n'), (prompt, b'/save\n'), (b'TEST_DRAFT_STAGED', 'SIGINT')], 130),
        ('failed-note', [(confirm, b'y\n'), (prompt, b'/save\n')], 2),
        ('reopen-latest', [(b'Open this note?', b'y\n'), (confirm, b'y\n'), (prompt, b'/save\n'), (prompt, b'/exit\n')], 0),
        ('reopen-explicit', [(confirm, b'y\n'), (prompt, b'/save\n'), (prompt, b'/exit\n')], 0),
        ('reopen-refuse', [(b'Open this note?', b'n\n')], 1),
        ('refuse', [(confirm, b'n\n')], 1),
        ('api-key', [(confirm, b'y\n')], 2),
        ('continue', [(confirm, b'y\n'), (prompt, b'first\n'), (prompt, b'correction\n'), (prompt, b'/exit\n')], 0),
        ('outside', [(confirm, b'y\n'), (prompt, b'check scope\n'), (prompt, b'/exit\n')], 0),
        ('stale', [(confirm, b'y\n'), (prompt, b'first\n'), (prompt, b'second\n'), (prompt, b'/exit\n')], 0),
        ('malformed-start', [(confirm, b'y\n'), (prompt, b'question\n')], 2),
        ('auth-change', [(confirm, b'y\n'), (prompt, b'question\n')], 2),
        ('missing-event', [(confirm, b'y\n'), (prompt, b'question\n')], 2),
        ('failure', [(confirm, b'y\n'), (prompt, b'question\n')], 2),
        ('cancel', [(confirm, b'y\n'), (prompt, b'question\n'), (b'TEST_TURN_ACTIVE', 'SIGINT')], 130),
        ('eof-active', [(confirm, b'y\n'), (prompt, b'question\n'), (b'TEST_TURN_ACTIVE', b'\x04')], 1),
        ('cancel-connect', [(confirm, b'y\n'), (b'Connecting to Codex', 'SIGINT')], 130),
        ('eof-prompt', [(confirm, b'y\n'), (prompt, b'\x04')], 0),
    ]
    cases.insert(0,('launcher',[(prompt,b'Describe the AI connections\n'),(confirm,b'y\n'),(prompt,b'save the result\n'),(prompt,b'exit\n')],0))
    cases.insert(1,('launcher',[(prompt,b'1\n'),(confirm,b'y\n'),(prompt,b'Keep my decision and explain the unknowns\n'),(prompt,b'save\n'),(prompt,b'exit\n')],0))
    cases.append(('launcher-parent',[(prompt,b'Describe the AI connections\n'),(prompt,b'/source SELECTED\n'),(confirm,b'y\n'),(prompt,b'save\n'),(prompt,b'exit\n')],0))
    cases.append(('launcher-index-bad',[(prompt,b'Describe the AI connections\n'),(confirm,b'y\n'),(prompt,b'save\n'),(prompt,b'exit\n')],0))
    for mode, answers, expected in cases:
        terminal(root, entry, node, mode, answers, expected)
