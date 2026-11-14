// Creates local candidates with a fresh temporary build; never publishes.
import {mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {checkVersion} from './check-version.mjs';
const root = resolve(import.meta.dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

export function packCandidates(destination, {publishable = false} = {}) {
  checkVersion(root);
  const output = resolve(destination);
  // Never reuse or remove an existing destination, even after a failed run.
  mkdirSync(output);
  const stage = mkdtempSync(join(tmpdir(), 'n8r-candidates-'));
  try {
    const revision = execFileSync('git', ['rev-parse', 'HEAD'], {cwd:root, encoding:'utf8'}).trim();
    const dirty = Boolean(execFileSync('git', ['status', '--porcelain'], {cwd:root, encoding:'utf8'}).trim());
    const pack = (cwd, destination) => JSON.parse(execFileSync(npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', destination], {cwd, encoding:'utf8'}))[0];
    const built = join(stage, 'built');
    execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(root, 'tsconfig.json'), '--outDir', built], {cwd:root, stdio:'pipe'});
    const initial = JSON.parse(execFileSync(npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', stage], {cwd:root, encoding:'utf8'}))[0];
    execFileSync('tar', ['-xzf', join(stage, initial.filename), '-C', stage]);
    const payload = join(stage, 'package');
    rmSync(join(payload, 'dist'), {recursive:true, force:true});
    cpSync(built, join(payload, 'dist'), {recursive:true});
    const manifestPath = join(payload, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (manifest.private !== true) throw new Error('Candidate preparation requires private: true');
    // The source was already built; consumers do not need development tooling.
    delete manifest.scripts;
    delete manifest.devDependencies;
    if (publishable) {
      if (manifest.version !== '0.1.0-experimental.5') throw new Error('Publishable preparation is limited to candidate version 0.1.0-experimental.5');
      manifest.private = false;
      manifest.publishConfig = {access:'public', registry:'https://registry.npmjs.org', tag:'experimental'};
    }
    const report = {revision, dirty, version:manifest.version, packages:[]};
    for (const name of ['@n8r/surface']) {
      writeFileSync(manifestPath, JSON.stringify({...manifest, name}, null, 2) + '\n');
      const folder = 'scoped';
      mkdirSync(join(output, folder));
      const packed = pack(payload, join(output, folder));
      packed.filename = `${folder}/${packed.filename}`;
      const sha256 = createHash('sha256').update(readFileSync(join(output, packed.filename))).digest('hex');
      report.packages.push({name, filename:packed.filename, sha256, releaseAsset:`n8r-surface-${manifest.version}-${folder}.tgz`});
    }
    writeFileSync(join(output, 'candidates.json'), JSON.stringify(report, null, 2) + '\n');
    return report;
  } finally {
    rmSync(stage, {recursive:true, force:true});
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length < 3 || process.argv.length > 4 || (process.argv[3] && process.argv[3] !== '--publishable')) throw new Error('Usage: node scripts/pack-candidates.mjs NEW_DIRECTORY [--publishable]');
  console.log(JSON.stringify(packCandidates(process.argv[2], {publishable:process.argv[3] === '--publishable'}), null, 2));
}
