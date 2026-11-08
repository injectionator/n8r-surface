# Capability and Bound Surface implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan.

**Goal:** Complete #50's bounded contract, examples and checks, enabling #51.

**Architecture:** Add JSON-only `n8r.surface/0.2` Capability and Bound descriptions.
Keep selected definitions at `0.1`. Reuse the research envelope, provenance,
logical digests and offline reference/revision APIs; do not change the runner.

**Tech Stack:** Existing TypeScript, Node.js and Node test runner; no new dependency.

**Spec:** [Agreed delivery intent](../../n8r-surface/surface-descriptions.md).

## Constraints and decisions

- Work in the existing #50 branch and draft PR; no worktrees or merge.
- Bound means configured, not exercised. Missing evidence means unknown.
- A Bound description pins one Capability revision and one opaque instance.
- Capability edges describe possibilities; exclusive groups prevent treating
  alternatives as a simultaneous configured composition.
- Keep source findings and human decisions separately referenced. Conflicting
  targets remain conflicting even when a human prefers one.
- Retain only safe role/product identities, no settings or arbitrary extensions
  in the new profile. Prose/source sanitization remains a producer obligation.
- JSON first; old readers reject the new version. No implicit downgrade.
- The skill is standalone: it must neither call nor depend on the `n8r-surface`
  CLI. #51 implements installed output and #52 proves the installed journey.

## Review focus

Missing evidence must not become absence; conflicting targets must not collapse;
external digest/reference drift must fail; changed target must preserve the binding
slot identity without rewriting history; malformed inputs must not echo values.
Tests in task 1 cover each of these boundaries.

## Task 1: Contract and synthetic verification

Files: `src/contracts.ts`, `src/validate.ts`, `src/codec.ts`, `src/revisions.ts`,
`tests/descriptions.test.mjs`, `examples/researcher/descriptions/`.

Interfaces: existing `validateArtefact`, `encode`, `decode`, `verifyReferences`,
`verifySuccessor`; new exported `CapabilitySurface` and `BoundSurface` types.

- [x] Add synthetic sanitized source/research, capability, bound and successor
  fixtures. Assert possible/configured/unknown/conflicting distinctions, exclusive
  options, decision separation, exact references, identity, privacy and JSON reuse.
- [x] Build and run the new tests; confirm rejection of unsupported `0.2`.
- [x] Implement closed shapes, local/external checks and successor invariants.
  Reject YAML for `0.2`; keep existing `0.1` behavior.
- [x] Run `npm test`; expect all tests passing. Inspect fixtures and saved bytes.
- [x] Commit only the contract, fixtures and their checks.

## Task 2: Documentation, review and publication

Files: `docs/n8r-surface/surface-description-contract.md`,
`docs/n8r-surface/surface-descriptions.md`, `docs/n8r-surface/contracts.md`,
`spec/README.md`, `examples/researcher/README.md`, this plan.

Interfaces: document the task 1 APIs, fields and compatibility limits.

- [x] Document shapes, evidence meaning, revision rules, privacy limits and the
  short human fixture-inspection task list with runnable technical readback.
- [x] Record baseline: on 8 November 2026 installed skill 0.1.9 explicitly excludes
  validated HTML/JSON. CLI availability is irrelevant to the standalone skill.
  Installed generation is
  blocked on #51, not a failed AI investigation or a passing acceptance rehearsal.
- [x] Run package smoke, Markdown lint, offline links, citation validation, Python
  fixture checks and whitespace checks. Exercise documented fixture readback.
- [x] Review the final diff and obtain a fresh code review; address material gaps.
- [x] Commit, verify publication identity, push and update draft PR #53 and #50.
  Leave #50 WIP pending merge, #51/#52 Planned; no human acceptance claim.

## Execution record

Authorization to implement #50 is carried forward from the continuation request;
no additional planning approval is needed. Implementation choices above are the
builder's choices within the approved intent.

Contract tests first failed on unsupported `0.2`, then passed. Additional regressions
reproduced a portable-parser diagnostic echo and an omitted contradictory finding;
both were fixed before publication. A fresh review found the latter material gap
and no other material defect. Minor deferred coverage: explicit scoped-capability
absence test (the validation rule is implemented; the main delivery states are
covered). Installed generation and human acceptance remain unproved.

Implementation choices: the binding ID denotes an instance/capability slot, allowing
its target to change across revisions; `0.2` extensions are empty and configured
multi-target/unbound slots are outside this bounded increment. These reduce scope
at the cost of requiring future versioned expansion for those cases.

Verification: Node.js 26.13.0 on macOS; `npm test` passed 179 tests;
`npm run check:package` passed installed-library and existing offline terminal
checks; Markdownlint 0.24.0 passed 84 files; lychee 0.24.2 found zero local
link/fragment errors; cffconvert 2.0.0 validated metadata; Python passed 24 tests.
The documented fixture readback returned `configured, conflicting, unknown`,
`urn:target:atlas`, then `urn:target:mongodb`, with exit 0 and no file changes.
Local Node.js 22/24 checks were not repeated; no distribution tooling changed.
