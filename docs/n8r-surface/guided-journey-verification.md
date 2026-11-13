# Installed skill: freeform component exploration

Related to [#17](https://github.com/injectionator/n8r-surface/issues/17).
The user starts with a main component and brings other sources into the
conversation as useful connections emerge. Suggestions help exploration; they
are not mandatory steps or a component-selection wizard.

## Task and boundary

**Given:** an installed Researcher and only a selected LibreChat source folder.
**When:** the user asks what connects to it, chooses a different branch from the
recommendation, introduces Atlas and connector sources, saves Capability/Bound
descriptions, then reopens and corrects their scope.
**Then:** useful suggestions have source evidence, supported possibilities remain
separate from selections and verified configuration, and saved successors retain
identities, decisions, unknowns and exact predecessor references.

The skill has no built-in knowledge of the user's Lab or repository layout. It
may inspect only sources the user introduces. The test's connector files become
available in a later turn; the originating repository is inaccessible to the
Researcher. Shared source implementation does not establish a shared runtime.
No service operation, provisioning, live API request or CLI/Labs implementation
is part of this trial.

## Installed 0.1.11 rehearsal

Agent rehearsal on 9 November 2026 used the installed 0.1.11 plugin, byte-matched
across all 20 files to merged commit
`5eed2ac9a31933caa2ae306e4b407e327d147bf7`. Host: Codex CLI 0.166.0 app-server,
ChatGPT sign-in, configured `gpt-6-astra`, Node 26.13.0, macOS. Fresh ephemeral
sessions and explicit file permissions denied earlier receipts and the separate
Lab repository. No inference credentials were copied.

Initial input contained only the same pinned LibreChat README, database and
OpenID source copies used in the [accepted two-product trial](skill-usefulness-verification.md).
Later input added a limited historical operator excerpt and selected private
connector source files. Their provenance and hashes remain in the private run
inventory. The developing agent supplied conversational test-user choices and
source copies; the installed Researcher produced the findings and saved bundles.
This is an agent rehearsal, not a human rerun or a current deployment inspection.

Observed sequence:

1. Asked for LibreChat connections without naming other components. The reply
   offered model, storage, identity, document/tool and telemetry branches, with
   a suggested next investigation. It saved nothing when asked not to save.
2. Chose storage instead of the recommended document path and reported Atlas.
   The reply followed that direction and distinguished a user statement from
   configured and exercised connections.
3. Challenged source-read claims whose events appeared missing. Explicit Node
   reads and hashes followed. Subsequent raw-transcript diagnosis established
   that the event stream was incomplete; see the recording limit below.
4. Introduced a historical storage note and private connector sources, then
   switched to inference. The reply traced the connector/app-server boundary,
   retained Atlas and deferrals, and excluded a separate assistant connection.
5. Requested Capability and Bound bundles in successive turns. Both saved and
   passed independent helper readback. User selections did not become verified
   current bindings.
6. Reopened in a fresh process, narrowed the Atlas selection to chat records
   rather than uploaded files, and named retention/access controls as next work
   without authorizing investigation. The saved successor retained those limits.

Independent readback checked all three bundles, 36 source-hash references,
8 stable nodes, 5 stable relationships, exact parent references and the exact
Capability pin. All 24 files present before reopening remained unchanged.

### Recording and runner limits

The command-event stream omitted some nested shell calls. Initial review therefore
mistook missing events for unsupported inspection. A fresh diagnostic using the
same installed 0.1.11 retained a raw tool transcript: six shell calls and their
returned results appeared there, while the event stream recorded only four. The
raw transcript includes actual source reads. Missing command events alone cannot
establish that a source was unread or that the Researcher invented an earlier read.
The original ephemeral sessions cannot supply complete raw history retrospectively;
that per-turn coverage limit remains explicit. Later recorded targeted reads and
independent source checks substantiate the saved findings.

The first reopen attempt reached the runner's 120-second limit without saving a
successor. A fresh retry with a 600-second allowance completed and passed
independent readback. The timeout is retained as Blocked, not artifact success or
a skill defect. This allowance changed only a private copy of the existing runner.
An optional full-thread read was unavailable for ephemeral sessions; the focused
recording diagnosis used a fresh persistent session instead. The runner also
warned that injected skill text was truncated; installed-file reads are recorded,
and no complete injected-prompt claim is made.

## Result and remaining limits

**Agent rehearsal: Pass for the bounded journey and saved-output checks. Human
acceptance: pending.** The skill offered evidence-backed branches, followed user
redirection, incorporated later sources, preserved selections and deferrals, and
saved/reopened checked artifacts. The developer did not supply its findings.

No skill-code gap was established. Distributed skill 0.1.11 and its artifact
helpers remain unchanged; no new version or release is proposed for delivery.
The recording and timeout findings change how this rehearsal is interpreted, not
product behavior. Keep complete tool transcripts when investigating read-coverage
claims; event summaries alone are insufficient for a negative claim.

This trial does not verify arbitrary APIs, current deployment settings, running
connections, ChatGPT Work lifecycle, broad host compatibility or CLI/Labs
integration. The Bound artifact appropriately keeps current bindings unknown
while recording the user's Atlas and connector selections. Sources, private
component identities, prompts, tool receipts, snapshots and readback results stay
in the selected private vault; no private source bundle is published here.

## Human verification task list

Prerequisites: the identified installed 0.1.11 skill in a local Codex chat, Node.js
22/24/26, readable user-selected sources and a writable research destination.
Use the [installation guide](researcher-skill.md) for the pinned accepted revision. Record the installed version and host.

- [ ] Start with only your main component folder. Ask: “Use n8r-surface Researcher
  to explore LibreChat from this folder. What connects to it, and where would it
  be useful to explore next? I have not chosen other components. Don't save yet.”
  Expect optional evidence-backed branches, explicit unknowns and no save.
- [ ] Choose a different branch from its recommendation: “Leave documents and
  tools aside. We use Atlas for chat storage. What does that add, and what remains
  unverified?” Expect a useful response without restarting a fixed questionnaire.
- [ ] Introduce permitted connector sources: “Now explore inference from these
  files. Retain the storage choice and deferred topics. The separate assistant
  connection is outside this Surface.” Expect source-based connections and limits,
  with no operation or search through unselected repositories.
- [ ] Ask: “Save checked Capability and Bound descriptions here. Separate supported
  possibilities, my choices, configuration evidence and unknown runtime use.
  Read them back and show me the briefs.” Open both briefs and their evidence;
  expect actual files and helper readback, not only a claim of success.
- [ ] In a fresh chat, supply the Bound bundle and say: “Atlas is selected for chat
  records only, not uploaded files. Retention/access controls are next, but don't
  investigate yet. Keep my other choices and deferrals. Save a checked successor
  without changing earlier files.” Expect the correction, retained identity and
  history, and the requested stopping point.
- [ ] Report **Pass / Fail / Blocked**, skill revision/host, the unclear or
  unsupported claim if any, and links to the saved briefs. Keep private sources
  and receipts private. Retain the research after the trial; no service cleanup
  is needed because the task operates no services.
