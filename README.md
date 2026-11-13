# n8r-surface

The home of the **AI Surface Model**, an open model for describing the connected
components, configuration and relationships of an AI system, at the level of
detail available or useful. This repository also develops the experimental
`n8r-surface` command and Researcher library.

> [!NOTE]
> **Early draft; experimental tooling.** The model concepts and illustrative
> fields remain provisional. The library and command are available as the
> experimental [`@n8r/surface` package](https://www.npmjs.com/package/@n8r/surface/v/0.1.0-experimental.2);
> there is no universal schema, exporter or deployment engine yet. The Researcher
> skill supports working research through the host. The standalone command now
> supports bounded Codex research with numbered Markdown saves and fresh-session reopening.

## Why this is needed

An AI model's name does not tell you which services an application calls, how
authentication is configured, or which setup produced an Experiment result.
Answering those questions can mean piecing together diagrams, configuration files
and notes, often with incomplete information.

The AI Surface Model aims to make that context explicit and shareable. Start with
the components and connections you know, record the gaps, and add detail as it
becomes available. A saved description should help someone investigate a system,
understand a result or assess what they would need to recreate a setup.

## Who it is for

| If you… | The model is intended to help you… |
| --- | --- |
| Build or operate AI applications | Describe services, integration settings and dependencies across a setup. |
| Investigate security or component changes | Find affected components while keeping unknown versions and coverage gaps visible. |
| Run experiments | Connect results to the definition revision and effective setup actually used. |
| Build inventory, provenance or analysis tools | Explore exchange of a defined subset with explicit mapping losses. |

It is usable independently of Injectionator or any particular application.
Security investigation, reproducibility and configuration understanding are all
part of its scope.

For a compact security view, start with the provisional
[Skeleton Surface v0.1](spec/README.md#output-profiles-and-size): key nodes,
relationships and potential LLM/tool interception points, with linked evidence
and explicit gaps. Bindings are optional; larger research is not a minimum size.

This repository maintains the model and standalone tooling. Application design
and implementation for `n8r-labs` are maintained in its separate repository.

For the agreed professional-service direction, see the
[AI Surface security assurance strategy](docs/n8r-surface/security-assurance-strategy.md):
policy, controls, implementation guidance and observable assessment of static and
live systems. For the proposed first proof of value, see [from source discovery to a verified defensive change](docs/n8r-surface/product-direction.md).
The installed skill starts with folders and URLs; possible integrations remain
distinct from configured systems and runtime evidence.

## What it describes

An **AI Surface** is the connected system being described: applications, agents,
AI models, inference services, authentication, tools, data stores and supporting
infrastructure, together with their configuration and relationships.

There is one model: the **AI Surface Model**. A **fragment** is a working term
for a focused part of a description within it, such as Lab or Experiment; fragment
boundaries and serialization remain open. A Lab contains Experiments, and each
Experiment requests its setup directly from the Lab.

Definitions stay separate from deployments, dated observations and Experiment
Runs. A Run refers to the definition revision and effective setup used, so later
discovery does not silently change what an earlier result refers to.

## Experimental tooling

The [Researcher library](docs/n8r-surface/contracts.md) reads and writes bounded
HTML research records and partial definitions in JSON/YAML, with
[synthetic acceptance cases](examples/researcher/README.md). These checks do not
establish universal model conformance or consumer compatibility.

**To try the command, follow [Install, run and check research](docs/n8r-surface/getting-started.md).**

The [bare-startup command](docs/n8r-surface/startup.md) displays local settings and
saved artefacts, then offers explicitly confirmed local vault setup or reuses the
saved vault. The explicit `discover [source]` command now starts a
[Codex research conversation](docs/n8r-surface/codex-research-verification.md)
with source evidence, follow-up, explicit Markdown saves and fresh-session reopening.
See [save/reopen evidence and limits](docs/n8r-surface/save-reopen-verification.md).
The current candidate adds validated paired research HTML and partial Surface JSON,
with fresh-session revision; see the [candidate evidence and limits](docs/n8r-surface/surface-revisions-verification.md). See the
[critical path](docs/n8r-surface/critical-path.md) for the next work and the
[command outcome specification](docs/n8r-surface/command-outcomes.md) for the
intended interactions and required evidence.

The issue #41 skill candidate adds [standalone workspace setup and recognition](docs/n8r-surface/workspace.md)
before research, with a minimal identity record and preservation checks. Installed
candidate PM acceptance is [tracked separately](docs/n8r-surface/workspace-verification.md).

The [n8r-surface Researcher skill package](docs/n8r-surface/researcher-skill.md) is now
available for testing in the existing Codex/ChatGPT harness. It uses the host's
source access and conversation to produce evidence-backed working notes. The
[discovery guide](docs/n8r-surface/researcher-discovery.md) focuses on AI-relevant
graphs, reusable product knowledge and comparing descriptions with evidence. See
[verification and pending Work-mode checks](docs/n8r-surface/researcher-skill-verification.md).
[Skill 0.1.14 is available from the repository marketplace](docs/n8r-surface/marketplace-0.1.14.md).
It saves a [self-contained CycloneDX Surface](docs/n8r-surface/skill-cyclonedx.md)
with a generated brief, connected overview and investigation journal. See the
[0.1.14 first-use verification](docs/n8r-surface/first-use-overview.md). Follow the [working user manual](docs/n8r-surface/skill-manual.md)
for multi-component research, saving and continuation.
The [freeform component journey](docs/n8r-surface/guided-journey-verification.md)
records installed-skill exploration, later source intake and saved continuation.
The accepted delivery order is skill first, standalone CLI second, then separate
n8r-labs adaptation.
The [local vault](docs/n8r-surface/researcher-vault.md) holds research notes, intermediate artifacts
and Surface descriptions at a user-selected local path. It also includes prepared test material
and a walkthrough for investigating another chat-system repository.

## Start at the depth you need

The levels are reading paths, not prerequisites. Start at 100 for an introduction,
or jump to the examples, design questions or contribution guidance.

| Level | Start here | What you will find |
| --- | --- | --- |
| **100 · Understand** | [Model overview](models/ai-surface-model.md), then [Conceptual guide](models/README.md) | The purpose, vocabulary and a walkthrough of one investigation. |
| **200 · Explore** | [Synthetic examples](examples/README.md) | Compare descriptions at two depths; identify known facts, gaps and recreation requirements. |
| **300 · Examine** | [Draft concepts](spec/README.md) and [interoperability research](docs/interoperability.md) | Identity, evidence, partial knowledge, open decisions and proposed mappings to other formats. |
| **400 · Contribute and extend** | [Propose a change or extension](CONTRIBUTING.md#propose-a-change-or-extension) | Turn a use case into a proposal, example or bounded mapping, then follow the contribution workflow. |

The [roadmap](docs/roadmap.md) describes the intended sequence of work and the
evidence needed before a release.

## See progressive detail

Both [LibreChat examples](examples/README.md) describe a fictional authentication
path. These JSON excerpts show the **same component** at two levels of detail.
Field names are illustrative, not a released schema.

In the [minimal description](examples/librechat/minimal.json), its role is known
but its product is not:

```json
{
  "id": "component:authentication",
  "kind": "service",
  "role": "authentication",
  "product": { "status": "unknown" }
}
```

In the [expanded description](examples/librechat/expanded.json), the same identity
has more detail:

```json
{
  "id": "component:authentication",
  "kind": "service",
  "role": "authentication",
  "product": {
    "status": "known",
    "name": "Keycloak",
    "basis": "synthetic example"
  }
}
```

The expanded file also describes an OpenID Connect relationship and a supporting
database. Some settings remain unknown or omitted; inference and other application
dependencies remain unexplored. Neither example establishes a running integration
or enough information for recreation. They are alternative synthetic descriptions,
not a revision history or evidence of a deployment change.

Detail can grow along any connection, with shared components and cycles. Depth is
relative to the starting point and has no fixed two-hop ceiling. Missing detail
does not establish absence.

## Working with existing standards and tools

We have adopted CycloneDX as the standards direction for AI Surface exchange and
SBOM-first discovery. See the [strategic brief](docs/cyclonedx-adoption.md) for the
decision, discovery policy and open representation choices. Implementation remains
future work; SPDX remains an interoperability candidate. Use native constructs
where suitable and report omitted or transformed information.
Compatibility and round-trip fidelity still need evidence from named versions and
consuming tools. See the [interoperability research](docs/interoperability.md) for
mapping questions and related work, including Prismor and sbom-tools.

## Contribute or cite

Start with an issue, use a dedicated branch and open a linked draft PR; see
[Contributing](CONTRIBUTING.md) for proposals, checks and the full workflow.

Use [CITATION.cff](CITATION.cff) for attribution and include the exact commit URL
you used when citing this evolving draft.

## Licence

Machine-readable model assets, schemas, examples, code snippets and tooling use
[Apache-2.0](LICENSE). Written specification and documentation use
[CC-BY-4.0](LICENSE-DOCS). See [LICENSING.md](LICENSING.md) for the material split
and attribution requirements.

Commercial and proprietary reuse are welcome under those terms. Users retain
control of the licensing and publication of their own Surface descriptions and
Experiment data. Third-party material retains its applicable terms.

This is an independent Injectionator project, with no claimed OWASP affiliation
or endorsement.
