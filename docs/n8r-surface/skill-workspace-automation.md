# Installed Researcher workspace acceptance

Issue [#43](https://github.com/injectionator/n8r-surface/issues/43) binds only the
first three [canonical scenarios](../../tests/acceptance/skill-workspace.feature)
to Cucumber: create, repeat setup and fresh-session reopen. The other scenarios
remain manual. Ordinary `npm test` is offline and never starts inference.

## Scope and interface

The runner uses **Codex CLI 0.166.0 app-server over stdio**, not the desktop UI
and not the standalone n8r command. It requires an enabled installed Researcher
**0.1.9**, byte-identical to source commit
`3cb08f59a4a932121bdd1c742fbac724d12a6d74`. The default installation is the normal
Codex plugin cache. `--installed PATH --revision FULL_COMMIT` can select another
already-installed, byte-verified 0.1.9 candidate. The runner never installs or
replaces a plugin. See the [installation procedure](workspace-installation.md).

The [documented skill input](https://developers.openai.com/codex/app-server#skills)
loads the discovered installed SKILL.md. The harness supplies only the selected
folder and scenario request. The model reads the skill reference and chooses the
installed helper invocation; the harness never invokes the helper or writes
workspace identity metadata. Its sole content write is the synthetic user note
between create and repeat.

One ephemeral thread holds create and repeat. Reopen starts another app-server
process and empty ephemeral thread, with no copied transcript, expected identity
or answer. The first process is closed; the second must fail to read the old
thread through `thread/read`. The
[permission profile](https://learn.chatgpt.com/docs/permissions) grants writes only
to the disposable workspace and reads to the installed plugin and runtime paths.
It denies access to retained evidence; a sandbox command checks allowed skill
reads and denied evidence reads before each session, including the actual setup
receipt before reopen. This technical probe never invokes the workspace helper.

Memories, project instructions, apps, configured MCP servers, browser/computer
access, remote control, multi-agent/history features and web search are disabled.
The normal sign-in is used by the host, never copied into fixtures or receipts.
Local commands receive a restricted environment. Command network access is off;
Codex authentication and model service traffic still need network access.

These controls establish the tested CLI boundary, not a general sandbox security
certification. Runtime paths remain readable. The Codex service processes the
conversation. No claim is made about desktop behavior, other hosts, or complete
system-wide file auditing.

## Run the three scenarios

Maintainer prerequisites: Node.js 22, 24 or 26; Git; `npm ci`; Codex CLI 0.166.0
signed in with ChatGPT; the identified plugin installed/enabled; a configured
available OpenAI model. The runner records the selected model and refuses a
provider fallback. A live run consumes account inference allowance and may incur
cost under the account's terms. It is opt-in and is not scheduled in CI.

From the repository root, on the branch under test:

```sh
npm run acceptance:skill -- --live --evidence .local/skill-acceptance/run-1
```

The evidence directory must not already exist. Create its parent first if needed:
`mkdir -p .local/skill-acceptance`. Keep it private and ignored. A second run uses
a new evidence directory and automatically creates a new disposable workspace:

```sh
npm run acceptance:skill -- --live --evidence .local/skill-acceptance/run-2
```

There are at most three user turns, one per scenario, each limited to 120 seconds,
and a 600-second suite limit. No simulated user, retries or automatic conversation
repair are used. A missing capability, unexpected host question or unanswered
setup question is a failure/blocker; dependent scenarios cannot pass.

The runner reports **automated** results separately from full Gherkin acceptance.
Independent checks compare the saved format, UUID, folder-derived name, supplied
purpose, complete entry lists, hashes and file timestamps. They compare helper
receipts and assistant identity/location claims with filesystem readback. This
detects changed-note and wrong-identity evidence without a model grader.

Semantic criteria, such as useful continuation, accurate attachment claims and
absence of unnecessary questions, remain **pending human review**. Each scenario
runs its automated checks before an After hook marks it pending. Cucumber's
passing intermediate steps are not full scenario acceptance. No pending criterion
is counted as passed by default.

Exit codes:

- **1:** at least one automated scenario or final installation check failed.
- **2:** blocked prerequisites, or automated checks passed but human review is
  pending. Inspect `results.json` and `blocked.json` to distinguish these cases.
- **0:** successful owned-fixture cleanup. Offline report and review modes have
  their own exit meanings below. A live run does not claim full human
  acceptance and therefore does not return 0 in this increment.

## Evidence and human verification

The evidence directory contains run/install identity once (`metadata.json`), raw
app-server requests/events, each turn, before/after inventories, final metadata,
Cucumber JSON and individual results with outstanding review criteria. Failed
attempts get their own directory; rerunning never overwrites them. Paths, model
responses and tool receipts are private: do not commit these files or paste raw
receipts into public issues/PRs. Review and sanitize any published summary.

Tester steps, after the maintainer has prepared the prerequisites above:

- [ ] Run the first command from the repository root. Expect three automated
  results and exit 2 when all automated checks pass with human review pending.
  An automated failure, skipped prerequisite or `blocked.json` is not a pass.
- [ ] Open `results.json`, `1-turn.json`, `2-turn.json` and `3-turn.json` in the
  selected private evidence directory. For each result, inspect the listed
  `reviewRequired` criteria against actual responses and tool activity.
  Expect creation only, recognition on repeat, and useful readiness orientation
  on reopen. No research, credentials request, attachment claim or repeated
  setup permission question should occur. Use the
  [existing experience rubric](workspace-human-check.md#independent-evidence-and-report).
- [ ] Open the inventory files and `final-record.json`. Expect only identity
  metadata after create, then that metadata plus the synthetic note, unchanged
  through repeat/reopen. Inspect `setup.jsonl` and `reopen.jsonl` for the installed
  helper path, denied-evidence probes and distinct empty ephemeral sessions.
- [ ] Run again with `run-2`. Expect the same observable outcomes with a different
  disposable destination, UUID, session IDs and timings. These values may vary;
  preservation within one journey must not vary.
- [ ] Report **Pass / Fail / Blocked** per scenario, including the reviewed run
  directory and criterion, without publishing private transcripts. An automated
  pass with unreviewed criteria is **Pending**, not human acceptance.

After preserving/reviewing evidence, clean only the owned disposable fixture:

```sh
npm run acceptance:skill -- --cleanup --evidence .local/skill-acceptance/run-1
```

Expected: exit 0 and “Removed owned fixture only; evidence retained.” Cleanup
requires the recorded ownership token and final inventory, refuses other roots,
and leaves the evidence, normal installation and earlier trials untouched.

## Offline checker tests

```sh
node --test tests/skill-acceptance.test.mjs
```

These tests deliberately substitute an incorrect identity, alter a synthetic note
and timestamp, add a file, remove/fail the installed helper receipt, and fail a
scenario prerequisite. They validate the assertions; they are not installed-skill
acceptance runs. They also run in the normal offline `npm test` suite.

## Development evidence — 8 November 2026

Initial live rehearsals used macOS, Node 26.13.0, Codex CLI 0.166.0 and the
configured `gpt-6-astra` model (medium effort). The normal installed Researcher
0.1.9 matched all 14 files at the pinned revision before use. No installation
replacement, desktop claim, merge or release was involved.

Failed attempts are retained privately:

| Attempt | Observed result |
| --- | --- |
| Initial interface probe | Installed skill selected its helper; Node could not read its system OpenSSL configuration. Destination remained empty. |
| Permission probe launch | Nested config was incorrectly serialized as JSON rather than TOML; server did not start. |
| First runner preflight | The harness incorrectly rejected the standard configured endpoint; no inference. An offline regression test now covers it. |
| First full journey | Create passed. Repeat preserved files/identity but the checker wrongly demanded the absolute path again rather than allowing “selected folder.” Reopen was blocked by that failed prerequisite. The corrected assertion retains the create location requirement. |

Two later fresh-fixture journeys passed all three automated scenarios:

| Private run label | Create | Repeat | Fresh reopen | Full Gherkin result |
| --- | --- | --- | --- | --- |
| run-3 | 17.842 s | 11.881 s | 16.574 s | Pending human review |
| run-4 | 21.449 s | 12.872 s | 18.257 s | Pending human review |

These are developing-agent rehearsals, not PM acceptance. They used a dirty
checkout during implementation; run-4 records complete harness file digests.
A subsequent startup-deadline fix has an offline regression test; the committed
rehearsals below include that fix. The maintained feature text is
unchanged apart from selection tags. Checker tests demonstrate rejection of
incorrect identity, altered notes, ambiguous isolation failures, malformed output
and unsafe cleanup. The runner leaves human criteria pending instead of treating
these tests or filesystem results as full conversational acceptance.

### Committed-code repetitions

Both runs below exercised clean commit
`d9c99c4e9853ca407264f126a9dd2aa6b8599df4`, with identical harness digests and
the environment/installed revision above. Each used a fresh disposable fixture,
a different generated identity, and separate setup/reopen processes. Both exited
2 with all automated checks passed and all full scenarios pending human review.

| Private run label | Create | Repeat | Fresh reopen |
| --- | --- | --- | --- |
| run-5 | 18.251 s | 8.713 s | 17.801 s |
| run-6 | 17.966 s | 8.431 s | 14.814 s |

Independent readback confirmed unchanged repeat/reopen inventories, global
settings fingerprints and installed bytes. Both reopen receipts retain the exact
missing-thread error and denied evidence reads. Agent inspection of the messages
found orientation, no repeated initialization question, honest attachment/access
boundaries and no research activity. This is an agent assessment, not PM acceptance;
the runner correctly leaves those human criteria pending. The documented cleanup
command then removed both owned fixtures, exited 0 and retained all evidence.

A deliberately missing installation exited 2 before inference and marked all
three scenarios blocked. All 153 offline tests passed, including 14 acceptance
checker/adapter tests. The package check passed locally on Node 26.13.0. CI for
`d9c99c4` passed Node 22/24/26, fixtures/tooling, Markdown and local links. Local
Markdown lint, lychee 0.24.2 offline links/anchors, citation validation and diff
checks also passed. No live inference was run by CI.

### Human acceptance — 8 November 2026

The user ran the documented command from clean commit
`77b1bc49108c2741e012cf1d6b5ca43e3cee97ab` on macOS with Node 22.23.2,
Codex CLI 0.166.0 and `gpt-6-astra`. The installed Researcher remained 0.1.9
at the pinned revision above. All three automated scenarios passed.

After reviewing the actual final responses and relevant tool activity presented
from that run, the user explicitly accepted **create, repeat setup and
fresh-session reopen: Pass**. The user also accepted the reopen turn's denied
attempt to read the unrelated Superpowers skill; its read returned exit 1 and
the Researcher inspection subsequently succeeded. Recorded metadata/note
inventories and global-settings fingerprints were unchanged through the
applicable checks. Scenario durations were 16.998, 10.737 and 19.492 seconds.

This is human acceptance of the reviewed run, separate from the earlier agent
rehearsals. A private acceptance receipt accompanies the original run evidence;
the raw Cucumber pending results remain unchanged as the historical automated
output. Future runs still require their own human review. The user authorized
PR #44 to become ready for review, not merge or release.

## Readable reports and recorded human verdicts

The follow-up in [#45](https://github.com/injectionator/n8r-surface/issues/45)
adds a private `review.md` after live-run finalization. It contains each actual
final response, user input, commentary, tool commands and results, including
failed or denied operations. Successful tool outputs and technical session
receipts are expandable in Markdown viewers supporting HTML details; their full
text remains in the file. Failed outputs remain visible. Missing evidence is
explicit. No model generates the report or judges the interaction.

The runner prints the report path and a SHA-256 **run fingerprint**. The companion
`review-manifest.json` binds the evidence file names/bytes and the report bytes.
These files contain private machine paths and transcripts: retain them with the
ignored run directory, not in public commits. Existing reports are verified,
never silently regenerated over different evidence.

To generate or verify a report for a retained run without inference:

```sh
npm run acceptance:skill -- --report --evidence .local/skill-acceptance/run-1
```

Expected: exit 0 when the report is successfully generated or verified, with the
report path, fingerprint and automated status. Exit 0 here means reporting worked,
not that the scenario passed. A blocked run can have a valid readable report.
Missing required evidence prevents an overall Pass. Once a verdict receipt exists,
this command also shows the three human verdicts and combined overall status.

### Human review task list

Prerequisite: a completed run from the command above or the live command. No new
Codex sign-in, network access or inference is needed for report/review commands.
From the repository root:

- [ ] Run `--report` as shown above and open the printed `review.md` path. Read
  each scenario's human criteria, actual final response and tool activity.
  Inspect any failed commands and preservation warnings. Expect the same actual
  responses as the retained turn receipts; there are no invented summaries.
- [ ] Copy the report's run fingerprint. Choose **Pass**, **Fail** or **Blocked**
  independently for create, repeat and reopen. The command below shows all Pass
  only as an example; replace each verdict with your actual judgment, replace
  the fingerprint and reviewer, and use the optional comment for any caveats:

  ```sh
  npm run acceptance:skill -- --review \
    --evidence .local/skill-acceptance/run-1 \
    --run COPY_THE_64_CHARACTER_RUN_FINGERPRINT \
    --reviewer 'Your name' \
    --create Pass --repeat Pass --reopen Pass \
    --comment 'Reviewed the actual responses and tool activity.'
  ```

  Expect a separate `human-review.json` containing the run fingerprint, report
  digest, reviewer, date/time, each verdict and comment. The terminal shows
  automated status, human verdicts and overall status together. **Pass → exit 0;
  Fail → exit 1; Blocked → exit 2.** A human Pass cannot override an automated
  failure, final preservation error, missing evidence or blocked prerequisite.
- [ ] Run `--report` again. Expect verification of the unchanged evidence/report
  and the recorded human verdicts. Original Cucumber JSON and pending results
  remain untouched; a verdict receipt does not retroactively alter execution.
- [ ] Report **Pass / Fail / Blocked** for this review workflow with the private
  run reference and any failed step. If commands refuse modified evidence, an
  incorrect fingerprint or a duplicate review, that is the expected protection;
  retain the refusal when reporting a problem. Do not publish raw private files.

Only one review receipt is supported per run in this increment. Duplicate
submissions refuse to overwrite it. A correction workflow, reviewer identity
verification and signed audit records are out of scope. A reviewer name is a
self-attribution, not authentication. Fingerprints detect drift relative to the
retained manifest; they do not make files tamper-proof against someone able to
rewrite both evidence and manifest. Evidence must be quiescent while reporting
and reviewing; concurrent writers are unsupported.

Owned-fixture cleanup still uses `--cleanup`. It retains reports and verdicts;
its later `cleanup.json` receipt is excluded from the evidence fingerprint. The
three generated review files are also excluded from that fingerprint, with
report bytes bound separately. All other evidence files are included. Symlinks,
nested entries and files over 64 MiB are refused. Historical manually written
acceptance receipts are preserved, not automatically imported as new approval.

Offline report/review checks:

```sh
node --test tests/skill-review.test.mjs
```

These tests use synthetic reviewer names and verdicts. They do not establish
human acceptance of any real run. Live execution retains its existing pending
exit behavior; `--review` is the separate acceptance step.

### Report/review development evidence — 8 November 2026

The observed baseline was the user's accepted #43 run: an agent had to extract
responses/tools from JSON for human review. The new offline report command was
exercised against that retained real run and a retained missing-installation run;
they reported automated Pass and Blocked respectively without new inference or
rewriting raw evidence. The earlier manual acceptance receipt was preserved and
was not imported as a new command-recorded review.

A fresh installed-skill run on macOS, Node 26.13.0, Codex CLI 0.166.0 and the
configured `gpt-6-astra` model passed all three automated scenarios and generated
the report automatically. The installed 0.1.9 plugin matched the same pinned
revision before and after. This was a development checkout with harness file
hashes retained privately, not a clean-commit or human acceptance claim.

The agent checked every final response and command against the readable report,
then exercised the documented review command using reviewer name
“Codex agent rehearsal (not human acceptance)” and an explicit rehearsal comment.
It recorded three Pass verdicts, exited 0 and displayed separate automated/human
results. Offline report verification still succeeded after owned-fixture cleanup;
raw results and all evidence remained retained. These verdicts test the recording
workflow; they are not the user's acceptance of this increment.

Focused offline checks cover changed/missing evidence, wrong fingerprints,
modified reports, invalid/duplicate reviews, blocked/failing aggregation, null or
empty required evidence, and interrupted-turn tool recovery from session receipts.
The latter two cases were found in fresh review, corrected and regression-tested.
All 171 offline tests passed, including 18 report/review cases; the installed
package check also passed on Node 26.13.0. No new dependencies or live CI were added.

A second fresh run exercised clean commit `1eb4cae` with the same environment
and installed skill. All three automated scenarios passed in 52.7 seconds;
live execution retained its pending-human status. The agent inspected the actual
responses, tool activity, preservation and isolation receipts, then recorded an
explicitly labeled agent rehearsal with three Pass verdicts (exit 0). Cleanup
and offline report verification both exited 0, preserving the exact fingerprint
and recorded verdicts. This does not establish desktop or human acceptance.

A later offline regression caught an evidence file named `__proto__` being omitted
from a plain JavaScript object's hash map. Null-prototype maps now include that
filename; changing its contents is detected. The final narrow fix was verified
by the offline suite rather than another live inference run.
