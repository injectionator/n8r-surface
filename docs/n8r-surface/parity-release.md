# Shared-core parity release candidate

Package **0.1.0-experimental.6** and Researcher skill **0.1.17** prepare the
shared CycloneDX implementation already consumed by Labs for distribution.
The published version remains `.5` / skill `0.1.16`; this candidate is not a
registry release or a marketplace promotion. Preparation is authorized under
[issue #92](https://github.com/injectionator/n8r-surface/issues/92).

## Scope and dependency

This increment depends on [PR #88](https://github.com/injectionator/n8r-surface/pull/88)
and [PR #90](https://github.com/injectionator/n8r-surface/pull/90), starting from
`e3fef8f5d8986bf40a30e5d375050776009fad29`. It versions the public
`@n8r/surface/cyclonedx` consumer entry and bundled helper with source-URN
validation, useful schema diagnostics, clock-time privacy handling and ordinary
relationships without an alternative group. Alternatives still require a group.
There is no new research engine, read/report feature or CLI/BOM format migration.

Changed prerelease bytes advance the package's experimental suffix; skill
identity advances independently. Both plugin manifests and instruction identity
are 0.1.17. Old 0.1.16 candidates and installed copies can have differing helper
bytes: use exact source revisions and digests, not those labels alone.

Labs' inspected consumer baseline is commit
`2d50313ccdc81d7a0090cc99f2c521db201a6b5f`, pinning the e3fef8f archive with SHA-256
`dffdbab5eabb443d3ac2ff329be712c1776c6eefd2d4aa874d6b50b72ed35413`.
Labs supplies draft identity, timestamp, predecessor metadata, scoped storage,
concurrency checks and a **48 KiB** revision limit. The skill requires a complete
BOM and explicit predecessor. Shared validation does not make those hosts
identical. No active Labs dependency or user data is changed by this preparation.

## User outcome and evidence boundary

Given a supplied synthetic Surface containing ordinary relationship records and
annotation text `11:37:49`, checking and saving through the candidate helper
succeeds. A successor preserves the first revision's bytes and identity and
reopens through the installed public consumer. The Labs adapter can exercise
the same path only after its pinned-version guard is updated, as rehearsed below.
An alternative without a group still fails. This is supplied-document handling,
not evidence that a Researcher investigated a real system.

The starting installed 0.1.16 helper accepts the original example but refuses
clock text as sensitive material and an ordinary relationship with its group
omitted. The e3fef8f candidate accepts all three. Keep validation, persistence,
agent rehearsal and human research acceptance separate. A synthetic adapter
rehearsal cannot establish the quality of live-model research or browser UX.

## Agent rehearsal on 18 November 2026

The retained private candidate was built from clean commit
`7afd4384696501bd06893a9e63dedbb0e62bf40c` (`dirty: false`). Its archive is
`scoped/n8r-surface-0.1.0-experimental.6.tgz`, SHA-256:

```text
073bf2487df28b902991bf4be0e928ccdeac4dc6a88fb7ea5dee304681320bbf
```

Subsequent evidence documentation does not change that artifact's source identity.
It contains the initial preparation guide, not this later rehearsal record.
The installed bundled `surface.mjs` SHA-256 is
`055650bd5e448796a73d45880fa94418ede15c2ca1a41be2fdd916ee9277d040`.
The CLI's bundled instruction digest is
`sha256:3feda9d62d93ede6469ef1a02b883c20293efe050bc78de115f3a0ed4a4f78ad`;
it covers a different instruction set from Labs' digest and is not interchangeable.

| Check | Observed result |
| --- | --- |
| `npm test` on Node 22.23.2 / 24.22.2 / 26.13.0 | 248 passed per runtime, zero failed. Includes private/publishable packer checks; no registry writes. |
| `npm run check:package` on each runtime | Installed exports, skill identity/digest, assets, isolated startup and scripted terminal discovery passed. |
| `node scripts/check-cyclonedx-package.mjs` on each runtime | Production-only consumer validation, views and immutable revisions passed. |
| Same retained archive, installed helper and consumer on each runtime | Clock text and ordinary omitted group accepted; alternative omitted group refused with exit 1. |
| Same retained archive, helper/API persistence on each runtime | Helper saved revision 1; public API read it and saved revision 2; helper read 2 and saved 3; public API read 3. Original file hashes unchanged. |
| Unmodified Labs baseline with the new archive | **Blocked by deliberate version guard**, before tests could execute: unsupported shared Surface package. |
| Isolated Labs copy after version-guard update | Bun 1.4.4: 15 tests passed, zero failed, 120 assertions, including a supplied-document continuation rehearsal. |

The isolated Labs copy came from the exact commit above, not the active dirty
checkout. Only its dependency pointed to the retained archive; the package/skill
guard in `server/researcher.ts` and matching assertion in
`tests/researcher.test.ts` were advanced from `.5`/`0.1.16` to `.6`/`0.1.17`.
An additional local rehearsal exercised the actual worker/store adapter with a
scripted assistant call: check (no persistence), save revision 1, read that save
with the installed helper, save a standalone successor, submit its BOM as a Labs
successor draft, then read both histories. Labs retained the serial number and
predecessor digest; all revision-1 file hashes stayed unchanged. Generated brief,
journal and HTML files were read from disk. Host timestamps can make the two
successor BOMs differ; this is bounded interchange, not byte-identical host output.

The first GitHub run exposed a cold-cache setup gap: `npm ci` plus YAML-only
cache preparation left AJV registry metadata unavailable to the offline package
installer. Local checks had used a warm cache. Preparation now uses
`npm run cache:runtime` to fetch metadata and archives for all direct and
transitive runtime versions in the lockfile. This is an explicit networked setup
step; a fresh empty-cache preparation followed by `npm run check:package` passed
on Node 26.13.0, including terminal rehearsals. The package check stays offline.
This affects setup,
not the retained archive's shared helper bytes.

These were **agent technical rehearsals with supplied synthetic data**, not AI
research findings, a browser journey or human acceptance. Fresh-chat prompts in
the task list below have not been accepted by a human. The current Labs checkout
and its dependency pin remain unchanged. Adopting `.6` there requires a separate
consumer change covering its pin/provenance, version guard and assertion; merely
replacing the archive fails. Raw local logs, prepared fixtures, installed consumers
and saved revisions are retained privately with the candidate; no local paths or
application data are published here.

## Maintainer preparation

Use the normal clean checkout after the candidate commit and the
[distribution procedure](npm-distribution.md#build-and-inspect-candidates).
Retain its private scoped archive and `candidates.json`; verify `dirty: false`,
the full revision and archive SHA-256. Install that exact archive into a fresh
local consumer, with scripts disabled. Never rebuild an old released version.
Run source, package and public-consumer checks on Node 22/24/26. The helper needs
no runtime installation when extracted with its skill resources.

Use a real directory without symlink ancestors for saved Surface files, such as
an ignored directory beneath this checkout's `.local/`. The reader rejects
symlink paths. Do not substitute a platform's symlinked temporary path.

Supply the tester with the installed candidate, an empty test folder, and the
synthetic example from the candidate's
`plugins/n8r-surface/skills/research/references/examples/surface.cdx.json`.
Name that copy `draft.json`. Add `Captured at 11:37:49.` to the first annotation's
text. In an ordinary (non-`alternative`) relationship property's JSON value,
omit `group`. Keep the original example unchanged. This is a deliberate test
fixture, not a discovered finding. Confirm the candidate helper accepts it.

## Human verification task list

Prerequisites: a host that can run the installed skill helper and write local
files, Node 22/24/26, and the maintainer-prepared fixture and empty test folder.
Open the candidate skill **0.1.17**, not a cached 0.1.16 installation. Supply the
absolute fixture and test-folder paths in place of the bracketed text below.

- [ ] Ask: “Using the supplied Surface at [draft.json], check and save it to
  [empty test folder]/001 with the installed Surface helper. This is synthetic
  verification data; do not investigate or add findings. Report the helper and
  skill versions and the actual result.” Expect successful validation and
  `saved-and-read-back`, revision 1. There must be no privacy refusal for the
  clock text or requirement for an ordinary relationship group.
- [ ] Open `001/surface.html`, `001/brief.md`, `001/investigation.md` and
  `001/surface.cdx.json`. Expect the synthetic graph, evidence and gaps, and the
  clock text in the BOM. Ask the host to read back `001` with the helper; expect
  `checked`, the same serial number and revision 1.
- [ ] In a fresh chat with the same candidate, ask: “Read [test folder]/001.
  Save an unchanged-claims successor to [test folder]/002, using 001 as the
  predecessor. Preserve identity, evidence and all original files; add only
  required revision and predecessor metadata. Read it back.” Expect revision 2,
  the same serial number, the original BOM's SHA-256 as predecessor digest,
  and a reference to revision 1. Ask for before/after hashes of all four files
  in `001`; they must be identical.
- [ ] Ask: “In a disposable copy of the original supplied draft, remove the
  group from an alternative relationship and check it without saving.” Expect
  refusal (helper exit 1), with no new saved revision. Restore nothing in `001`:
  this negative check must use a separate draft.
- [ ] Report **Pass / Fail / Blocked**, candidate revision and archive digest,
  Node version, helper results, predecessor hashes and which files you opened.
  Wrong identity, changed predecessor bytes, missing views or accepted invalid
  alternatives are Fail. Missing candidate/helper access is Blocked. Retain
  evidence; remove only the disposable test folder after review.

These prompts are human acceptance steps. Direct helper and adapter execution by
an agent is a separate technical rehearsal; it does not count as a fresh-chat
human acceptance result.

## Release decisions and recovery

Review readiness, merge of the dependency stack, marketplace promotion and npm
publication are separate decisions. Keep the preparation PR draft. After
approval, build the publishable archive from the reviewed clean release commit
on `main`, with a new permanent annotated `v0.1.0-experimental.6` tag. Local
private candidates are not the publishable bytes; retain each report separately.

The manual release workflow is guarded for `.6`. After explicit authorization,
follow the [previous staged release procedure](npm-release.md#preparation-and-publication)
using **v0.1.0-experimental.6** for every operation. `prepare` creates the fresh
publishable archive and draft release once; `stage` submits those retained bytes
for maintainer 2FA; `verify` independently checks the published bytes. Never run
these operations for `.5` again. No workflow dispatch is part of local preparation.

Check current registry state before staging. An existing version must be verified,
never republished. On partial failure retain the exact original assets and follow
the [recovery procedure](npm-release.md#prepare-and-stage-retained-artifacts);
never replace an archive silently. Registry signatures, signed provenance,
source/workflow identity, installed registry readback and final immutable release
verification remain pending until publication. Do not promote `latest`.
