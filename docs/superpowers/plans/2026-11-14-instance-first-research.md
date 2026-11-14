# Instance-first Researcher Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation.
> Use independent agents for bounded behavioral evaluation and final review.

**Goal:** Improve the installed skill's user-led investigation of running compositions.

**Architecture:** The host harness supplies permitted access. A bundled reference
routes evidence collection and revisit reasoning into the existing Surface profile.
No new collector or artifact representation.

**Tech Stack:** Markdown skill guidance, existing Node.js 22/24/26 save/read helper.

**Spec:** [approved design](../specs/2026-11-14-instance-first-research-design.md).

## Global constraints

- Keep CycloneDX 1.7 Surface profile 1 and read-only research boundaries.
- Work in the existing issue #76 branch; no worktrees or deployment changes.
- Private operational evidence stays outside tracked files.
- Host access and installation differ; never infer access from a URL or skill load.

## Review focus

- Remote text without exact bytes must not acquire a fabricated source hash.
- Newer vendor docs must not establish older target behavior.
- A GET that starts work must not be used as passive inspection.
- Changed mounted files must not become claims about loaded process bytes.
- Newly accessible integrations and lost access must not become additions/removals.

## Task 1: Guidance and behavioral cases

**Files:** `plugins/n8r-surface/skills/research/SKILL.md`, its references
`instance-first.md`, `discovery-map.md`, `cyclonedx.md`; both plugin manifests.

**Consumes:** Approved design and private installed baseline.
**Produces:** Self-contained candidate 0.1.15 with unchanged profile/helper.

- [x] Evaluate current guidance on a synthetic mixed-source/revisit case; retain
  actual behavior, including successes, without inventing a failing baseline.
- [x] Add the focused reference and routing; preserve source-only behavior.
- [x] Clarify exact-byte versus projection identity and installed candidate version.
- [x] Repeat behavioral evaluation with candidate and compare actual results.

## Task 2: Rehearsal and delivery

**Files:** `docs/n8r-surface/instance-first-research.md`,
`docs/n8r-surface/command-outcomes.md`, `docs/n8r-surface/skill-manual.md`.

**Consumes:** Candidate instructions and existing helper.
**Produces:** Human task list and bounded, accurately attributed verification record.

- [x] Install candidate separately; record host/version and installed file hashes.
- [x] Invoke installed candidate for permitted live research and saved continuation;
  independently check evidence, views and predecessor bytes.
- [x] Add short human task list and mixed-source/revisit scenarios; distinguish
  agent outcomes, missing prerequisites and pending human acceptance.
- [x] Run Markdown, links, fixture checks, skill validation, npm tests/package check.
- [x] Review diff and sensitive-material boundary; commit, push and update existing
  draft PR. Keep issue WIP and PR draft; no merge or release.

## Completion evidence

Implementation: `7be51fb2b58e38aa252a4b9717781f28c065439c`; exact installed plugin
bytes verified against that commit. See the [rehearsal record](../../n8r-surface/instance-first-research.md#verification-record).
The live revisit exposed incomplete evidence links in a consolidated summary;
the focused instruction refinement and fresh-context successor corrected them.
Current profile/helper and target unchanged. Human acceptance remains pending;
this increment does not complete all of issue #76.
