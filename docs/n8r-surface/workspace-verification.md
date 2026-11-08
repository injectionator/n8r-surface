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
No PM product acceptance, merge, release or normal-installation replacement is
claimed. CLI/Labs workspace integration and other hosts remain unverified.

## Scenario and evidence mapping

| Canonical scenario | Deterministic supporting evidence | Product/experience evidence |
| --- | --- | --- |
| Create; missing/empty | `tests/workspace.test.mjs`: actual files, record readback and no scaffolds | Baseline above; candidate PM pending |
| Repeat with note | Same suite: byte-preserving reuse and unknown fields | Candidate PM pending |
| Fresh reopen; moved identity | Same suite: separate process and moved folder inspection | Baseline continuation above; candidate PM pending |
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
and their offline installed-command rehearsals. The workspace-specific installed
smoke check is also being repeated across supported Node majors.
Markdownlint 0.24.0, lychee 0.24.2 offline links/fragments, cffconvert 2.0.0,
Python fixture/workflow tests (24), shell syntax and skill frontmatter validation
passed. A fresh independent code review found no actionable findings and reran
the nine helper tests. These are technical checks, not PM acceptance.

The initial helper test failed because it was absent; eight behavioral checks
then failed against placeholder exports before implementation. The first full
implementation exposed a macOS temporary-directory alias in executable detection;
using the real script path fixed the copied-helper check. Failed test output remains in the implementation chat evidence. No fixture was silently repaired to claim a product pass.
