// Copied into a temporary consumer directory; no checkout-relative imports.
import assert from 'node:assert/strict';
import {readFileSync, mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const packageName = process.env.N8R_TEST_PACKAGE || 'n8r-surface';
const {readResearchHtml, decode, encode, verifyReferences, verifySuccessor} = await import(packageName);
const asset = name => readFileSync(new URL(import.meta.resolve(`${packageName}/examples/${name}`)), 'utf8');
const lumen = readResearchHtml(asset('lumen-r2.research.html'));
const harbor = readResearchHtml(asset('harbor-r2.research.html'));
const surface = decode(asset('composed.surface.json'), 'json');
assert.equal(surface.nodes.length, 4);
assert.equal(surface.relationships.length, 6);
verifyReferences(surface, [lumen, harbor]);
verifySuccessor(readResearchHtml(asset('lumen-r1.research.html')), lumen);
assert.deepEqual(decode(encode(surface, 'yaml'), 'yaml'), surface);
assert.throws(() => readResearchHtml(asset('lumen-manual-edit.pending.html')), /conflict/);
assert.ok(readFileSync(new URL(import.meta.resolve(`${packageName}/contracts/contracts.md`)), 'utf8').includes('n8r.research/0.1'));
const description = name => decode(asset(`descriptions/${name}.json`), 'json');
const descriptionContext = ['research-r1', 'research-r2', 'capability'].map(description);
const boundBefore = description('bound-r1'), boundAfter = description('bound-r2');
verifyReferences(boundBefore, descriptionContext);
verifyReferences(boundAfter, descriptionContext);
verifySuccessor(boundBefore, boundAfter);
assert.deepEqual(boundBefore.bindings.map(b => b.state), ['configured', 'conflicting', 'unknown']);
assert.equal(boundAfter.bindings[0].claims[0].target, 'urn:target:mongodb');
assert.deepEqual(decode(encode(boundAfter, 'json'), 'json'), boundAfter);
console.log('Installed Capability/Bound JSON assets, references and successor passed.');
const graph = name => decode(asset(`relationships/${name}.json`), 'json');
const graphContext = ['research-r1', 'research-r2', 'capability'].map(graph);
const graphBefore = graph('bound-r1'), graphAfter = graph('bound-r2');
verifyReferences(graphBefore, graphContext); verifyReferences(graphAfter, graphContext);
verifySuccessor(graphBefore, graphAfter);
assert.equal(graphBefore.relationships[0].configuration.claims[0].value[0].key, 'CHAT_STORE_URI');
assert.equal(graphAfter.relationships[0].binding.claims[0].target, 'urn:target:mongodb');
assert.deepEqual(decode(encode(graphAfter, 'json'), 'json'), graphAfter);
console.log('Installed shared relationship details, configuration references and bindings passed.');
// Exercise the public consumer boundary; reject before inherited hooks run.
let serializationCalls = 0;
class LossyArray extends Array {
  toJSON() { serializationCalls++; return ['replacement']; }
}
const imported = structuredClone(lumen);
imported.extensions['urn:ext:array-boundary'] = new LossyArray('original');
for (const format of ['json', 'yaml']) {
  assert.throws(() => encode(imported, format), /plain array/);
  assert.equal(serializationCalls, 0);
  assert.equal(imported.extensions['urn:ext:array-boundary'][0], 'original');
}
console.log(`Installed package passed on Node ${process.version}; 4 nodes, 6 relationships, exact research references.`);

// Internal module location is inspected only for distribution QA, not a public API.
const installedRoot = new URL('../', import.meta.resolve(packageName));
const manifest = JSON.parse(readFileSync(new URL('package.json', installedRoot)));
assert.equal(manifest.name, packageName);
assert.ok(process.env.N8R_TEST_VERSION, 'independent candidate version required');
assert.equal(manifest.version, process.env.N8R_TEST_VERSION);
assert.equal(manifest.bin['n8r-surface'], './dist/cli.js');
console.log(`Verified installed identity: ${manifest.name}@${manifest.version}`);
const {researcherInstructions} = await import(new URL('dist/codex.js', installedRoot));
const instructions = researcherInstructions();
assert.equal(instructions.version, '0.1.11');
assert.equal(instructions.digest, 'sha256:1e19fd9daf1d7c4ce7fbdcf3dfa1af9dbcdbf2a29896e023604c929b80ec706b');
console.log('Installed Researcher instructions and all references match the reviewed 0.1.11 digest.');

const artifactHelper = await import(new URL('plugins/n8r-surface/skills/research/scripts/artifacts.mjs', installedRoot));
assert.equal(artifactHelper.checkBundle({research: graph('research-r1'), surface: graph('capability'), dependencies: []}).surface.kind, 'capability');
console.log('Installed standalone artifact helper validates bundled Capability without CLI.');

// The installed skill's shared helper must work without a developer checkout.
const workspaceHelper = await import(new URL('plugins/n8r-surface/skills/research/scripts/workspace.mjs', installedRoot));
const workspaceFixture = mkdtempSync(join(tmpdir(), 'n8r-installed-workspace-'));
try {
  const created = workspaceHelper.setupWorkspace(workspaceFixture);
  assert.equal(created.status, 'created');
  const bytes = readFileSync(join(workspaceFixture, '.n8r/workspace.json'));
  assert.equal(workspaceHelper.inspectWorkspace(workspaceFixture).record.id, created.record.id);
  assert.equal(workspaceHelper.setupWorkspace(workspaceFixture).status, 'recognized');
  assert.deepEqual(readFileSync(join(workspaceFixture, '.n8r/workspace.json')), bytes);
} finally { rmSync(workspaceFixture, {recursive: true, force: true}); }
const portablePlugin = JSON.parse(readFileSync(new URL('plugins/n8r-surface/plugin.json', installedRoot)));
const codexPlugin = JSON.parse(readFileSync(new URL('plugins/n8r-surface/.codex-plugin/plugin.json', installedRoot)));
assert.equal(portablePlugin.version, instructions.version);
assert.equal(codexPlugin.version, instructions.version);
console.log('Installed workspace helper create/reuse/readback passed; plugin versions agree.');
