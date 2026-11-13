# First-use overview implementation plan

> Execute inline using the supplied feedback as the spec. Use test-first checks
> and an independent final review; no worktrees. Related to issue #72.

## Goal and scope

Skill/plugin 0.1.14 should help a newcomer explain an application's major parts,
external integrations, consequential security findings, gaps and next decision.
Preserve the simple source → research → output-links interaction. The supplied
evaluation of 0.1.13 is the baseline; its private artifacts stay private and intact.
The npm package version, deployment automation and comprehensive dependency SBOMs
are outside this increment.

## Approach

Change research instructions and generated presentation together. Instructions
alone leave the row-per-relationship renderer unchanged; presentation alone cannot
recover unresearched authentication options or invent missing security findings.
Keep CycloneDX Surface profile 1 and its evidence/history contracts. Add an optional
checked node property `n8r:surface:presentation` containing boundary, area, focus
and evidence references. This is a rendering hint, not deployed trust evidence.
Older readers may ignore it; older records remain readable with unclassified nodes.
Use existing descriptions, finding entries, coverage/gaps and next-step entries;
do not introduce another authoritative summary document.

The brief opens with the focus application's description and research scope, then
grouped architecture, evidence-linked findings and implications, coverage/gaps and
continuation. Storage/editing mechanics move to the footer. The HTML overview has
one node per identity and directed connections, followed by full edge details,
inventory, investigation and evidence. Common uncertainty is explained once;
individual conditions, conflicts and observations remain in relationship details.

## Tasks and checks

- [ ] Add `tests/surface-overview.test.mjs`: older/empty records, checked grouping
  evidence, focus uniqueness, connected graph identity and edge preservation,
  long names, cycles/parallel edges, escaped hostile text, evidence links and
  no unsupported findings. Run against baseline and retain failures privately.
- [ ] Extend `src/surface-bom.ts` to validate optional node hints and expose them
  as a serializable record. Implement `src/surface-overview.ts` for deterministic
  graph layout. Revise `src/surface-view.ts` to render useful brief/overview first
  while preserving every relationship, annotation and journal entry underneath.
- [ ] Update research instructions and the CycloneDX reference: record the focus
  description, evidence-backed areas, security implications and seven coverage
  topics; distinguish supported, intended, configured and observed states. Keep
  narrow tasks narrow and leave unresearched topics explicit. Update versioned
  metadata, bundled bytes and bounded package-check expectations to 0.1.14.
- [ ] Repeat the newcomer task through an identified installed candidate without
  supplying findings. Independently read outputs and verify source/evidence links,
  predecessor preservation and next-step usefulness. Record any blocker honestly.
- [ ] Run full tests, package check, Markdown lint, offline links, citation check
  and diff review. Commit, push and keep one draft PR with concise human tasks.

## Review focus

- Unclassified nodes must not become external by inference from component type.
- Supported options and intended selections must not become runtime guarantees.
- Grouping must retain shared nodes, disconnected nodes, cycles and parallel edges.
- Summarization must retain adverse evidence and meaningful relationship exceptions.
- Saved text must stay inert; layout must not truncate names or require network.

## Human proof

With the identified candidate installed and a supplied source folder, ask for an
initial security overview and save it in a new folder. Open the brief and map:
explain the application, major internal areas, external integrations, a few
evidence-backed implications, important unknowns and the next planning decision.
Follow a finding to its evidence. Describe intended model, identity, storage and
tool choices, then continue from the saved BOM in a fresh chat. Expect intended
choices to remain distinct from configured or observed facts and earlier files
to remain unchanged. Report Pass / Fail / Blocked with revision and output links.
Agent rehearsal is not human acceptance; browser policy refusals stay blockers.
