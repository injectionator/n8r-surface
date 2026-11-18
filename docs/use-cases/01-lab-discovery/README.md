# Surface UC01 — Discover the existing lab

Agreed 18 November 2026. [Issue #96](https://github.com/injectionator/n8r-surface/issues/96).
State: **Discovery underway; installed skill and fresh-chat continuation verified by agents. Runtime evidence is captured; deeper node/edge investigation continues. Labs import is separate work.**

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

At the initial attempt, runtime access was incomplete. Noninteractive SSH with
strict host-key checking
returned permission denied. The first normal Labs browser attempt refused the
connection; after the user started Labs, the same address opened successfully.
Surface collection and the existing Lab's Files and notes were inspected. A normal
Attach file attempt for the exact revision 002 BOM was blocked before upload by
the browser extension's disabled local-file permission. After the user enabled
that permission, retry attached the exact 29,093-byte
BOM. File preview showed the matching digest; the Lab assistant recovered its
graph and uncertainty. It reported no external-BOM opening operation and refused
a new save that would replace identity. The answer was saved in chat; no successor
Surface was created. Exact Surface opening and continuation were **Blocked** at
that attempt; later import implementation is separate work.
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

### Runtime continuation and node/edge focus

The user clarified that UC01 should deepen understanding of component configuration,
operation and connections to identify controls, tests and controlled changes.
Labs import implementation proceeds separately and does not block this discovery;
its earlier acceptance result remains recorded, not reclassified as a pass.

SSH subsequently authenticated using the existing agent key with strict host-key
checking. No server or SSH configuration was changed. Read-only inspection and an
independent repeat identified the same LibreChat and connector containers, images
and mounted configuration hashes. Both containers were running and healthy.
The identified LibreChat filesystem reports package version `v0.8.8`.

Revision 006 preserves all earlier component IDs and adds local persistent volumes:
nine nodes and nine paths. Configuration evidence now selects hosting, the private
connector endpoint, Atlas and local storage. Atlas is not the only persistence
location. Mounted settings, container launch configuration and passive state are
kept separate from loaded values and exercised behavior. No target inference,
database query, service restart or live change was performed.

A bounded deployed-source read clarified MongoDB pool configuration: numeric zero
is omitted by a truthiness guard when constructing options. This does not prove
the effective driver minimum or establish a defect. Separate application JWT,
connector bearer, managed ChatGPT and Atlas identity boundaries guide subsequent
control tests. Current local adapter source is not silently equated with the
identified deployed bundle. Atlas management policy and current Codex entitlement
remain unknown.

The installed helper saved and read back revision 006. Independent inspection
checked retained receipt hashes, stable identities and generated views. Its BOM
SHA-256 is
`f35b12b4c716cf1ea6408a9d6277193ee4080ae4512b6824b513892ff75df2c9`.
This is a bounded architecture/research SBOM, not a complete package inventory.
See the updated [UC11 handoff](uc11-handoff.md) for candidate tests and their limits.

The full scope of #96 is still incomplete; PR #97 remains draft and related work.

### Caller-context trace and Atlas access

The next read-only increment traced the identified LibreChat filesystem through
browser JWT authentication, agent/conversation access checks and endpoint option
construction. Ephemeral-agent instructions can derive from parsed model parameters
or the request prompt prefix, subject to model-spec processing. Agent context builds
system messages; provider serialization can map them to developer messages.
These are conditional source paths, not a captured request or proven bypass.

The mounted connector bundle was inspected beyond lexical indicators. It applies
its own bearer check, bounds message shapes, combines system/developer text into
Codex developer instructions and sends conversation history as reference text.
It requests restricted execution policy and validates the returned policy. This
narrows the earlier source gap but does not prove loaded-memory identity or tested
enforcement. Packaged TypeScript source remains distinct from compiled execution.

Atlas initially required sign-in. The user signed in and selected the lab project;
normal management pages then allowed read-only inspection of database roles,
network policy and cluster recovery state. Those settings and identifiers remain
private. Management access is distinct from database access and does not establish
that the account itself has a read-only role. No database records, credentials,
connection strings or live changes were involved. Exact application target/principal
correspondence and recovery behavior remain gaps.

Revision 007 added a separate browser-to-Atlas management edge. Readback caught a
finding title that could imply tested execution restrictions; revision 008 clarifies
the title and coverage without changing observations. There are nine stable nodes
and ten edges. Latest BOM SHA-256:
`c4d0c93326305d2991b80aa1f394b4d8216ee30e8e8ab3748fd0b9d395391f3c`.
Predecessor and evidence hashes remain preserved. Labs import stays separate.

### Bounded binding confirmation and LLM focus

The next read-only check matched the configured Atlas SRV members exactly to the
selected cluster UI and matched the configured principal/database to its role
display. The identified Node process environment matched the Docker connection
setting. These comparisons expose no connection string or credential and do not
prove a successful database operation. The user considers this sufficient Atlas
depth and directed further discovery toward Codex/LLM.

Caller-policy inspection found that the mounted base file is not sufficient to
establish actor-effective policy: the source resolves per-principal overrides and
omits model specs from anonymous startup responses. A signed-in read-only view is
the next source; missing base-file keys do not establish disabled controls.

Mounted connector source describes separate short-lived catalog-inspection and
generation workers, command-line policy overrides and returned-policy validation.
A process snapshot showed only the connector runtime. A bounded telemetry read
contained no recognized events; this is not evidence of no earlier inference.
The configured default model is now a node, explicitly distinct from verified
catalog availability or an exercised model selection. Effort is fixed low in the
adapter source. SSE framing wraps completed output, rather than forwarding live
token deltas. Ephemeral Codex threads do not establish application data deletion.

Revision 009 preserves earlier identities and adds the configured-default model:
ten nodes and eleven edges. BOM SHA-256:
`33e88126aa7748b4a939cab31e814b3ca138fde9182b797012a2d88ee3afe06f`.
No catalog/model operation, database query or live configuration change was made.

A save initially triggered the installed privacy heuristic on a nonsecret boolean
written using credential-refresh field syntax. Equivalent prose passed without
changing helper bytes. Retain this as a separately scoped usability candidate;
no skill fix or release is included here.

## Signed-in UI continuation

Revision 010 retains the graph and adds signed-in UI observations and mounted
worker lifecycle guards. That inspection covered category navigation only; subsequent opening of Chat
and Data & Privacy exposed user preferences. No effective server-policy payload
was inspected; a selected display label does not establish an underlying model identity.
Actor-effective instructions remain unverified. No message was submitted or live
setting changed. Completion/failure guards are source evidence, not exercised
controls. Labs import remains a separate acceptance gap.

## Saved memories and selected prompts

Revision 012 traces two source-supported input paths. Selected production prompts
undergo variable substitution and enter ordinary User-message submission. The
observed auto-send preference means selecting one can submit immediately; discovery
did not select a prompt. Saved memories require user-preference, permission and
resolved-configuration gates, are queried by user and agent partition, and can join
additional instructions. The connector combines system/developer messages into
Codex developer instructions while retaining user/assistant history separately.

These are source paths, not captured live transfers. The enabled memory preference
does not establish stored memory, effective server policy or inclusion in a request.
Codex's own disabled memory feature does not exclude memory text supplied by its
caller. No exploit, filtering effectiveness or isolation guarantee was demonstrated.
The private Surface retains ten nodes and thirteen paths with stable identities;
new memory and prompt paths have unknown selection and no observed transfer.
BOM SHA-256: `facb47205f103c4f30e4a972e1a9ed1c4c6c3face4973c51c0f97a77f36fbacb`.
