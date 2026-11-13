# Save and continue a Surface

Use the host to investigate. Use bundled `scripts/surface.mjs` to check and save
CycloneDX 1.7 Surface profile 1. This is the sole authority for new saved Surfaces;
brief, map and journal are generated views. Node.js 22/24/26; no runtime install,
network, product CLI or source execution. Research uses the host's permitted tools.

## Ordinary interaction

The user says “save the Surface.” Do not ask them to choose a format or classify
it as Capability/Bound. Infer supported possibilities, selected connections and
dated observations per relationship. Missing configuration and placeholders do
not establish selection or absence. A safe static configuration projection can
establish selection; runtime probes are not required or implied.

Start a useful investigation plan immediately. With saving authorized, save the
initial journal and update it at useful milestones, choices and diversions. Show
what each next step could establish and the access it needs. Keep deferred paths
and reasons. Offer a few next options, allow inspection of the whole map and stop
when the user has enough. Do not search past chats or old vault research.

## Prepare a BOM

Use [the synthetic BOM](examples/surface.cdx.json) for structure only. Replace its
identities, claims, dates, sources and hashes; never treat it as product evidence.
An initial plan may have no nodes, relationships or evidence yet. Keep the required
properties and unknown composition; record open steps and gaps honestly.

Standard fields:

- `serialNumber`: a fresh `urn:uuid:` identity; `version: 1` initially.
  `metadata.timestamp`: UTC capture/save time. `metadata.lifecycles`, if used,
  describe capture phases, not one evidence classification for the whole graph.
- `components` / `services`: stable `bom-ref`, `name`, appropriate standard type
  for components. Models use `machine-learning-model`; serving endpoints are
  separate services when evidenced. Do not invent versions or transitive packages.
- `annotations`: individually identified findings/decisions with `bom-ref`,
  `subjects` (node refs or other valid BOM refs), `annotator`, `timestamp`, `text`.
  Record disagreements and qualifications in the text, not just a conclusion.
- `externalReferences`: source `url` (safe relative locator or public HTTPS URL),
  standard `type`, `comment` with source version, capture scope and limitations,
  and SHA-256 `hashes` over the inspected bytes. No credentials, query strings,
  private endpoints or absolute local paths. Inspect safe configuration projections
  only; do not print or store raw connection strings. Generic URLs are not evidence
  of source access. Say when exact source identity is unavailable.
- `citations`: optional attribution with `pointers` (resolvable JSON Pointers),
  UTC `timestamp`, `attributedTo` (existing BOM reference), and `note`. This is
  attribution, not a replacement for the evidence/source locations below.
- `dependencies`: exactly selected relationships whose kind is `dependency`,
  grouped by `from` as `{ref, dependsOn:[to]}`, deduplicated. Omit or use `[]` when
  none are selected. Other edges remain in the profile. Do not emit empty
  dependency entries to imply dependency-free nodes. Keep
  `compositions: [{aggregate: "unknown"}]` for this bounded inventory.

## Profile properties

Use standard `{name, value}` properties, with prefix `n8r:surface:`. This is an
experimental, unregistered property profile. Values are strings; records below
use JSON text per individual record, not an embedded old native bundle.

Exactly one each: `profile` = `1`, `objective`, `scope`. Repeated plain-text
`coverage` and `gap` properties retain inspected scope and unknowns.

One `evidence` property per source-backed annotation used by the graph/journal:

```json
{"id":"finding-storage","basis":"source","sources":[{"index":0,"locator":"src/storage.ts:12-28"}],"applicability":"Inspected source revision only; no deployment observation."}
```

`id` resolves to an annotation. `basis` is `source`, `configuration`, `observation`
or `user`. `sources` identifies zero-based external-reference indices and exact
inspected locations; non-user evidence needs at least one. User choices may have
no source reference; their annotation records the human decision and date.
Evidence annotations must include both relationship endpoints in `subjects`.

One `relationship` property per meaningful path:

```json
{"id":"storage","from":"app","to":"database","kind":"dependency","optionality":"optional","group":"","support":"supported","selection":"unknown","observations":[],"evidence":["finding-storage"],"selectionEvidence":[],"purpose":"Persist conversation state","mechanism":"Database driver","configuration":[],"conditions":[],"note":"Supported; the selected deployment target is unknown."}
```

- `kind`: `dependency`, `integration`, `hosting`, `data-flow`.
- `optionality`: `required`, `optional`, `alternative`, `unknown`; alternatives
  name a nonempty `group`. A group does not by itself assert mutual exclusion;
  put known exclusivity/conditions in the conditions and evidence.
- `support`: `supported`, `unknown`, `absent`, `conflicting`, `out-of-scope`.
  Supported/absent/conflicting need evidence. Missing detail does not mean absent.
- `selection`: `selected`, `unknown`, `not-selected`, `conflicting`. Every state
  other than unknown needs configuration or human-choice `selectionEvidence`.
  Explain whether it is configured selection or human intent in that evidence.
- `observations`: independent `{at, evidence:[annotationId], note}` records.
  These require observation-basis evidence and UTC dates. Do not infer from selection.
- `purpose`, `mechanism`, `note`: readable text, explicit unknowns where needed.
  `configuration`: safe setting names/relative locations only. Placeholder values
  cannot justify selection. `conditions`: applicable preconditions as strings.

One ordered `entry` property per investigation step/question/choice:

```json
{"id":"inspect-storage","kind":"next","title":"Inspect storage selection","text":"Establish the chosen target from safe configuration.","status":"open","reason":"Support alone does not identify a target.","access":"A safe configuration projection","evidence":[],"at":"2026-11-13T12:00:00Z"}
```

`kind`: `next`, `question`, `decision`, `diversion`, `finding`.
`status`: `open`, `active`, `done`, `deferred`, `superseded`.
Use optional `parent` for a branch and `supersedes` for a correction (entry IDs).
Retain ordering, deferred reasons and access needs. Decisions reference user-basis
evidence. Preserve earlier decisions verbatim; a later decision can supersede one,
changing only the earlier status to `superseded` and retaining its provenance.

## Overview presentation hints

For an initial overview, use [first-use guidance](first-use-overview.md). Optional
node properties on a component or service can guide grouping without changing
relationship semantics or CycloneDX Surface profile 1. Use at most one property
named `n8r:surface:presentation` per node, with a JSON-text value:

```json
{"boundary":"internal","area":"Conversation and orchestration","focus":true,"evidence":["finding-architecture"]}
```

`boundary` is `internal`, `external` or `unknown`, relative to the focus application.
`area` is a short meaningful functional group. `focus` is optional boolean, true
on at most one node; give that node a standard `description` explaining the app.
`evidence` contains existing evidence IDs whose annotations include this node in
`subjects`. Internal/external placement requires at least one evidence reference.
Do not classify by CycloneDX component/service type alone. Grouping records placement; its evidence basis distinguishes source support,
human intent, configuration and dated observation. It does not establish a
deployed trust boundary.

The property is optional and additive: old profile-1 readers may ignore it; the
0.1.14 reader checks its shape and references. Old saves without hints remain
readable with Unclassified placement and the research objective as their opening.
No source re-investigation or boundary inference happens inside the renderer.
Record a corrected grouping only in an authorized successor with its evidence.

## Check, save, read back

Resolve helper paths relative to this installed skill. Show the destination and
provide links; keep outputs outside source repositories. Parent directories must
exist and be real directories; the numbered revision directory must be new.

```sh
node /INSTALLED/skills/research/scripts/surface.mjs check /WORKSPACE/draft.cdx.json
node /INSTALLED/skills/research/scripts/surface.mjs save /WORKSPACE/draft.cdx.json /WORKSPACE/surfaces/001
node /INSTALLED/skills/research/scripts/surface.mjs read /WORKSPACE/surfaces/001/surface.cdx.json
```

Exit 0: `checked`, then `saved-and-read-back`, then `checked` with recovered state.
Exit 1 is failure. The output contains `surface.cdx.json`, `surface.html`, `brief.md`,
`investigation.md`, `manifest.json`. Read the saved BOM and views independently.
Link the folder and each human-readable file. There is no native sibling authority.
Source validity/privacy checks are bounded; they cannot establish truth or detect
all secrets. Keep sensitive data out before staging; no raw source snapshots.

## Continue and reconcile

A supplied BOM alone suffices. Read it with the helper; re-establish source access
and disclose unavailable sources. Keep IDs, decisions, uncertainty, dated observations and evidence. Correct an
observation with a new annotation/entry explaining the correction; retain the
original observation and its relationship association.
Copy its serial, increment version by one, retain previous entries, update the
journal, and add an `externalReferences` entry of type `bom` with exact predecessor
`urn:cdx:UUID/VERSION`. Set `n8r:surface:predecessor-digest` to `sha256:HEX` over
previous BOM file bytes (not canonical JSON). Replace this property on each save.

```sh
node /INSTALLED/skills/research/scripts/surface.mjs save /WORKSPACE/next.cdx.json /WORKSPACE/surfaces/002 /WORKSPACE/surfaces/001
```

Previous argument may be a lone BOM. A saved directory or its canonical
`surface.cdx.json` path also checks sibling view hashes. An edited journal/HTML/brief is a proposal, not new authority. Preserve
it, read it, clarify conflicting meaning only when needed, record the accepted
choice and add a plain-text `n8r:surface:reconciliation` explanation. Then use
`reconcile NEXT_BOM NEW_DIRECTORY PREVIOUS_DIRECTORY` instead of `save`. This still
verifies predecessor BOM bytes; it never overwrites the edited files. A changed
BOM or missing original manifest needs investigation, not a bypass.

For explicitly supplied legacy saves use `artifacts.mjs read DIRECTORY` or
`cyclonedx.mjs read EXCHANGE_DIRECTORY`. Preserve them. Deliberate migration means
reading that evidence and authoring a fresh profile BOM, recording provenance and
limitations in `n8r:surface:migration`. No automatic lossless converter is claimed.
Never quietly keep native and BOM formats as two new authorities.
