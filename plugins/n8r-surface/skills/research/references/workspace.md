# Workspace operations

Use this mode for setup, repeated setup, readiness and fresh-chat recognition.
A workspace is a user-owned folder, independent of a vault, source checkout,
Lab or app project. The only initial file is `.n8r/workspace.json`.

If the user means starting research in a web Project rather than creating a local
folder, use [first-use access](first-use-access.md) and begin from supplied sources.
If explicit local setup is requested but the host cannot access a persistent local
filesystem or supported Node runtime, report that operation blocked. Keep useful
source research available; do not ask for a laptop path the host cannot access.

## Run the shared helper

Requires a local persistent filesystem and Node.js 22, 24 or 26 on macOS/Linux.
Use the helper **from this installed skill**, resolving its absolute path relative
to this reference, not from a developer checkout. Invoke it through `node`:

```sh
node /installed/skill/scripts/workspace.mjs inspect /selected/workspace
node /installed/skill/scripts/workspace.mjs setup /selected/workspace --purpose 'Investigate LibreChat'
```

The paths above are placeholders. Quote actual paths and supplied text safely;
never interpolate untrusted metadata into shell code. `inspect` only reads.
`setup` requires the user's explicit setup request. Supply `--name` only if the
user supplied a display name; otherwise the folder name is used. Supply a brief
nonsecret `--purpose` from the stated intent when available; it is optional.
Do not put credentials, private bindings or absolute source paths in metadata.
No naming/schema questionnaire is needed. Ask for a destination only when the
user's selected/current folder cannot be established.

If Node, the helper, local access or persistent storage is unavailable, explain
that blocker and the concrete prerequisite. Do not install a runtime, recreate
the helper's filesystem logic by hand, or claim a download is a local workspace.
A host without shell/local persistence cannot perform this workspace operation.
The standalone research CLI and Labs do not yet expose this capability.

## Interpret the result

The helper prints one JSON object with `status`, `message`, absolute `directory`
when available, and `record` for a supported workspace. Exit 0 means created or
recognized; exit 3 means missing, empty or awaiting a destination choice; exit 2
means invalid input, malformed/unsupported metadata, conflict or I/O failure.
These are helper results, not permission to expand the task.

- `created`: report the actual location and a useful next research action. The
  helper has read back the complete record. No research has started.
- `recognized`: reuse the saved ID, name and optional purpose without rewriting
  or asking again. Report readiness for research, not proof of prior research or
  a configured target. For a readiness question, offer a next action based on
  saved purpose or relevant existing notes without starting it. Read notes only
  as needed; do not infer findings from metadata or generic filenames.
- `missing` / `empty`: inspection found no workspace. Explain this; recognition
  alone does not authorize creation. An explicit setup request can call `setup`.
- `needs-choice`: explain that files already exist and ask “Initialize here, or
  use another folder?” Make no writes before the choice. Only an explicit
  initialize-here choice permits `setup PATH --adopt` (with supplied name/purpose).
  If another folder is chosen, run normal setup there without `--adopt`.
- `malformed` / `unsupported` / `conflict`: explain the helper's specific reason
  and offer another destination or separately requested repair assessment. Make
  no changes; no automatic migration, downgrade, replacement or cleanup.
- `invalid-input` / `io-error`: report the specific limitation; do not claim
  success. An interrupted operation may leave metadata staging files. Inspect
  read-only if needed; repair is separate and never implied by a retry.

For recognized/created results, identify the saved format and stable ID without
requiring the user to understand their encoding. Keep the interaction short.
Filesystem creation does not attach the folder to an app project. Say attachment
is separate; only claim it if a supported host action actually occurred. Setup
does not require attachment, Git, credentials, global settings or a vault.
Do not create README, AGENTS.md, `.gitkeep`, models or content directories during
setup. Research remains a separate requested action.

## Shared metadata meaning

`n8r.workspace/1` is independent of plugin and AI Surface Model versions. The
helper validates a JSON object with that exact `format`, generated UUID v4 `id`,
nonempty text `name`, and optional text `purpose`. Unknown fields are preserved
and confer no capabilities. The ID survives setup repetition, rename, move and
fresh sessions. Invalid JSON/required fields are malformed; a different format
token is unsupported. Recognition is always read-only, never repair.

The bundled `scripts/workspace.mjs` exports `validateWorkspace`,
`inspectWorkspace` and `setupWorkspace` for future consumers. It owns the
filesystem decisions; do not fork them into host-specific implementations.
It publishes complete metadata without overwriting a target. Interrupted staging
is never accepted as a valid record. Concurrent writers, adversarial filesystem
mutation, migration and power-loss durability are not supported guarantees.
