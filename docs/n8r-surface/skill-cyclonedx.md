# Skill CycloneDX exchange: bounded mapping

Issue [#68](https://github.com/injectionator/n8r-surface/issues/68), candidate
0.1.12. CycloneDX 1.7 is an exchange alongside the existing checked native bundle.
Native records remain authoritative for Surface meanings; no existing file changes.

## User task and evidence

Given an installed candidate, a writable workspace and explicitly supplied sources,
ask the skill to research a multi-component Surface and save CycloneDX alongside
its checked research. Expect a readable brief, inventory and a report of projected,
retained and unsupported meanings. Reopen in a fresh chat, correct one fact and
save a successor. Independently open both outputs, follow evidence and check that
earlier bytes are unchanged. Current baseline, actual rehearsal and consumer
results belong in the release verification record, not in these expectations.

The user introduces components and evidence incrementally. Seek applicable supplied
or upstream SBOMs; record identity/version and coverage. When none is available,
produce a clearly partial source-derived inventory, not a fabricated transitive
SBOM. The offline rehearsal source pack has no supplied SBOM and no network access;
upstream lookup/generation therefore remains a reported gap. No general SBOM
collector or import/merge engine is introduced in this increment.

## Projection contract

The helper reads a checked Capability/Bound bundle and an explicit mapping with
`nodes` and `dependencies`. Each node entry is `{id, kind, type?, rationale}`:
`kind` is `component` or `service`; components require a native CycloneDX type.
Every native node appears exactly once. Labels and IDs come from native records;
the mapping cannot rename nodes, introduce versions or fabricate package IDs.
Rationale explains the classification using the research context. It is a host
judgment, not newly established evidence. Product-specific names have no special
handling. Versions and package identifiers are omitted in this first projection
because the current native node contract does not encode them as verified fields.

`dependencies` names native relationship IDs deliberately projected as dependency
relationships. Only a Bound relationship with a single configured target is
eligible. Its source and concrete target become `ref` and `dependsOn`; the role
endpoint is retained separately in the native snapshot. The host must establish
that dependency is the right meaning. Identity, containment, data flow and hosting
are not automatically dependencies. Capability possibilities, conflicting and
unknown bindings remain in the report and native records, never concrete links.
No empty dependency list claims complete dependency knowledge.

| Meaning | Exchange representation / limit |
| --- | --- |
| Node identity and label | Native ID as `bom-ref`, label as `name`; component/service classification explicitly supplied. |
| Model versus service | Model may use component type `machine-learning-model`; its serving/connector service remains a separate node when supported by evidence. |
| Concrete evidenced dependency | Explicit selected Bound relationship projects source to configured target. Multiple native edges may collapse to one dependency; report retains every source relationship ID. |
| Capability alternatives and role nodes | Inventory names carry a description identifying the originating Surface kind; no claim of installation or runtime activity. Capability emits no concrete dependencies. |
| Purpose, mechanism, safe configuration, evidence, decisions, gaps | Full native bundle in `surface-records.json`, linked from BOM external references; loss report identifies semantic information absent from the standard dependency view. |
| Coverage and runtime | `compositions.aggregate` is `unknown`. No operations lifecycle, reachability, exercised connection or whole-surface completeness is inferred. |
| Provenance | Report pins exact native IDs/revisions/digests and mapping; immutable exchange manifest hashes all members. |

No custom property namespace is introduced. The exchange cannot be round-tripped
through an ordinary BOM consumer to recover Surface meanings. The native snapshot
and mapping report must travel with the BOM. File references are relative to the
exchange directory. Do not add raw endpoints, credentials or customer data.

## Identity, saving and readback

A deterministic UUID derived from the Surface identity identifies the BOM lineage;
first export has version 1. A successor export requires its prior exchange and a
native direct successor (or an unchanged native revision for a new projection),
keeps the serial number, increments BOM version and pins the prior manifest hash.
Native identities, predecessor references and source digests retain their existing
meanings. The exporter checks exact direct-parent content and retained mapping
classifications. It does not overwrite previous exports or repair manual edits.

The standalone helper saves `surface.cdx.json`, `surface-records.json`,
`mapping.json`, `README.md` and `manifest.json` in a new private directory, then
reads them back. Readback validates schemas, references, hashes and reprojects the
retained native snapshot/mapping to detect conflicts. Previous directories stay
unchanged. No network access, runtime package installation or product CLI required.

## Validation and consumer boundary

Vendored schemas are from CycloneDX specification tag 1.7, commit
`4b3f59453366e27c8073fd24e98bf21ef8892c8e`, under Apache-2.0:
[BOM schema](https://github.com/CycloneDX/specification/blob/4b3f59453366e27c8073fd24e98bf21ef8892c8e/schema/bom-1.7.schema.json).
Validation runs offline. It does not establish research accuracy or interoperability.
The independent consumer task is to load the BOM using a pinned CycloneDX Python
Library version, list the separate components/services and inspect a selected
concrete dependency. Record exact version and results before claiming support.
The [synthetic configured example](../../examples/researcher/cyclonedx/configured/README.md)
contains a complete checked exchange for inspection, including the selected
application-to-Atlas dependency; its sources are illustrative fixtures, not real
deployment evidence.
Other tools, lossless import, live inspection, MBOM generation and posture ratings
remain outside this bounded release.
