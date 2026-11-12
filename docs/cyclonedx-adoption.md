# Strategic brief: adopting CycloneDX for AI Surfaces

12 November 2026. Adoption direction agreed; representation and implementation
remain to be designed. This brief records strategy, not implemented behavior or
verified interoperability. Tracked in [issue #66](https://github.com/injectionator/n8r-surface/issues/66).

## Decision and purpose

Adopt CycloneDX as the standards foundation for exchanging AI Surface inventories,
manufacturing information and operational descriptions. Use established constructs
where they preserve the intended meaning, and investigate a documented AI Surface
namespace for information that needs additional semantics.

The purpose is to make security-relevant descriptions of complex AI systems usable
across our workflows and existing supply-chain tools. Connect what a system
supports, how a particular setup was assembled, and what was subsequently observed.
There remains one AI Surface Model, usable independently of Injectionator.

CycloneDX covers components, services, dependencies, manufacturing formulation and
AI/ML information. Its published 1.7 specification provides the baseline for the
mapping investigation; it is not yet a selected implementation dependency.
See the [specification overview](https://cyclonedx.org/specification/overview/)
and [AI/ML-BOM capability](https://cyclonedx.org/capabilities/mlbom/).

## Fit across labs, fab and runtime

| Our context | CycloneDX fit | Intended question |
| --- | --- | --- |
| Labs | SBOM, supplemented by service and AI/ML information | What components and integrations constitute the system under consideration? |
| Fab | MBOM and formulation | How is a selected setup built, configured, transformed and deployed? |
| Runtime | OBOM | What environment, configuration and dependencies are present in operation? |

CycloneDX's [MBOM](https://cyclonedx.org/capabilities/mbom/) includes software and
services as well as hardware, with declared and observed manufacturing processes.
[OBOM](https://cyclonedx.org/capabilities/obom/) addresses runtime environments,
configurations and additional dependencies. These concerns overlap; they are not
rigid equivalents of Capability/unbound, Bound and Observed:

- **Capability:** supported possibilities, without asserting instance bindings.
- **Bound:** selected and configured relationships, without requiring proof of use.
- **Observed:** dated evidence about an instance; execution claims require
  corresponding runtime evidence.

An SBOM can describe a selected composition before deployment or software
identified in operation. An MBOM can describe a planned process or its execution.
Purpose, binding state and evidence basis must remain independently identifiable.
Missing evidence means unknown, not unbound.

In a synthetic LibreChat example, a Capability Surface describes authentication
alternatives. A Bound Surface selects OpenID Connect (OIDC) and expands that
integration. Unselected alternatives can disappear from the instance view while
remaining in the referenced capability description. Configuration alone does not
establish a successful login or an exercised authentication path. An inventory
must not flatten mutually exclusive possibilities into an installed composition.

These are consumer workflow contexts, not a new Lab application architecture.
Existing ownership remains: an Experiment requests its setup from its Lab, which
owns resource configuration and local bindings. See the
[draft concepts](../spec/README.md) and
[Surface description meanings](n8r-surface/surface-descriptions.md).

## SBOM-first discovery

When a potential AI Surface is presented to an Injectionator user, for example a
Viewyonder consultant, the first discovery step should identify its software
components and seek existing SBOMs for them.

Search our own library of SBOMs and references, known upstream publication
locations, and each component's repository, release artifacts and website. Check
candidate provenance and applicability to the component version or artifact under
analysis before using an SBOM as the discovery baseline. A document for another
version can inform research but cannot silently describe the target version.

Where no suitable SBOM is available, the first task should be to obtain or generate
one from available source, build artifacts or packages. If access or tooling
prevents this, record the limitation and continue with an explicitly partial
inventory. Generation must identify its inputs, method and coverage; source-based
findings do not by themselves establish installed or running software.

Maintain a reusable library of SBOMs and references with component identities,
versions, sources, retrieval dates and coverage information. Preserve upstream
documents and distinguish them from inventories we generate or enrich. Library
storage, refresh policy, access controls and generation tools remain design work.
Only permitted material may be retained or shared; this policy does not authorize
publishing customer inventories in this repository.

An SBOM supplies the starting inventory. Discovery extends it with services, AI
models, integrations, configuration, trust boundaries and supporting evidence.
Dependencies or relationships omitted from an SBOM remain unknown until
investigated. Existing inventories in other formats should be retained as source
evidence; any conversion must disclose transformations and losses.

## Standards and namespace policy

Investigate an AI Surface profile of CycloneDX, in this order:

1. Map information to native CycloneDX constructs.
2. Use documented extension properties where native constructs cannot adequately
   preserve the meaning.
3. Link supporting Surface records where embedding would lose meaning or expose
   sensitive information.
4. Record omissions, transformations and unsupported meanings explicitly.

An XML namespace and a CycloneDX property namespace solve different problems.
Retain the standard document structure and namespace when producing CycloneDX
XML. A separate AI Surface vocabulary needs ownership, versioning and semantics
across supported serializations. See the
[CycloneDX 1.7 XML reference](https://cyclonedx.org/docs/1.7/xml/).

A property prefix such as `n8r:surface:*` is an illustrative candidate, subject to
namespace review and registration. It is not registered by this decision and must
not be placed under the reserved `cdx` namespace. Follow the
[CycloneDX property taxonomy](https://github.com/CycloneDX/cyclonedx-property-taxonomy).

Whether CycloneDX becomes the canonical saved format or an exchange representation
remains open. Decide using a mapping that demonstrates preservation of AI Surface
meanings. Existing records and contracts remain unchanged in this increment.

## Tool compatibility

“CycloneDX tools work with us” is an acceptance requirement to demonstrate.
For each supported profile, identify exact specification and tool versions,
demonstrate validation and import, and verify a named useful result: inventory
inspection, dependency traversal, comparison or another agreed task. Check whether
extensions survive processing and whether consumers understand or ignore them.

Parsing establishes neither semantic compatibility nor round-trip fidelity.
Ordinary consumers should receive a useful standard inventory even when they do
not understand additional Surface semantics. Retain the fuller source description
and report losses. No consumer has been verified by this brief; see the
[interoperability evidence requirements](interoperability.md#evidence-for-compatibility).

## Provenance and transitive dependencies

AI Surface provenance should support a traceable chain from source evidence and
selected definition through assembly, bindings, observations and Experiment Runs.

Retain stable identities, exact revisions, artifact digests where applicable,
producers, timestamps, transformation history and evidence references. Later
observations must not rewrite the setup attributed to an earlier Run.
Cryptographic verification, if introduced, must be distinguishable from an
unverified provenance assertion. A signature alone does not establish that the
inventory is accurate or complete.

Represent software inside software and software supporting services, including
shared and transitive dependencies. Keep containment, dependency, invocation and
data-flow relationships distinct. Unknown service internals remain a coverage gap;
retain partial descriptions, cycles and arbitrary depth where relevant.

CycloneDX supports dependency graphs and cross-document references through
[BOM-Link](https://cyclonedx.org/capabilities/bomlink/). Evaluate these mechanisms
before introducing another linking scheme. A referenced BOM needs its own identity,
revision and applicability checks; linking it does not prove its contents.

## Security and government alignment

Maintain a versioned evidence crosswalk: the exact requirement and source revision,
its applicability, the Surface information that supports it, and evidence still
required. Initial references are:

- **US and international SBOM guidance:** retain the NTIA 2021 documents below as
  foundations, alongside the updated
  [2026 Minimum Elements for an SBOM](https://www.cyber.gov.au/publication/2026-minimum-elements-for-a-software-bill-of-materials-sbom).
  Use the archived [Executive Order 14028, 12 May 2021](https://www.govinfo.gov/app/details/DCPD-202100401)
  as historical context, not a determination of current obligations.
- **NIST:** investigate secure-development evidence against SSDF and its
  generative-AI community profile,
  [SP 800-218A, final 2024](https://csrc.nist.gov/pubs/sp/800/218/a/final).
- **UK:** map relevant lifecycle security evidence to the
  [AI Cyber Security Code of Practice, 2025](https://www.gov.uk/government/publications/ai-cyber-security-code-of-practice).
- **EU:** assess relevant component-transparency and vulnerability-handling
  requirements under the
  [Cyber Resilience Act, Regulation (EU) 2024/2847](https://digital-strategy.ec.europa.eu/en/policies/cra-summary),
  recording applicability separately and consulting the regulation itself for
  any detailed requirements mapping.

Standards alignment means traceable mappings and supporting evidence. It does not
establish certification, legal compliance or government endorsement. No control
crosswalk or regulatory applicability assessment has been completed here.

The supplied historical NTIA references are retained for follow-up:

- [Framing Software Component Transparency: Establishing a Common SBOM, second edition, 21 October 2021](https://www.ntia.gov/files/ntia/publications/ntia_sbom_framing_2nd_edition_20211021.pdf).
- [The Minimum Elements for an SBOM, 12 July 2021](https://www.ntia.gov/files/ntia/publications/sbom_minimum_elements_report.pdf).

Both supplied PDF URLs returned access errors during the brief's research. Their
full text remains to be checked before a detailed crosswalk. Other linked primary
sources informed the strategic summary; mutable pages and the property taxonomy
will need exact revisions pinned for implementation findings.

## Required outcome before implementation

The next design increment should produce a version-pinned mapping, a namespace
proposal and a synthetic worked example spanning capability, selected
configuration, assembly and observation. Include the SBOM lookup/generation path,
information losses, privacy boundaries and concrete consumer acceptance checks.
Resolve canonical storage versus exchange format before migration work.

This brief authorizes no code changes. Its scope is the AI Surface Model and
consumer integration boundaries. Lab application architecture, automated SBOM
collection/generation, runtime inspection, deployment automation and migration of
existing artifacts require subsequent decisions. Implementation and compatibility
remain unproved.
