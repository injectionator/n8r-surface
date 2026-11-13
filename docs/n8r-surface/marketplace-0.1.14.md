# Skill 0.1.14 marketplace publication

Status on 13 November 2026: **published through the repository marketplace and
verified by a fresh default-branch installation**.
Related to [#77](https://github.com/injectionator/n8r-surface/issues/77),
[#72](https://github.com/injectionator/n8r-surface/issues/72) and
[PR #73](https://github.com/injectionator/n8r-surface/pull/73).
PR #73 merged as `94553968e5682f3b11b9cd8a951499ebcb9c45c3`. This
documentation branch starts from that merged default-branch commit.

## Destination and exact version

The destination is the existing `injectionator/n8r-surface` GitHub repository
marketplace, named `n8r-surface`. Its
[catalog](../../.agents/plugins/marketplace.json) points to
`plugins/n8r-surface`; both plugin manifests identify version 0.1.14.
No catalog change, npm publish or public Plugins Directory submission is needed.
[OpenAI's packaging guidance](https://developers.openai.com/plugins/build/plugins)
distinguishes repository marketplaces from the universal directory.

Before promotion, default branch `main` was `a314c79` with plugin 0.1.13.
The user reported PR #73 merged; GitHub independently confirmed the merge on
13 November at 12:00 UTC. The merged plugin tree and marketplace catalog match
the tested candidate exactly. No additional catalog mutation was necessary.

Exact pre-merge tested plugin source:
`6d68b9c4c717fb2c5efc78d02f16cf094c538a6d`.
Later documentation-only commits do not change those plugin bytes. Helper SHA-256:
`3087fad27e2f38bde37a251e762cdead220dab2d3b30e07a1c37e7226613b79b`.

## Install or replace an earlier pin

Prerequisites: Codex CLI 0.166.0, Git, network access to GitHub, and Node.js
22, 24 or 26 for the bundled helpers. Use a local host with source and filesystem
access. See the [host boundaries](researcher-skill.md) and
[working manual](skill-manual.md). Installation does not need inference sign-in;
research uses the host's existing sign-in.

From any directory, record an existing installation before changing it:

```sh
codex plugin marketplace list --json
codex plugin list --marketplace n8r-surface --json
```

Keep the previous source/ref privately for restoration. If this marketplace is
already registered, remove only its registration before adding the reviewed pin:

```sh
codex plugin marketplace remove n8r-surface --json
```

Skip removal for a first installation. Install the identified published revision:

```sh
codex plugin marketplace add injectionator/n8r-surface --ref 94553968e5682f3b11b9cd8a951499ebcb9c45c3 --json
codex plugin add n8r-surface@n8r-surface --json
codex plugin list --marketplace n8r-surface --json
```

Expect exit 0 for each operation and one installed/enabled
`n8r-surface@n8r-surface` at 0.1.14. Paths vary by machine. Save research outside
the plugin cache; the remove/add sequence replaces the marketplace snapshot.
Refresh/restart the host and start a fresh chat to use the updated skill.

Earlier trial commits also used 0.1.14. The version string alone cannot identify
the bytes. An old commit pin remains old; refreshing a pinned marketplace does
not select this newer commit. Re-register the exact pin and compare its plugin
files to `git archive` of that commit when verifying provenance. Keep version
0.1.14 for these already identified plugin bytes; no version bump is introduced by
these documentation changes.

## Verification and limits

A fresh isolated Git installation on 13 November used Codex CLI 0.166.0 and
Node 26.13.0. Add/install/list exited 0; all 25 installed files matched pre-merge
commit `6d68b9c`, with no extra files. The installed helper checked the synthetic
initial BOM: `checked`, five relationships and three entries, exit 0. The
standalone bundle consistency check also passed. The everyday installation was
not changed. Private installation receipts and the digest inventory are retained
outside the repository.

The initial verification wrapper failed while parsing empty helper stdout: the
macOS temporary-directory alias did not trigger the helper's direct-entry path.
Repeating with the installed script's canonical filesystem path produced the
expected checked result. Installation and byte comparison had already succeeded;
only that repeated invocation establishes the fixture result. No helper fix is
claimed by this documentation increment.

The [user retest record](first-use-overview.md#user-retest-readback--13-november-2026)
records positive feedback and independent output readback without inventing formal
human acceptance. The full suite at code revision `92c1c0b` and CI at `6d68b9c`
are prior evidence; they were not rerun as part of this documentation-only change.
Browser usability, intended-setup continuation and runtime effectiveness remain
unproved by the latest readback.

After the merge, a second fresh isolated home installed directly from
`injectionator/n8r-surface` without `--ref`, using the default-branch source.
Add/install/list exited 0 and delivered 0.1.14. All 25 installed files matched
merged commit `94553968e5682f3b11b9cd8a951499ebcb9c45c3`, with no extras;
the helper digest was unchanged and its synthetic check returned `checked`,
five relationships and three entries, exit 0. This establishes repository
marketplace delivery of the tested bytes. It does not promote old user pins,
publish to npm or establish additional research acceptance.

Existing users may keep their exact tested pin; updating to the merged revision
above produces identical plugin bytes. The everyday installation was left intact.
The blog remains a draft and has not been posted externally.

## Human documentation review

- [ ] Open this record and PR #73. Expect a named repository marketplace, an exact
  published commit and independently verified default-branch delivery, with no npm or universal
  directory publication claim.
- [ ] Open the [blog draft](../blog/2026-11-13-researcher-progress.md). Expect a
  useful source-investigation/save/continuation story, linked evidence and clear
  limitations. The last published release baseline is the
  [5 November npm prerelease](https://github.com/injectionator/n8r-surface/releases/tag/v0.1.0-experimental.2),
  not an invented skill 0.1.13 release. The tag bundled skill 0.1.8; later accepted
  0.1.11 repository distribution and 0.1.13 candidate work are distinct history.
- [ ] Follow its evidence links. Expect agent rehearsal, user feedback and pending
  acceptance to remain separate, with no private research findings or local paths.
- [ ] Report **Pass / Fail / Blocked**, the reviewed commit and any misleading
  passage. Fail for unsupported release or security claims; Blocked for unavailable
  evidence. No cleanup is needed for this document review. Blog posting remains
  separate from drafting.

For an installation rehearsal that leaves the active host alone, follow the
[isolated-home procedure](workspace-installation.md#isolated-maintainer-installation),
substituting the merged commit and expected version above. Retain receipts until
review, then remove only the temporary rehearsal home. This checks delivery;
it does not replace the [fresh-chat human tasks](first-use-overview.md#follow-up-human-tasks).
