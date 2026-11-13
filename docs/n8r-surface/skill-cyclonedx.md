# Self-contained CycloneDX Surface

Skill **0.1.13** introduced the format below; candidate [0.1.14](first-use-overview.md)
adds checked optional grouping and a connected overview without changing profile 1.
The 0.1.13 increment replaces the 0.1.12 alongside-native exchange as the
destination for new Surface saves. Issue [#68](https://github.com/injectionator/n8r-surface/issues/68).
One CycloneDX 1.7 BOM carries inventory, relationships, evidence, decisions,
uncertainties and investigation state. The brief, HTML map and Markdown journal
are generated from it. Earlier saves remain intact and deliberately readable.
The standalone product CLI retains its existing pair behavior; this is skill-first.

## Standard fields and profile

The [CycloneDX 1.7 reference](https://cyclonedx.org/docs/1.7/json/) supplies
components/services, metadata, dependencies, annotations, external references,
citations and properties. The [BOM-Link specification](https://cyclonedx.org/capabilities/bomlink/)
provides version-pinned predecessor identity. We use one BOM per revision, not a
set whose missing member could hide required investigation state.

The exact [Surface profile](../../plugins/n8r-surface/skills/research/references/cyclonedx.md#profile-properties)
and [synthetic example](../../examples/researcher/surface-bom/initial.cdx.json)
are bundled with the installed skill. Profile version 1 uses unregistered
`n8r:surface:` properties: objective, scope, individual relationship/evidence/entry
records, coverage and gaps. It does not embed the native research/Surface bundle.

| Meaning | Standard representation and bounded addition |
| --- | --- |
| Application, model, service | `components` / `services` with stable `bom-ref`; model type `machine-learning-model`. |
| Selected dependency | Standard `dependencies`, mechanically checked against selected dependency-kind profile relationships. |
| Supported alternative | Individual relationship property with support evidence, optionality/group, selection and conditions. Never an unconditional dependency merely because supported. |
| Hosting, integration, data flow | Distinct relationship kinds, not interchangeable `dependsOn` edges. |
| Dated observed use | Observation records with timestamp and observation-basis evidence; independent of support/selection. |
| Findings, choices, disagreements | Standard annotations with subjects, annotator, timestamp and readable text. |
| Source identity | External references with safe locator, hash, source version/capture scope in comment; profile evidence points to exact locations and applicability. |
| Attribution | Standard citations with checked JSON Pointers and attribution references. Not a replacement for evidence. |
| Investigation journey | Ordered entry properties: objective-driven steps, questions, findings, decisions, branches, supersession, access needs and reasons for deferral. |
| Lifecycle | Capture context in metadata when established; never a forced whole-Surface evidence state. |
| Revision | Stable serial, increasing version, exact predecessor BOM-Link and byte digest. |

Missing configuration is unestablished selection, not absence. A placeholder is
not a concrete binding. Safe static configuration can establish selection.
Selection evidence distinguishes actual configuration from human design intent.
Optionality is not a confidence score. A group alone does not assert exclusivity.

## Save and recovery boundary

The standalone `surface.mjs` checks official pinned schemas, profile shapes,
references, evidence applicability and exact dependency projection. It saves one
new private revision folder with BOM, generated views and a byte manifest.
The BOM alone reopens; sibling files are not semantic dependencies.

For directory continuation, edited generated views block ordinary save. Explicit
reconciliation reads the proposals, retains the edited files, records an accepted
choice/explanation and writes a successor. Predecessor BOM hashes are still checked.
Supplying a lone BOM proves only its own structure and supplied predecessor identity,
not that an unavailable old manifest or source is intact. No authenticity claim.

The reader preserves historical annotations/source references and decision
provenance; corrections add evidence and can supersede decisions. Nodes and
relationship endpoints/kinds retain identity. Older revisions are never rewritten.
Unsupported profile versions, dangling references and ambiguous projections fail.

Legacy `artifacts.mjs read` and `cyclonedx.mjs read` remain available for deliberately
supplied old saves. Migration requires reviewing and transferring their meanings
into a fresh profile BOM, with explicit provenance/limits. No automatic lossless
legacy conversion is claimed. No second native authority is created for new saves.

## Consumer and visualization limits

Generic consumers can read standard inventory and selected dependencies. They
cannot reconstruct possible paths or investigation state without this profile.
The helper renders those distinctions as solid selected and dashed other paths,
with support state, evidence, observations and journal available for inspection.

Sunshine at commit `beaab3faf2bab234069a8677fc627de2f0f01a3d` generated HTML from
the synthetic 1.7 BOM, including application/model names and all four services.
Its output omitted the profile relationship IDs, evidence and decision entries.
It is therefore not selected as the investigation visual. This is a file-level
consumer exercise, not a browser rendering or general 1.7 compatibility claim.
See [Sunshine source](https://github.com/CycloneDX/Sunshine/tree/beaab3faf2bab234069a8677fc627de2f0f01a3d).

The visual requires no scripts, remote assets or network. HTML escaping and a
restrictive content policy keep saved text inert. Browser visual QA is separately
tracked in the [verification record](skill-bom-verification.md). Validity does not
establish research accuracy, complete inventory, deployed controls or runtime use.
