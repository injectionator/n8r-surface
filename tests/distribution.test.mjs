import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

for (const publishable of [false, true]) test(`scoped candidate has checked ${publishable ? 'publishable' : 'private'} manifests and exact payload bytes`, t => {
  const temp = mkdtempSync(join(tmpdir(), 'n8r-distribution-'));
  t.after(() => rmSync(temp, {recursive: true, force: true}));
  const stale = 'dist/obsolete-candidate-check.js';
  writeFileSync(stale, 'stale build output', {flag:'wx'});
  t.after(() => rmSync(stale, {force:true}));
  const out = join(temp, 'candidates');
  const result = spawnSync(process.execPath, ['scripts/pack-candidates.mjs', out, ...(publishable ? ['--publishable'] : [])], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(readFileSync(join(out, 'candidates.json'), 'utf8'));
  assert.deepEqual(report.packages.map(p => p.name), ['@n8r/surface']);
  assert.match(report.revision, /^[a-f0-9]{40}$/);
  assert.equal(typeof report.dirty, 'boolean');
  const payloads = report.packages.map((p, i) => {
    const archive = join(out, p.filename);
    assert.equal(p.sha256, createHash('sha256').update(readFileSync(archive)).digest('hex'));
    const extracted = join(temp, String(i));
    mkdirSync(extracted);
    execFileSync('tar', ['-xzf', archive, '-C', extracted]);
    const root = join(extracted, 'package');
    const manifest = JSON.parse(readFileSync(join(root, 'package.json')));
    assert.equal(manifest.name, p.name);
    assert.equal(manifest.version, report.version);
    assert.equal(manifest.private, !publishable);
    if (publishable) assert.deepEqual(manifest.publishConfig, {access:'public', registry:'https://registry.npmjs.org', tag:'experimental'});
    assert.equal(manifest.scripts, undefined);
    assert.equal(manifest.devDependencies, undefined);
    delete manifest.name;
    function files(dir, prefix = '') {
      return readdirSync(dir, {withFileTypes:true}).sort((a,b) => a.name.localeCompare(b.name)).flatMap(e =>
        e.isDirectory() ? files(join(dir,e.name), prefix + e.name + '/') :
          [[prefix + e.name, readFileSync(join(dir,e.name)).toString('hex')]]);
    }
    return {manifest, files: files(root).filter(([name]) => name !== 'package.json')};
  });
  assert.deepEqual(readdirSync(out).sort(),['candidates.json','scoped']);
  assert.ok(!payloads[0].files.some(([name]) => name === 'dist/obsolete-candidate-check.js'));
  assert.ok(payloads[0].files.some(([name]) => name === 'dist/cli.js'));
  const before = readFileSync(join(out, 'candidates.json'));
  assert.notEqual(spawnSync(process.execPath, ['scripts/pack-candidates.mjs', out]).status, 0);
  assert.deepEqual(readFileSync(join(out, 'candidates.json')), before);
});

test('unknown candidate option fails before creating a destination', t => {
  const temp = mkdtempSync(join(tmpdir(), 'n8r-option-'));
  t.after(() => rmSync(temp, {recursive:true, force:true}));
  const result = spawnSync(process.execPath, ['scripts/pack-candidates.mjs', join(temp, 'out'), '--publisable'], {encoding:'utf8'});
  assert.notEqual(result.status, 0);
  assert.deepEqual(readdirSync(temp), []);
});
