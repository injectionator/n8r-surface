# Workspace verification status

Issue [#41](https://github.com/injectionator/n8r-surface/issues/41) adds identity
and safeguards to expected README-based baseline behavior. Code/test success is
not closure: installed-product rehearsal and initial PM acceptance remain required.

## Installed 0.1.8 baseline — 8 November 2026

Two separate local desktop chats exercised setup and readiness. The installed
plugin's files matched source commit `3effc41bf7e8466651722b7b4c64035f862b1901`;
exact installation provenance was unknown. SKILL.md SHA-256:
`cd38dcd85f67ca962f06d86178009308aea527c9783fa0e0a3f834f783f1ebf4`.
Host version was 26.1023.51421, build 22530. The PM reported GPT-6 Astra medium;
the chat API did not independently expose the per-run model.

Create took one turn and about 36 seconds. It created README and a research
placeholder, with no identity record or research. PM feedback: “No problems.”
Fresh-chat readiness took one turn and about 30 seconds, recovered saved purpose,
accurately stated that no findings existed and offered useful next actions without
research. No separate reopen satisfaction rating was supplied. Content bytes were
unchanged; a host Git checkpoint subtree appeared. The destination already had
`.git` at its first product listing, so a strictly empty initial state is unproved.

The future identity contract was absent, as expected in 0.1.8, not a regression.
Outcome against that new contract was not met; useful interaction and saved-context
continuation were observed strengths. Other baseline scenarios were untested.
Fresh chats were observed, but enforced denial of history/filesystem access was
not established. Private transcripts and machine paths are retained outside this
public repository; this summary contains only sanitized observations.

## Candidate 0.1.9

Source changes implement the helper and skill guidance. The exact committed
candidate, installation receipts and checks are recorded below as they occur.
No PM product acceptance, merge or release is claimed. Normal installation was
subsequently replaced with explicit PM authorization, as recorded below. CLI/Labs workspace integration and other hosts remain unverified.

## Scenario and evidence mapping

| Canonical scenario | Deterministic supporting evidence | Product/experience evidence |
| --- | --- | --- |
| Create; missing/empty | `tests/workspace.test.mjs`: actual files, record readback and no scaffolds | Candidate create passed; missing destination pending |
| Repeat with note | Same suite: byte-preserving reuse and unknown fields | Candidate PM repeat passed; independent hashes unchanged |
| Fresh reopen; moved identity | Same suite: separate process and moved folder inspection | Candidate fresh-chat reopen passed after destination clarification; move trial pending |
| Adoption question and both choices | Same suite: no-write refusal, in-place and alternative destination | Candidate PM pending |
| Malformed/conflicting/unsupported | Same suite: complete before/after snapshots | Candidate PM pending |
| Interrupted setup | Same suite: publication failure and no-overwrite guard | Technical evidence only |
| Installed helper availability | Same suite: copied helper with no checkout dependencies; package smoke | Installed-skill invocation pending |

Run `node --test tests/workspace.test.mjs` or the full `npm test` from the repo
root. These tests own temporary folders and remove them. Publication failure is
injected at the filesystem boundary; this is not a real machine crash trial.
The [human checklist and rubric](workspace-human-check.md) retain exact prompts,
readback, ownership and separate outcome/experience reports. All canonical
Gherkin is in [the feature file](../../tests/acceptance/skill-workspace.feature).

## Implementation checks

On macOS with Node.js 26.13.0, the full `npm test` passed 139 tests, including
nine workspace checks. `npm run check:package` passed both legacy archive names
and their offline installed-command rehearsals. The expanded installed helper/terminal checks passed on Node 22.23.4, 24.22.2
and 26.13.0 for both legacy archive names. The full 139-test suite also passed
on Node 22 and 24. An initial parallel matrix run collided on the existing
`dist/obsolete-candidate-check.js` fixture in two Node 24 distribution tests;
the serial rerun passed. No product fix was required for that orchestration error.
Markdownlint 0.24.0, lychee 0.24.2 offline links/fragments, cffconvert 2.0.0,
Python fixture/workflow tests (24), shell syntax and skill frontmatter validation
passed. A fresh independent code review found no actionable findings and reran
the nine helper tests. These are technical checks, not PM acceptance.

The initial helper test failed because it was absent; eight behavioral checks
then failed against placeholder exports before implementation. The first full
implementation exposed a macOS temporary-directory alias in executable detection;
using the real script path fixed the copied-helper check. Failed test output remains in the implementation chat evidence. No fixture was silently repaired to claim a product pass.

## Identified installed candidate — 8 November 2026

Candidate commit: `3cb08f59a4a932121bdd1c742fbac724d12a6d74`, plugin `0.1.9`,
[draft PR #42](https://github.com/injectionator/n8r-surface/pull/42).
Codex CLI 0.166.0 fetched this exact commit through the Git repository marketplace.
Clean installation and upgrade from baseline `3effc41` were exercised in separate
isolated homes. Every one of the 14 plugin files matched the committed source by
relative filename and SHA-256. Both manifests and the installed list reported
`0.1.9`, enabled. A synthetic workspace outside the installations remained
byte-for-byte unchanged. The normal registration/configuration and baseline
plugin bytes were unchanged during these isolated trials.

The PM then explicitly authorized switching the normal installation to this
pinned candidate. Its original registration details were retained privately;
marketplace removal, pinned registration and plugin installation all exited 0.
The normal installed entry is enabled `0.1.9`, and all 14 files again match the
candidate. This is installed-byte evidence; desktop fresh-chat loading was pending at installation; the create trial below now verifies it.

SKILL.md SHA-256: `91abc353f4e0dea663a81decd5eaba6d72470c32b432b904e684c1a3b1092b3b`.
Complete file-map SHA-256: `de5d16d92f714f2f8ea900266078db8e113f6116d78ee4c98e68dcab8a696180`
(sorted relative-path → SHA-256 JSON, compact separators, UTF-8). The full map,
Git/CLI receipts, original registration, test logs and retained baseline evidence
are stored in the private task inventory, outside tracked files.

Prepared PM fixtures contain only empty destinations or explicit synthetic
adoption/refusal inputs. No successful workspace was seeded in the create fixture.
They are deliberately retained; the create fixture has now been exercised, as recorded below. Product chats have not been created by
the implementation agent. The PM must exercise create → repeat → fresh reopen and
the remaining cases using the [walkthrough](workspace-human-check.md), then return
conversation references and separate outcome/experience judgments. The full create/repeat/reopen journey and first-increment acceptance remain pending;
installation and automated checks do not establish them. No merge or release.

## PM create trial — 8 November 2026

**Outcome: Pass for the observed create operation. Experience: Pass.** The PM
reported “Worked fine.” One fresh product chat completed in one turn (18.978
seconds) without questions or technical rescue. Its tool receipts show reads of
the installed `0.1.9` skill and workspace reference, then the installed helper's
`setup` invocation with the supplied destination and purpose; exit 0. The helper
path was in the installed plugin cache, not the developer checkout. All 14
installed file hashes still match the identified candidate.

The prepared destination was empty before the trial. Independent readback found
only `.n8r/workspace.json`, with exact format `n8r.workspace/1`, a valid generated
UUID v4, folder-derived nonempty name and supplied purpose. All pre-existing
fixture entries and file hashes were unchanged. The final response linked the
actual workspace, identified format/ID and purpose, accurately separated app
attachment, and offered a next research action without starting it. The visible
tool trace contains no source fetch, credential request or global-setting write.
A complete global-settings before/after snapshot was not collected for this trial.

| Experience criterion | Verdict and observed evidence |
| --- | --- |
| Orientation | Pass: final response links location and identifies completion and next action. |
| Necessary questions | Pass: no repeated authorization or unnecessary setup questions. |
| User effort | Pass: one prompt, no schema choice, manual setup or technical rescue. |
| Honest boundaries | Pass: completion matches independent files; attachment explicitly separate. |
| Scope | Pass: setup only; no research in the tool trace or saved output. |

This verifies loaded installed bytes and the create interaction, not the complete
issue. The chat's working directory was an existing user folder while the prompt
explicitly selected the separate empty destination; the requested boundary was
honored. A separate chat does not prove enforced history/filesystem isolation.
Host/model were not independently remeasured for this trial. Private chat receipts,
full metadata, hashes and PM feedback are retained in the task evidence inventory;
no raw transcript or machine path is published here.

After create readback, the coordinator added the documented synthetic user note
exclusively and captured a new before-inventory for repeat setup. That preparation
is distinct from product output. Repeat, fresh reopen, move, missing destination,
both adoption choices and refusal product trials remain pending. No repair,
cleanup, merge or release occurred.

## PM repeat-setup trial — 8 November 2026

**Outcome: Pass. Experience: Pass.** The PM reported “Looks good.” In the same
product chat, the user selected the installed Researcher and asked to set up the
same workspace again. One turn completed in 10.978 seconds. The tool receipt
shows the installed `0.1.9` helper invoked against the original destination;
exit 0. No repeated confirmation or technical rescue was required.

The response recognized the same saved ID, format, name and purpose, linked the
workspace, and kept research and app attachment separate. Independent comparison
against the inventory captured after synthetic-note preparation found exact
agreement: no added/deleted entries and no changed file hashes, including both
identity metadata and the note. This verifies preservation, not merely an
assistant statement that files were unchanged.

All five experience criteria pass for this turn: clear orientation, no unnecessary
questions, no user repair burden, accurate completion/attachment statements and
setup-only scope. The private evidence inventory retains the full tool receipt,
before/after hashes and PM judgment. A read-only snapshot has been retained for
the next fresh-chat reopen trial. Reopen, move, missing destination, adoption and
refusal product trials remain pending; the issue and PR remain open/draft.

## Additional same-chat readiness check — 8 November 2026

The user supplied a readiness response matching the saved identity and purpose.
Its actual tool receipt belongs to the original setup chat, so this does **not**
exercise fresh-chat reopen. Retain it as a successful read-only readiness check;
the fresh-session scenario remains pending, not a product failure.

One turn completed in 12.477 seconds. The installed `0.1.9` helper ran `inspect`
against the selected workspace and exited 0. Independent full inventory/hash
comparison found no changes to metadata or the synthetic note. The response
identified readiness, accurately separated attachment and offered a next action
without research. Visible experience criteria were met; no separate PM satisfaction
rating was supplied for this turn. The private receipt and verdict retain the
same-chat limitation explicitly. No repair or fixture reset was performed.

## Fresh-chat attempt without the target location — 8 November 2026

A distinct product chat received the readiness question without the prepared
workspace path. Its current folder was the earlier user-selected baseline folder,
not the candidate workspace. The installed `0.1.9` skill/reference were loaded;
the helper inspected that current folder and returned exit 3 (nonempty,
unrecognized). The assistant reported that state and asked for a destination
choice. No mutation command appears in the receipt.

Fresh reopen is **Blocked for this attempt: the intended workspace was not made
available as the selected target**. This is not evidence that the saved identity
could not be recognized. Independent readback confirms the actual candidate
workspace and synthetic note remain byte-for-byte unchanged. The 21.996-second
trial and missing-location precondition are retained privately rather than
silently relabeled as a pass. No fixture repair or product change was made.
The new chat can receive the explicit target and perform read-only recognition;
creation in the unrelated current folder is not needed for this scenario.

## Fresh-chat reopen after destination clarification — 8 November 2026

**Outcome: Pass for fresh-chat recognition with the explicit destination.** In the
separate readiness chat, the user supplied the saved workspace path and requested
inspection without initialization. No setup conversation or expected identity was
supplied. The installed `0.1.9` helper ran `inspect` on that exact destination;
exit 0. This turn took 12.697 seconds. The earlier missing-location attempt remains
part of the trial evidence; this was not a successful first-turn reopen.

The response recovered the original ID, format, name and purpose from the saved
workspace. It offered a useful next research action while distinguishing readiness
from source access, prior findings and app attachment. Independent complete
inventory/hash comparison confirms unchanged metadata and synthetic note, with
no added/deleted entries. No initialization, research or technical repair occurred.
The visible experience criteria were met after destination clarification; the PM
supplied the response but no separate satisfaction rating for this turn.

The create → repeat → fresh-chat recognition path now has installed-helper tool
evidence and independent state readback. A distinct chat is observed; enforced
denial of broader history/filesystem access remains unproved. Host/model limits
remain as recorded above. This does not complete issue #41: moved-folder identity,
missing destination, both adoption choices and malformed/conflicting/unsupported
product refusal trials are still pending, as is overall PM acceptance. Automated
coverage for those cases is supporting evidence, not a substitute. PR remains
draft; no merge, release or cleanup.
