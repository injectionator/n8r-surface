# Skill CycloneDX implementation plan

> **For agentic workers:** Use superpowers:executing-plans inline. The user authorized implementation on 13 November; retain developer and installed-user evidence separately.

**Goal:** Skill 0.1.12 researches a multi-component Surface and saves a bounded CycloneDX 1.7 exchange beside existing checked records, with a working user manual.

**Architecture:** Preserve native bundles. A standalone bundled exporter consumes a checked bundle plus an explicit node/dependency mapping, validates against pinned CycloneDX schemas, saves an immutable exchange with native evidence snapshot and loss report, and reads it back. The host performs source research; helpers never inspect sources or run services.

**Tech Stack:** TypeScript, Node 22/24/26, esbuild, pinned development-time JSON Schema validator bundled into the standalone helper; offline tests. Independent CycloneDX Python Library consumer in an isolated verification environment.

**Spec:** [Issue #68](https://github.com/injectionator/n8r-surface/issues/68) and the user-approved alongside-records scope; [mapping](../../n8r-surface/skill-cyclonedx.md).

## Global constraints

- Work in this checkout on `feat/68-skill-cyclonedx`; no worktrees or sibling edits.
- Existing Capability/Bound contracts and saved bytes remain unchanged.
- CycloneDX is an exchange view, not a migration or a claim of running state.
- Public fixtures are synthetic; private sources/results stay in the selected vault.
- Installed research must produce its own findings, never developer-prewritten findings.
- Scope excludes CLI product commands, npm release, attacks, deployment and Labs implementation.

## Review focus

- Unknown/conflicting bindings cannot become concrete dependencies (Task 2).
- Type mappings cannot silently omit nodes or substitute role targets (Task 2).
- Changed native snapshots, mappings or exchange bytes must fail readback (Task 2).
- Successor export must retain lineage and leave previous bytes unchanged (Task 2).
- Source/instance/model mismatch must remain visible in actual user output (Task 3).

## Task 1: sources, mapping and baseline

Files: create `docs/n8r-surface/skill-cyclonedx.md` and `skill-manual.md`; private source pack and runner receipts in the selected vault.

- [x] Recover only selected component sources and sanitized historical configuration context; record hashes and access limits.
- [x] Invoke installed 0.1.11 for the requested exchange; record unavailable capability or actual result before implementation.
- [x] Pin schema revision/licensing and settle explicit classifications, dependency projection, identity, evidence snapshot and loss reporting.
- [x] Record State X / Input Y / Outcome Z and a short user walkthrough.

## Task 2: checked immutable exchange

Files: create `src/skill-cyclonedx.ts`, schema assets and `tests/skill-cyclonedx.test.mjs`; modify `scripts/build-skill.mjs` and dependency/notice metadata.

Interfaces: `projectBundle(bundle, mapping, previous?)` returns `{bom, report}`; `saveExchange(bundleDirectory, mapping, destination, previous?)` and `readExchange(directory)` retain/read checked exchange. Helper operations: `export BUNDLE_DIR MAPPING.json NEW_DIR [PREVIOUS_EXPORT]`, `read DIR`, `help`.

- [x] Write behavioral tests for node/service/model distinctions, configured targets, excluded possibility/conflict, invalid/missing classifications and invalid schema input; run and observe expected failures.
- [x] Implement pinned schema validation and deterministic projection with explicit loss report. Preserve full native records in the exchange snapshot; do not inject unsupported relationship semantics into CycloneDX dependencies.
- [x] Add failing persistence tests: tampering, destination overwrite, predecessor mismatch and successor identity/version preservation; implement exclusive save/readback.
- [x] Run focused and full suites; rebuild and check exact standalone helper bytes.
- [x] Commit and open one issue-linked draft PR after the first reviewable increment/checks.

## Task 3: installed skill and working manual

Files: modify distributed skill/references/manifests to 0.1.12, documentation and verification record; no schema migration.

- [x] Add the positive CycloneDX workflow recipe addressing the recorded baseline gap; preserve accepted native behavior.
- [x] Install exact candidate into an isolated host home and verify all distributed bytes.
- [x] Exercise multi-component research, native save, exchange, correction and fresh-session reopen through the actual installed skill. Independently verify source claims, native/exchange outputs and prior hashes.
- [x] Run a pinned independent consumer: inventory and concrete dependency lookup; record unsupported meanings and limits.
- [x] Grow the manual from observed prompts, outputs and recovery points; keep maintainer preparation separate from user steps.
- [x] Run appropriate Node, package, skill, Markdown, link, fixture and citation checks; fresh whole-branch review; inspect public diff for sensitive material.
- [x] Prepare exact ZIP/digests and installation handoff; keep PR draft and distinguish candidate readiness, human acceptance, merge and publication.

## Outcome

See [actual verification and human steps](../../n8r-surface/skill-cyclonedx-verification.md).
The installed candidate completed research and a fresh-session correction; public
exchange examples remain synthetic. Draft PR #69 is not merged or released.
