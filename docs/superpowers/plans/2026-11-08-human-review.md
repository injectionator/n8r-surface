# Human review implementation plan

> Execute inline with superpowers:executing-plans. The user authorized this
> bounded follow-up in the existing checkout. No worktrees.

**Goal:** Make the existing three-scenario run readable and record explicit human
verdicts against the exact retained evidence.

**Architecture:** One offline review module snapshots evidence hashes, renders a
Markdown report, verifies the snapshot and stores a separate immutable review
receipt. The existing runner dispatches report/review modes before any live host
work and generates a report only after final evidence capture. No dependencies.

**Spec:** [Issue #45](https://github.com/injectionator/n8r-surface/issues/45).

## Decisions and constraints

- `--report` generates a private `review.md` and `review-manifest.json` for retained
  evidence. Existing generated reports are verified, never silently replaced.
- `--review --run SHA256 --reviewer NAME --create Pass --repeat Pass --reopen Pass`
  records all three verdicts; optional `--comment TEXT` records context.
  Fail and Blocked are equally supported. No inferred approval or model grader.
- Evidence fingerprints include all regular files in the run directory except
  the three generated review files and the later cleanup receipt. Reject symlinks,
  nested entries and evidence changes. Bind report bytes too. This detects drift;
  it is not a signed or tamper-proof audit system.
- Preserve raw results. A human Pass cannot override automated failure, blocked
  prerequisites, missing required evidence or final preservation errors.
- A single receipt is non-overwriting; review corrections are outside this slice.
  Historical manual acceptance receipts remain intact and are not auto-imported.
- Reports quote recorded text as data in safe fenced blocks, including failed
  commands and unknown tool items. Missing sections are explicit.

## Tasks

- [x] Write offline tests for exact response/tool reporting, safe fences, evidence
  drift, wrong run IDs, missing files, blocked/failed runs, invalid/duplicate
  verdicts and unchanged raw evidence. Run red, implement the review module, green.
- [x] Add offline CLI modes and automatic report generation after live finalization.
  Test command-level report/review/usage outcomes without starting inference.
- [x] Rehearse report generation on the retained real run and a blocked run. Run
  one fresh installed-skill journey, inspect the report and record an explicitly
  labeled agent-review rehearsal. Preserve private evidence and exercise cleanup.
- [x] Update the runner guide and AGENTS.md command inventory. Run repository
  checks, request focused review, fix findings and push a matching draft PR.

## Review focus

Evidence/report changes cannot inherit approval. Unknown or failed tool activity
must remain visible. Missing metadata and failed final checks cannot appear as a
passing run. Verdicts must not mutate Cucumber output or prior reviews. Report and
review commands must not start inference or alter the installed skill.
