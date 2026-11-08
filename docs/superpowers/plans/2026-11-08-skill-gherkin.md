# Installed skill Gherkin implementation plan

> Execute inline using superpowers:executing-plans. The user authorized the
> issue #43 scope and implementation in the existing checkout; no worktrees.

**Goal:** Run the first three canonical workspace scenarios against an identified
installed Researcher, with independent filesystem evidence.

**Architecture:** Cucumber executes the existing feature with three selection
tags. A small app-server adapter loads the installed skill via its documented
skill input. Create/repeat share one ephemeral thread; reopen uses a new process
and thread. A restricted permission profile denies transcript/evidence reads.

**Tech stack:** Node.js 22/24/26, Cucumber, Codex CLI 0.166.0.

**Spec:** [Issue #43](https://github.com/injectionator/n8r-surface/issues/43) and
[canonical scenarios](../../../tests/acceptance/skill-workspace.feature).

## Constraints and review focus

- No helper invocation by the harness, model grader, extra scenarios or live CI.
- Keep normal installation intact; compare every installed byte with a pinned
  revision before and after inference. Private receipts stay ignored.
- Fail closed on unavailable installation, authentication, permission profile,
  denied-history probe, unexpected host request, timeout or missing tool evidence.
- Never promote human experience judgments to automated passes. Report exact
  observable claims checked and leave semantic rubric review explicit.
- Preserve failed attempts; no automatic conversation repair or retries.

## Tasks

- [x] Add offline checker tests: wrong identity, changed note, extra file, missing
  helper receipt, incorrect response identity, and failed prerequisite handling.
  Run the tests red, then implement independent inventory/evidence assertions.
- [x] Add the bounded app-server adapter and Cucumber bindings. Select exactly
  three tagged scenarios, preserve their order, retain prompts/events/snapshots
  and per-scenario results. Limit each scenario to one user turn and 120 seconds.
- [x] Add one opt-in command and owned-fixture cleanup. Run twice with fresh
  destinations; retain raw evidence outside published files.
- [x] Document interface identity, failed probes, isolation controls, human rubric
  review and a repeatable tester task list. Run offline regression and repository
  checks; review the final diff for private material.
- [x] Commit, push and open a draft PR after the first reviewable slice. Keep the
  issue open for any incomplete acceptance and report pushed versus merged state.

## Interface findings before implementation

All 14 installed 0.1.9 files match revision
`3cb08f59a4a932121bdd1c742fbac724d12a6d74`. The first app-server probe loaded the
installed skill and selected its helper but Node failed on a denied system
OpenSSL configuration read; no workspace was created. A second fresh probe with
that runtime read permission created the expected identity metadata. A separate
sandbox command could read the installed skill but received EPERM reading both
retained setup transcript and summary. One intermediate permission-probe launch
failed because a nested config value was incorrectly serialized as JSON instead
of TOML. These are retained private attempts, not acceptance passes.

This establishes an interface candidate, not desktop behavior or full acceptance.
The complete runner must verify its own isolation and repeat/reopen outcomes.

## Completion record

Implementation commit `d9c99c4` has two clean committed-code live rehearsals.
All three automated checks pass in each; semantic human criteria remain pending.
Draft PR #44 retains issue #43 as related work. Failed attempts, raw evidence and
cleanup receipts remain private. A fresh reviewer identified isolation-error,
finalization and startup-deadline gaps; each was corrected and covered by offline
checks. No review findings remain outstanding. See the
[public evidence summary](../../n8r-surface/skill-workspace-automation.md#committed-code-repetitions).
