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

## Installed candidate readback, 8 November 2026

Scoped candidate `0.1.0-experimental.3`, built from clean commit
`19ebdeee72b2b9f0719cce90a55900890827ef84`, was installed globally with lifecycle
scripts disabled. Archive SHA-256:
`8f34182c435632052e3e44f516cf5d0993d7f50e7af76eaeacb8fd8bfa9db842`.
`--version` returned .3; normal startup reused the existing vault without setup
changes. The exact installed command reopened the previous Capability, retained
both deferrals, added a requested callback-investigation deferral and saved a
successor (exit 0). Independent readback through the installed helper confirmed
both exact parent digests, retained decisions and component identities, and all
prior source/settings/output files unchanged. Codex 0.166.0, ChatGPT sign-in,
gpt-6-astra and Node 26.13.0 were used. The full suite (206 tests) and installed
package/terminal checks passed on Node 22.23.2, 24.22.2 and 26.13.0.

This is an installed agent rehearsal. Public npm publication, human acceptance
of the CLI and Labs compatibility are not claimed. Later documentation alignment
does not change the installed candidate's recorded code revision or archive.

## Open conversation and return, 9 November 2026

The new interactive entry point accepts a research question immediately. It uses
the current folder unless the user selects another source. Questions and
corrections do not require preparing a Surface first. Plain `save` can prepare
and persist the current result; later startup offers the saved title and remembers
its source/model. Source conflicts keep the question available for correction.
A recent-index failure reports the saved paths and preserves the saved result.

An installed live run exercised bare startup → research question → unrelated
follow-up about authentication → `save the result` → `exit`, then a fresh bare
startup → select title by number → add a decision → `save` → `exit`. Both
processes exited 0. Independent helper readback confirmed exact parent references,
retained component identities and the runtime-verification deferral, plus the
new OIDC-investigation deferral. Source, settings and predecessor bytes stayed
unchanged; the recent-work entry advanced to the successor. This used Codex
0.166.0, its configured gpt-6-astra model, ChatGPT sign-in and Node 26.13.0.

The first live attempt exposed a conflicting old instruction requiring another
save command. It saved the initial result but did not save a successor; that run
is retained as failed evidence. The host now explicitly authorizes Surface
staging during a plain-language save request. The repeated full journey passed.

The successful rehearsal archive was built from a working checkout before the
version bump (package version .2), SHA-256:
`7c6b07625295dcde330b8b0a3740cb04d8e5d666e134f72002f159154d9cfdd1`.
Every runtime file and bundled instruction was independently compared with the
clean .4 candidate from `1b3082d143a2829dc62624de3859ac25b5a41d42`; all bytes
matched. The .4 scoped archive SHA-256 is
`cf19b37c89a20bad6237ded40779b7f0d9436e36b61ed089fc2d5852d398ff83`.
That archive is installed in the user's Node 22/24/26 environments. The installed
Node 22 command was also opened normally and reached the free `You>` prompt;
`exit` returned 0. No Node-default switch or settings migration was performed.

208 tests pass on Node 22.23.2, 24.22.2 and 26.13.0. The first Node 24 run had a
subprocess timeout in the existing occupied-vault startup check; its isolated
rerun and the full suite passed without a code change. Terminal regressions cover
new conversation, plain save, fresh startup selection, source correction and
index failure. This evidence remains agent rehearsal, not user acceptance,
public npm availability or Labs compatibility.
