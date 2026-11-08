import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const moduleUrl = new URL('../plugins/n8r-surface/skills/research/scripts/workspace.mjs', import.meta.url);
const available = fs.existsSync(moduleUrl);
const api = available ? await import(moduleUrl.href) : {};
const sample = { format: 'n8r.workspace/1', id: 'd9ea5e66-53ed-4c1b-bbf4-fac53539271e', name: 'Synthetic' };
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'n8r-workspace-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
function snapshot(dir) {
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir).sort().map(name => {
    const file = path.join(dir, name), stat = fs.lstatSync(file);
    return [name, stat.isSymbolicLink() ? ['link', fs.readlinkSync(file)] : stat.isDirectory() ? snapshot(file) : fs.readFileSync(file).toString('base64')];
  });
}
function record(dir, value) {
  fs.mkdirSync(path.join(dir, '.n8r'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.n8r/workspace.json'), typeof value === 'string' ? value : JSON.stringify(value));
}

test('workspace helper is bundled', () => assert.equal(available, true));
test('create missing and empty destinations with only complete identity metadata', { skip: !available }, t => {
  const root = fixture(t);
  for (const name of ['missing space Ω', 'empty']) {
    const dir = path.join(root, name);
    if (name === 'empty') fs.mkdirSync(dir);
    const before = snapshot(dir);
    assert.equal(api.inspectWorkspace(dir).status, name === 'empty' ? 'empty' : 'missing');
    assert.deepEqual(snapshot(dir), before);
    const result = api.setupWorkspace(dir, { purpose: 'Investigate a synthetic system' });
    assert.equal(result.status, 'created');
    const saved = JSON.parse(fs.readFileSync(path.join(dir, '.n8r/workspace.json')));
    assert.equal(saved.format, 'n8r.workspace/1');
    assert.match(saved.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    assert.notEqual(saved.id, sample.id);
    assert.equal(saved.name, name);
    assert.equal(saved.purpose, 'Investigate a synthetic system');
    assert.deepEqual(fs.readdirSync(dir), ['.n8r']);
    assert.deepEqual(fs.readdirSync(path.join(dir, '.n8r')), ['workspace.json']);
  }
});
test('repeat, fresh-process recognition and move preserve all bytes and unknown properties', { skip: !available }, t => {
  const root = fixture(t), dir = path.join(root, 'original');
  record(dir, { ...sample, future: { untrusted: 'do not execute' } });
  fs.writeFileSync(path.join(dir, 'user-note.md'), 'My own note\n');
  const before = snapshot(dir);
  assert.equal(api.setupWorkspace(dir, { name: 'Replacement', purpose: 'Changed' }).status, 'recognized');
  const run = spawnSync(process.execPath, [moduleUrl.pathname, 'inspect', dir], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(JSON.parse(run.stdout).record.id, sample.id);
  assert.deepEqual(snapshot(dir), before);
  const moved = path.join(root, 'renamed');
  fs.renameSync(dir, moved);
  assert.equal(api.inspectWorkspace(moved).record.id, sample.id);
  assert.deepEqual(snapshot(moved), before);
});
test('nonempty folder requires choice and both choices preserve user files', { skip: !available }, t => {
  const root = fixture(t), dir = path.join(root, 'existing');
  fs.mkdirSync(dir); fs.writeFileSync(path.join(dir, 'note.md'), 'Keep me');
  const before = snapshot(dir);
  assert.equal(api.setupWorkspace(dir).status, 'needs-choice');
  assert.deepEqual(snapshot(dir), before);
  assert.equal(api.setupWorkspace(path.join(root, 'other')).status, 'created');
  assert.deepEqual(snapshot(dir), before);
  assert.equal(api.setupWorkspace(dir, { adopt: true }).status, 'created');
  assert.equal(fs.readFileSync(path.join(dir, 'note.md'), 'utf8'), 'Keep me');
});
test('malformed and unsupported records are refused without any writes', { skip: !available }, t => {
  const root = fixture(t);
  const cases = ['{', [], null, {}, { ...sample, id: 'not-a-uuid' }, { ...sample, name: ' ' }, { ...sample, purpose: 42 }, { ...sample, format: 1 }, { ...sample, format: 'n8r.workspace/2' }];
  cases.forEach((value, i) => {
    const dir = path.join(root, String(i)); record(dir, value === null ? 'null' : value);
    const before = snapshot(dir);
    const status = i === cases.length - 1 ? 'unsupported' : 'malformed';
    assert.equal(api.inspectWorkspace(dir).status, status);
    assert.equal(api.setupWorkspace(dir, { adopt: true }).status, status);
    assert.deepEqual(snapshot(dir), before);
  });
});
test('conflicting metadata, symlinks and non-directory destinations are preserved', { skip: !available }, t => {
  const root = fixture(t), outside = path.join(root, 'outside'); fs.mkdirSync(outside);
  for (const kind of ['file', 'directory', 'symlink', 'record-directory', 'record-link', 'partial']) {
    const dir = path.join(root, kind); fs.mkdirSync(dir);
    const meta = path.join(dir, '.n8r');
    if (kind === 'file') fs.writeFileSync(meta, 'Keep');
    else if (kind === 'symlink') fs.symlinkSync(outside, meta);
    else {
      fs.mkdirSync(meta);
      if (kind === 'record-directory') fs.mkdirSync(path.join(meta, 'workspace.json'));
      if (kind === 'record-link') fs.symlinkSync(path.join(outside, 'absent'), path.join(meta, 'workspace.json'));
      if (kind === 'partial') fs.writeFileSync(path.join(meta, '.workspace-interrupted.tmp'), '{');
    }
    const before = snapshot(dir);
    assert.equal(api.setupWorkspace(dir, { adopt: true }).status, 'conflict');
    assert.deepEqual(snapshot(dir), before);
  }
  const file = path.join(root, 'not-folder'); fs.writeFileSync(file, 'Keep');
  assert.equal(api.setupWorkspace(file).status, 'conflict');
  assert.equal(fs.readFileSync(file, 'utf8'), 'Keep');
  const link = path.join(root, 'folder-link'); fs.symlinkSync(outside, link);
  assert.equal(api.setupWorkspace(link).status, 'conflict');
  assert.deepEqual(fs.readdirSync(outside), []);
});
test('invalid options have no filesystem effects', { skip: !available }, t => {
  const root = fixture(t), dir = path.join(root, 'absent');
  for (const options of [{ name: '' }, { name: 4 }, { purpose: 2 }, { adopt: 'yes' }]) {
    assert.equal(api.setupWorkspace(dir, options).status, 'invalid-input');
    assert.equal(fs.existsSync(dir), false);
  }
});
test('interrupted publication cannot expose partial identity or overwrite a record', { skip: !available }, t => {
  const root = fixture(t), dir = path.join(root, 'interrupted');
  t.mock.method(fs, 'linkSync', () => { throw Object.assign(new Error('interrupted'), { code: 'EIO' }); });
  assert.equal(api.setupWorkspace(dir).status, 'io-error');
  assert.notEqual(api.inspectWorkspace(dir).status, 'recognized');
  assert.equal(fs.existsSync(path.join(dir, '.n8r/workspace.json')), false);
  t.mock.restoreAll();
  const other = path.join(root, 'no-overwrite'), link = fs.linkSync;
  t.mock.method(fs, 'linkSync', (from, to) => { fs.writeFileSync(to, JSON.stringify(sample)); return link(from, to); });
  assert.equal(api.setupWorkspace(other).status, 'io-error');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(other, '.n8r/workspace.json'))), sample);
});
test('copied standalone helper works and rejects bad command arguments before writes', { skip: !available }, t => {
  const root = fixture(t), copy = path.join(root, 'workspace.mjs'), dir = path.join(root, 'new');
  fs.copyFileSync(moduleUrl, copy);
  for (const args of [['setup', dir, '--unknown'], ['setup', dir, '--name'], ['inspect', dir, '--adopt']]) {
    const run = spawnSync(process.execPath, [copy, ...args], { encoding: 'utf8', cwd: root });
    assert.equal(run.status, 2);
    assert.equal(fs.existsSync(dir), false);
  }
  const run = spawnSync(process.execPath, [copy, 'setup', dir], { encoding: 'utf8', cwd: root });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(JSON.parse(run.stdout).status, 'created');
});
