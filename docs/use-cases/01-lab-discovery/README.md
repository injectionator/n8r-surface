# Surface UC01 — Discover the existing lab

Agreed 18 November 2026. [Issue #96](https://github.com/injectionator/n8r-surface/issues/96).
State: **Discovery underway; installed skill and fresh-chat continuation verified by agents. Runtime and Labs consumer acceptance remain incomplete.**

## Intent and boundaries

Use Researcher skill 0.1.17 to understand the existing Injectionator lab before
[Labs UC11](https://github.com/injectionator/n8r-labs/blob/main/docs/use-cases/11-lab-equipment-controls/README.md).
Investigate DigitalOcean hosting, LibreChat, Codex Pro and MongoDB Atlas through
permitted sources and observation. These are investigation targets, not verified
inventory. Distinguish declared configuration, effective readback and runtime
observations; retain source, time, applicability and unknowns.

Initial state: the lab exists, but this use case has no verified baseline or saved
Surface. Input: an identified installed skill, user-supplied scope and permitted
source access. Intended result: a saved, evidence-backed partial Surface that can
be reopened and opened in n8r-labs Surface to begin work on the same description.
The user explicitly requires that artifact handoff, not only an exported diagram.

Surface UC01 owns discovery and its journal. Labs owns implementation, live
configuration changes, behavioural checks and restoration in UC11. Observation
must not implicitly apply settings, restart services or repair the lab.

## Execution plan and acceptance

- [x] Record this use case, link the field-notes plan and create the tracking issue.
- [x] Install skill 0.1.17 at the identified merged revision and compare its bytes.
- [x] Exercise the installed helper with synthetic data before discovery.
- [x] Confirm a fresh intended host chat loads that exact installation.
- [ ] Conduct observational discovery, capturing actual interactions and decisions.
- [x] Save and independently inspect the BOM, brief, map and journal; verify key
  claims against sources. Reopen in a fresh chat and preserve predecessor bytes
  (bounded agent rehearsal; human acceptance remains pending).
- [ ] Open the exact saved `surface.cdx.json` in n8r-labs Surface through its normal
  user workflow. Inspect components, connections, evidence, uncertainty and history,
  then begin a continuation using the imported description. Record the actual
  interaction, artifact digest, Labs revision/package pin, retained identities,
  any mapping losses and saved-result readback. No implicit live changes are allowed.
  Missing open/import support is Blocked; helper validation is not this proof.
- [ ] Hand Labs UC11 configuration evidence, access gaps and candidate reversible
  experiments for LibreChat, Codex Pro and Atlas. Identify expected effects and
  possible restoration checks as proposals, not verified working controls.
- [ ] Assemble publication-safe field-report and release facts packs for the
  separate injectionator-website chat. Website owns article writing and publication.

The Labs handoff must demonstrate useful continuation, not just successful parsing.
Keep the original artifact intact. Record any consumer changes in Labs separately;
this use case does not authorize implementation in that repository.

## Journal and publication

Keep raw prompts, receipts, infrastructure details and screenshots in the selected
private vault's `runs/`; use its research/artifact/Surface folders for ongoing
research under the [vault convention](../../n8r-surface/researcher-vault.md).
Do not publish local paths, credentials, private infrastructure or raw transcripts.
This public development journal retains only reviewed summaries. Record actual
expectations, results, mistakes, decisions and retests contemporaneously; label
later reflections. Use the [reporting pack](../../field-notes/reporting-pack-template.md).

This case becomes the immediate field-notes priority. Preserve the earlier fresh
LibreChat preparation as its own historical record; use-case numbers and article
queue numbers are separate namespaces.

## Installation journal — 18 November 2026

Before upgrade, Codex CLI 0.166.0 reported enabled skill 0.1.15; this planning
chat exposed 0.1.16. Neither established a loaded 0.1.17 host session.
The first attempt to register a pinned source failed because the marketplace
already existed with a different source. Retained the prior registration receipt,
removed that marketplace registration, registered the exact merged commit and
installed `n8r-surface@n8r-surface`. All replacement/install commands exited 0.
The normal CLI registration now reports installed/enabled 0.1.17.

All 27 tracked plugin files match commit
`b0f982287d1f316aa9ec13c630a6912a205624c5` byte for byte. Installed helper SHA-256:
`055650bd5e448796a73d45880fa94418ede15c2ca1a41be2fdd916ee9277d040`.
Node: 26.13.0. Private evidence retains registration receipts, per-file hashes,
fixture inputs, outputs and exit codes.

Direct installed-helper rehearsal used the bundled synthetic example with clock
text and an ordinary relationship without a group. Check, save, read, successor
save and successor read all exited 0. The successor preserves the serial number,
uses revision 2 and references the predecessor digest. All predecessor files
remained byte-identical. An alternative relationship without a group was rejected
with exit 1. These are technical fixture results, not discovered lab findings,
fresh-chat invocation or human acceptance. No lab discovery had started at the end
of that preparation increment.

## Candidate and release policy

Skill 0.1.17 and npm 0.1.0-experimental.6 are prepared candidates. UC01 findings
may require changes before publication. Track each fix separately, retain earlier
candidate identities and evidence, rebuild and reverify affected paths, and record
exact new commit/digests. A version label alone cannot identify tested bytes.
If a version has already been published, use a new version; never replace its bytes.

Follow the [parity release checks](../../n8r-surface/parity-release.md) before
publication. Discovery does not replace release acceptance. Marketplace delivery,
npm publication, registry/provenance checks and Labs adoption are distinct.
Prepare a release facts pack (changes, versions, installation, evidence and limits)
and a field report (actual investigation and learning). Neither is a finished article.

## Preparation verification task list

For the earlier preparation increment:

- [ ] Open this record and the [field-notes plan](../../field-notes/README.md).
  Expect Surface UC01 first, preserved earlier preparation, private raw evidence,
  separate release decisions and an explicit Labs open-and-continue requirement.
- [ ] Open a fresh Codex chat after refreshing the app if needed. Ask:
  “Before research, identify the installed n8r-surface Researcher version and
  installation path. Confirm it is 0.1.17 and compare its helper SHA-256 with
  the Surface UC01 installation record. Do not discover the lab yet.”
  Expect the exact installed candidate and digest above. A stale skill is Blocked;
  do not infer the loaded version from this document or the CLI listing alone.
- [ ] Report **Pass / Fail / Blocked**, host/version, observed skill identity and
  any discrepancy. Retain private receipts; return only sanitized summaries.

No cleanup is required for document review. Keep installation and synthetic
verification evidence for continuation. Full discovery and Labs acceptance remain
incomplete above; preparation did not complete issue #96. For the current increment,
use the [discovery and consumer task list](uc11-handoff.md#human-verification-task-list).

## Discovery journal — 18 November 2026

The new research chat exposes both 0.1.16 and 0.1.17 installations. It explicitly
selected the catalogued 0.1.17 skill, read its instructions and both manifests,
checked the helper digest above and compared all 27 plugin files against the
expected commit. All matched. Discovery used that installed helper with Node
26.13.0; no candidate bytes were changed.

The first private save recorded an empty investigation plan. The next saved eight
components and eight source-backed paths from the supplied Labs checkout at
`2d50313ccdc81d7a0090cc99f2c521db201a6b5f`. Operator records, retained configuration
recipes and implementation source were kept distinct from current deployment
observations. Existing Labs working-copy changes were preserved.

A separate fresh chat reopened revision 002, independently checked selected source
hashes and saved revision 003. It corrected an evidence locator: connector
validation was described against the server entry point but implemented in the
provider handler. The correction retains the original annotation and adds the
missing provenance. It also traced caller context into developer instructions;
this is a source-level investigation lead, not a demonstrated vulnerability.
Serial identity, component identities and all predecessor files were preserved.
This passes the bounded agent reopening rehearsal, not human acceptance.

Runtime access remains incomplete. Noninteractive SSH with strict host-key checking
returned permission denied. The first normal Labs browser attempt refused the
connection; after the user started Labs, the same address opened successfully.
Surface collection and the existing Lab's Files and notes were inspected. A normal
Attach file attempt for the exact revision 002 BOM was blocked before upload by
the browser extension's disabled local-file permission. After the user enabled
that permission, retry attached the exact 29,093-byte
BOM. File preview showed the matching digest; the Lab assistant recovered its
graph and uncertainty. It reported no external-BOM opening operation and refused
a new save that would replace identity. The answer was saved in chat; no successor
Surface was created. Exact Surface opening and continuation remain **Blocked**.
Earlier research surfaced by the existing Lab UI remains
historical context, not this run's findings.

The source-level consumer review also found a boundary to test: the setup-package
importer expects its own format, while the assistant Surface save adapter assigns
host-owned serial/version values. Neither route proves preservation of an external
BOM. The inspected consumer dependency is the retained experimental.5 archive at
`e3fef8f5d8986bf40a30e5d375050776009fad29`; its recorded SHA-256 is
`dffdbab5eabb443d3ac2ff329be712c1776c6eefd2d4aa874d6b50b72ed35413`.
That is a checkout dependency pin, not a verified running-build identity.

See the [UC11 handoff and acceptance gaps](uc11-handoff.md) and the
[publication-safe reporting pack](../../field-notes/uc01-source-pack.md).
Private BOMs, receipts and infrastructure details remain in the selected vault.
A passive read through the existing documented LibreChat tunnel returned HTTP 200
for health and public configuration. The allowlisted public fields reported the
application title and login/registration flags; an independent repeat agreed.
These observations do not prove current host/container state, database health,
loaded private configuration or inference. Revision 004 reconciles the resolved
UI/upload access gaps while preserving earlier failures and all predecessor bytes.
Final readback found stale description wording and two competing active actions;
revision 005 corrects them and retains consumer runtime metadata (Bun 1.4.4).
Its BOM SHA-256 is
`7cbdf82608c490feba1945dca353cc8fc97022ba1d23fab44b508e043d30fa5b`.

The full scope of #96 is still incomplete; PR #97 remains draft and related work.
