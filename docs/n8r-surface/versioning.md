# Package version and release identity

The distribution plan is **`@n8r/surface` only**. Its authoritative version is
`package.json`; the lockfile must agree, and the installed command reads its own
manifest for `--version`. Package versions do not version the AI Surface Model,
Researcher skill or individual saved Surface revisions.

The maintainer removed unscoped publication and name reservation from the plan
on 5 November 2026. The first verified release is
[`@n8r/surface@0.1.0-experimental.2`](npm-release.md#verified-scoped-release).
Historical dual archives remain evidence, not a second supported package or a
future publication commitment. Current tooling prepares only the scoped package; preparation does not authorize
a release.

## Compatibility and version changes

Follow [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html) for package releases.
The compatibility boundary covers documented library exports, supported Node
majors, command inputs/exit behavior, settings and persisted formats. Provisional
model semantics remain provisional; a package number does not establish universal
model conformance. Document migration requirements for breaking changes.

| Stage | Breaking change | Compatible feature | Compatible fix |
| --- | --- | --- | --- |
| Before 1.0 | Increment minor, reset patch | Increment minor, reset patch | Increment patch |
| From 1.0 | Increment major, reset minor/patch | Increment minor, reset patch | Increment patch |

Before 1.0, this is a project compatibility convention stronger than SemVer's
allowance for initial development. A major release of 1.0 requires an explicit
compatibility decision, not simply a successful build. Prereleases use a suffix
such as `-experimental.1` or `-rc.1`; increment it for changed prerelease bytes.
Never reuse a released number. Release versions exclude `+build` metadata to
avoid distinct Git tags representing the same npm version identity.

Use `npm version VERSION --no-git-tag-version` for an approved version change,
then review both manifests in the issue's PR. `npm run check:version` rejects
invalid versions and drift in either lockfile version. `npm test` and candidate
packing run that check. A version bump needs no source-code edit for CLI output.
The maintainer authorized the next release on 14 November 2026. The current
release is `0.1.0-experimental.5`; required account actions remain separate. See
the [release procedure](npm-release.md#experimental5-release).

npm distribution tags are movable pointers, unlike permanent Git release tags:

- Experimental prereleases use explicit `experimental` on the scoped package.
- Release candidates use explicit `next`; they must not update `latest`.
- Stable releases may use `latest` only after the scoped exact-version route passes
  verification and promotion is authorized. Publish initially under `next` to
  permit independent readback before promotion.

## One version, one commit, one release

After release authorization, use a clean, reviewed commit with the approved
version. Create one annotated `vVERSION` Git tag pointing to its full commit SHA;
never move, overwrite or delete a release tag. Create the corresponding GitHub
Release as a draft with `target_commitish` explicitly set to that SHA and the
prerelease flag matching the version. Do not use a moving branch as the target.

Enable [GitHub release immutability](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/prevent-release-changes)
before publishing a release. Attach all evidence before finalizing the draft:
GitHub then locks its tag and assets. The verifier rejects published releases
that do not report `immutable: true`. No repository settings are changed by
these local tools. Review/approval of the selected commit is a maintainer
prerequisite; the verifier checks identity, not the adequacy of code review.

Retain the approved scoped archive, its digest report, build environment, test
evidence, release notes and registry readback. SHA-256 identifies bytes; it does
not authenticate the builder. Do not rebuild or alter a published version.

The packer produces one scoped archive. Preserve the historical reports and both
archives for verification of `.1` and `.2`; their version-specific verification
still checks both. Source and default candidates remain private. Never strip a
guard from an old tarball and retain its old digest or source claim.

## Read-only verification commands

From the clean source checkout corresponding to the retained candidates, with
Node 22/24/26, Git, POSIX `tar`, and GitHub CLI authenticated for read access:

```sh
npm run check:version
npm run check:release -- /path/to/candidates
```

The second command reads GitHub's release API and resolves the remote tag. It
checks the source and lockfile versions, clean HEAD, report revision/dirty flag,
local and remote tag targets, release target SHA and prerelease flag, required archive
manifests and hashes, and matching uploaded asset names/digests. It fails closed
on missing data or API errors. A passing JSON result includes the version,
revision, tag, draft status, `evidence: "GitHub API readback"`, and explicit
`npmPublication`/`provenance` values of `"not checked"`. No files or remote state
are changed. Published releases also require immutability and non-private archives.

For offline checking of a previously saved raw GitHub REST release response:

```sh
npm run check:release -- /path/to/candidates /path/to/release.json
```

This deliberately reports `evidence: "offline metadata rehearsal"`. It does not
contact GitHub or verify a remote tag. Handwritten or stale JSON is not live
release evidence. The report is also not a reproducible-build proof: validating
its claimed revision cannot prove arbitrary supplied artifacts were built from
that revision. Authenticated build provenance and registry readback remain
required. This checker remains read-only. The separate [release workflow](npm-release.md)
performs explicitly selected publication; registry permissions remain external.

## Authentication, provenance and incomplete releases

Future publication requires an authorized npm identity with write access to
`@n8r/surface`. Unscoped ownership, reservation and defensive publication are
out of scope. The first release used a stage-only token, followed by maintainer
2FA approval; [the release record](npm-release.md#verified-scoped-release)
contains the observed results.

Prefer [trusted publishing](https://docs.npmjs.com/trusted-publishers/) from the
public repository on GitHub-hosted runners for future scoped releases. Configure
only `@n8r/surface` for the reviewed workflow/environment. This has not yet been
exercised. Recheck npm's current requirements before setup; a newly configured
publisher must complete a successful publication within two days or be recreated.
Keep credentials outside tracked files.

For the exact scoped registry version, verify registry signatures and the
package's own provenance, source repository/commit, workflow identity and subject
digest. Compare downloaded bytes with the retained SHA-256 and registry integrity.
Exercise the documented isolated installation and npm-exec route. An attested
dependency or matching repository text alone is insufficient.

If submission or verification fails, keep the release incomplete and retain its
exact archives. Check whether the version already exists before retrying; verify
existing bytes instead of overwriting or silently rebuilding them. A mismatch
requires a new approved version. Finalize the immutable GitHub Release only after
the scoped package passes acceptance. Promote `latest` only after a separate
promotion decision; no unscoped publication is required.

## Human check for this increment

Maintainer preparation: provide this branch, installed dependencies and the
candidate setup from [the distribution guide](npm-distribution.md#build-and-inspect-candidates).
No npm credentials, real Git tag, GitHub Release or global-install change is needed.
Keep the current terminal with `candidate_run` set by that guide.

- [ ] From the checkout root run `npm run check:version`. Expect
  `Version consistent: 0.1.0-experimental.5`, exit 0. Inspect `package.json` and
  both root version fields in `package-lock.json`; they must match.
- [ ] Follow the [candidate install steps](npm-distribution.md#human-verification)
  for the scoped package. In its consumer directory run:

  ```sh
  node -p 'require("./node_modules/@n8r/surface/package.json").version'
  ./node_modules/.bin/n8r-surface --version
  ```

  Expect
  `0.1.0-experimental.5` and `n8r-surface 0.1.0-experimental.5`, both exit 0.
- [ ] Inspect `candidates.json`: one scoped entry has its `releaseAsset` name,
  the report version/revision, and a hash matching the retained tarball.
  A clean-commit rehearsal must say `dirty: false`.
- [ ] Read the compatibility table and release/recovery procedure above. Expect
  one permanent Git tag and exact commit for the scoped package; `experimental`
  and `next` do not silently promote `latest`.
- [ ] Report **Pass / Fail / Blocked**, Node/npm versions, report revision and
  the scoped CLI output. Version drift or missing artifacts is Fail. Missing real
  release/authentication is Blocked for live release verification, not a reason
  to create a tag or publish. Clean up only the temporary consumer directory
  created by the distribution procedure after retaining needed evidence.

Automated technical evidence: `tests/version.test.mjs` changes a copied installed
manifest to `0.7.3-rc.2` and asserts CLI readback; `tests/release.test.mjs` uses
throwaway Git repositories, tags, archives and metadata to exercise success and
rejection paths. These tests are synthetic, not a real GitHub Release or registry
publication. Agent rehearsal and human acceptance remain separate.
