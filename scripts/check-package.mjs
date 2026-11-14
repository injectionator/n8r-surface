// Includes installed vault setup, reuse, repair and cancellation readback.
// Build first; prepare the offline dependency cache as documented in CONTRIBUTING.md.
import {mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {packCandidates} from './pack-candidates.mjs';
const root = resolve(import.meta.dirname, '..');
const temp = mkdtempSync(join(tmpdir(), 'n8r-package-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
try {
  const candidates = join(temp, 'candidates');
  const report = packCandidates(candidates);
  for (const packed of report.packages) {
    const consumer = join(temp, 'scoped');
    mkdirSync(consumer);
    writeFileSync(join(consumer, 'package.json'), '{"private":true,"type":"module"}\n');
    execFileSync(npm, ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', join(candidates, packed.filename)], {cwd: consumer, stdio: 'pipe'});
    copyFileSync(join(root, 'tests/package-smoke.mjs'), join(consumer, 'smoke.mjs'));
    for (const name of ['startup.test.mjs', 'helpers.mjs', 'startup-pty.py', 'discovery-pty.py', 'surface-fixture.mjs']) {
      copyFileSync(join(root, 'tests', name), join(consumer, name));
    }
    const runtimes = process.argv.slice(2);
    for (const node of runtimes.length ? runtimes : [process.execPath]) {
      const env = {...process.env, N8R_TEST_PACKAGE: packed.name, N8R_TEST_VERSION: report.version, N8R_TEST_BIN_DIR: join(consumer, 'node_modules/.bin')};
      execFileSync(node, ['smoke.mjs'], {cwd: consumer, env, stdio: 'inherit'});
      execFileSync(node, ['--test', 'startup.test.mjs'], {cwd: consumer, env, stdio: 'inherit'});
      if (process.platform === 'win32') {
        throw new Error('The interactive startup rehearsal requires a POSIX terminal and Python 3');
      }
      execFileSync('python3', ['startup-pty.py', node], {cwd: consumer, env, stdio: 'inherit'});
      execFileSync('python3', ['discovery-pty.py', node], {cwd: consumer, env, stdio: 'inherit'});
    }
  }
} finally {
  rmSync(temp, {recursive: true, force: true});
}
