# Surface BOM Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline in the existing checkout. No worktrees.

**Goal:** Save and reopen a useful investigation using a self-contained BOM.

**Architecture:** Standard CycloneDX inventory and annotations with a bounded
Surface property profile. Derived journal/brief/HTML views share that authority.

**Tech Stack:** TypeScript, pinned CycloneDX 1.7 schemas, existing Ajv and Node tests.

**Spec:** [Design](../specs/2026-11-13-surface-bom-design.md).

## Global constraints

Node.js 22, 24 or 26. No worktrees. Preserve research and predecessor revisions.
Synthetic public fixtures only. No merge, release or deployment. No second native
authority for new saves; retain deliberate legacy access. No new runtime packages.

## Review focus

- Mixed evidence states must not collapse into one Surface classification.
- Generic consumers must not mistake possible paths for selected dependencies.
- BOM-only recovery must not depend on sibling files or historical notes.
- Generated-view edits and unsafe filesystem paths must not be overwritten.
- Fresh assessment must come from installed skill behavior, not developer findings.

## Tasks

- [x] Add failing tests and a concrete synthetic BOM profile fixture for mixed
  relationships, citations, decisions and investigation steps. Implement profile
  checking/recovery in `src/surface-bom.ts`, reusing standard schema validation.
  Run focused tests, then the full suite. Retain legacy exchange reader tests.
- [x] Implement `saveSurface`, `readSurface` and derived presentation in focused
  modules. Add failing tests for BOM-only recovery, immutable revisions, unsafe
  paths, changed views and escaped HTML. Bundle standalone `surface.mjs` and
  exercise it outside the checkout. Retain deliberate legacy reading and document manual migration with explicit
  limitations; do not claim an automatic converter.
- [ ] Update installed skill instructions/references and the manual for fresh
  context, automatic evidence inference, ordinary save, living journal, links and
  next steps. Use current behavior as baseline and installed sessions as outcome
  evidence. Update command intents and repository candidate descriptions.
- [ ] Evaluate a pinned Sunshine checkout with the synthetic BOM; record actual
  service/model/profile behavior and select the useful renderer. Install exact
  candidate bytes and run fresh LibreChat assessment, diversion and continuation
  in a private workspace. Independently check saved bytes and BOM-only recovery.
- [ ] Run all relevant checks, fresh whole-branch review, fix material findings,
  commit/push and update draft PR with exercised human verification and limits.

## Ledger

Initial evidence: current exporter requires native siblings and suppresses all
Capability dependencies. Prior installed rehearsal is explicitly superseded as
acceptance of this revised destination; it is not fresh research input.

Implementation checks: 221/221 tests passed on Node 26.13.0. Initial RED tests
covered missing BOM recovery and persistence. A standalone bundling failure
revealed executable-entry import coupling; schema validation now has its own
module. Successor preservation tests failed before retention checks were added.

Ruling: retain legacy reading and documented deliberate manual migration, without
an automatic converter. The user allowed migration/reading; automatic conversion
would need separate treatment of legacy-only contract meanings. Cost: migrating
an old save requires host review and explicit transfer, not one command.

Final review: three P2 findings reproduced as failing tests, then fixed. Canonical
BOM paths now check sibling view edits; disconnected nodes remain in human views;
historical observations retain dates, notes and relationship association. Focused
suite: 15/15. No deferred minor findings. Installed behavior, research accuracy,
browser acceptance and general consumer fidelity require their separate evidence.
The package smoke check initially failed on the previous instruction digest;
updated the exact candidate digest after reviewing the new instructions.
