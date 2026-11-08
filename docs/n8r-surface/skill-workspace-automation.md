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
- **0:** successful owned-fixture cleanup. A live run does not claim full human
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
A subsequent startup-deadline fix has an offline regression test; committed-code
rehearsal is recorded separately when available. The maintained feature text is
unchanged apart from selection tags. Checker tests demonstrate rejection of
incorrect identity, altered notes, ambiguous isolation failures, malformed output
and unsafe cleanup. The runner leaves human criteria pending instead of treating
these tests or filesystem results as full conversational acceptance.
