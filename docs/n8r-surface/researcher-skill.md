# n8r-surface Researcher: start an investigation

**Historical first increment:** an experimental Researcher, packaged for
ChatGPT desktop / Work and Codex. It researches supplied sources with the existing
harness and saves working notes. It does not add a CLI runner, Lab connection or
validated experimental HTML/Surface output. Related to [#17](https://github.com/injectionator/n8r-surface/issues/17).

The user selected this order on 4 November 2026: prove the skill in the existing
harness, adapt that same core to n8r-labs in its repository, then return to the
standalone `n8r-surface` command. Unfinished #16 source-overview work is paused.
There will be no separate status subcommand.

The primary result is a partial **AI Surface graph**, with evidence and unresolved
connections. It is not an inventory of every application feature or setting.
Configuration matters when it establishes or explains a relevant node, edge,
route, data flow or authority boundary. The bundled
[discovery guide](../../plugins/n8r-surface/skills/research/references/discovery-map.md)
covers available source combinations, reusable product knowledge and comparison.
See [discovery, comparison and live-inspection examples](researcher-discovery.md)
for those broader tasks; the short first trial below uses authentication.
For a compact security brief and explicit reconciliation, use the
[Skeleton Surface walkthrough](researcher-skeleton-check.md). This provisional
Markdown profile adds no validated structured-output contract.

For workspace-only setup and recognition, use the
[workspace contract](workspace.md), [isolated candidate installation](workspace-installation.md)
and [short human check](workspace-human-check.md). The workspace helper requires
Node.js 22, 24 or 26 and a persistent local filesystem. Desktop workspace
acceptance is pending; a cloud-only chat cannot perform local setup.

The installation commands below change the selected host's plugin registration.
For issue #41 trials, prefer the isolated procedure above; replacing a normal
installation must be an explicit choice.

## RESEARCH-01: investigate and continue

Reuse an existing installation only after checking the version:

```sh
codex plugin list --marketplace n8r-surface --json
```

Expect one installed/enabled entry at the candidate version below. If an older
version came from the Git branch marketplace, refresh its snapshot and reinstall:

```sh
codex plugin marketplace upgrade n8r-surface
codex plugin add n8r-surface@n8r-surface --json
codex plugin list --marketplace n8r-surface --json
```

A marketplace pinned to a commit stays pinned. To choose a different ref, remove
that marketplace registration and repeat step 1 with the new ref. For a local
marketplace, update its source checkout first and use the
[maintainer installation](#maintainer-installation-from-a-local-candidate).
Refreshing the desktop app alone does not refresh the Git snapshot.

You need a local Work
or Codex chat that can read your LibreChat checkout and save files. Existing
ChatGPT sign-in is sufficient for research through this plugin; it adds no model
API connection. Work's picker and full lifecycle still need
[human acceptance](researcher-skill-verification.md#remaining-work-mode-acceptance).

1. **Install once.** With Codex CLI installed, run these commands from any
   directory. They fetch the candidate from GitHub; no manual clone, npm install
   or build of n8r-surface is needed:

   ```sh
   codex plugin marketplace add injectionator/n8r-surface --ref feat/51-standalone-surface-artifacts --json
   codex plugin add n8r-surface@n8r-surface --json
   codex plugin list --marketplace n8r-surface --json
   ```

   Expected: exit 0 and one installed/enabled `n8r-surface@n8r-surface`, version
   `0.1.11`. The branch is a changing draft candidate, not a release on `main`.
   Use an identified commit with `--ref` for a repeatable installation. Network
   access is required; the commands change plugin configuration/cache.
2. **Open your source.** Start a local chat with your LibreChat folder selected.
   In Work, select **n8r-surface Researcher** via `@`; the qualified skill is
   `n8r-surface:research`. Refresh/restart the app if the installed version is
   missing. The host must actually read the checkout; naming a path in a cloud
   chat does not supply its files.
3. **Ask one bounded question:**

   > Use n8r-surface Researcher to investigate authentication in this LibreChat
   > checkout. Explain the components and configuration choices, cite the files
   > you read, and distinguish supported options from my selected setup. Save
   > working notes in your default research folder, show me where they are,
   > and ask the next useful question.

   Expect a source revision, an explanation with file/line evidence, unanswered
   questions and a saved Markdown note. Supported options are not your selected
   deployment, and reading source does not verify a running integration.
4. **Open the saved note.** The default on a local filesystem is
   `~/Documents/n8r-surface/research/librechat/authentication-001.md`.
   The Researcher shows the resolved absolute destination before saving and
   provides an openable link after reading it back. Existing files get the next
   unused number. You can request another folder. A host without persistent local
   file access must say so and provide a download or text; that does not pass the
   local-save check.
5. **Answer, then continue.** Answer the Researcher's actual question or correct
   one finding. Ask it to save a successor. Expect `authentication-002.md` (or
   the next unused number), the dated human decision separated from source
   evidence, and the first note unchanged. In a fresh chat with the same source
   access and skill selected, provide that successor and ask:

   > Continue this research from the saved note. Check the source revision,
   > retain my decisions and unresolved questions, and investigate the next
   > useful gap. Save a successor and show me the result.

Wording, source revision, findings, date and file number may vary. Missing access,
invented citations, a missing saved file, overwritten earlier notes or a lost human
decision are failures. Independently opening the files is the readback check;
an agent rehearsal is separate from human acceptance. No service is started and
the source checkout should remain unchanged. Keep the notes after the trial;
plugin removal does not delete them.

**State X:** installed skill, readable identified checkout, and a writable notes
folder. **Input Y:** the prompt above, followed by an actual human answer and a
fresh-chat continuation. **Outcome Z:** a useful explanation and preserved,
readable successor notes with source evidence, choices and gaps. See
[observed results and remaining limits](researcher-skill-verification.md).

These earlier checks cover working notes. Candidate 0.1.10 adds the separate
[checked artifact workflow](skill-surface-artifacts.md); Lab adaptation remains
outside this repository. RESEARCH-01 does not establish the
complete installed-command E2E-01/E2E-02 cases.

## Package and standards

The canonical source is [the plugin folder](../../plugins/n8r-surface/).
It contains one `skills/research/SKILL.md`, bundled references, optional
OpenAI skill metadata, licence files and an icon. It has no MCP server, hooks,
installer scripts, embedded credentials or separate model connection.

The [Agent Skills specification](https://agentskills.io/specification) defines
`SKILL.md`, required `name`/`description` frontmatter and relative resources.
The [OpenAI skill guide](https://learn.chatgpt.com/docs/build-skills) distinguishes
local skill folders from distributable plugins. Follow
[plugin packaging](https://developers.openai.com/plugins/build/plugins) for
repository marketplaces and host-specific metadata. Reviewed 4 November 2026.
These are packaging contracts; host behavior still needs its own rehearsal.

- [plugin.json](../../plugins/n8r-surface/plugin.json) uses Agent Plugins 1.0.0.
- [.codex-plugin/plugin.json](../../plugins/n8r-surface/.codex-plugin/plugin.json)
  is the compatibility manifest needed by the tested Codex CLI 0.139.0. Keep
  identity, version and presentation metadata aligned with the portable manifest.
  Both use the same skill files; no second instruction copy is maintained.
- [The repository marketplace](../../.agents/plugins/marketplace.json) exposes
  `n8r-surface@n8r-surface` as available, without forcing installation.
- Plugin and skill version `0.1.11` identify this experimental candidate. Increment
  them when changing distributed instructions; record the Git revision and
  installed file digest with test results. This is separate from the npm version.

Keep the skill self-contained: installation copies it away from this checkout.
Bundled references must work there. Instructions use CC-BY-4.0; metadata, icons
and tooling use Apache-2.0. The package includes the repository's licence texts
and [licensing explanation](../../LICENSING.md).

## Maintainer installation from a local candidate

Use this route only when developing the plugin itself. CLI 0.139.0 was used for
the package checks; other versions need verification. Record `codex --version`
and `git rev-parse HEAD`. If this marketplace is already registered from GitHub,
run `codex plugin marketplace remove n8r-surface` before changing its source to
the local checkout. The CLI rejects that source change otherwise. This removes
the marketplace registration/snapshot, not research notes. From this repository root:

```sh
codex plugin marketplace add . --json
codex plugin add n8r-surface@n8r-surface --json
codex plugin list --marketplace n8r-surface --json
```

Expected: each command exits 0. The installed list contains exactly one
`n8r-surface@n8r-surface`, version `0.1.10`, installed and enabled. The installation
path varies by computer. `alreadyAdded: true` is fine on a repeated marketplace
registration. Do not register a second copy of the skill in `.agents/skills`.

If the earlier 0.1.0 candidate is installed, remove its old package ID once:

```sh
codex plugin remove n8r-researcher@n8r-surface --json
```

The renamed package replaces that candidate; saved research stays in place.

In ChatGPT desktop, open Plugins and select the **n8r-surface** source. Verify
**n8r-surface Researcher** is installed. Refresh/restart the app if the new marketplace
or version is absent, as the packaging guide requires. Then start a fresh Work
chat. Loading instructions in this development chat is not this acceptance test.

The repository installation above is sufficient for a trial. A public Plugins
Directory listing requires a separate
[submission and publication](https://developers.openai.com/plugins/deploy/submission)
decision; it is not necessary for this repository test.

## LOAD-01: install, invoke, remove, reinstall

Use the prepared installation above. Record the desktop app version and selected
Work environment. The host must have access to the two synthetic documents
[lumen-guide.md](../../examples/researcher/sources/lumen-guide.md) and
[lumen-settings.md](../../examples/researcher/sources/lumen-settings.md), through
attachments or explicitly selected local source access. A local path by itself
is not access in a cloud chat.

1. In a **fresh Work chat**, type `@` and select the plugin's
   `n8r-surface:research` skill (display name **n8r-surface Researcher**). Ask:

   > Research Lumen Desk from these two documents for an AI Surface Model
   > description. Identify the components and configuration choices, show evidence
   > and gaps, and ask the next question that would help me choose a setup.
   > Save working research notes that I can reopen.

   Expected: the skill identifies version `0.1.11`, reads the two actual documents,
   cites evidence and saves a readable note outside the plugin cache. Independently
   open that note. Both conflicting batch maxima (10 and 25) and the unknown model
   version must survive; optional features must not become user selections. The
   note is not a validated `n8r.research/0.1` artefact. A version announcement alone
   does not prove the packaged instructions or sources were used; retain the
   visible invocation/tool evidence and verify the resulting content.
2. Record the note's path/download and content digest when available. In the
   plugin browser select **Uninstall plugin**, or run:

   ```sh
   codex plugin remove n8r-surface@n8r-surface --json
   codex plugin list --marketplace n8r-surface --json
   ```

   Expected: exit 0, no installed entry for this plugin. The marketplace may still
   offer it for installation. Do not remove other skills or the saved research.
3. Start another **fresh Work chat**. Check that this skill is absent from the
   selector and installed-plugin list. Do not paste its instructions into that
   chat. Confirm the saved note still opens unchanged. Do not use an old chat's
   memory of the skill as an unload test: uninstall does not erase its history.
4. Reinstall using the same `codex plugin add` command. In a new Work chat, verify
   exactly one skill entry appears and invoke it again against the same sources.
   Supply the earlier note when testing continuation. Retain a new output file;
   do not overwrite the first note. Verify version, source identity and retained
   evidence. A prompt that never loaded the installed skill is not a pass.

Any missing selector entry after install, duplicate installation, wrong version,
fabricated source access, missing save/readback or changed user note is a failure
or blocker to investigate. Do not count a CLI list result as a Work-mode invocation
or unload result. Record the actual stage reached in [verification](researcher-skill-verification.md).

For cleanup after testing, remove this plugin using the command above. Optionally
run `codex plugin marketplace remove n8r-surface` to remove this marketplace source.
Keep user research files. Reinstallation is reversible; cleanup is separate from
publishing or deleting the source repository.

## Prepare a shareable ZIP

From a committed, reviewed candidate in the repository root:

```sh
n8r_skill_zip=$(mktemp -d)
git archive --format=zip --output="$n8r_skill_zip/n8r-surface.zip" HEAD:plugins/n8r-surface
python3 -m zipfile -l "$n8r_skill_zip/n8r-surface.zip"
```

Expected: exit 0; the archive has both manifests, one skill with its references, synthetic shape examples, workspace/artifact helpers
and third-party notice
and OpenAI metadata, the icon and licence files. It contains no Git history,
source-repository research data, credentials or node_modules. The output directory
varies. Archive only the committed plugin subtree so paused/untracked work cannot
enter the package. Uploading or publishing the ZIP remains a separate action.

## Checked artifacts in candidate 0.1.10

The skill now supports standalone Capability/Bound JSON, research HTML and a
brief through bundled resources. See the [artifact task and human
verification](skill-surface-artifacts.md) for prerequisites, privacy limits,
revision behavior and evidence. Historical working-note rehearsals above do
not establish acceptance of this new path.
