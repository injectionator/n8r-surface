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

Maintainer preparation: install the candidate in the tester's active Node
installation, confirm Codex sign-in/model access and vault setup, and open the
terminal in the existing prepared Lumen source directory. Do not ask the tester
to build packages or find paths. The checks below send that source to OpenAI
after confirmation. See [using the command](getting-started.md).

- [ ] Run `n8r-surface`. At `You>`, enter: “Research the AI connections in this
  guide. Keep unknown configuration and runtime use explicit. My decision is to
  defer runtime verification.” Confirm research. Expect findings based on the
  guide and the recorded decision. Ask a follow-up question in your own words;
  the conversation should let you explore freely.
- [ ] Type `save`. Open the brief or HTML at the returned path. Expect a useful
  explanation of the connections, source evidence, unknowns and your decision.
  Type `exit` when you want to leave. No separate Surface-preparation command is
  required; saving does not end the conversation.
- [ ] Run `n8r-surface` again and select the saved title by its number. Expect
  the previous research and decision to return without copying a file path.
  Say: “Keep my runtime-verification deferral. Add my decision to defer external
  OIDC investigation because model-service configuration is the priority.”
  Then type `save`. Expect a new saved result with both decisions; the previous
  result remains available and unchanged. Type `exit` to leave (exit 0).
- [ ] Report **Pass / Fail / Blocked** and any point where the experience was
  confusing or the result was wrong, with the saved links. Wording and filenames
  can vary. Missing saves, lost decisions or overwritten files fail. Missing
  installation or sign-in is blocked. Keep the saved work; no cleanup is needed.

Maintainer evidence checks cover exact parent digests, preserved source/settings
bytes, dependency validation and the local recent-work index. They do not replace
the user's judgment of the conversation and result.

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
