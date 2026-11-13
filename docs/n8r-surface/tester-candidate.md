# Try Researcher candidate 0.1.13

**Takeaway: understand what your supplied sources reveal about an AI system,
and choose the next useful investigation.** Save that understanding, its evidence
and unanswered questions so you can return to it later.

This is an interim test candidate, not a release or security certification.
It describes and investigates; it does not configure or deploy your system.
A source checkout shows supported possibilities. Nonsecret configuration can
establish selected connections; dated runtime evidence is needed to claim use.

## Choose a host

| Host | Candidate evidence | Installation effort |
| --- | --- | --- |
| Codex CLI | Installed research/save/continuation rehearsed; human acceptance pending. | Existing CLI and sign-in, Node 22/24/26, then three commands below. |
| Codex desktop / ChatGPT Work | CLI registration is checked; fresh desktop loading and acceptance remain pending. | Maintainer-assisted installation, restart and fresh-chat selection check. |
| Claude Code | Skill file installation checked; research/save/continuation untested. | Existing Claude Code, Node and Git; one installer command below. |
| Claude web / desktop Chat | Host supports custom skill ZIP upload; this candidate is untested there. | Upload a skill-shaped ZIP in Customize > Skills and enable it; source access, helper runtime and persistence still need checking. |

The instructions use the host's tools and model rather than an OpenAI API client.
Portability of instructions does not establish equivalent host behavior.
Claude Code's local filesystem access is distinct from web/desktop Chat's
execution environment. A local path mentioned in chat does not grant access.
Cowork is another environment requiring its own rehearsal.

For a nontechnical tester today, use an existing Codex installation with
maintainer help for setup, then follow the short task below. There is no verified
one-click cross-host installation. Claude's upload route is potentially simpler,
but is not yet a recommended route for testing this candidate's saved Surfaces.

## Install the pinned Codex candidate

Prerequisites: Codex CLI 0.166.0, Git/network access and Node.js 22, 24 or 26.
Research also needs the host's sign-in and access to the supplied sources.
From any directory, for a **new** n8r-surface marketplace registration:

```sh
codex plugin marketplace add injectionator/n8r-surface --ref d0ec3ece555fbcffb9788aed6593f380900e2d25 --json
codex plugin add n8r-surface@n8r-surface --json
codex plugin list --marketplace n8r-surface --json
```

Expect exit 0 for each command and exactly one installed/enabled entry at
`0.1.13`. These commands fetch GitHub content and write the selected Codex home's
plugin configuration/cache. They do not install the npm product CLI or research
the source. Existing registrations may be pinned elsewhere: have the maintainer
inspect the source before following the [replacement procedure](workspace-installation.md).
Do not silently replace a tester's existing registration.

Restart the desktop host when applicable, open a fresh chat and select
**n8r-surface Researcher**. Missing selection or an unexpected version is Blocked;
CLI installation alone does not pass this desktop check.

## Can I use npx?

Yes, for a standalone skill installation through the third-party
[Vercel Labs skills installer](https://github.com/vercel-labs/skills).
This is different from running `npx @n8r/surface`, which starts the separate npm
command and does not install the Researcher skill.

The following exact command was exercised with `skills` 1.8.1 and Node 26.13.0.
Run it in a new trial project folder, with Git/network access, for **Claude Code**:

```sh
env DISABLE_TELEMETRY=1 npx --yes skills@1.8.1 add https://github.com/injectionator/n8r-surface/tree/d0ec3ece555fbcffb9788aed6593f380900e2d25/plugins/n8r-surface/skills/research --skill research --agent claude-code --copy --yes
```

Expect exit 0, `.claude/skills/research/` and `skills-lock.json` in that folder.
All 18 copied skill files matched the pinned source in the installation check.
It downloads/runs the installer through npm's cache and fetches the source from
GitHub; telemetry is disabled by the process-scoped variable. It copies the skill,
not plugin manifests, icons or root licence files. Do not redistribute that bare
copy as the complete licensed plugin package. Do not run over an existing
same-named `research` skill. This project-scoped command does not register a
Codex plugin or install into Claude web/desktop Chat.

In Claude Code opened in that folder, `/research` is the host-documented invocation
for a standalone skill named `research`. Actual candidate invocation, source
research, helper execution and fresh-session continuation remain **untested**.
Do not treat the install success as a support claim. Other agent targets offered
by the installer were not rehearsed here.

## Tester task: one useful explanation

Maintainer preparation: verify installation and provide a readable source pack
and a writable output folder. Reuse the [working manual](skill-manual.md) and
[recorded rehearsal](skill-bom-verification.md); no services need starting.
For a synthetic trial, provide [Lumen's guide](../../examples/researcher/sources/lumen-guide.md)
and [settings](../../examples/researcher/sources/lumen-settings.md).

- [ ] Open a fresh chat with the installed Researcher selected and supply the
  source files. Ask:

  > Explain what these sources reveal about the AI system. Keep the first answer
  > short: Sources provided (distinguish inspected from merely supplied), Summary
  > (link the evidence), and Now what? (one useful next action). Save the Surface
  > in the output folder I supplied. Keep deployment choices unknown unless the
  > supplied evidence establishes them. Do not execute the source or start services.

  Expect an evidence-linked explanation, explicit coverage limits and links to
  the saved brief, map and journal. For Lumen, retain conflicting batch maxima
  10 and 25 and the unknown model version; do not silently choose one value.
- [ ] Open the linked files. Follow one evidence reference back to the supplied
  source. Expect the cited claim to be supported and unsupported selections to
  remain unknown. The current generated brief is longer than the requested chat
  summary; report whether that obstructs understanding.
- [ ] Answer the Researcher's question or redirect it, then ask it to save.
  Expect a new numbered revision retaining your decision and the earlier files.
- [ ] Open a fresh chat with the same skill. Supply the latest
  `surface.cdx.json` and source access. Ask: “Continue this Surface. What did I
  choose, what remains uncertain, and what should we investigate next?” Expect
  the choice and gaps to survive; unavailable evidence must be acknowledged.

Return **Pass / Fail / Blocked**, the host/version, what you asked, one useful
finding, and any missing or confusing result. Include nonsecret output references.
Pass means useful explanation, inspectable evidence and preserved continuation;
fabrication, lost choices or overwritten predecessors are failures. Missing host,
source or runtime access is Blocked. Wording, filenames and findings may vary.
Human acceptance is separate from the earlier agent rehearsals.

Optional cleanup: use `codex plugin remove n8r-surface@n8r-surface --json` for
this Codex installation, or remove only the newly created Claude trial folder.
Keep your research outputs. Do not delete pre-existing skills or project files.

## Package identity and remaining work

The retained complete plugin ZIP is `n8r-surface-skill-0.1.13.zip`, containing
24 files under `n8r-surface/`, including licences and notices. SHA-256:

```text
bdab66880bc1763c73ee30d98d3b188a4c8ae2af410f03b364785fbcc58640dd
```

It matches commit `d0ec3ece555fbcffb9788aed6593f380900e2d25` byte for byte.
This plugin-shaped ZIP is **not** a verified Claude custom-skill upload ZIP;
Claude expects a skill folder with SKILL.md. No upload or publication was done.

On 13 November 2026, an isolated Codex home fetched that commit and installed
0.1.13 with all 24 files matching; a separate trial folder exercised the npx
command with all 18 skill files matching. Both commands exited 0. The prior
installed research evidence is linked above; no new research acceptance is claimed.

The proposed primary presentation is **Sources provided / Summary / Now what?**,
with expandable inspected-source detail and links to deeper evidence. This was
reviewed as an editorial preview, not implemented in the generator. Candidate
0.1.13 still generates inventory, connections and gaps. Preserving an authored,
evidence-linked summary in the authoritative Surface and regenerating it remains
follow-up work; this package does not promise that presentation is already saved.

## Official host references

Reviewed 13 November 2026; host support does not establish candidate acceptance:

- [OpenAI plugin packaging and marketplaces](https://developers.openai.com/plugins/build/plugins)
- [Claude Code skills, invocation and local locations](https://code.claude.com/docs/en/skills)
- [Claude custom skill upload and prerequisites](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [Vercel Labs installer commands and scope](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
