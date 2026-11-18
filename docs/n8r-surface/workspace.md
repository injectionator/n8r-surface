# Surface workspace v1

The issue #41 candidate adds standalone workspace setup and read-only recognition
to the existing Researcher skill. A workspace is a user-owned folder with only
`.n8r/workspace.json` initially. It needs no vault, Git repository, source checkout,
Lab, credentials or app attachment. Research and content folders are lazy.

The [bundled workspace reference](../../plugins/n8r-surface/skills/research/references/workspace.md)
defines the record and interaction rules used by the installed skill. The
[shared module](../../plugins/n8r-surface/skills/research/scripts/workspace.mjs)
is the authoritative validator and filesystem implementation. Plugin removal or
upgrade does not own or remove user workspaces.

For the proposed multi-source system workspace, effort history and discovery
index, see [the workspace workflow](workspace-workflow.md). That proposal does
not change the v1 contract or claim installed management features.

## Public consumer boundary

Import the bundled ESM module using Node.js 22, 24 or 26. It uses built-ins only:

```js
import { inspectWorkspace, setupWorkspace, validateWorkspace }
  from './plugins/n8r-surface/skills/research/scripts/workspace.mjs';

const state = inspectWorkspace(selectedDirectory); // read-only
// Only after an explicit setup request; adopt only after an initialize-here choice.
const created = setupWorkspace(selectedDirectory, { purpose: 'Investigate LibreChat' });
const validation = validateWorkspace(JSON.parse(savedText));
```

`selectedDirectory` and `savedText` are supplied by the host. The return value has
`status`, `message`, `directory` when available, and `record` only for supported
metadata. The helper's [result table and script interface](../../plugins/n8r-surface/skills/research/references/workspace.md#interpret-the-result)
apply equally to importers. Imports do not run the script interface. There is no
npm export alias or new `n8r-surface` CLI command for this module in this slice.

Host adapters must preserve the distinction between inspection and authorized
setup, and between an explicit setup request and consent to adopt a nonempty
folder. They must consume this module rather than reimplement filesystem rules.
The module cannot verify conversational authorization: that is the caller's duty.
CLI/Labs integration and compatibility are not verified.

## Persistence and limitations

Identity uses `n8r.workspace/1`, a generated UUID v4, a nonempty display name and
optional purpose. The exact supported record is distinct from plugin and AI
Surface Model versions. Unknown fields confer no authority and are preserved by
read-only reuse. Rename/move preserves ID; copying a workspace copies its ID and
is not a new-identity operation. No rename, copy, repair or migration API is added.

Setup writes a complete temporary record, flushes it, publishes it with an atomic
no-overwrite hard link, removes that temporary link, and reads the result back.
If publication fails, setup reports failure and retains staging evidence; a
later request refuses incomplete `.n8r` contents. An interruption after publication
may leave a complete valid identity and staging file; recognition reads the
identity and never deletes the staging file. It cannot accept partial JSON.

This targets ordinary local macOS/Linux filesystems supporting hard links.
Unsupported filesystems report an I/O failure, without a weaker overwrite fallback.
Destination and metadata symlinks/nonregular files are refused. Ancestor aliases
may resolve normally; this is not an adversarial filesystem sandbox. Concurrent
writers, malicious path replacement and power-loss durability are outside scope.
No network, credentials or global settings are used. Read-only here means no
intentional writes; operating-system access times and host checkpoints are separate.

## Intent and evidence

**State X:** an identified installed skill, a selected writable destination and a
fresh product chat. **Input Y:** “Help me set up an n8r workspace here for
investigating LibreChat. Set it up only; do not start researching yet.”
**Outcome Z:** one valid identity record, a useful next action, no research or
unrelated configuration; repeat and fresh-session inspection preserve identity
and all existing bytes.

[Canonical Gherkin](../../tests/acceptance/skill-workspace.feature),
[human walkthrough](workspace-human-check.md) and
[verification status](workspace-verification.md) distinguish deterministic checks,
installed-product rehearsal and PM acceptance. Gherkin is manually runnable; no
framework is installed.

Skill instructions, helper and references ship together in plugin `0.1.9`; both
manifests match. The repository marketplace points to that same subtree and has
no separate version field. The npm package version remains unchanged. The existing
CLI instruction-bundle revision guard is aligned so packaging does not break;
its restricted runner gains no workspace tools. Future consumer releases must
identify the bundled helper revision and rerun the same contract checks.
