# CycloneDX consumer module

The candidate package exposes `@n8r/surface/cyclonedx` for bounded CycloneDX 1.7
Surface validation, generated views and immutable revision storage. It does not
start research, inference, a CLI or target equipment. The existing root exports
remain compatible. This entry is not yet a registry release.

```ts
import {checkSurfaceBom, renderSurface, saveSurface, readSurface}
  from '@n8r/surface/cyclonedx';
const surface = checkSurfaceBom(input);
const views = renderSurface(surface);
saveSurface(surface.bom, newDirectory);
const saved = readSurface(newDirectory);
```

The [profile](skill-cyclonedx.md) remains authoritative. Validation includes the
pinned standard schemas, profile references, evidence and privacy checks. Hosts
must omit sensitive values before staging; the conservative privacy check is not
an arbitrary-text secret detector. Models grant no operating authority.

The module also exports `property`, `prefix`, `projectDependencies`, `byteDigest`
and the `Bom`, `Surface`, `Relationship`, `Entry`, `Evidence`, `Presentation` types.
Revision save/read retains existing predecessor hashes, identity and historical
evidence rules. Generated views are derived; edited views require explicit
reconciliation. Filesystem saves retain the existing partial-save failure contract.

Runtime dependencies include pinned AJV validators and YAML, which the strict
JSON decoder uses to detect duplicate keys and restricted number syntax. Shared
helpers avoid loading legacy model validation, Researcher presentation or runners.
Code and schemas retain their [licensing](../../LICENSING.md).

Run `npm test` for source contracts and skill consistency, and
`node scripts/check-cyclonedx-package.mjs` for a freshly packed scoped candidate
installed with production dependencies only. The latter downloads missing npm
dependencies, tests the public entry, and cleans its temporary consumer. It does
not publish. Use the existing [candidate procedure](npm-distribution.md) to retain
an archive and source revision/digest report for a consumer integration.

The producer owns this entry and its compatibility tests; consumers pin a reviewed
candidate and retain their own equipment mapping, credentials and authorization.
