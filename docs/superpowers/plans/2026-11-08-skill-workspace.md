# Skill workspace implementation plan

> Execute inline using superpowers:executing-plans. The accepted issue authorizes
> implementation; use the existing checkout, never a worktree.

**Goal:** Let the installed Researcher create, safely repeat and recognize a
standalone workspace before research.

**Architecture:** One bundled, dependency-free JavaScript module owns validation
and filesystem behavior. The existing skill calls it and translates its result
into a short interaction. Future consumers import the same module.

**Tech stack:** Node.js 22, 24 or 26; existing Node test runner; Markdown and manual
Gherkin. No evaluation framework or new runtime dependencies.

**Spec:** [Accepted issue #41](https://github.com/injectionator/n8r-surface/issues/41).

## Constraints and review focus

- Only `.n8r/workspace.json` is initially created; `n8r.workspace/1`, UUID v4,
  nonempty name, optional purpose, unknown fields preserved.
- No implicit research, vault setup, app attachment or repair. Reuse is read-only.
- Nonempty unrecognized folders require a choice; malformed, unsupported and
  conflicting metadata cause no writes.
- Check symlinks/nonregular metadata, interrupted writes, unknown fields,
  Unicode/spaced paths and invalid options before side effects.
- Concurrent writers and hostile filesystem mutation are outside this slice.
- Source, installed bytes, PM acceptance, merge and release remain separate.

## Task 1: Shared workspace behavior

Files: `plugins/n8r-surface/skills/research/scripts/workspace.mjs`,
`tests/workspace.test.mjs`.

Interfaces: `inspectWorkspace(directory)` returns a status and optional record;
`setupWorkspace(directory, {name, purpose, adopt})` returns the same shape with
`created` or `recognized` on success. Both report absolute destination and
specific limitations. `validateWorkspace(record)` classifies saved metadata.
A thin script interface accepts `inspect PATH` or `setup PATH` with optional
`--name`, `--purpose`, `--adopt`; structured results and documented exit codes.

- [x] Write tests for actual file outcomes, preservation and refusals, then run
  `node --test tests/workspace.test.mjs`; observe missing capability.
- [x] Implement validation and inspection, guarded initialization and atomic
  no-overwrite publication of a complete record.
- [x] Run focused checks, including interrupted publication, move/rename identity,
  and running a copied plugin helper without developer-checkout dependencies.

## Task 2: Skill and durable acceptance

Files: existing Researcher skill, bundled workspace reference, working-notes
reference, both manifests, workspace docs and
`tests/acceptance/skill-workspace.feature`.

- [x] Route setup/readiness to the helper before research instructions. Keep
  workspace-aware saving lazy and preserve existing non-workspace continuation.
- [x] Align plugin/skill version to `0.1.9`; keep npm version separate and verify
  marketplace still points at the one canonical plugin.
- [x] Retain accepted Gherkin, short PM walkthrough, fixture ownership/readback
  and separate outcome/experience rubric. Record baseline evidence accurately.
- [x] Run full tests, package smoke checks, Markdown/link/citation and fixture
  checks; inspect the task diff for sensitive material.

## Task 3: Reviewable candidate and delivery

- [x] Obtain a fresh whole-branch code review; resolve material findings and rerun
  affected checks. This review is not a product test chat or PM acceptance.
- [x] Verify publishing identity, commit task files, push the dedicated branch
  and create one draft PR with `Related to #41` and exact human interactions.
- [x] Prepare exact candidate bytes and isolated marketplace installation
  evidence without changing the normal plugin registration.
- [x] Hand the PM a fresh-chat walkthrough. Record actual candidate rehearsal
  only when performed in separate product chats; keep unrun scenarios pending.

## Execution record

- Baseline create/reopen already observed with installed 0.1.8: expected
  README-based setup and useful continuation; identity safeguards were absent.
  Other baseline scenarios were untested and are explicitly agreed new behavior.
- Branch starts at `3effc41bf7e8466651722b7b4c64035f862b1901` after fetch.
- Routine design decisions: use Node built-ins and a bundled ESM module; partial
  staging records never count as workspace identity. Preserve residual staging
  on interruption for separate recovery rather than guessing repair.

- Implementation commit: `3cb08f5`; draft PR #42. Full suites pass on Node 22/24/26,
  package matrix passes, independent review reports no actionable findings.
- Isolated clean/upgrade installations match all 14 source files. PM explicitly
  authorized normal installation replacement; pinned 0.1.9 bytes verified there.
  Fresh product-chat load and human acceptance remain pending.

- All planned installed-product scenario outcomes now pass with independent
  readback. Earlier same-chat/missing-location attempts remain explicit evidence.
  Overall PM acceptance and review readiness are separate and pending. Fixtures
  and private evidence are deliberately retained. CI checker-download failure is
  recorded separately from passing local links and product checks.
