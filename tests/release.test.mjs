import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync, mkdirSync, chmodSync, cpSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

function fixture(t, version = '0.1.0-experimental.1', privatePackage = true) {
  const temp = mkdtempSync(join(tmpdir(), 'n8r-release-'));
  t.after(() => rmSync(temp, {recursive:true, force:true}));
  const root = join(temp, 'source');
  const out = join(temp, 'candidates');
  mkdirSync(root); mkdirSync(out);
  const git = (...args) => execFileSync('git', args, {cwd:root, encoding:'utf8'}).trim();
  git('init', '-q');
  git('config', 'user.name', 'Synthetic Tester');
  git('config', 'user.email', 'tester@example.invalid');
  const manifest = {name:'n8r-surface',version,private:privatePackage};
  writeFileSync(join(root, 'package.json'), JSON.stringify(manifest));
  writeFileSync(join(root, 'package-lock.json'), JSON.stringify({...manifest,packages:{'':manifest}}));
  git('add', '.'); git('commit', '-qm', 'Synthetic release');
  const revision = git('rev-parse','HEAD');
  const tag = `v${version}`;
  git('tag', '-a', tag, '-m', tag);
  const payload = join(temp, 'package'); mkdirSync(payload);
  const packages = (['0.1.0-experimental.1','0.1.0-experimental.2'].includes(version)?['@n8r/surface','n8r-surface']:['@n8r/surface']).map((name, i) => {
    writeFileSync(join(payload, 'package.json'), JSON.stringify({...manifest, name}));
    const filename = `${i}.tgz`;
    execFileSync('tar', ['-czf', join(out, filename), '-C', temp, 'package']);
    const sha256 = createHash('sha256').update(readFileSync(join(out, filename))).digest('hex');
    return {name, filename, sha256, releaseAsset:`n8r-surface-${version}-${i === 0 ? 'scoped' : 'unscoped'}.tgz`};
  });
  const report = {version, revision, dirty:false, packages};
  const save = () => writeFileSync(join(out, 'candidates.json'), JSON.stringify(report));
  save();
  const release = {tag_name:tag,target_commitish:revision,draft:privatePackage,prerelease:version.includes('-'),immutable:!privatePackage,
    html_url:`https://github.com/injectionator/n8r-surface/releases/tag/${tag}`,
    assets:packages.map(p => ({name:p.releaseAsset,state:'uploaded',digest:`sha256:${p.sha256}`}))};
  return {root,out,report,release,git,save};
}

test('release verification accepts a matching draft and rejects mismatches', async t => {
  const {checkRelease} = await import('../scripts/check-release.mjs');
  const f = fixture(t);
  assert.equal(checkRelease(f.root,f.out,f.release).tag, 'v0.1.0-experimental.1');
  for (const patch of [
    {tag_name:'v0.1.0'}, {target_commitish:'main'}, {prerelease:false},
    {html_url:'https://github.com/example/other/releases/tag/v0.1.0-experimental.1'},
    {assets:f.release.assets.slice(0,1)},
    {assets:f.release.assets.map(a => ({...a,digest:'sha256:'+'0'.repeat(64)}))},
    {draft:false,immutable:false}, {draft:false,immutable:true}
  ]) assert.throws(() => checkRelease(f.root,f.out,{...f.release,...patch}));
  const original = structuredClone(f.report);
  for (const patch of [{dirty:true},{revision:'0'.repeat(40)},{version:'0.2.0'},
    {packages:f.report.packages.slice(0,1)},
    {packages:f.report.packages.map(p => ({...p,filename:'../outside.tgz'}))},
    {packages:f.report.packages.map(p => ({...p,name:'wrong'}))}]) {
    Object.assign(f.report,original,patch); f.save();
    assert.throws(() => checkRelease(f.root,f.out,f.release));
  }
  Object.assign(f.report,original); f.save();
  writeFileSync(join(f.root,'unexpected.txt'), 'untracked input');
  assert.throws(() => checkRelease(f.root,f.out,f.release), /clean/);
  rmSync(join(f.root,'unexpected.txt'));
  f.git('tag','-d',f.release.tag_name);
  assert.throws(() => checkRelease(f.root,f.out,f.release), /tag/i);
  f.git('tag',f.release.tag_name);
  writeFileSync(join(f.out,f.report.packages[0].filename), 'tampered');
  assert.throws(() => checkRelease(f.root,f.out,f.release), /hash/i);
});

test('release verification rejects a tag pointing at a different commit', async t => {
  const {checkRelease} = await import('../scripts/check-release.mjs');
  const f = fixture(t);
  f.git('commit','--allow-empty','-qm','Different revision');
  f.report.revision = f.git('rev-parse','HEAD'); f.save();
  f.release.target_commitish = f.report.revision;
  assert.throws(() => checkRelease(f.root,f.out,f.release), /tag/i);
});

// These success cases ensure rejection tests do not pass because every input fails.
test('public immutable release and stable version metadata can pass', async t => {
  const {checkRelease} = await import('../scripts/check-release.mjs');
  const f = fixture(t, '1.2.3', false);
  assert.deepEqual(checkRelease(f.root,f.out,f.release), {
    version:'1.2.3',revision:f.report.revision,tag:'v1.2.3',draft:false,
    packages:['@n8r/surface']
  });
});

test('offline command reports its evidence boundary and exits nonzero for missing assets', t => {
  const f = fixture(t);
  mkdirSync(join(f.root,'scripts'));
  for (const file of ['check-release.mjs','check-version.mjs']) cpSync(join('scripts',file),join(f.root,'scripts',file));
  f.git('add','.'); f.git('commit','-qm','Include verifier');
  // Only disposable fixture tags are replaced; never the project release tags.
  f.git('tag','-d',f.release.tag_name); f.git('tag',f.release.tag_name);
  f.report.revision = f.git('rev-parse','HEAD'); f.save();
  f.release.target_commitish = f.report.revision;
  const metadata = join(f.out,'release.json');
  writeFileSync(metadata,JSON.stringify(f.release));
  const run = () => spawnSync(process.execPath,[join(f.root,'scripts/check-release.mjs'),f.out,metadata],{encoding:'utf8'});
  const result = run();
  assert.equal(result.status,0,result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.evidence,'offline metadata rehearsal');
  assert.equal(output.provenance,'not checked');
  assert.equal(output.npmPublication,'not checked');
  f.release.assets.pop(); writeFileSync(metadata,JSON.stringify(f.release));
  assert.notEqual(run().status,0);
});

test('GitHub command discovers drafts and requires a remote tag, not a same-named branch', t => {
  const f = fixture(t);
  mkdirSync(join(f.root,'scripts'));
  for (const file of ['check-release.mjs','check-version.mjs']) cpSync(join('scripts',file),join(f.root,'scripts',file));
  f.git('add','.'); f.git('commit','-qm','Include verifier');
  f.git('tag','-d',f.release.tag_name); f.git('tag',f.release.tag_name);
  f.report.revision = f.git('rev-parse','HEAD'); f.save();
  f.release.target_commitish = f.report.revision;
  const metadata = join(f.out,'release.json');
  writeFileSync(metadata,JSON.stringify(f.release));
  const bin = join(f.out,'bin'); mkdirSync(bin);
  const stub = join(bin,'gh');
  writeFileSync(stub, `#!/usr/bin/env node
const args = process.argv.slice(2);
const release = JSON.parse(require('node:fs').readFileSync(process.env.FIXTURE_RELEASE));
const repo = 'github.com/injectionator/n8r-surface';
const base = 'repos/injectionator/n8r-surface/';
if (JSON.stringify(args) === JSON.stringify(['release','view',release.tag_name,'--repo',repo,'--json','databaseId'])) {
  console.log(JSON.stringify({databaseId:17}));
} else if (args[0] === 'api' && args[1] === '--hostname' && args[2] === 'github.com') {
  if (args[3] === base + 'releases/17') console.log(JSON.stringify(release));
  else if (args[3] === base + 'git/ref/tags/' + release.tag_name) {
    if (process.env.FIXTURE_NO_TAG) process.exit(1);
    console.log(JSON.stringify({ref:'refs/tags/' + release.tag_name, object:{type:'tag',sha:'a'.repeat(40)}}));
  } else if (args[3] === base + 'git/tags/' + 'a'.repeat(40)) {
    console.log(JSON.stringify({sha:'a'.repeat(40),tag:release.tag_name,object:{type:process.env.FIXTURE_BAD_TYPE ? 'tree' : 'commit',sha:process.env.FIXTURE_WRONG_SHA ? '0'.repeat(40) : release.target_commitish}}));
  } else if (args[3] === base + 'commits/' + release.tag_name) {
    // A branch with this name exists even when the tag does not.
    console.log(JSON.stringify({sha:release.target_commitish}));
  } else process.exit(1);
} else process.exit(1);
`);
  chmodSync(stub,0o755);
  const run = extra => spawnSync(process.execPath,[join(f.root,'scripts/check-release.mjs'),f.out],{
    encoding:'utf8',env:{...process.env,PATH:bin + ':' + process.env.PATH,FIXTURE_RELEASE:metadata,...extra}
  });
  const result = run({});
  assert.equal(result.status,0,result.stderr);
  assert.equal(JSON.parse(result.stdout).evidence,'GitHub API readback');
  assert.notEqual(run({FIXTURE_NO_TAG:'1'}).status,0,'same-named branch cannot replace missing remote tag');
  assert.notEqual(run({FIXTURE_WRONG_SHA:'1'}).status,0,'remote tag SHA must match');
  assert.notEqual(run({FIXTURE_BAD_TYPE:'1'}).status,0,'tag must resolve to a commit');
});

test('next release verifies only scoped bytes and refuses an added unscoped package',async t=>{
 const {checkRelease}=await import('../scripts/check-release.mjs');
 const f=fixture(t,'0.1.0-experimental.5');
 assert.deepEqual(checkRelease(f.root,f.out,f.release).packages,['@n8r/surface']);
 f.report.packages.push({...f.report.packages[0],name:'n8r-surface'});f.save();
 assert.throws(()=>checkRelease(f.root,f.out,f.release));
});
