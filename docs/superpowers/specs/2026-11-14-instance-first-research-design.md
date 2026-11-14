# Instance-first research through the host harness

Approved by the maintainer on 14 November 2026; partial increment of issue #76.
The deliverable is improved n8r-surface Researcher guidance, not a one-off system
report. Labs integration remains paused.

## Outcome and boundary

Given an identified running system and permitted sources, a user asks Researcher
to explain the composition and save a useful Surface. Codex/ChatGPT supplies
available tools for remote repositories, documents, URLs and live observations.
The skill guides their use; it grants no access, supplies no credentials and
assumes no particular connector or shell. Missing access leaves useful partial
research. Source-only requests remain useful without a running system.

Start from the selected instance and follow relevant bindings beyond the first
repository. Preserve source identity, scope, evidence time and uncertainty.
Distinguish source support, configured selection, running components, reachable
endpoints and exercised connections. A mounted file is not necessarily loaded
code; HTTP GET alone does not establish that an operation has no side effects.
On revisit, distinguish target changes, newly learned facts, unchanged checked
facts, lost coverage and conflicts. Preserve predecessors and stable identities.

Use CycloneDX 1.7 Surface profile 1 and the existing bundled save/read helper.
No new schema, collector, network dependency, deployment action, test prompt,
credential extraction, Labs integration or release is included.

## Approaches

- **Chosen:** focused host-neutral guidance with realistic behavioral checks.
  Builds on working host access and existing artifact semantics.
- A Docker-specific collector would automate one environment but introduce an
  access/runtime surface before a demonstrated need; defer it.
- A new observed-artifact format would duplicate existing per-edge observations;
  no demonstrated representation gap justifies it.

## Verification

Retain the installed 0.1.14 rehearsal privately as baseline, including its
inherited development context. Evaluate synthetic mixed-source and revisit cases
before and after the guidance change. Install a separate candidate, invoke its
skill against the permitted live target, save and independently read back its
BOM, generated views, evidence and predecessor bytes. Do not supply prewritten
findings to the investigating agent. Report missing access and unexercised paths;
agent rehearsal is not human acceptance or a security verdict.
