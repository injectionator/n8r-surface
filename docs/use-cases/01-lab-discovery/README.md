# Surface UC01 — Discover the existing lab

Agreed 18 November 2026. [Issue #96](https://github.com/injectionator/n8r-surface/issues/96).
State: **Plan recorded; skill installation technically verified; discovery pending.**

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
- [ ] Confirm a fresh intended host chat loads that exact installation.
- [ ] Conduct observational discovery, capturing actual interactions and decisions.
- [ ] Save and independently inspect the BOM, brief, map and journal; verify key
  claims against sources. Reopen in a fresh chat and preserve predecessor bytes.
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
fresh-chat invocation or human acceptance. No lab discovery has started.

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

## Human verification task list

For this documentation increment:

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
unchecked above; this preparation increment does not complete issue #96.
