# Initial implementation decisions

These choices complete the remaining implementation decisions for
[issue #15](https://github.com/injectionator/n8r-surface/issues/15). They are
maintainer-reviewable implementation choices within the approved design, not
claims that the CLI or runner has shipped.

## Runtime and distribution

Use TypeScript compiled to ESM JavaScript, npm with a committed lockfile, and the
built-in Node test runner. The initial supported majors are **Node.js 22, 24 and
26**. Test the current patch of each supported major before a release. Odd-numbered
majors and Bun-only execution are not part of the initial support promise. Revisit
22 before its scheduled end of support. The official
[Node release schedule](https://github.com/nodejs/Release/blob/main/schedule.json)
lists 22/24/26 support windows through April 2027/2028/2029 respectively (checked
4 November 2026).

Use **`@n8r/surface`** as the published npm package/library import, exposing the
`n8r-surface` executable. The maintainer approved a scoped-only first release on
5 November 2026, superseding the dual-publication requirement in
[issue #27](https://github.com/injectionator/n8r-surface/issues/27).
Unscoped publication and name reservation are removed from the plan. The
remaining unscoped candidate generation/testing is legacy tooling to remove;
`n8r-surface` was not published or secured on npm. The [release record](npm-release.md#verified-scoped-release)
identifies the verified registry version, source and provenance.

The [distribution candidate procedure](npm-distribution.md) preserves
`private: true` in source and default candidates. Explicit publishable preparation
is guarded to the approved version; it does not publish. The existing workflow
still assumes dual submission/verification and must be reviewed before future
releases. The [version policy](versioning.md) keeps the manifest authoritative and
verifies artifact identity against the exact tag, commit and GitHub Release.

Issue #15 ships a library, built declarations, contracts and synthetic assets.
The first #16 increment adds a `bin` entry for bare startup only; see its
[settings, parser and inspection decisions](startup.md). It must be exercised
through the installed tarball outside the source checkout. #17 adds the versioned
Researcher instructions. Runtime consumers do not need TypeScript or Bun.

Use `yaml` 2.9.1 as the single runtime dependency; its parsed nodes allow rejection
of tags, aliases, duplicate keys and unsupported numeric forms before conversion.
See its [version 2 documentation](https://eemeli.org/yaml/) and the locked version
in [package-lock.json](../../package-lock.json). TypeScript 6.0.3 and Node typings
22.20.5 are development dependencies. The bounded field/reference checker and
HTML renderer need no framework, browser runtime or general ontology dependency.

## First CLI AI runner

The user revised the order on 4 November 2026: use the Researcher as a
[shareable skill](researcher-skill.md) in Codex/ChatGPT first, adapt it in n8r-labs
second, then complete the standalone command. The current host supplies inference,
file access, search and conversation. The skill does not configure a provider,
extract credentials, or connect a second AI account.

For the later CLI, select installed Codex with ChatGPT sign-in. This supersedes
the earlier direct OpenAI Responses API adapter decision from #15. The
[official authentication guide](https://learn.chatgpt.com/docs/auth) distinguishes
ChatGPT subscription access from separately billed API-key access. The
[SDK guide](https://learn.chatgpt.com/docs/codex-sdk) documents local-agent control
and directs interactive clients to app-server. Reviewed 4 November 2026.

Before implementing the CLI integration, verify a supported interface against its
actual installed version, preserve user permissions and source scope, and record
real tool events, human continuation and saved-output readback. Do not borrow
application tokens, silently switch accounts/providers or fall back to API billing.
Source transmission and a result destination remain separate decisions. A Lab is
optional. No standalone runner or Lab compatibility is established by installing
the skill. No API key was read or model API invoked by #15's contract tests.

## HTML ownership and numeric scope

The embedded data owns the record and the whole readable HTML is its deterministic
projection. The reader rejects divergence, including benign reformatting, so human
edits cannot disappear in a later save. Reviewed corrections become successors;
a rich editor and automatic merging are deferred.

Use only safe integer numbers in the initial portable data subset. Decimal and
large quantities require explicit strings/units. This costs convenience but makes
lossy numeric conversion an explicit error instead of an undetected change to
evidence or identity. Expanding either HTML editing or numeric support requires
versioned tests and a documented migration.

## Verification boundary

`npm test` checks this profile, its source/reference fixtures and HTML/data
consistency. `npm run check:package` packs and installs into a temporary directory,
then imports built exports and bundled fixtures with no checkout-relative imports.
Prepare npm's local dependency cache with `npm ci` and `npm run cache:runtime`:
the latter also fetches registry metadata needed on a fresh machine. The installer
then runs with `--offline --ignore-scripts`. Temporary files are removed after the
check. See [contributor commands](../../CONTRIBUTING.md#researcher-contract-library).

These checks do not prove an AI can research LibreChat, a consumer understands an
extension, a Lab can import the format, or a selected composition runs. Keep those
later tests separate and name the actual runner/consumer versions when they run.
