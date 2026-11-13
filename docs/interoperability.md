# Interoperability research

The goal is useful exchange with existing ecosystems while preserving the native
AI Surface description. An export can contain only a subset of that description.
Its omissions and transformations must be visible to the recipient.

**Status:** CycloneDX is the adopted standards direction; see the
[strategic brief and SBOM-first discovery policy](cyclonedx-adoption.md). Detailed
mappings and representation choices remain open. This repository does not yet
contain an exporter, a validated CycloneDX/SPDX fixture or consumer compatibility
results.

## Related work

| Project | Relevant starting point | What to establish here |
| --- | --- | --- |
| [CycloneDX](https://cyclonedx.org/specification/overview/) | BOM components, services, dependencies and AI/ML-related description. | Which Surface meanings fit native constructs, which need links or extensions, and which should be omitted. |
| [SPDX](https://spdx.github.io/spdx-spec/v3.0.1/) | Artifact identities and relationships, including AI and Dataset profiles. | Profile selection and faithful mapping of Surface components and their relationships. |
| [Prismor](https://github.com/PrismorSec/prismor) | Agent runtime controls and an [AI-BOM exporter](https://github.com/PrismorSec/prismor/blob/main/prismor/runtime/aibom.py). | What declared inventory or evidence could be exchanged without changing its meaning. |
| [sbom-tools](https://github.com/sbom-tool/sbom-tools) | Analysis and comparison of supplied CycloneDX/SPDX BOMs. | Whether a named version can usefully inspect and compare our exported subset. |

Standards and tools have different roles. A format supporting a concept does not
prove that a particular producer collects it or that every consumer understands it.
CycloneDX is the selected standards direction; the other projects remain
interoperability candidates. None is selected here as a software dependency.
No affiliation or endorsement is implied.

## Candidate mapping questions

| Surface information | Investigation |
| --- | --- |
| Product/service identity and version | Preserve identifiers, artifact hashes and version uncertainty in suitable native fields. |
| Connections | Keep dependency, identity, invocation and containment meanings distinct; do not flatten every edge into the same claim. |
| Integration configuration | Determine native support, linked artifact options and whether an extension is justified. |
| Unknown or partial coverage | Preserve what the export does and does not claim to enumerate. |
| Internal Agent/model/tool entities | Establish identity and relationship mappings without losing the enclosing application's context. |
| Provenance and evidence references | Preserve source and applicability; distinguish declared configuration from tested behavior. |
| Experiment bindings | Link where supported; otherwise omit with an explicit explanation while retaining the native records. |

These are questions, not findings that either standard lacks those capabilities.

## Export contract to design

Every export profile should identify:

1. The native model revision and exact target standard/profile version.
2. The supported entity and relationship subset.
3. Rules for stable references, identifiers and configuration artifacts.
4. Any extension namespaces and the semantics they introduce.
5. What was included, transformed, omitted or could not be represented.
6. Whether import or round-trip behavior is supported for this subset.

For example, an authentication component might be included while its particular
claim-mapping configuration is omitted. The loss report should identify that
configuration and the reason; the native description should retain it.

## Evidence for compatibility

Use the same source facts to produce native and standard-format examples. Pin
standard versions, validators and consumer versions. Check syntax, reference
integrity, preserved meaning and the actual questions each consumer can answer.

Schema validation alone is not an interoperability result. A schema-valid custom
property may be ignored by a consumer. Do not describe an omitted relationship
as absent or claim complete round-trip fidelity from successful file parsing.

## Source and licence handling

Keep source links and version/commit references with future findings. Exchanging
data with a project does not automatically require adopting its code. If material
is copied or incorporated, preserve its applicable licence and attribution.

Related: [draft concepts](../spec/README.md), [roadmap](roadmap.md),
[licensing](../LICENSING.md).
