# Skill 0.1.12 CycloneDX verification

Issue [#68](https://github.com/injectionator/n8r-surface/issues/68), draft
[PR #69](https://github.com/injectionator/n8r-surface/pull/69). Agent rehearsal on
13 November 2026; human acceptance, merge and release remain separate decisions.

## Revision and environment

The isolated installation contains all 22 plugin files exactly matching source
commit `da0e445221d2209fc843d0cef682606610d22ad5`, candidate 0.1.12.
Codex CLI 0.166.0, ChatGPT sign-in, configured `gpt-6-astra`, Node 26.13.0,
macOS. No API-key or provider/model fallback. The active everyday installation
remained 0.1.11; this candidate used a separate host home and private workspace.

The harness uses ephemeral app-server sessions with the installed skill supplied
as a skill input. Network, memory, unrelated tools and repository instructions are
disabled. Only the selected workspace and installed skill are accessible, apart
from required runtime files. A filesystem probe checks that private evidence and
unsupplied repository instructions cannot be read. Source-pack provenance, raw
transcripts, outputs, hashes and environment receipts stay in the selected private
vault; this public record contains no private deployment configuration.

## Baseline and task

State X: installed 0.1.11, supplied source pack and writable workspace. Input Y:
inspect the installed skill/helper and determine whether checked CycloneDX export
is available, without substituting invented findings or an external exporter.
Observed: only native artifact operations were available; the host identified the
missing mapping/export/validation workflow. This was a bounded capability check,
not a failed full research run.

The candidate task was to research the supplied multi-component sources, explain
the system to a consultant advising a security engineer, preserve intended versus
historical configuration, save native records and CycloneDX alongside them, and
read both back. The source pack contained selected code, documentation and safe
historical operational projections recovered from prior work. No applicable SBOM
was supplied; network lookup was unavailable. Upstream revision, package and
transitive coverage remain explicit gaps.

## Observed initial result

The installed candidate performed its own investigation and preparation. The
developing agent supplied sources and user instructions, not prewritten findings.

- Twelve recorded source hashes match their supplied files after the run.
- Checked native Capability records contain nine nodes and nine relationships.
- CycloneDX 1.7 contains five components and four services. It has no concrete
  dependencies because the candidate chose Capability for this evidence scope.
- Native snapshot equals the checked native bundle. Mapping/report retains the
  connection meanings, evidence and uncertainty absent from the BOM view.
- Intended model and different historical model evidence remain distinct. Source
  control points are identified without asserting present deployment or efficacy.
- Native brief, HTML and JSON, consultant summary and five-member exchange were
  saved and independently reopened. The candidate corrected one inspection error
  (`mapping.nodes` is nested inside the report), then completed readback. It did
  not replace the successfully checked export with unchecked JSON.

## Fresh-session correction

A second ephemeral process confirmed that the previous thread was unavailable,
then recovered from the saved directories and supplied sources. The rehearsal
input added an owner decision to keep connector tools disabled in the intended
configuration and require separate authorization/assessment for a future enabled
path. It was explicitly design intent, not evidence of deployed configuration.

The candidate saved native and exchange successors. Independent developer readback
confirmed all ten earlier artifact files and all twelve sources were unchanged;
all nine node identities and the prior decision were preserved. Decisions grew
from one to two. The BOM serial stayed stable and its version advanced from 1 to
2. Native snapshots matched both checked bundles. This is an actual installed-agent
rehearsal, not human acceptance.

## Independent consumer

CycloneDX Python Library **11.12.0**, Python 3.13.1, in a separate environment:
`JsonStrictValidator(SchemaVersion.V1_7)` returned no validation error;
`Bom.from_json(data=json.loads(text))` deserialized the synthetic configured BOM.
The consumer listed its application and separate services and resolved the
selected application dependency to the concrete Atlas target rather than its
abstract database role. The [retained synthetic exchange](../../examples/researcher/cyclonedx/configured/README.md)
is available for inspection. The same independent consumer then validated and
loaded both actual installed-skill BOMs: five components, four services, versions
1 and 2, no dependency edges, as expected for this Capability projection.
This establishes those bounded read tasks only; it
is not lossless round-trip, general consumer or runtime compatibility.

## Maintainer checks

- Full suite: 208 passing on Node 22.23.2; 209 passing on Node 24.22.2 and
  26.13.0 after adding the installation-buffer regression. Its focused 15-test
  suite also passes on Node 22.23.2.
- Installed package checks pass on all three Node majors, including existing
  terminal setup/reuse/preservation interactions. Exact skill bundle and notices
  checks pass; no runtime dependency installation is needed by either helper.
- Twenty-four Git workflow tests and shell syntax check pass. Example JSON parses;
  native contracts/reference checks and CycloneDX schema/reference checks are
  bounded validation, not universal model conformance.
- Markdown lint 0.24.0, offline links with lychee 0.24.2, citation metadata with
  cffconvert 2.0.0 and whitespace checks are run before the final handoff.

Two integration failures were found and fixed during actual checks: installed-byte
verification exceeded its old one-MiB Git output buffer, and package smoke checks
still expected the previous instruction version/digest. The buffer now permits
16 MiB with a large-helper regression; the digest was independently calculated
from the candidate source bytes. A fresh whole-branch reviewer confirmed the
package-pin failure and found no critical projection issue. Additional tamper and
classification boundaries were manually exercised by that reviewer; retaining
more automated variants and clarifying the shared skill paragraph's CLI boundary
remain minor follow-ups. The new exchange is a standalone skill capability, not
a new product CLI command.

## Human task list

Prerequisites: candidate 0.1.12, Node 22/24/26, a readable source set and a writable
disposable workspace. Open a fresh Codex chat in that workspace. Maintainers can
install the pinned source through the normal plugin marketplace mechanism; see
[skill installation](researcher-skill.md). Do not substitute an older installation.

- [ ] Supply your source paths and say: `Use n8r-surface Researcher to explain this
  multi-component Surface. Save checked native records and CycloneDX 1.7 alongside
  them. Explain what the evidence establishes and what remains unknown.` Expect
  source-backed findings and links to the native brief and exchange files.
- [ ] Open the brief and `mapping.json`. Expect intended/historical/current state
  to remain distinct. Open `surface.cdx.json`; expect identified components and
  services, with only eligible explicitly selected dependencies. Capability output
  may have none. Unknown coverage is explicit.
- [ ] Start a fresh chat, supply saved directories and say: `Reopen these records.
  Record this correction as a design decision, save successors and preserve all
  earlier records and decisions.` Supply a correction. Expect stable node IDs and
  BOM serial, incremented BOM version and links to both generations.
- [ ] Report **Pass / Fail / Blocked**, candidate revision, interactions and output
  paths. Missing output, invented facts, lost decisions or modified prior records
  fail. Missing installation/source access blocks. Keep evidence for review; later
  remove only the disposable workspace, not original sources.

Values such as names, node counts and selected dependencies depend on the supplied
sources; the nine-node rehearsal is not a required graph size. The
[working manual](skill-manual.md) explains the user journey. Technical helper
verification uses exit 0 for `saved-and-read-back` / `checked`; a nonzero exit is
not success. Those commands are maintainer evidence, not required user interactions.
