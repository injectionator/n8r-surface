# Contributing

The model is an early draft. Concrete cases and counterexamples are particularly
useful: what does the Surface contain, what is known, and what question should
someone be able to answer from its saved description?

Open an issue for a use case, modeling question, interoperability finding or
proposal. Pull requests should explain the problem, the proposed semantics and
what information remains unknown.

## Propose a change or extension

This is the level 400 reading path from the [README](README.md). Familiarity with
the [draft concepts](spec/README.md) and [synthetic examples](examples/README.md)
will help you explain where a proposal fits. There is no stable extension API or
namespace mechanism yet; extensions begin as design proposals.

Choose the closest issue template: a concept proposal, interoperability question,
example submission or defect report. Before opening another issue, search for an
existing discussion of the same problem.

1. **Describe a concrete question.** Who needs to answer it, what information do
   they have, and what is difficult to express with the current concepts?
2. **Show the smallest useful example.** Use synthetic data, stable component
   identities and explicit unknowns. State the scope and what is omitted.
3. **Explain the proposed meaning.** Identify affected concepts, relationships
   and evidence. Explain how partial descriptions and historical Run references
   remain useful, and whether existing examples would need to change.
4. **For interoperability, bound the claim.** Name source and target versions,
   the supported subset, transformations and losses. Separate a proposed mapping
   from results you have actually observed with a named consumer.
5. **Set acceptance checks.** Describe an example, counterexample or question
   that would demonstrate the improvement. Agree the scope before implementing.

See [interoperability research](docs/interoperability.md) for the evidence expected
of compatibility claims. Include only material you have permission to publish;
do not submit credentials, private deployment details or personal data.

## Issue, branch and pull request workflow

Follow this sequence for each contribution, including documentation changes:

1. **Start with an issue.** Find or open the issue that describes the user task,
   initial state, actual interaction, intended state change and observable
   verification evidence. Use the [command outcome spec](docs/n8r-surface/command-outcomes.md)
   for command/Researcher work. Agree the scope before editing; attempt the current
   product path or record why it is unavailable before implementing the gap.
2. **Create a branch from updated `main`.** Use a dedicated branch such as
   `docs/123-model-links`, with the issue number in its name. Work in the existing
   checkout and preserve unrelated changes.
3. **Do the work and open a draft PR.** Commit and push the branch, open one
   matching draft PR. Use `Closes #123` when it completes the issue; use
   `Related to #123` for a partial increment and list the work still outstanding.
   Explain the change and record the relevant checks. Repeat the original user
   interaction and independently read back the changed state; report blocked or unproved outcomes explicitly.
   Internal tests do not establish end-to-end product acceptance. Keep the same
   branch and PR updated as the work develops.
4. **Review, then merge.** Keep the PR draft until review readiness is approved.
   Merge, release and deployment are separate decisions.
5. **Return to `main` after the merge.** While still on the completed branch, use
   `./scripts/flow done` as described below. Once cleanup succeeds, start the next
   issue on a new branch from the updated `main`.

The [Git workflow in AGENTS.md](AGENTS.md#git-workflow) gives the full branch,
workspace and publication rules, including the prohibition on Git worktrees.

Write simple acceptance checks as plain-language examples: given these files,
when the user runs this command, then they see this output, verified by these
process/output/file checks. Representative terminal output is useful; a technical
DSL or a large per-check form is unnecessary. See the
[bare startup example](docs/n8r-surface/command-outcomes.md#startup-01-run-the-command-and-see-what-is-here).

Every PR includes human verification steps with an exact starting state, commands
or interactions, expected output/exit codes, readback and cleanup. Explain any
variable output and failure conditions; rehearse the steps before requesting
review. Include a runnable example in the PR, even when it also links to a longer
guide. See the [bare-startup human check](docs/n8r-surface/startup-human-check.md).
Agent execution of the procedure does not replace human acceptance.

Write these steps for a teammate who has not followed the implementation: what
to open, what to do or ask, and what they should see. Keep technical preparation
and evidence checks with the maintainer; give the tester a short task list and a
Pass / Fail / Blocked report. The [local vault's walkthroughs](docs/n8r-surface/researcher-vault.md#try-the-installed-skill)
provides prepared files and walkthroughs that assume the skill is installed.

Keep the human proof proportional to the change. With an established installation
and working runner, a small command addition may need just an invocation and its
expected result/readback. State and reuse those prerequisites, link to setup, and
leave broad regression coverage to automation. Repeat or expand setup checks when
the change affects them; the comprehensive startup guide is a foundation example,
not the required length for every later increment.

Grow the spec and working verification one useful behavior at a time. Existing
behavior can gain a documented intent and repeatable verification without a code
change. Keep [progress and evidence](docs/n8r-surface/command-outcomes.md#grow-the-specification-with-working-verification)
current so readers can distinguish plans, implementation and verified outcomes.

## Cleanup after a merge

Merging a PR on GitHub updates the remote repository; it does not switch your
local checkout back to `main`. The `flow` script is a helper for completing this
step safely, so the next contribution starts from the updated base.

After the PR is merged, run this from the repository root while still on its
completed branch. Let the helper switch branches for you:

```sh
./scripts/flow done
```

On success, you are on updated `main` and the completed local branch is removed.
If the helper refuses, read the reason and preserve or resolve the outstanding
work before retrying. Do not bypass its checks with a reset or forced deletion.
Use `./scripts/flow help` for a reminder of the command's purpose.

The [flow helper](scripts/flow) requires Bash 3.2 or later, Git and an authenticated
[GitHub CLI](https://cli.github.com/) (`gh auth login`). It reads PR metadata from
GitHub and fetches `main` from `origin`, so network access is required. Credentials
stay in your existing Git/GitHub CLI configuration.

The command verifies that the PR belongs to the current branch in `origin`, is
merged into `main`, and has the same head commit as the local branch. It checks
that the merge commit is present on the fetched `origin/main`, fast-forwards
local `main`, then deletes only the completed local branch. This also works after
a squash or rebase merge, whose history may not contain the original branch tip.

The checkout must have no uncommitted or untracked work, and local `main` must
already exist and be able to fast-forward. Ignored files are preserved if they
would be overwritten. Missing, open, draft, closed-without-merge, fork and non-main
PRs are refused, as are differing local commits. Verification failures retain the
branch. If switching succeeds but updating `main` fails, you may be left on `main`
with the feature branch retained; the error reports the current checkout.

Invoking `done` authorizes that local branch deletion. Agents should run it only
when cleanup is authorized, after the merge is confirmed. Finish other Git
operations first and avoid concurrent changes to the checkout. This helper
provides only `done` and `help`; it does not merge PRs, delete remote branches,
clean other branches, create releases or stop services.

Run the offline helper checks with Python 3.9 or later and Git:

```sh
bash -n scripts/flow
python3 -m unittest discover -s tests -v
```

The tests use disposable local repositories and a GitHub CLI stub. They do not
use GitHub credentials, access the network or change this repository's branches.

## Contribution principles

See the [Researcher library checks](#researcher-contract-library) when changing
the experimental TypeScript contracts or fixtures.

- Keep partial descriptions useful. Do not require unrelated detail for a task.
- Preserve the distinction between declared configuration and observed behavior.
- Retain identities, sources, time and uncertainty where relevant.
- Prefer existing standard meanings when they fit; explain mapping losses.
- Label examples as synthetic or identify their permitted evidence sources.
- Include only material you have the right to publish; use placeholders for
  credentials and synthetic configuration in public examples.
- Distinguish proposals from released capabilities and verified interoperability.

## Checks before a pull request

Run these from the repository root, including for new files. GitHub runs the
[repository checks](.github/workflows/checks.yml) on pull requests and pushes to
`main`. Tool versions and action commits are pinned in the workflows; update the
commands here when changing those pins.

The Researcher job runs `npm ci`, `npm test` and `npm run check:package` on
Node.js 22, 24 and 26 on Linux, with Python for the installed-command terminal
rehearsal. It also caches the runtime dependency's registry metadata before the
offline consumer install. See [Researcher contract library](#researcher-contract-library) for
the same local commands, prerequisites, side effects and verification limits.
CI uses synthetic inputs and does not invoke an AI runner or publish packages.

### Offline fixtures and tooling

With Bash 3.2+, Git and Python 3.9+:

```sh
bash -n scripts/flow
python3 -m unittest discover -s tests -v
git diff --check
```

The tests parse every JSON file under `examples/`. For the current LibreChat
fixtures they also check unique local identifiers, relationship endpoints, secret
requirements and preserved component identities between minimal and expanded
descriptions. New example families need their own reference checks as appropriate.
These are fixture integrity checks, not a schema validator or model conformance
suite. Unknown and omitted information remains valid in these examples.

The workflow-helper tests use temporary local repositories and a stub for GitHub.
They require no credentials or network access and do not alter your checkout.
Review new, untracked files too; `git diff --check` does not include them until
they are staged. Python may create ignored `__pycache__` directories.

### Markdown and local links

With Node.js 22+ and npm, run the same Markdown linter version as CI:

```sh
npx --yes markdownlint-cli2@0.24.0
```

This downloads the checker and its dependencies from npm into the npm cache on
first use. It checks repository Markdown, including the PR template, using
[the lint configuration](.markdownlint-cli2.jsonc). It does not rewrite files.
The Researcher library has its own supported Node.js versions and checks below.

Install [lychee 0.24.2](https://github.com/lycheeverse/lychee/releases/tag/lychee-v0.24.2)
using the release's installation instructions, then run:

```sh
lychee --offline --include-fragments --no-progress '**/*.md'
```

This checks local Markdown links and heading anchors without network requests.
[The link configuration](lychee.toml) includes hidden GitHub templates and skips
dependency and scratch directories. A missing target or heading fails the check.

### Citation metadata

Install the checker in an isolated environment and validate CFF 1.2.0 metadata:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install 'cffconvert==2.0.0'
.venv/bin/cffconvert --validate
```

Installation downloads packages from PyPI into the ignored `.venv` directory;
validation uses the checker's bundled schema. CI runs the same command with its
installed `cffconvert`. No release or DOI is needed to cite the draft. Include
the exact commit URL when citing the version you used.

### External links and manual review

The separate [external-link workflow](.github/workflows/links.yml) runs weekly or
on manual dispatch. To run its check locally with network access:

```sh
lychee --no-progress '**/*.md'
```

This sends requests to the linked public websites. It uses no credentials,
skips private addresses and reserved `.test` fixtures, and bounds retries and
timeouts. Failures remain visible; a third-party outage does not block the local
checks on a PR. External fragment anchors are not checked by this command.

Review the rendered Markdown, semantic consistency, scope and sensitive material
in the final diff. Passing checks does not establish compatibility, recreation
or the correctness of a modeling proposal. GitHub-hosted checks also download
actions and tools; none needs repository secrets or write permissions.

## Licensing

Contributions use the licence appropriate to their material type:
Apache-2.0 for model assets and software, CC-BY-4.0 for written material.
See [LICENSING.md](LICENSING.md). Contributors retain copyright and must have
the right to contribute the material under those terms. Identify any third-party
material and its licence explicitly.

There is no released conformance suite yet. For the current draft, check that
JSON examples parse, their local references resolve, Markdown links work and
the documentation does not claim unimplemented capabilities.

## Researcher contract library

Prerequisites: Node.js 22, 24 or 26 and npm. The installed-command terminal
rehearsal also requires Python 3.9+ and a POSIX terminal (macOS/Linux). Git and
Python remain prerequisites for the separate workflow-helper tests above.
Contributor commands:

```sh
npm ci
npm cache add yaml@2.9.1
npm test
npm run check:package
git diff --check
```

`npm ci` uses the registry and creates `node_modules/`. `npm cache add yaml@2.9.1`
uses the registry to cache the runtime dependency's metadata and tarball; a fresh
`npm ci` cache alone is insufficient for the later offline consumer install. Keep
this cache command and the CI step aligned with runtime dependency changes.
`npm test` compiles strict
TypeScript into ignored `dist/` and runs Node tests offline. `npm run build` can
compile independently. The installed-package check uses `npm pack`, installs in
a temporary directory with `--offline --ignore-scripts`, imports the built library
and reads bundled assets. It also runs the installed `n8r-surface` executable with
closed input and in a real terminal under temporary homes, compares output to
prepared settings/files, verifies confirmed vault setup and unchanged source bytes,
and checks that reuse/closed-input startup does not write. It also checks
installed Researcher instruction digests and discovery authorization, scope,
errors, EOF and cancellation with an explicitly scripted offline Codex fixture.
That fixture is a process test, not real AI evidence; the separate
[Codex rehearsal](docs/n8r-surface/codex-research-verification.md) covers actual inference. It then
removes the temporary directory. No API credentials,
Lab, source checkout at runtime or registry publication is required. Populate the
dependency cache with both preparation commands above before the offline package
check. The package check itself makes no registry requests.

To repeat the package smoke check using already installed Node executables:

```sh
npm run build
node scripts/check-package.mjs /path/to/node22/bin/node /path/to/node24/bin/node /path/to/node26/bin/node
```

Use the executable named `node` in each runtime installation: the installed bin
uses `env node` with that directory first on PATH. These paths are local command
placeholders, not portable artefact fields. Passing
no paths uses the current Node executable. Before distribution changes, run the
full test suite on each supported Node major too. The current package exposes
an ESM library, assets and a bare-startup executable. No registry or npx-download
claim follows from these local tarball checks. See the [startup settings, exit
codes and limits](docs/n8r-surface/startup.md).

The library accepts strings/data and returns strings/data, with no network or
filesystem effects. It checks a bounded experimental profile, not all AI Surface
Model semantics or consumer compatibility. Read the
[contract and API boundaries](docs/n8r-surface/contracts.md),
[host requirements](docs/n8r-surface/host-contract.md) and
[synthetic cases](examples/researcher/README.md) before changing them.

Preserve all fixture revisions and their references when extending a case. The
pending manual-edit HTML is intentionally invalid; its rejection is an acceptance
case. Ordinary `git diff` excludes untracked files, so inspect and check new files
before committing. Check changed Markdown links/anchors and parse all JSON
examples; syntax success is not semantic validity.

### Legacy dual npm candidates

`npm run check:package` still checks two candidate names independently. Only
`@n8r/surface` is planned for publication; the unscoped path is legacy tooling. To retain the
two private tarballs and their source/digest report, use
`npm run pack:candidates -- NEW_DIRECTORY` after dependency setup. This needs Git
and POSIX `tar`; the destination must not exist. See the
[human distribution check and release boundaries](docs/n8r-surface/npm-distribution.md).

## Package version checks

`npm run check:version` validates the authoritative package version and lockfile;
it also runs in `npm test` and before candidate packing. From a clean tagged
checkout, `npm run check:release -- CANDIDATE_DIRECTORY` reads GitHub to verify
release metadata, tag/commit identity and both retained archive hashes. It needs
GitHub CLI read access and never publishes. An optional second argument supplies
an offline release JSON response and explicitly limits the result to rehearsal.
See [version policy, prerequisites and human verification](docs/n8r-surface/versioning.md).

## Scoped-only release scope

Publish only `@n8r/surface`; the executable remains `n8r-surface`. Unscoped
publication and name reservation are not planned. Remove dual-package behavior
from release tooling before another release, preserving existing tagged artifacts.
The commands below describe the historical first-release tooling, not permission
to rerun it for an already released version.

## First npm release preparation

Default candidates remain private. For the approved `0.1.0-experimental.2`
release, `npm run pack:candidates -- NEW_DIRECTORY --publishable` builds fresh
publishable archives without registry writes. The manual GitHub Actions workflow
prepares retained assets, stages those exact bytes for maintainer 2FA approval,
and independently compares published bytes. Follow the
[first-release procedure](docs/n8r-surface/npm-release.md), including account
prerequisites, human checks and partial-stage recovery. Keep merge, acceptance
and actual registry/provenance verification distinct from local checks.

## Opt-in installed-skill acceptance

The [workspace Gherkin runner](docs/n8r-surface/skill-workspace-automation.md)
executes create, repeat and fresh-session reopen through an identified installed
Researcher. Live inference is opt-in, separate from `npm test`, and never runs in
CI. Follow its prerequisites, private evidence rules and owned-fixture cleanup.
Automated checks and pending human experience criteria are reported separately.
