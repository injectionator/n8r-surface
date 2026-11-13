"""Drive real terminal interactions and independently read installed-command output."""
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


def snapshot(root):
    return {str(p.relative_to(root)): ('dir' if p.is_dir() else
            (p.read_bytes().hex(), p.stat().st_mtime_ns)) for p in root.rglob('*')}


def terminal(home, source, answers, expected, mutate=None):
    if expected == 0:
        answers = [*answers, ('You>', b'exit\n')]
    master, slave = pty.openpty()
    env = {**os.environ, 'HOME': str(home), 'USERPROFILE': str(home), 'LANG': 'C',
           'PATH': os.pathsep.join([os.environ.get('N8R_TEST_BIN_DIR', ''),
                                   str(Path(sys.argv[1]).parent), os.environ['PATH']])}
    command = [sys.argv[1], os.environ['N8R_TEST_ENTRY']] if 'N8R_TEST_ENTRY' in os.environ else ['n8r-surface']
    child = subprocess.Popen(command, cwd=source, env=env, stdin=slave, stdout=slave, stderr=slave)
    os.close(slave)
    output = b''
    sent = 0
    deadline = time.monotonic() + 8
    try:
        while True:
            assert time.monotonic() < deadline, ('terminal hung', output)
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
                if sent < len(answers) and answers[sent][0].encode() in output:
                    if mutate:
                        mutate(sent)
                    answer = answers[sent][1]
                    if answer == 'SIGINT':
                        child.send_signal(signal.SIGINT)
                    else:
                        os.write(master, answer)
                    sent += 1
            elif child.poll() is not None:
                break
        code = child.wait(timeout=2)
        assert code == expected, (code, expected, output.decode())
        assert sent == len(answers), ('question missing', output.decode())
        assert b'PRIVATE_VALUE_MUST_NOT_APPEAR' not in output
        return output.decode()
    finally:
        if child.poll() is None:
            child.kill()
            child.wait()
        os.close(master)


location = 'Vault directory [~/n8r/]:'
confirm = 'Create vault folders and save this location? [y/N]'
with tempfile.TemporaryDirectory(prefix='n8r-vault-pty-') as temporary:
    root = Path(temporary).resolve()
    source = root / 'source'
    source2 = root / 'source two'
    source.mkdir()
    source2.mkdir()
    (source / 'README.md').write_text('Synthetic source bytes.\n')
    (source2 / 'README.md').write_text('Second source bytes.\n')
    before = snapshot(source), snapshot(source2)
    count = 0
    for custom in (False, True):
        home = root / ('custom-home' if custom else 'default-home')
        home.mkdir()
        file = home / '.n8r/n8r-surface.json'
        original = {'version': 1, 'artefactRoot': '../legacy', 'large': 9007199254740993, 'unknown': {'private': 'PRIVATE_VALUE_MUST_NOT_APPEAR'}}
        if custom:
            file.parent.mkdir()
            file.write_text(json.dumps(original))
            (home / 'legacy').mkdir()
        vault = root / 'chosen vault' if custom else home / 'n8r'
        answer = b'../chosen vault\n' if custom else b'\n'
        output = terminal(home, source, [(location, answer), (confirm, b'y\n')], 0)
        assert output.index('n8r-surface') < output.index(location) < output.index(confirm)
        assert 'Vault ready: '+str(vault) in output
        saved = json.loads(file.read_text())
        assert saved == ({**original, 'vaultRoot': str(vault)} if custom else {'version': 1, 'vaultRoot': str(vault)})
        assert all((vault / name).is_dir() for name in ['research', 'artifacts', 'surfaces'])
        after = snapshot(home), snapshot(vault)
        reused = terminal(home, source2, [], 0)
        assert 'Vault ready: '+str(vault) in reused and location not in reused and confirm not in reused
        assert (snapshot(home), snapshot(vault)) == after
        # Repair requires confirmation and must retain settings bytes/mtime.
        (vault / 'surfaces').rmdir()
        settings_before = file.read_bytes(), file.stat().st_mtime_ns
        terminal(home, source, [(confirm, b'yes\n')], 0)
        assert (vault / 'surfaces').is_dir()
        assert (file.read_bytes(), file.stat().st_mtime_ns) == settings_before
        if not custom:
            import re
            text = output.replace(str(root), '<case>').replace('\r', '')
            text = re.sub(r'\x1b\[[0-9;]*[A-Za-z]', '', text)
            text = re.sub(r'PID \d+', 'PID <observed PID>', text)
            text = re.sub(r'observed \d{4}-[^\n]+', 'observed <UTC timestamp>', text)
            print(text)
        count += 3
    for step in ('location', 'confirm'):
        for answer in (b'n\n', b'\x04', 'SIGINT'):
            if step == 'location' and answer == b'n\n':
                continue
            home = root / ('cancel-'+step+str(count))
            home.mkdir()
            answers = [(location, answer)] if step == 'location' else [(location,b'\n'),(confirm,answer)]
            terminal(home,source,answers,1)
            assert snapshot(home) == {}
            count += 1
    # External edit between choice and confirmation must survive.
    home = root / 'conflict-home'
    (home / '.n8r').mkdir(parents=True)
    file = home / '.n8r/n8r-surface.json'
    file.write_text('{"version":1}')
    def edit(step):
        if step == 1:
            file.write_text('{"version":1,"other":"writer"}')
    terminal(home,source,[(location,b'\n'),(confirm,b'y\n')],2,edit)
    assert json.loads(file.read_text()) == {'version':1,'other':'writer'}
    assert not (home / 'n8r').exists()
    count += 1
    # An accepted destination must not poison the legacy listing on next startup.
    for kind in ('root', 'nested', 'alias'):
        home = root / ('legacy-overlap-' + kind)
        (home / '.n8r').mkdir(parents=True)
        legacy = home / 'legacy'
        legacy.mkdir()
        (home / '.n8r/n8r-surface.json').write_text('{"version":1,"artefactRoot":"../legacy"}')
        selected = legacy / 'nested' if kind == 'nested' else legacy
        if kind == 'alias':
            selected = root / 'legacy-alias'
            selected.symlink_to(legacy)
        state_before = snapshot(home)
        terminal(home, source, [(location, (str(selected)+'\n').encode()), (confirm, b'y\n')], 2)
        assert snapshot(home) == state_before
        count += 1
    # A root alias is resolved for confirmation and persistence; unsafe targets fail.
    home = root / 'root-alias-home'
    home.mkdir()
    target = root / 'alias-target'
    target.mkdir()
    alias = root / 'root-alias'
    alias.symlink_to(target)
    output = terminal(home, source, [(location, (str(alias)+'\n').encode()), (confirm, b'y\n')], 0)
    assert 'Vault directory: '+str(target) in output
    assert json.loads((home / '.n8r/n8r-surface.json').read_text())['vaultRoot'] == str(target)
    terminal(home, source2, [], 0)
    count += 2
    home = root / 'bad-alias-home'
    home.mkdir()
    bad = root / 'bad\nname'
    bad.mkdir()
    alias = root / 'safe-looking-alias'
    alias.symlink_to(bad)
    terminal(home, source, [(location, (str(alias)+'\n').encode())], 2)
    assert snapshot(home) == {} and snapshot(bad) == {}
    count += 1
    assert (snapshot(source), snapshot(source2)) == before
    print(f'Installed PTY vault setup passed: {count} interactions; default/custom, reuse, repair, cancellation, EOF, SIGINT, conflict; independent settings/folder/source readback.')
