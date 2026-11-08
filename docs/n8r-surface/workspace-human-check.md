# Check workspace setup and continuation

Use [the canonical scenarios](../../tests/acceptance/skill-workspace.feature).
This is a PM walkthrough through the installed skill, not a developer executing
the helper and calling it product acceptance. Keep this guide and expected answers
out of the product chat. Current results are in [verification](workspace-verification.md).

## Maintainer preparation

- Identify the candidate commit, plugin version and every installed file digest.
  Follow [candidate installation](workspace-installation.md). Verify the actual
  loaded skill path from tool receipts; a version announcement alone is insufficient.
- Use a local Codex desktop chat with ordinary inference sign-in, persistent
  filesystem access and Node.js 22, 24 or 26. Record actual app/build, selected
  model and CLI version. Unsupported/cloud-only hosts are blocked, not passed.
- Prepare disposable folders outside source repositories. Keep evidence outside
  product inputs. Create one empty folder each for create and alternative choice;
  leave a missing destination absent. For each adoption case create a folder with
  `user-note.md` containing `Synthetic user note: preserve this text.`
- Prepare independent refusal folders: malformed `.n8r/workspace.json` containing
  `{`; conflicting `.n8r` as a plain text file; unsupported identity JSON with
  `format: n8r.workspace/2`. These are inputs, not seeded successful workspaces.
- Record the owned fixture inventory, all initial file bytes/hashes and directory
  entries. Record global/project instructions, enabled tools, memory/history and
  filesystem access. Verify the selected folder is actually available. Do not
  attribute host-created `.git` to the skill. Do not call a nonempty folder empty.
- Start a separate fresh product chat. Supply only the installed skill, selected
  folder and ordinary user prompt. Never include this implementation chat,
  expected outputs or hidden repair hints. Record isolation limits; a fresh chat
  alone is not proof that history/filesystem access is excluded.

## PM tasks

- [ ] Open the prepared empty folder in a fresh local chat. Select the installed
  **n8r-surface Researcher** and send:

  > Help me set up an n8r workspace here for investigating LibreChat.
  > Set it up only; do not start researching yet.

  Expect a clear saved location and useful next step, without beginning research.
  It should distinguish creation from app attachment and require no source or
  credentials. Open the folder with hidden files visible: only
  `.n8r/workspace.json` should be new. Open it and record its ID and format.
- [ ] Add `user-note.md` containing `Synthetic user note: preserve this text.`
  Ask: “Set up this n8r workspace here again.” Expect recognition without a new
  identity, rewrite or repeated permission question. The note remains unchanged.
- [ ] In a new chat, select the same folder and installed skill, then send:

  > Is this n8r workspace ready, and what can I do next?

  Expect the same saved identity/format, useful continuation from saved purpose,
  no claim of completed LibreChat research and no writes or research.
- [ ] Move the disposable folder using the file manager. Open it in another fresh
  chat and repeat the readiness question. Expect the same identity at the new
  location. Do not move a borrowed/user-owned workspace for this test.
- [ ] Repeat setup with the absent destination, stating its location in the prompt.
  Expect the same minimal creation without a redundant permission question.
- [ ] Use each adoption fixture separately. Ask setup; expect a choice before any
  write. Answer “Initialize here” in one run; choose the prepared alternative
  empty folder in the other. Expect the chosen destination initialized and every
  original user file preserved.
- [ ] Ask setup in each refusal fixture. Expect a specific explanation and next
  action, no success claim, repair, migration or file changes.

Answer only genuine questions using the scenario facts. Stop at technical rescue,
10 exchanges or 15 minutes; retain the failed/incomplete trial. Do not silently
fix files, change the expectation or retry until a pass.

## Independent evidence and report

The maintainer compares complete before/after file inventories and hashes, then
reads saved JSON independently of the helper. Verify UUID v4, exact format,
nonempty name, optional purpose, stable ID and unchanged note bytes. Record tool
exit statuses (helper success 0, choice/uninitialized 3, refusal/error 2), actual
messages/tool receipts, timestamps and unrelated/global-state checks. Helper
calls in automated tests are supporting evidence, not this chat journey.

Report each scenario's **Outcome: Pass / Fail / Blocked**, with file/tool evidence.
Separately score **Experience: Pass / Fail / Blocked** for each:

| Criterion | Evidence to return |
| --- | --- |
| Orientation | Turn showing location, completion state and useful next action. |
| Necessary questions | Each question and why its information was missing. |
| User effort | Any request to choose a schema/structure or perform technical rescue. |
| Honest boundaries | Attachment, access and failure statements versus actual tools/state. |
| Scope | Whether setup/readiness ended without research. |

False completion, unauthorized effects or lost data fail regardless of conversation
quality. An expected refusal can pass; an unavailable host is blocked. Record
invalid environment separately. Wording, paths, names, UUIDs and timings may vary;
identity changes, unexpected writes or invented research are failures. Retain
sanitized PM judgments and private evidence references, including failed trials.

## Cleanup

Retain transcripts, hashes and verdicts before cleanup. Remove only the exact
inventoried task-owned fixture and isolated-installation roots when authorized;
verify removal. Never delete the normal installation, borrowed folders or research.
Record deliberate retention and leftovers. Installation, rehearsal, acceptance,
merge and release are separate states.
