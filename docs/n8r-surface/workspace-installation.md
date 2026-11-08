# Install an identified workspace candidate

Plugin `0.1.9` belongs to issue #41 on `feat/41-skill-workspace`. Pin the reviewed
commit from the draft PR; a moving branch alone is not repeatable provenance.
This procedure exercises installation without replacing the normal installation.
It does not establish desktop invocation or PM acceptance.

## Isolated maintainer installation

Prerequisites: Git, Codex CLI 0.166.0, Python 3 and network access for a Git
marketplace. From the n8r-surface checkout at the reviewed commit:

```sh
n8r_candidate_revision=$(git rev-parse HEAD)
n8r_candidate_root=$(mktemp -d)
mkdir "$n8r_candidate_root/codex"
env CODEX_HOME="$n8r_candidate_root/codex" codex plugin marketplace add injectionator/n8r-surface --ref "$n8r_candidate_revision" --json
env CODEX_HOME="$n8r_candidate_root/codex" codex plugin add n8r-surface@n8r-surface --json
env CODEX_HOME="$n8r_candidate_root/codex" codex plugin list --marketplace n8r-surface --json
```

Expected: exit 0; exactly one installed/enabled `n8r-surface@n8r-surface` at
`0.1.9` in the isolated home. Keep the root and revision in a private run inventory.
The environment override is scoped to each process, not exported into the normal
shell. No inference credentials are copied. These install operations need no model
sign-in. Do not claim that this changes the desktop app's active installation.

Use `git archive` of the exact commit to compare every plugin-relative file and
SHA-256 digest to the listed installed path. Verify both manifests, SKILL.md,
references and `scripts/workspace.mjs`; preserve a complete digest inventory.
Run the installed helper only in a separate technical fixture to check packaging.
Do not use that helper-created fixture as the PM's new-user input.

For an offline/local marketplace rehearsal, archive the exact commit's
`.agents/plugins/marketplace.json` and `plugins/n8r-surface` into a task-owned
source directory and register that directory instead. This uses the repository
marketplace layout without editing its name or installing a second skill.
Record that local delivery route distinctly from Git fetch verification.

## Upgrade rehearsal

Use another isolated home and install baseline commit
`3effc41bf7e8466651722b7b4c64035f862b1901` (plugin `0.1.8`) first. Independently
snapshot a synthetic user workspace outside the installation. Remove only that
isolated marketplace registration, register the exact candidate revision, and
run `plugin add` again. A pinned marketplace does not float to a new commit.
Expect `0.1.9`, byte equality with the candidate, and an unchanged user workspace.
This tests replacement of the installed snapshot; fresh-chat skill use remains
[a separate PM task](workspace-human-check.md).

## Desktop product rehearsal

The PM must choose an explicit installation route for the actual desktop session.
An isolated CLI installation is not automatically visible there. Record the normal
registration first. If the PM authorizes replacing it for the trial, use the pinned
candidate registration/add sequence, verify installed bytes, refresh the app if
needed and start fresh product chats. Keep the original source/ref available for
restoration. Never remove/repoint the normal registration silently.

Alternatively use a separately verified host configuration that loads the isolated
installation. Verify this from actual tool receipts before testing. Do not assume
an environment override affects an already-running desktop process.

[Official plugin packaging guidance](https://developers.openai.com/plugins/build/plugins)
describes the repository marketplace and bundled resources. The commands above
must also be checked against the installed CLI's help and actual results.
Neither repository marketplace installation nor a ZIP is a public Plugins
Directory listing, npm release or authorization to merge.
