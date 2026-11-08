# Standalone Surface artifacts implementation plan

> **For agentic workers:** Use superpowers:executing-plans for inline execution.

**Goal:** Implement #51 through the installed skill without the product CLI.

**Architecture:** The host investigates authorized sources and prepares research
and Surface JSON. A bundled Node helper reuses the library validators, renderer
and successor checks, then saves an immutable, hashed directory and reads it back.
The helper never performs research or infers evidence.

**Tech Stack:** TypeScript, Node.js 22/24/26; bundled existing YAML codec dependency
for strict JSON decoding, with no runtime install or network access.

**Spec:** [Agreed delivery](../../n8r-surface/surface-descriptions.md) and
[0.3 contract](../../n8r-surface/surface-relationships.md).

## Global constraints

- Work in the existing checkout on the #51 branch; never use worktrees.
- Save only on user authorization; immutable predecessors and exact digests.
- Capability possibilities do not establish instance configuration.
- Configuration references contain names/locations, never setting values.
- Preserve conflicts, unknowns, human decisions and role/target distinctions.
- Earlier readers remain supported; no Observed Surface, release or deployment.

## Review focus

Malformed references, edited predecessors, occupied/symlink destinations,
sensitive data in errors, and lost decisions must fail without false success.
Contract validity cannot establish research accuracy or complete privacy.

## Task 1: Standalone helper

Files: `src/skill-artifacts.ts`, `scripts/build-skill.mjs`,
`plugins/n8r-surface/skills/research/scripts/artifacts.mjs`,
`tests/skill-artifacts.test.mjs`, package build configuration.

Interface: `checkBundle({research, surface, dependencies})`,
`saveBundle(bundle, destination, predecessor?)`, `readBundle(directory)`.
A bundle uses one current research record, a 0.3 Surface and pinned dependencies.
Readback returns the checked bundle; a manifest hashes every saved member.

- [x] Record installed baseline or prerequisite blocker.
- [x] Write and run failing tests for standalone generation/readback, Bound
  references, successors, collisions, tampering, privacy and safe errors.
- [x] Implement validation, brief rendering and exclusive directory persistence.
- [x] Bundle the library without the CLI; run focused tests from a detached copy.

## Task 2: Installed instructions and rehearsal

Files: skill/reference/plugin metadata, instruction digests/package checks,
`docs/n8r-surface/skill-surface-artifacts.md`, command outcome inventory.

- [x] Explain host research, sanitized intake, JSON shapes, checks, save and reopen.
- [x] Keep version/digests/bundled resources aligned and verify reproducible bundle.
- [x] Exercise generation and fresh-chat revision through installed Codex;
  independently read bytes and compare predecessors, sources and sentinels.
- [x] Record environment and exact evidence limits; separate #52 human acceptance.

## Task 3: Verification and draft PR

- [x] Run relevant tests, package check, lint, links, citation and fixture checks.
- [x] Review final diff and privacy; rehearse human task list.
- [x] Commit, push and open one draft PR. Report remaining work without merging.
