# Synthetic Capability and Bound descriptions

These are developer-written fixtures for [contract 0.2](../../../docs/n8r-surface/surface-description-contract.md),
not AI findings or a real deployment. The example vocabulary `urn:v:demo` version
`1` uses `component` for nodes and `uses` for possible directed relationships.
These terms describe roles only, not protocol compatibility.

| File | Inspect for |
| --- | --- |
| [Source pack](sources.md) | Synthetic product support, sanitized configuration summaries and a separate human preference. |
| [Research r1](research-r1.json) | Exact source hash, source locators, known/conflicting findings and human decision. |
| [Capability](capability.json) | Possible MongoDB/OIDC/SAML relationships, exclusive authentication options, unknown inference. |
| [Bound r1](bound-r1.json) | Configured Atlas, conflicting authentication and unknown inference; pinned Capability revision. |
| [Research r2](research-r2.json) | Changed database evidence with the original research as predecessor. |
| [Bound r2](bound-r2.json) | Same instance and binding slot, new MongoDB target, pinned predecessor; unchanged Capability revision. |

All source/settings content is synthetic and sanitized at origin; there are no
actual endpoints, accounts or secrets to recover. Configuration claims do not
prove runtime use. A conflicting target does not assert that its protocol fits
the possible connection; it records source disagreement requiring investigation.
Missing evidence does not mean unbound.

Follow the [human inspection and runnable readback](../../../docs/n8r-surface/surface-description-contract.md#human-verification-task-list).
`npm test` checks exact hashes, local/external references and revisions; it does
not establish research quality, installed-skill acceptance or model conformance.

Machine-readable fixtures use [Apache-2.0](../../../LICENSE). This guide and the
synthetic source pack use [CC-BY-4.0](../../../LICENSE-DOCS); credit AI Surface
Model contributors. No third-party source material is included.
