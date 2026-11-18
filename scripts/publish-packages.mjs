// Scoped-release publisher: caller must first run check:release on retained assets.
// Network and registry writes are explicit; imports are side-effect free.
import {readFileSync, realpathSync, mkdtempSync, readdirSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

export function verifyRegistryBytes(entry, version, metadata, bytes) {
  if (metadata.name !== entry.name || metadata.version !== version) throw new Error('Registry identity mismatch');
  if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) throw new Error('Registry bytes differ from retained archive; stop and select a new version');
  if (metadata.dist?.integrity !== 'sha512-' + createHash('sha512').update(bytes).digest('base64')) throw new Error('Registry integrity mismatch');
}

export function verifyStagedBytes(entry, version, stage, bytes) {
  if (stage.packageName !== entry.name || stage.version !== version || stage.tag !== 'experimental' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stage.id)) throw new Error('Staged identity mismatch');
  if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) throw new Error('Staged bytes differ from retained archive');
}

async function registryVersion(name, version) {
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Registry lookup failed: ${response.status}`);
  return response.json();
}

async function readback(entry, version, metadata) {
  const url = new URL(metadata.dist?.tarball);
  if (url.origin !== 'https://registry.npmjs.org' || url.username || url.password) throw new Error('Unexpected registry tarball URL');
  const response = await fetch(url, {redirect:'error'});
  if (!response.ok) throw new Error(`Registry download failed: ${response.status}`);
  verifyRegistryBytes(entry, version, metadata, Buffer.from(await response.arrayBuffer()));
  if (!metadata.dist?.attestations?.url || !metadata.dist.attestations.provenance) throw new Error('Package provenance metadata missing; release remains incomplete');
  return {name:entry.name, version, sha256:entry.sha256, integrity:metadata.dist.integrity, attestations:metadata.dist.attestations};
}

export async function publishMissing(entries, {lookup, verify, publish}) {
  const pending = [];
  // Inspect retained packages before changing the registry. Network errors never mean absent.
  for (const entry of entries) {
    const existing = await lookup(entry);
    if (existing) await verify(entry, existing);
    else pending.push(entry);
  }
  for (const entry of pending) {
    await publish(entry);
    const metadata = await lookup(entry);
    if (!metadata) throw new Error('Published version not yet readable; retain artifacts and retry readback');
    await verify(entry, metadata);
  }
}

async function main(directory, operation) {
  if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REPOSITORY !== 'injectionator/n8r-surface') throw new Error('Publication requires the official GitHub Actions workflow');
  const root = resolve(import.meta.dirname, '..');
  const report = JSON.parse(readFileSync(join(directory, 'candidates.json'), 'utf8'));
  if (report.version !== '0.1.0-experimental.5' || process.env.GITHUB_REF !== `refs/tags/v${report.version}` || process.env.GITHUB_SHA !== report.revision) throw new Error('Workflow must run at the exact approved version tag/revision');
  if(report.packages?.length!==1 || report.packages[0].name!=='@n8r/surface') throw new Error('Only @n8r/surface is authorized by this tooling');
  // Revalidate live release mapping immediately before any registry writes.
  execFileSync(process.execPath, [join(root, 'scripts/check-release.mjs'), directory], {stdio:'inherit'});
  for (const entry of report.packages) {
    const archive = join(directory, entry.filename);
    const manifest = JSON.parse(execFileSync('tar', ['-xOf', archive, 'package/package.json'], {encoding:'utf8'}));
    if (manifest.private !== false || manifest.publishConfig?.tag !== 'experimental' || manifest.publishConfig?.access !== 'public' || manifest.publishConfig?.registry !== 'https://registry.npmjs.org') throw new Error('Archive is not explicitly prepared for this release');
  }
  await publishMissing(report.packages, {
    lookup: async entry => {
      const published = await registryVersion(entry.name, report.version);
      if (published) return {published};
      if (operation === 'verify') return null;
      const stages = JSON.parse(execFileSync('npm', ['stage', 'list', entry.name, '--json', '--registry=https://registry.npmjs.org'], {encoding:'utf8'}));
      if (!Array.isArray(stages)) throw new Error('Invalid staged-package list');
      const matching = stages.filter(s => s.packageName === entry.name && s.version === report.version);
      if (matching.length > 1) throw new Error('Multiple matching stages; maintainer must resolve before retry');
      return matching.length ? {stage:matching[0]} : null;
    },
    verify: async (entry, state) => {
      if (state.published) console.log(JSON.stringify(await readback(entry, report.version, state.published)));
      else {
        const stage = state.stage;
        if (!/^[0-9a-f-]{36}$/i.test(stage.id) || stage.tag !== 'experimental') throw new Error('Unexpected staged identity/tag');
        const temp = mkdtempSync(join(tmpdir(), 'n8r-stage-'));
        try {
          execFileSync('npm', ['stage', 'download', stage.id, '--registry=https://registry.npmjs.org'], {cwd:temp, stdio:'pipe'});
          const files = readdirSync(temp);
          if (files.length !== 1 || !files[0].endsWith('.tgz')) throw new Error('Unexpected staged download');
          const bytes = readFileSync(join(temp, files[0]));
          verifyStagedBytes(entry, report.version, stage, bytes);
          console.log(JSON.stringify({name:entry.name, version:report.version, stageId:stage.id, sha256:entry.sha256, npmStatus:stage.status, nextStep:'Inspect npm validation status, then approve with 2FA when eligible'}));
        } finally { rmSync(temp, {recursive:true, force:true}); }
      }
    },
    publish: entry => {
      if (operation === 'verify') throw new Error('The exact scoped version must be approved before registry verification');
      execFileSync('npm', ['stage', 'publish', realpathSync(join(directory, entry.filename)), '--ignore-scripts', '--access=public', '--tag=experimental', '--provenance', '--registry=https://registry.npmjs.org'], {stdio:'inherit'});
    },
  });
  console.log(operation === 'stage' ? 'Retained bytes submitted or already present. Staged versions require maintainer 2FA approval; publication is not yet established.' : 'The scoped registry archive matches retained bytes and exposes provenance metadata. Independently verify signatures, provenance source and installed behavior before finalizing the draft release.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 4 || !['stage','verify'].includes(process.argv[3])) throw new Error('Usage: node scripts/publish-packages.mjs CANDIDATE_DIRECTORY stage|verify');
  await main(resolve(process.argv[2]), process.argv[3]);
}
