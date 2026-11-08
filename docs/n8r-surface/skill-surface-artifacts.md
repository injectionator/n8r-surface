# Standalone installed-skill Surface artifacts

Issue [#51](https://github.com/injectionator/n8r-surface/issues/51) adds a standalone
artifact helper, now bundled in candidate skill 0.1.11. The host researches sources and prepares
JSON; the bundled helper checks it, renders research HTML and a brief, and saves
a new revision directory. It never invokes the `n8r-surface` CLI, reads source
configuration, connects to a model or makes network requests.

## Task and implementation boundary

**Given:** the installed candidate, Node.js 22/24/26, an authorized workspace and
permitted source evidence. **When:** the user requests a saved Capability or Bound
Surface. **Then:** the host provides openable brief, research HTML and 0.3 JSON,
with pinned dependency artifacts and a hash manifest. A fresh chat can read the
saved directory and save a checked successor while preserving the predecessor.

The current [relationship contract](surface-relationships.md) supplies validation,
evidence references and revision rules. The helper reuses that implementation;
JSON decoding retains the existing strict codec. A development-only esbuild step
bundles the helper and its YAML parser dependency into one offline Node module.
The parser's licence is retained alongside it. There is no runtime dependency
installation. The library reader accepts both presentation generations; the CLI persistence output remains unchanged.

`npm run build:skill` regenerates the retained bundle; `npm run check:skill`
checks exact reproducibility and runs in `npm test`. The helper entrypoint is
`plugins/n8r-surface/skills/research/scripts/artifacts.mjs`; its host-facing
[procedure](../../plugins/n8r-surface/skills/research/references/artifacts.md)
and synthetic examples ship together. Bundled examples illustrate shapes, not
findings. No helper is allowed to invent research or infer instance bindings.

Save creates a new directory exclusively. Existing directories and symlink
ancestry are refused. Parent directories must already exist. Files use private
permissions. An I/O failure can leave an incomplete directory for inspection;
it is never reported as success or overwritten on retry. Stable directory topology
is required during synchronous operations; this is not a hostile-filesystem sandbox.
The manifest detects accidental changes, not an attacker able to rewrite all
files and hashes. No source file, service, credential or predecessor is modified.

Privacy starts before source intake: use permitted sanitized projections and
never print or stage raw settings. The helper rejects recognizable URLs, addresses,
credential assignments and private paths, with fixed diagnostics that omit input
values. This is defense in depth, not a guarantee that arbitrary names or opaque
secrets can be recognized. Human/source review remains necessary. Safe configuration
owner/key/location and product/role identity remain useful without setting values.

## Baseline evidence

On 8 November 2026, installed skill 0.1.9 was invoked through Codex CLI 0.166.0
app-server with a synthetic assistant source and this request:

> Use product.md to create a Capability Surface. Save the brief, research HTML and
> checked structured Surface in this workspace. The skill must work standalone
> without invoking n8r-surface CLI.

It produced provisional brief/HTML/JSON/check files, explicitly reporting that
contract validation was unavailable because no validator was bundled. This is
an actual installed baseline, not an inferred test failure. Raw receipts and
source/output bytes are retained privately in the selected vault's run folder.

## Candidate rehearsal and checks

A local marketplace installed candidate 0.1.10 in an isolated test home. Codex
CLI 0.166.0 app-server used fresh ephemeral sessions, the existing ChatGPT sign-in
model `gpt-6-astra` and Node 26.13.0. The first candidate run reached the existing workspace runner's
120-second deadline while correcting a draft; no success was claimed. The
follow-up used the same Host harness with a private 600-second turn deadline.
This is agent rehearsal, not a new public acceptance-runner mode or desktop proof.

The installed host then produced Capability, Bound and fresh-chat Bound-successor
artifacts from supplied synthetic sources. It used the bundled helper without the
product CLI. Independent readback checked saved bytes, source hashes, possible
versus configured states, concrete targets, pinned Capability, stable identities,
parent digests and retained human deferral. Prior files remained byte-identical.
Synthetic sensitive URL/address/username/password sentinels were confined to the
owned raw source fixture; scanning generated files and retained receipts found no
copies. The host selected only permitted fields before retaining configuration.

The synthetic fixture supplements the human task below with `instance.json`
containing `instance`, `revision`, `modelService`, `configured` and sensitive
sentinel fields. The interaction explicitly permits only the first four fields.
The raw fixture is test input, not a retained production evidence store. The
second source changes the model service identity; no researcher findings were
prewritten by the developing agent.

Focused checks cover standalone execution outside the checkout, Capability/Bound
readback, missing references, orphan revisions, collisions, symlinks, edited HTML,
privacy refusals, lost decisions, rewritten pinned dependencies, duplicate JSON
members and value-free errors. Three independent review findings gained failing
then passing regressions. A final error-path regression prevents the exported
digest helper from echoing unsafe property names. All opaque extensions are
refused in this bounded host; the general library's earlier contracts remain intact.

The final installed candidate also saved a further fresh-chat successor selecting
Model Service C. Independent checks confirmed source hashes, both parent digests,
unchanged prior artifacts and the retained decision. All 20 installed files matched
the candidate source. Final instruction digest:
`sha256:a3480402aef42c93cb4d7e77fbf157b33dab6eaedb6b97f8ef1db1022cfaa58b`.
Standalone helper SHA-256:
`aec2dc355b5d33661ff7c3250a1a3edb3e31bf4ea22e614816c9593da37d3019`.
The final sentinel scan covered 72 generated/retained files, excluding the owned
raw source fixture and the initial isolated installation cache, with zero matches.

Private run records retain installation/source file digests, interaction receipts,
independent readback and preservation inventories. The final PR identifies the
exact source revision and final test counts. Neither the first timed-out attempt
nor fixture/package checks are reported as human acceptance. The broader
unrelated-product journey and human acceptance remain #52.

## Human verification task list

Maintainer preparation: identify the installed 0.1.11 candidate and file digests,
record Codex/model/Node versions, and supply an empty writable workspace containing
`product.md` with this synthetic source. Use the
[isolated installation procedure](workspace-installation.md) with the candidate's
commit and version; it does not replace the normal desktop installation. A tester
needs the identified skill available in their selected host.

```text
# Synthetic assistant
Revision: fixture-1
The assistant can send prompts to an OpenAI-compatible model API using HTTPS.
MODEL_ENDPOINT is documented in config/example.env.
No instance configuration is supplied.
```

- [ ] Open the prepared workspace in Codex, invoke the installed Researcher, and
  ask: “Use product.md to create a Capability Surface. Save the brief, research
  HTML and checked structured Surface in capability-001.” Open all returned
  links. Expect the supported model-API connection, explicit gaps and no selected
  instance target. There must be actual saved files and successful readback.
- [ ] Supply a permitted summary: “For synthetic instance demo, configuration
  revision 1 selects Model Service A for the model API. This establishes only
  configuration, not runtime use.” Ask: “Save a Bound Surface in bound-001 using
  this summary and the saved Capability. Record my decision to keep runtime
  verification deferred.” Expect the same role relationship, a separate concrete
  target, source evidence for configuration, and a separate human decision.
- [ ] Start a fresh chat with the same workspace. Supply: “Configuration revision
  2 changes that model API target to Model Service B.” Ask: “Reopen bound-001
  and save a successor in bound-002 reflecting this change.” Open both revisions.
  Expect stable role/component identities, updated binding, preserved decision,
  exact predecessor reference and unchanged prior files.
- [ ] Report **Pass / Fail / Blocked**, output links and the failing step if any.
  IDs, dates and wording may vary. Broken links, unsupported bindings, leaked
  values, lost decisions/history or success after a failed check are failures.

Technical evidence checks belong to the maintainer: read each directory with the
installed helper, verify source digests and consequential claims independently,
compare predecessor/source hashes and scan all outputs and receipts for synthetic
sensitive sentinels. Exit 0 plus `checked`/`saved-and-read-back` is required;
exit 1 is failure. Retain owned trial outputs for review. Cleanup is a separate
user decision and must never delete borrowed sources.

This bounded agent rehearsal is distinct from human acceptance. Issue #52 retains
the broader two-product journey, human corrections, usefulness and host acceptance.

## Human-readable presentation (candidate 0.1.11)

The 0.1.10 rehearsal exposed a usefulness failure: HTML listed contract fields,
and the brief directed readers elsewhere for evidence. Candidate 0.1.11 renders
a shared narrative in both formats: current picture, what changed, why it
matters, evidence locators, human decisions and remaining unknowns. Impact is
limited to the connection's documented purpose and configured selection; it does
not invent business outcomes or runtime success. Conflicting claims remain visible.

A previous target is compared only when the exact parent research record is in
the bundle. Otherwise the report says that the comparison is unavailable. Full
records, source coverage and hashes remain accessible in expandable HTML details.
The report uses local styles, no scripts, remote fonts or network resources.

Saved bundles now use manifest version 2 and HTML presentation 1. Research and
Surface contracts and canonical digests do not change. The reader still accepts
unchanged manifest-1 bundles and their original brief/HTML. Both presentations
reject visible edits; updating a manifest hash alone cannot legitimize prose that
disagrees with the embedded data. New HTML also checks its embedded Surface and
dependency context against the accompanying files. Older 0.1.10 helpers cannot
read the new presentation; install 0.1.11 before continuing it.

### Short human check

Prerequisite: the identified 0.1.11 candidate and an existing checked Bound
successor and its predecessor, produced by the task list above. Keep the original
files. In the same workspace, ask the Researcher:

> Read bound-002 and its predecessor bound-001 using the bundled helper. Save the
> same checked bundle with the new readable presentation in bound-002-readable.
> Preserve all research and Surface data, decisions and original files. This is
> a presentation copy, not another research revision. Show the HTML and brief.

- [ ] Open the returned HTML. The configured target should be the first useful
  statement. “What changed” should name the previous and current targets when
  the exact parent research is retained.
- [ ] Read “Why it matters” and “Evidence”. Expect the documented connection
  purpose/integration, configuration-versus-runtime limit and source locators.
  No new source findings or business/security assurances should appear.
- [ ] Read decisions and unknowns, then expand technical details. The deferred
  decision, unresolved questions and original checked data must remain available.
- [ ] Open the brief. Expect the same substantive explanation without needing to
  decode identifiers or open the JSON to discover the conclusion.
- [ ] Report **Pass / Fail / Blocked**, the two output links and any unclear
  wording. Visual usefulness requires human review, separate from data checks.

Maintainer evidence: helper save/read must exit 0; compare canonical research,
Surface and dependency data and byte hashes of all original files. Only HTML,
brief and their new manifest may differ in the presentation copy. Retain the
copy for review; no cleanup or registry publication is part of this task.

### Presentation evidence and limits

The copied standalone 0.1.11 helper re-rendered the previously generated Bound
successor without new research. Save and independent read exited 0. Research,
Surface and dependency data compared equal; Surface/dependency JSON bytes were
identical, and all 29 files present before the presentation copy were unchanged.
The new brief identifies the old/current targets, source locators and retained
deferral. Raw receipts remain private. This is helper rehearsal, not a fresh
installed-skill conversation or human usefulness acceptance. Browser policy
blocked the local-file preview, so no screenshot or visual acceptance is claimed.

Six presentation regressions cover data preservation, legacy reopening, visible
edits, manifest downgrade, equal-label target identities and conditional/exclusive
Capabilities. Independent review found the latter three issues before fixes;
regressions demonstrated each failure, then passed. The complete suite has 201
checks. Package preparation exposed stale version/digest expectations; those were
corrected. Concurrent cross-runtime tests collided on a shared temporary build
file; sequential rerunning passed. Broad usefulness remains the two-product
skill journey in #52, followed by CLI integration and separate Labs work.
