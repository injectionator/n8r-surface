# Draft roadmap

The first milestone is an explainable model demonstrated on concrete questions.
This list is a research and design sequence, not a release commitment.

1. Develop representative cases: inference, external authentication, tools and
   downstream data, with both minimal and expanded descriptions.
2. Settle entity identity, relationships, partial knowledge and configuration
   semantics before freezing field names.
3. Define a small native serialization and validation rules that accept useful
   partial descriptions.
4. Demonstrate offline component/version investigation, including unresolved
   coverage and historical versus current deployment scope.
5. Define immutable revisions and links to effective setup, provenance and Runs;
   exercise both one-to-many Experiment/Surface patterns.
6. Implement a bounded CycloneDX export with explicit loss accounting, then
   evaluate SPDX and named consumer tools using the same facts.
7. Exercise recreation from a shareable example and record required artifacts,
   local bindings and remaining gaps.

## Security assurance product direction

The [agreed strategy](n8r-surface/security-assurance-strategy.md) connects the model
and discovery work to a practical framework and professional service for consultants,
security engineers, architects and system owners. Its milestone map starts with
existing skill acceptance, then a bounded policy/control/verification slice,
static/configured assessment, observable runtime proof and repeatable posture
reporting. Level definitions and scoring rules remain to be designed. The broader
model research sequence above remains relevant and is not a product delivery claim.

## Evidence needed before a model/interoperability release

- Examples have an identified schema version and validate against it.
- Queries give useful answers without hiding incomplete knowledge.
- Immutable references preserve what an Experiment result refers to.
- Exported documents validate and work with named, versioned consumers.
- Recreation claims have been attempted in an independent environment.

The model/interoperability sequence remains draft; no universal released schema,
exporter, consumer compatibility trial or recreation proof is claimed here.
Experimental command/library delivery and accepted bounded skill verification are
tracked separately in the [critical path](n8r-surface/critical-path.md) and strategy.

Related: [draft concepts](../spec/README.md),
[interoperability](interoperability.md), [contributing](../CONTRIBUTING.md).

## Evolving-target Joe/Maya proof

The [proposed design and delivery sequence](superpowers/specs/2026-11-14-joe-maya-proof-design.md)
prioritizes repeat investigation of the existing lab: baseline, minor configuration
change, HR integration, scoped failure, defensive change and fresh-chat readback.
[Issue #76](https://github.com/injectionator/n8r-surface/issues/76) retains the
Surface continuation work. Follow-on tracks preserve scope without committing to
a new platform now:

- [Evaluation helper and eventual extraction](https://github.com/injectionator/n8r-surface/issues/79).
- [Correlated observation handoff and later live view](https://github.com/injectionator/n8r-surface/issues/80).
- [Policy evidence generalization after a bounded Cedar decision](https://github.com/injectionator/n8r-surface/issues/81).

Surface remains the independently useful public release. n8r-runtime owns target
control/observation; n8r-probe owns harness authoring and
execution, initially evaluating Promptfoo and using Langfuse evidence. Both are
proposed private n8r-labs modules developed alongside the proof. Surface discovers
these tools and alternatives, including actual hooks/tool integrations, without
executing them. HR enforcement stays in the target. The provisional strategy is
standalone Surface, Probe and Runtime releases plus
a bundled Labs experience; only Surface is on the current public release track.
The original inline detect/evaluate sidecar remains deferred. Public issues retain
consumer handoffs, while receiving implementation issues belong in Labs. These are proposed
delivery gates, not implemented or verified capabilities.
