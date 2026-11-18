# npm release records

## Verified experimental.5 release

Published on 14 November 2026:
**[`@n8r/surface@0.1.0-experimental.5`](https://www.npmjs.com/package/@n8r/surface/v/0.1.0-experimental.5)**,
bundling Researcher skill **0.1.16**, from commit
`b787d091db1c5dcd21f77c97518f05cca08cc665` and permanent annotated tag
`v0.1.0-experimental.5`. The
[GitHub prerelease](https://github.com/injectionator/n8r-surface/releases/tag/v0.1.0-experimental.5)
is finalized and independently read back as `immutable: true`.

The existing stage-only credential submitted the retained scoped archive;
the maintainer approved it with npm 2FA. Registry bytes match retained SHA-256
`289db285717580ddfc7ff6b9543198c073f7509ff14e78eb03ae97368793516a`.
Registry signatures and the package's own signed provenance verified against the
exact workflow/tag identity, source commit and subject digest. Installed exports,
assets, skill instruction digest, CLI identity and isolated closed-input startup
passed on Node 22.23.2, 24.22.2 and 26.13.0. Fresh-cache npm-exec returned the
exact release version. See the attached
[registry verification](https://github.com/injectionator/n8r-surface/releases/download/v0.1.0-experimental.5/scoped-registry-verification.json)
and [workflow readback](https://github.com/injectionator/n8r-surface/actions/runs/43591235030).

Use the exact version or `experimental`; `latest` remains `0.0.0-stage`.
No unscoped package was published. Trusted publishing remains unexercised.
The CLI and skill retain distinct save formats. Release checks are agent
rehearsals, not new human research acceptance; the
[first-use web delivery limits](first-use-access.md) remain explicit.

## Verified scoped release

Published on 5 November 2026:
**[`@n8r/surface@0.1.0-experimental.2`](https://www.npmjs.com/package/@n8r/surface/v/0.1.0-experimental.2)**,
from commit `f38153645cd12f7ea60f76af251edfbaebb73409` and permanent tag
`v0.1.0-experimental.2`. The
[GitHub prerelease](https://github.com/injectionator/n8r-surface/releases/tag/v0.1.0-experimental.2)
is finalized and read back as `immutable: true`. Its attached
[verification summary](https://github.com/injectionator/n8r-surface/releases/download/v0.1.0-experimental.2/scoped-registry-verification.json)
records the exact digest and checks.

The maintainer approved **scoped-only** publication after npm accepted the scoped
stage but rejected the unscoped submission with E403. `n8r-surface` remains the
executable name; the unscoped registry package was not published or secured.
Its archive remains retained solely as evidence of the original dual build.
Unscoped publication and name reservation have since been removed from the plan.

Independent readback verified registry bytes against the retained archive,
installed library/assets and CLI identity on Node 22.23.2, 24.22.2 and 26.13.0,
empty-home startup and a fresh-cache npm-exec invocation. npm audit verified
registry signatures and the scoped package's provenance. Separate cryptographic
verification required the exact GitHub workflow/tag certificate identity; the
attestation subject digest and source commit/repository matched the release.
These release checks are not new real-model research evidence.

Use the exact version or npm tag `experimental`. `latest` still points to npm's
`0.0.0-stage` placeholder; it has not been promoted. The `.1` preparation stopped
before npm staging because of a faulty remote-tag API lookup. Its permanent tag
and unpublished draft artifacts remain retained.

## Experimental.5 release

The maintainer authorized a new scoped release on 14 November 2026 after accepting
PR #82. Version `0.1.0-experimental.5` packages the current library/CLI and
Researcher skill 0.1.16. Earlier `.3`/`.4` candidates remain distinct; their older
CLI evidence does not establish current release behavior. Only `@n8r/surface`
is built or submitted. The source stays private and `latest` is unchanged.

This release includes self-contained CycloneDX Surface saves in the skill,
connected overviews and journals, instance-first investigation and progressive
source-access guidance. CLI save formats remain separate; bundling the skill does
not establish CLI/BOM parity. The [first-use evidence](first-use-access.md)
records useful signed-in web responses but unresolved portable delivery/helper
execution. Those limits remain; publication does not establish end-to-end web
acceptance, runtime conformance or consumer compatibility.

### Preparation and publication

Start at the reviewed, clean release commit after Node 22/24/26 tests and installed
package checks pass. Confirm GitHub account/repository and commit author. Create
an annotated `v0.1.0-experimental.5` tag and push only that tag. It must be on `main`.
Do not reuse or move a permanent release tag.

```sh
gh workflow run npm-release.yml --ref v0.1.0-experimental.5 -f operation=prepare
```

The workflow builds one fresh publishable scoped archive, records its revision and
SHA-256, retains a build artifact and creates a draft prerelease. Inspect its
`candidates.json` and archive manifest: exact version, `@n8r/surface`,
`private: false`, public registry and `experimental`. The source remains private.
Download those assets; do not rebuild between preparation and staging.

```sh
gh workflow run npm-release.yml --ref v0.1.0-experimental.5 -f operation=stage
```

The existing stage-only `NPM_BOOTSTRAP_TOKEN` route requires valid package write
access. An expired credential blocks staging; renew it outside tracked files or
review trusted publishing separately. A stage is not publication. Inspect the
reported stage ID and validation state, then approve that exact stage with npm
2FA. [npm's staged-publishing procedure](https://docs.npmjs.com/staged-publishing/)
was rechecked on 14 November 2026. After approval:

```sh
gh workflow run npm-release.yml --ref v0.1.0-experimental.5 -f operation=verify
```

Independently verify registry signatures and the package's own signed provenance,
workflow/tag identity, source commit and archive digest. Exercise the isolated
installation below on supported Node majors and a fresh-cache exact-version
npm-exec route. Attach evidence and release notes before finalizing the immutable
GitHub prerelease. Verify `immutable: true` afterward. Never promote `latest` as
part of this procedure. Failed staging/readback leaves the draft incomplete;
retain its bytes and verify existing registry state before retrying.

### Human verification task list

Maintainer preparation: provide the retained scoped archive from the draft release
in a temporary directory, with Node 22/24/26 and npm installed. Run from that
directory; `ARCHIVE` below is the archive's absolute path. No normal installation,
Codex sign-in or research vault changes are needed.

- [ ] Create an isolated consumer and install the archive:

  ```sh
  export ARCHIVE="$PWD/n8r-surface-0.1.0-experimental.5-scoped.tgz"
  mkdir consumer
  cd consumer
  npm init --yes
  npm install --ignore-scripts --no-audit --no-fund --package-lock=false "$ARCHIVE"
  node --input-type=module -e 'import {decode} from "@n8r/surface"; console.log(typeof decode)'
  ./node_modules/.bin/n8r-surface --version
  ```

  Expect exits 0, `function`, and `n8r-surface 0.1.0-experimental.5`.
- [ ] Inspect `node_modules/@n8r/surface/plugins/n8r-surface/plugin.json`.
  Expect skill version `0.1.16`. This does not install a plugin into a web host.
- [ ] Exercise closed-input startup in an isolated home:

  ```sh
  mkdir empty-home
  env HOME="$PWD/empty-home" USERPROFILE="$PWD/empty-home" ./node_modules/.bin/n8r-surface </dev/null
  echo "$?"
  ls -A empty-home
  ```

  Expect setup guidance, exit **1**, and an empty home. Missing imports, wrong
  versions or home writes fail. After publication, repeat installation using
  `@n8r/surface@0.1.0-experimental.5` in a new consumer and compare the result.
- [ ] Report **Pass / Fail / Blocked**, Node/npm versions, archive digest and CLI
  output. Missing archive/authentication is Blocked; any unexpected behavior is
  Fail. Keep evidence, leave the consumer and remove only these temporary files.

Agent rehearsal and human acceptance are separate. Build/registry evidence is
attached to the release; see the verified record above. These steps describe the
completed preparation and must not rebuild or restage its permanent version.

## Retained preparation procedure

The procedure below records the original dual-package preparation. Its two-name
acceptance requirement was superseded by the maintainer's scoped-only decision.
Do not rerun it for the released version. The current workflow targets scoped experimental.5; the historical commands
below are retained as first-release evidence only. Future
releases require updated version guards, reviewed
authentication configuration, and a new permanent version/tag. Trusted publishing
has not been exercised; this release used stage-only token authentication and
maintainer 2FA approval.

## User outcome and starting evidence

Given private local candidates and no verified registry versions, the maintainer
can prepare both publishable archives from one reviewed commit, publish their
retained bytes with provenance, and independently install either exact version.
The source remains private to prevent publishing the checkout accidentally.

The original installed/candidate checks passed, but those archives were private.
Before this increment, `npm whoami` returned E401 and both names returned E404.
After interactive login, npm identified the intended account and confirmed its
`n8r` owner role. Both names still returned E404. These responses do not prove
name availability or successful first publication. At that starting point, no placeholder existed.

## Maintainer preparation

1. Review and merge the release-preparation PR after acceptance. Merging is a
   separate maintainer decision. The workflow must exist on the default branch.
2. Use an authorized npm account with `n8r` organization rights and permission
   to create the unscoped package. For this first release, the selected route is
   a short-lived granular npm token with package **read/write (stage only)**
   permission covering `@n8r/surface` and the new unscoped `n8r-surface`.
   Selecting package `n8r` or scope `@injectionator` is insufficient. If npm
   cannot select an unpublished unscoped name, temporarily use all-packages
   coverage; organization-management permissions are unnecessary. Store it only as
   repository Actions secret `NPM_BOOTSTRAP_TOKEN`. Never put it in a command,
   issue, report or committed file. npm account 2FA remains enabled.
3. Enable **Settings → General → Releases → Enable release immutability** before
   creating the draft. An administrator may be needed; an API 404 under a
   non-admin account is not proof the setting is disabled.
4. Verify all required Node 22/24/26 checks on the reviewed revision. From its
   clean checkout, create an annotated `v0.1.0-experimental.2` tag and push only
   that tag. Never move or reuse it. Record its full commit SHA.

References checked 5 November 2026: [npm token setup](https://docs.npmjs.com/creating-and-viewing-access-tokens/),
[provenance](https://docs.npmjs.com/generating-provenance-statements/),
[trusted publishing](https://docs.npmjs.com/trusted-publishers/), and
[release immutability](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/prevent-release-changes).
Trusted publishers require existing packages. npm offered stage-only tokens;
the maintainer explicitly approved staged first publication, including the
public `0.0.0-stage` placeholders it creates. The actual release versions require
maintainer approval with 2FA. See [npm staged publishing](https://docs.npmjs.com/staged-publishing/).

## Human check before publication

Prerequisites: the PR checkout with dependencies installed, Node 22/24/26, npm,
Git and POSIX `tar`. Staging uses npm 11.20.0 (staging requires 11.15+). Start in the repository root. These steps require no npm
write credentials and do not alter normal settings or installations.

- Create fresh publishable candidates:

  ```sh
  release_run=$(mktemp -d)
  npm run pack:candidates -- "$release_run/packages" --publishable
  tar -xOf "$release_run/packages/scoped/n8r-surface-0.1.0-experimental.2.tgz" package/package.json
  ```

  Expect exit 0, version `0.1.0-experimental.2`, name `@n8r/surface`,
  `private: false`, public npm registry/access and tag `experimental`.
  The source `package.json` must still have `private: true`.
- Install and run the preferred archive:

  ```sh
  mkdir "$release_run/consumer"
  cd "$release_run/consumer"
  npm install --offline --ignore-scripts --no-audit --no-fund --package-lock=false "$release_run/packages/scoped/n8r-surface-0.1.0-experimental.2.tgz"
  node --input-type=module -e 'import {decode} from "@n8r/surface"; console.log(typeof decode)'
  ./node_modules/.bin/n8r-surface --version
  mkdir "$release_run/home"
  HOME="$release_run/home" USERPROFILE="$release_run/home" ./node_modules/.bin/n8r-surface </dev/null
  echo "$?"
  ls -A "$release_run/home"
  ```

  Expect install/import/version exits 0, `function`, and
  `n8r-surface 0.1.0-experimental.2`. Bare startup prints setup guidance,
  exits **1**, and leaves the isolated home empty.
- Repeat in a new consumer and home directory using the `unscoped/` archive
  and import `n8r-surface`. Expect identical behavior, with that installed name.
- Report **Pass / Fail / Blocked**, both CLI outputs, Node/npm versions and
  candidate revision/dirty flag. Unexpected version, missing imports, or home
  writes are Fail. Missing prerequisites are Blocked. Leave the consumer and
  remove only the temporary directory created above after retaining evidence.

## Prepare and stage retained artifacts

The manual [workflow](../../.github/workflows/npm-release.yml) accepts only the
annotated first-version tag, requires it to be on `main`, and checks clean source.
Preparation runs tests and both installed-package suites, builds both archives
once, retains the complete build as an Actions artifact for 90 days, and stores
the archives with `candidates.json` on a draft GitHub Release. An existing
release prevents preparation from rebuilding. Downloads and hash validation are
performed before any publication. Network access includes npm, GitHub and Sigstore;
write effects are draft release assets and, only for `stage`, npm staged versions and first-package placeholders.

From the repository root with GitHub CLI access:

```sh
gh workflow run npm-release.yml --ref v0.1.0-experimental.2 -f operation=prepare
gh run list --workflow npm-release.yml --limit 1
```

Inspect the run and draft assets; record the run ID and full source revision.
Preparation must finish successfully before selecting staging:

```sh
gh workflow run npm-release.yml --ref v0.1.0-experimental.2 -f operation=stage
```

The publisher reads both registry versions first. An existing version must match
retained SHA-256 and registry SHA-512 integrity and expose provenance metadata;
only absent versions are staged. Existing stages are downloaded and compared
to retained SHA-256 before they are reused; duplicate stages or differing bytes
stop the run. Non-404 lookup errors stop the run. The
workflow never finalizes the GitHub Release and never promotes `latest`.
Provenance metadata presence is not cryptographic verification.

On partial failure, retain the draft and its exact assets. Retry **stage** only
after diagnosing the failure; never rerun preparation or rebuild a published
version. Existing bytes that differ require a new approved version for both
packages. If draft creation succeeds but an upload fails, recover missing assets
from the original run's `npm-release-COMMIT_SHA` Actions artifact. Download it
with `gh run download RUN_ID -n npm-release-COMMIT_SHA -D NEW_DIRECTORY`, verify
`candidates.json` revision and each archive SHA-256, and upload only missing
assets without `--clobber`. Run `check:release` before retrying staging.
Keep a durable independent copy before the 90-day retention expires. If the
original bytes cannot be recovered, stop; do not regenerate them.

## Approve each staged version with 2FA

Open npm's **Staged Packages** page as the authorized maintainer. For each of
`@n8r/surface` and `n8r-surface`, inspect version `0.1.0-experimental.2`, tag
`experimental`, the workflow's stage ID and downloaded bytes. Approve each with
2FA. Alternatively run `npm stage approve STAGE_ID` in your authenticated terminal.
These actions publish the real versions; the placeholders are not acceptance.

Then run the read-only verification operation:

```sh
gh workflow run npm-release.yml --ref v0.1.0-experimental.2 -f operation=verify
```

Expect success only when both exact registry versions match retained bytes and
expose provenance metadata. This operation cannot stage or approve anything.

## Independent registry acceptance and finalization

For each package, use a separate fresh consumer outside the checkout. Install
its exact version with lifecycle scripts disabled, run `npm audit signatures`,
read the installed name/version, import `decode`, run `--version` and the isolated
closed-input startup above. Also exercise the two explicit one-off routes:

```sh
npm exec --yes --package=@n8r/surface@0.1.0-experimental.2 -- n8r-surface --version
npm exec --yes --package=n8r-surface@0.1.0-experimental.2 -- n8r-surface --version
```

Both must print `n8r-surface 0.1.0-experimental.2` and exit 0. Download each
registry tarball and compare its bytes/digests with the draft assets. Inspect
its own provenance attestation, including source repository, full commit,
workflow identity and subject digest; an attested dependency is insufficient.
Record registry `dist.integrity`, publication and install results independently.

After both routes pass, configure trusted publishing separately for both names:
GitHub owner `injectionator`, repository `n8r-surface`, workflow `npm-release.yml`,
no environment, permission to stage. Keep maintainer 2FA approval for promotion. A new configuration must succeed within
two days; do not configure it long before its next use. Verify the configuration
and its first actual OIDC publication before claiming it works. Remove the
bootstrap secret and revoke its token when no longer needed. A future version
requires a reviewed update to the deliberate first-version guards.

Attach independent evidence and final release notes, then finalize the draft
with prerelease true and latest false. Read it back with `check:release` and
require `immutable: true`. Finalization remains blocked on failed registry,
provenance, identity or immutability checks. Record **Pass / Fail / Blocked** with
both package results; local rehearsals do not establish a completed release.
