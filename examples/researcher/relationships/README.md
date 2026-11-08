# Shared node-and-relationship examples

Start here for the revised #50 verification. These developer-authored fixtures
exercise [contract 0.3](../../../docs/n8r-surface/surface-relationships.md). The
fictional assistant and setting names are not findings about LibreChat or any
real deployment. Earlier [0.2 fixtures](../descriptions/README.md) stay unchanged.

| File | What to inspect |
| --- | --- |
| [Capability](capability.json) | Component nodes and relationship edges with purpose, integration mechanism, configuration references and individual evidence. |
| [Bound r1](bound-r1.json) | The same relationship structure and identities, annotated with configured Atlas, conflicting identity and unknown inference bindings. |
| [Bound r2](bound-r2.json) | Same relationship ID, role endpoints and purpose; changed concrete database target. |
| [Research r1](research-r1.json), [research r2](research-r2.json) | Support evidence, property-level findings, source hashes/locators, human decisions and immutable predecessor references. |
| [Source pack](sources.md) | Synthetic purpose, protocol, alternatives, configuration summaries and uncertainty. |
| [Config reference](config/assistant.env.example) | Setting name and owner, without an actual setting value. |

`urn:v:demo` version `1` gives node type `component` and edge types `persists-data`
(stores application data), `authenticates-via` (uses an identity service), and `uses`
(generic possible dependence with the specific integration unresearched). Types do
not imply protocol compatibility or exercised connections. Known configuration
metadata does not establish a configured instance binding.

The database edge's `from`/`to` connect Assistant and the MongoDB role. The Bound
edge's `binding` identifies Atlas as the configured target; its successor selects
self-hosted MongoDB without changing the role graph or rewriting the earlier file.
Missing details stay unknown. Conflicts remain visible alongside human preference.

Follow the [human inspection and runnable readback](../../../docs/n8r-surface/surface-relationships.md#human-verification-task-list).
The library checks are offline after dependency setup; no CLI or AI runner is
required. They do not establish installed-skill acceptance or model conformance.

Machine-readable fixtures and the config example use [Apache-2.0](../../../LICENSE).
This guide and synthetic source prose use [CC-BY-4.0](../../../LICENSE-DOCS); credit
AI Surface Model contributors. No third-party source material is included.
