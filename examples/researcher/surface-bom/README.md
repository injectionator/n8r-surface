# Synthetic Surface BOM

`initial.cdx.json` is a fictional assistant with four database alternatives, one
selected dependency, an unknown inference connection, evidence, a user decision
and an investigation plan. It makes no claim about LibreChat or any deployment.
The repeated evidence hash is a synthetic placeholder, not a real inspected file.

Read the [profile](../../../plugins/n8r-surface/skills/research/references/cyclonedx.md)
and [mapping limits](../../../docs/n8r-surface/skill-cyclonedx.md).
From the repository root with Node 22/24/26:

```sh
node plugins/n8r-surface/skills/research/scripts/surface.mjs check examples/researcher/surface-bom/initial.cdx.json
```

Expect exit 0 and `checked`, five relationships and three investigation entries.
This checks structure/references only, not actual product evidence.
