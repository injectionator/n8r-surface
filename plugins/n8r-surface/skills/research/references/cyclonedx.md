# CycloneDX 1.7 alongside native records

Use this workflow when the user asks for CycloneDX or an interoperable BOM of a
Surface. Research with the host, save a checked native bundle using
[artifacts](artifacts.md), then export through the bundled `scripts/cyclonedx.mjs`.
The helper is offline and standalone: Node.js 22/24/26, no product CLI or install.

## Source intake and user explanation

Explain the user journey as you go: sources → useful graph → checked native save →
CycloneDX exchange → independent readback → fresh-session continuation. Keep the
brief concise and explanations available on request. Treat the user's product list
as intended scope, not evidence of connections. Incrementally introduce sources;
no hidden knowledge of another repository or the team's deployment.

Seek applicable SBOMs in explicitly available libraries, supplied repositories,
release artifacts and permitted upstream locations. Check version, source and
coverage before using them. With no network or suitable inventory, record that
blocker and produce a partial source-derived inventory. Do not invent transitive
packages or claim the helper imports/merges arbitrary upstream BOMs. This release
projects researched native nodes; broader SBOM collection remains outside it.

Historical deployment notes describe their original observation period, not fresh
configuration. Keep selected model, actual model and provider identity distinct.
Inspect safe configuration projections only; never print or retain connection
strings, credentials, private endpoints or actual user records. Follow the native
artifact privacy rules before staging any output.

## Prepare the mapping

After a native bundle is saved, create a mapping JSON with exactly two keys:

```json
{
  "nodes": [
    {"id": "urn:component:assistant", "kind": "component", "type": "application", "rationale": "Application role established by the supplied source."},
    {"id": "urn:component:storage", "kind": "service", "rationale": "Managed storage service described by the supplied configuration evidence."}
  ],
  "dependencies": []
}
```

These are shape examples, not findings. Include every native node exactly once.
Copy IDs from the saved Surface; names come from that record. Classify each as a
CycloneDX `component` with an appropriate native type, or `service` without `type`.
For example `application`, `library`, `operating-system`, `platform` and
`machine-learning-model` are component types. Separate a model from its serving
service and connector when evidence supports those distinct entities. Do not force
unknown software to be a service just to avoid classifying it; investigate or
report the unresolved mapping. `rationale` records your classification basis.
Do not add versions, package IDs, endpoints, extra keys or arbitrary extensions.

`dependencies` lists native relationship IDs explicitly judged to mean dependency.
Only Bound relationships with a single configured target are eligible. The helper
uses the concrete target, not merely the abstract role endpoint. Do not add an
edge just because it is in the graph: hosting, identity, containment and data flow
are not interchangeable with dependency. Possible, unknown and conflicting links
stay in the report/native records. Capability exports use an empty dependency list.
The BOM is a partial view; the mapping report and native records retain richer
semantics, evidence and uncertainty. This output does not assert runtime use.

## Export and check

Resolve the helper from this installed skill. Resolve filesystem parents to their
real paths; use a new numbered destination beside the existing native directory.
The user request to save CycloneDX authorizes preparing the mapping and export.

```sh
node /INSTALLED/skills/research/scripts/cyclonedx.mjs export /WORKSPACE/native-001 /WORKSPACE/mapping.json /WORKSPACE/exchange-001
node /INSTALLED/skills/research/scripts/cyclonedx.mjs read /WORKSPACE/exchange-001
```

Exit 0 with `saved-and-read-back`, then `checked`, establishes the bounded helper
checks. Open the saved files independently. Provide links to the native brief,
`surface.cdx.json`, `mapping.json` and `README.md`. Explain projected dependencies,
retained meanings and gaps. `surface-records.json` carries the exact native snapshot;
keep it and the mapping report with the BOM. The helper validates pinned official
CycloneDX 1.7 schemas and references, not the truth or completeness of research.
Never claim a named consumer works unless it was actually exercised.

On failure, preserve the output, report no success and inspect the specific
contract/mapping/predecessor issue without printing unsafe input. Do not replace
failed validation with hand-authored unchecked JSON. A fresh native successor
cannot become a new initial export: supply its prior exchange. If an older native
lineage has no exchange, export its root first and follow the lineage in order.

## Reopen and revise

Read both native and exchange directories with their helpers. Check current source
identity; keep prior decisions and contrary evidence. Save a native successor using
the existing helper, then export with its prior exchange:

```sh
node /INSTALLED/skills/research/scripts/cyclonedx.mjs export /WORKSPACE/native-002 /WORKSPACE/mapping-002.json /WORKSPACE/exchange-002 /WORKSPACE/exchange-001
```

Expect stable BOM serial number, incremented BOM version and a predecessor digest.
Keep retained node classifications stable; changes to those require a separately
reviewed mapping evolution, not silent relabeling. Exact unchanged native records
may also be reprojected as a new exchange version. Read both saved outputs and
verify old manifests/bytes remain unchanged. Edited files are conflicts; do not
overwrite or regenerate them in place. No deployment, runtime probe or posture score.
