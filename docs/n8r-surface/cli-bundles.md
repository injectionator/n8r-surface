# CLI Capability and Bound bundles

The CLI candidate uses the same checked artifact machinery as Researcher skill
0.1.11. New research can stage `n8r.surface/0.3` Capability or Bound bundles.
`/save surface` saves the preview's brief, research HTML, Surface JSON, pinned
dependencies and manifest in the next numbered directory. Reopening either
`research.html` or `surface.json` reads and checks the complete bundle.

Existing `n8r.surface/0.1` pairs remain readable and can be revised in their
original format. There is no automatic migration. A Capability and a Bound
Surface are separate identities; continue a saved description in its original
kind. Start a new discovery for a different kind. The CLI can also reopen a
standalone skill bundle. Such a bundle has no CLI runner receipt; historical
source references are rechecked rather than assigned invented runner provenance.

The runner receives bundled schema examples as synthetic shapes, not findings.
It computes canonical artifact hashes through a read-only host tool, then stages
a complete bundle. The host checks current and dependency research sources
against actual reads or saved evidence. Validation does not establish research
accuracy, complete secret detection, runtime use or consumer compatibility.
Use permitted sources or sanitized configuration summaries; do not supply secrets.

## Human verification

Prerequisites: the installed candidate, Node.js 22/24/26, Codex CLI 0.166.0 signed
in with ChatGPT, and a configured vault. Use the existing
[installation and setup guide](getting-started.md). Use the supplied
[Lumen guide](../../examples/researcher/sources/lumen-guide.md), copied into a
separate source directory. Keep that source outside the vault output directory.
These steps send the selected source and messages to OpenAI after confirmation.

- From the source directory, run `n8r-surface discover .`. Confirm research.
  Send: “Research the supplied guide and create a Capability Surface distinguishing
  supported possibilities from configured selections. My decision is to defer
  runtime verification.” Expect actual source reads and a Capability preview,
  with that human decision separate from source claims.
- Enter `/save surface`, then `/exit`. Expect exit 0 and actual saved file paths.
  Open the brief, HTML and JSON. Expect contract `n8r.surface/0.3`, kind
  `capability`, source evidence and unverified runtime use. The directory also
  contains `dependencies.json` and `manifest.json`.
- Run `n8r-surface reopen /SAVED/surface.json --source /SOURCE`, replacing the
  two paths with the actual saved file and source directory. Confirm research.
  Send: “Keep my runtime-verification deferral. Add my decision to defer external
  OIDC investigation because model-service configuration is the priority.
  Preserve source claims and identities. Prepare the successor Capability
  Surface with that dated human decision, keeping runtime unverified.”
- Enter `/save surface`, then `/exit`. Expect exit 0, a new numbered directory,
  both decisions in the successor and the original files unchanged. Open both
  briefs and the successor JSON; its parent identifies the earlier revision.

Return **Pass / Fail / Blocked**, the installed version, saved file links and
any error. Generated prose, IDs and dates may vary. Missing saves, invented
configuration, lost decisions, changed predecessors or success after a validation
failure are Fail. Missing runtime or sign-in is Blocked. Preserve the source,
settings and saved work; no cleanup is required.

## Maintainer evidence

At baseline `5eed2ac`, the installed CLI completed the first interaction but
saved `n8r.surface/0.1`. Candidate regression checks cover shared-helper readback,
fresh-store successors, dependency corruption, lost decisions, standalone skill
reopening and legacy pairs. Real-run evidence is recorded with the implementing
PR; automated checks are not human acceptance or publication evidence.

On 8 November 2026 an installed development tarball based on `5eed2ac` (dirty)
completed the exact two-session task above with Node 26.13.0, Codex 0.166.0 and
`gpt-6-astra` using ChatGPT sign-in. Both processes exited 0. Independent helper
readback verified Capability kind, exact research/Surface parents, retained
component IDs and runtime deferral, added OIDC deferral and pinned dependencies.
Source, settings and every predecessor file remained unchanged. Tarball SHA-256:
`0a4cc51d39327dfab67e186516f9eef1a01efcb1369c7ae35a9cb843e62c458f`.
This is an agent rehearsal, not a new human acceptance or registry release.
Subsequent changes broadened dependency-source checks and preserved optional
runner/note receipts; final candidate verification must identify its own bytes.
