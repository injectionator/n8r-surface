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

## Revision: shared relationship structure

User verification identified that a generic `uses` edge does not answer why a
component connects, how it integrates or where configuration is defined. The user
approved a shared node/edge structure and explicit relationship metadata.

Use `n8r.surface/0.3` for the revised shape; retain `0.2` readers and fixtures.
Both descriptions have `nodes` and `relationships`. A relationship has stable
`id`, `from`, `to`, `type`, support `basis`, `conditions`, `note`, and independently
evidenced `purpose`, `integration` and `configuration` details. A Bound relationship
adds a `binding` annotation (configured/unknown/conflicting claims and decisions).
Its stable endpoints identify the integration roles; the annotation identifies
concrete targets without changing the relationship identity.

Details carry explicit knowledge states and sourced claims. Configuration claims
list owner component, mechanism, key and safe documented location, never actual
setting values. Each detail's source findings refer to that relationship ID and
property, preserving contradictory evidence. Bound descriptions repeat readable
metadata with their own exact evidence references and pin the Capability revision.

- [x] Add new synthetic `relationships/` examples and failing tests for both kinds,
  property-level provenance, safe config locations, conflicts, endpoint/type
  agreement, retained identities and closed shapes. Record the `0.2` baseline gap.
- [x] Implement `0.3` shared types and checks using existing codecs/revision helpers;
  retain all `0.1`/`0.2` tests. Run focused and full suites.
- [x] Update the contract, model guidance, examples and human inspection/readback.
  Rehearse the documented library interaction; installed skill remains blocked on
  #51's known missing artifact-production capability and must not depend on CLI.
- [x] Obtain fresh review, run package/docs/fixture checks, then commit and push
  this increment to draft PR #53. Update #50; no merge or human acceptance claim.

Revision evidence: the new tests first failed on unsupported `0.3`. The shared
shape/evidence checks then passed; successor tests exposed missing `0.3` identity
checks before their implementation. Fresh review found that detail conflicts
could not include an absent finding. A regression reproduced that rejection;
the correction retains known/absent assertions even when their values coincide
and rejects agreeing sources incorrectly labelled conflicting. `npm test` now
passes 186 tests. The documented readback returned the expected purpose, setting
owner/key/location and Atlas-to-MongoDB target change without file writes.

Package verification passed on Node.js 26.13.0, including installed shared-edge
metadata and binding readback. Markdownlint 0.24.0 passed 87 files; lychee 0.24.2
reported zero local-link errors; cffconvert 2.0.0 validated citation metadata;
Python passed 24 fixture/tooling tests. Earlier `0.2` fixtures remain unchanged.
No installed-skill acceptance, merge or release is claimed.
