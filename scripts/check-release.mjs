// Read-only release mapping check. A metadata file is an offline rehearsal,
// never authenticated GitHub evidence or npm provenance.
import {readFileSync, realpathSync} from 'node:fs';
import {resolve, join, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {checkVersion} from './check-version.mjs';
const repository = 'injectionator/n8r-surface';
const root = resolve(import.meta.dirname, '..');
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const requireMatch = (condition, message) => { if (!condition) throw new Error(message); };

export function resolveRemoteTag(tag, api) {
  const reference = api(`git/ref/tags/${tag}`);
  requireMatch(reference?.ref === `refs/tags/${tag}`, 'Remote reference must be the exact release tag');
  let object = reference.object;
  const seen = new Set();
  while (object?.type === 'tag') {
    requireMatch(/^[a-f0-9]{40}$/.test(object.sha) && !seen.has(object.sha) && seen.size < 16, 'Invalid or cyclic annotated tag');
    seen.add(object.sha);
    const annotation = api(`git/tags/${object.sha}`);
    requireMatch(annotation?.sha === object.sha, 'Annotated tag identity mismatch');
    object = annotation.object;
  }
  requireMatch(object?.type === 'commit' && /^[a-f0-9]{40}$/.test(object.sha), 'Remote release tag must resolve to a commit');
  return object.sha;
}

export function checkRelease(source, directory, release) {
  const version = checkVersion(source);
  const git = (...args) => execFileSync('git', args, {cwd:source, encoding:'utf8', stdio:['ignore','pipe','pipe']}).trim();
  requireMatch(git('status','--porcelain','--untracked-files=all') === '', 'Release verification requires a clean checkout');
  const revision = git('rev-parse','HEAD');
  const tag = `v${version}`;
  const report = json(join(directory, 'candidates.json'));
  requireMatch(report.version === version && report.revision === revision && report.dirty === false, 'Candidate version/revision must match clean HEAD');
  let tagged;
  try { tagged = git('rev-parse','--verify',`refs/tags/${tag}^{commit}`); }
  catch { throw new Error(`Missing local release tag ${tag}`); }
  requireMatch(tagged === revision, 'Release tag must resolve to candidate commit');
  requireMatch(release?.tag_name === tag && release.target_commitish === revision, 'Release tag/target_commitish must name the exact version and commit');
  requireMatch(typeof release.draft === 'boolean' && release.prerelease === version.includes('-'), 'Release draft/prerelease metadata is invalid');
  requireMatch(release.draft || release.immutable === true, 'Published GitHub Release must be immutable');
  // GitHub drafts use /releases/tag/untagged-... URLs until publication.
  const url = new URL(release.html_url);
  requireMatch(url.origin === 'https://github.com' && !url.search && !url.hash &&
    (url.pathname === `/${repository}/releases/tag/${tag}` ||
      (release.draft && new RegExp(`^/${repository}/releases/tag/untagged-[a-zA-Z0-9]+$`).test(url.pathname))),
  'Release URL must identify the official repository and tag');
  const names = ['0.1.0-experimental.1','0.1.0-experimental.2'].includes(version) ? ['@n8r/surface','n8r-surface'] : ['@n8r/surface'];
  requireMatch(Array.isArray(report.packages) && report.packages.length === names.length, 'Candidate packages must match the version-specific scope');
  requireMatch(Array.isArray(release.assets), 'Release assets are required');
  const base = realpathSync(directory);
  for (const [index, name] of names.entries()) {
    const entry = report.packages[index];
    requireMatch(entry?.name === name, 'Candidate package names/order must match release scope');
    const assetName = `n8r-surface-${version}-${index === 0 ? 'scoped' : 'unscoped'}.tgz`;
    requireMatch(entry.releaseAsset === assetName, 'Candidate release asset name mismatch');
    requireMatch(typeof entry.filename === 'string' && /^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9._-]+\.tgz$/.test(entry.filename), 'Unsafe candidate filename');
    const archive = realpathSync(join(base,entry.filename));
    requireMatch(archive.startsWith(base + sep), 'Candidate archive must remain inside its directory');
    const hash = createHash('sha256').update(readFileSync(archive)).digest('hex');
    requireMatch(entry.sha256 === hash, 'Candidate archive hash mismatch');
    const manifest = JSON.parse(execFileSync('tar',['-xOf',archive,'package/package.json'],{encoding:'utf8'}));
    requireMatch(manifest.name === name && manifest.version === version, 'Archive package name/version mismatch');
    requireMatch(release.draft || manifest.private !== true, 'Private candidates cannot establish a published release');
    const assets = release.assets.filter(asset => asset.name === assetName);
    requireMatch(assets.length === 1 && assets[0].state === 'uploaded' && assets[0].digest === `sha256:${hash}`, 'Release asset missing, duplicated or hash mismatch');
  }
  return {version, revision, tag, draft:release.draft, packages:names};
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length < 3 || process.argv.length > 4) throw new Error('Usage: node scripts/check-release.mjs CANDIDATE_DIRECTORY [OFFLINE_RELEASE_JSON]');
  const version = checkVersion(root);
  const tag = `v${version}`;
  const api = endpoint => JSON.parse(execFileSync('gh',['api','--hostname','github.com',`repos/${repository}/${endpoint}`], {encoding:'utf8'}));
  const offline = process.argv[3];
  // gh release view discovers authenticated drafts as well as published releases.
  const releaseId = offline ? undefined : JSON.parse(execFileSync('gh',
    ['release','view',tag,'--repo',`github.com/${repository}`,'--json','databaseId'], {encoding:'utf8'})).databaseId;
  if (!offline) requireMatch(Number.isSafeInteger(releaseId) && releaseId > 0, 'Invalid GitHub Release ID');
  const release = offline ? json(offline) : api(`releases/${releaseId}`);
  const result = checkRelease(root,process.argv[2],release);
  if (!offline) {
    const commit = resolveRemoteTag(tag, api);
    requireMatch(commit === result.revision, 'Remote release tag must resolve to candidate commit');
  }
  console.log(JSON.stringify({...result,evidence:offline ? 'offline metadata rehearsal' : 'GitHub API readback',
    npmPublication:'not checked',provenance:'not checked'},null,2));
}
