# Capability and Bound Surface contract 0.2

This bounded library contract implements [#50](https://github.com/injectionator/n8r-surface/issues/50)
within the one AI Surface Model. It supports the [agreed delivery intent](surface-descriptions.md),
not a universal schema or a released Researcher workflow. The standalone skill
must not call or depend on the `n8r-surface` CLI. Skill artifact production is #51;
installed-workflow and human acceptance are #52. Observed Surface remains deferred.

## Versions and shared representation

`n8r.surface/0.2` requires `kind: "capability"` or `kind: "bound"`. It neither
reinterprets nor replaces `n8r.surface/0.1` selected definitions. Older readers
reject it. Do not change the version string to downgrade: doing so loses possible
versus configured meaning, exclusive alternatives, conflicts and instance identity.
There is no automatic conversion. Keep the original when making a separately
reviewed projection. Package versions and artifact contract versions are distinct.

Reuse the [0.1 envelope, research records and logical digests](contracts.md).
All fields below are required; empty arrays are permitted except where specified.
Objects are closed. This profile requires an empty `extensions` object and has
no arbitrary attributes or actual-setting fields. JSON is the only encoding;
`encode` and `decode` reject YAML for these descriptions. Research records retain
their existing JSON/YAML/HTML support. No new renderer is introduced here.

| Shared field | Meaning |
| --- | --- |
| `id`, `title`, `scope`, `revision`, `extensions` | Existing envelope; `extensions` must be `{}`. |
| `records` | Exact research `{id, revision, digest}` references. |
| `vocabularies` | Unique `{id, version}` entries; terms remain vocabulary-specific. |
| `nodes` | `{id, label, type: {vocabulary, term}}`; useful component/target identity only. |
| `coverage`, `gaps` | Explicit coverage limits, missing information and next research needs. |

A basis entry is `{record, revision, items}`. `items` is nonempty and unique,
referring to findings, or to decisions only in the dedicated `decisions` field.
Referenced research revisions must occur in `records`. Source identity, version,
date, locator, coverage and limitations live in the research record, not copied
raw configuration. All IDs are opaque, stable and case-sensitive. Labels are not
identity matching rules. An omitted node/edge/binding is unspecified, not absent.

## Capability Surface

`kind: "capability"` adds `capabilities` and `exclusiveGroups`.

Each capability is `{id, from, to, type, state, basis, conditions, note}`. Endpoints
resolve to local nodes and type vocabulary resolves locally. Shared components,
parallel edges, cycles and self-loops are allowed. Each edge is a possible
relationship, never a selected composition. `conditions` lists material conditions
and `note` explains applicability and uncertainty. Empty conditions do not prove
unconditional support outside the stated scope.

| State | Evidence check |
| --- | --- |
| `possible` | Nonempty basis; all cited findings are `known`, subject equals `from`, property is `supports`, and every claim value equals the `to` node ID. |
| `absent` | Nonempty basis; all findings are `absent` with the same subject/property/target rule. This is scoped absence of support, not an unbound instance. |
| `conflicting` | Nonempty basis containing a conflicting finding; subject/property still match. Inspect all competing values in research. No target is selected. |
| `unknown`, `omitted`, `redacted`, `out-of-scope` | No support assertion. Any basis resolves to findings about that subject/property; notes explain the state. |

Each exclusive group is `{id, members}` with at least two distinct capability
IDs. It means **at most one** member may be configured in this bounded instance.
It does not require a selection, claim exhaustive alternatives, or resolve a
conflict. The synthetic authentication group is a fixture constraint, not a general
claim that every product makes OIDC and SAML mutually exclusive. Conditions and
other constraints remain human-readable; the checker does not execute them.

## Bound Surface

`kind: "bound"` adds `capability`, `instance` and `bindings`:

- `capability` pins one Capability Surface `{id, revision, digest}`.
- `instance` is `{id, label}` with an opaque identity distinct from the capability
  artifact and its components. It contains no location or credentials.
- Each binding is `{id, capability, state, claims, decisions, note}`. The inner
  `capability` is an edge ID in the pinned Capability Surface. One entry per
  capability is permitted in this bounded profile.
- Each claim is `{target, basis}`. `target` resolves to a local Bound node; basis
  is nonempty. A useful target label may be `MongoDB Atlas` or `OIDC service`.
  A target need not have the same ID as the product-level capability target.

| State | Required claims |
| --- | --- |
| `configured` | Exactly one target with known configuration evidence; capability state must be `possible`. |
| `conflicting` | At least two distinct targets, each evidenced; no selected target. |
| `unknown`, `omitted`, `redacted`, `out-of-scope` | No claims; the note explains why. |

A configuration finding has `subject` equal to the opaque instance ID, `property`
equal to the capability edge ID and claim values equal to target node IDs. It is
`known` or `conflicting`. Each cited finding must include the target it supports;
all of that finding's competing targets must be retained in the binding. All
known/conflicting findings for that same instance and capability in the Bound
description's referenced research are checked, including uncited basis items.
Multiple known findings supporting different targets also form a conflict. A configured
binding cannot cite a conflicting finding. Missing evidence cannot become an
unbound assertion. Explicit unbound/absence and multi-target configured slots are
outside this initial binding profile; preserve such source findings in research
and describe the coverage limit rather than forcing them into a supported state.

`decisions` refers only to research decisions, independently of source findings.
A human preference is not configuration evidence and cannot resolve a source
conflict by itself. Corrected source evidence belongs in a new research revision.
Configuration suffices; no reachability, runtime use or successful deployment is
asserted or checked. Target suitability and the truth/coverage of source prose
require inspection; matching references alone do not establish those facts.

## Verification and revisions

The existing public APIs accept the new types:

- `validateArtefact(value)` checks closed shape, states, identity uniqueness,
  local targets/vocabularies and declared research references.
- `verifyReferences(value, context)` additionally requires exact research and
  Capability revisions/digests, checks evidence roles, subject/property/target
  correspondence and exclusive groups. Include the Capability's research context
  even when the Bound description cites a later research revision.
- `encode(value, 'json')` and `decode(text, 'json')` check structure and preserve
  data. They do not imply that external references were checked.
- `verifySuccessor(previous, next)` checks parent revision/digest and retained
  identities. Description kind cannot change. A retained node cannot change its
  type; a retained capability cannot change endpoints/type. A retained binding
  slot cannot change its capability ID, instance or capability-artifact identity.
  A successor may pin a newer revision of the same Capability artifact and change
  a binding target with new evidence. Check both references and succession.

A binding ID denotes the instance's slot for that capability, not an immutable
edge to one target. Target changes retain the slot ID and component IDs where
those components are the same. A different connection/capability needs a new ID.
Old bytes and old references stay unchanged; these pure library functions do not
write files or enforce history-wide ID reuse, atomic persistence or retention.
Cross-revision vocabulary changes and newly supplied source meaning still need
human review. Size/depth limits are the existing 2 MiB / 64-level codec limits,
not graph hop limits.

## Privacy boundary

Supply only permitted, sanitized research. Do not copy actual URLs, IP addresses,
usernames, passwords, keys or raw settings into any note, label, identifier,
source locator, filename, HTML, JSON or retained evidence. Use opaque source
identifiers or sanitized snapshots whose digest describes those actual sanitized
bytes; never invent a digest of unseen raw material. A source that cannot be
inspected safely is a coverage limit. No raw-secret store is introduced.

Closed shapes and rejection of nonempty extensions prevent designated settings
fields from being stored, but **validation is not a secret detector**. A secret
could still be put in ordinary prose or an identifier. Producers must avoid
collecting it and check all output before retention; #51 owns that workflow.
Tests use synthetic sentinels, never real secrets. New-description validation and
reference errors omit input values/keys; parser syntax errors also omit source
snippets. Do not log raw rejected input or legacy research-validation exceptions.
Old research records allow arbitrary claim values and retain their existing
validation contract; sanitization remains essential before calling those APIs.

## Human verification task list

Prerequisite: open this branch's [synthetic examples](../../examples/researcher/descriptions/README.md).
No CLI, inference, credentials, real configuration or live services are needed.

- [ ] Open `capability.json`. Expect MongoDB, OIDC and SAML as **possible**, an
  authentication exclusive group and **unknown** inference support, without
  instance bindings.
- [ ] Open `bound-r1.json` beside `sources.md` and `research-r1.json`. Expect a
  **configured** MongoDB Atlas target, **conflicting** OIDC/SAML targets and
  **unknown** inference. Find the separate OIDC preference; it must not erase
  either source claim. Expect role/product identities, no actual settings.
- [ ] Open `bound-r2.json` and `research-r2.json`. Expect the same instance and
  database binding ID, a self-hosted MongoDB target and exact predecessor
  references. The original files still show Atlas and the earlier evidence.
- [ ] Report **Pass / Fail / Blocked**, inspected filenames and any incorrect
  state, exposed value, lost conflict or broken reference. These are developer
  fixtures; passing inspection is not installed Researcher acceptance.

### Maintainer preparation and technical readback

From the repository root, use Node.js 22, 24 or 26. Run `npm ci` then
`npm run build` (exit 0; dependency installation uses the registry). This read-only
example exercises the library directly, not a skill dependency on a CLI:

```sh
node --input-type=module <<'JS'
import {readFileSync} from 'node:fs';
import {decode, verifyReferences, verifySuccessor} from './dist/index.js';
const read = name => decode(readFileSync(
  `examples/researcher/descriptions/${name}.json`, 'utf8'), 'json');
const context = ['research-r1', 'research-r2', 'capability'].map(read);
const before = read('bound-r1'), after = read('bound-r2');
verifyReferences(context[2], context);
verifyReferences(before, context);
verifyReferences(after, context);
verifySuccessor(before, after);
console.log(before.bindings.map(b => b.state).join(', '));
console.log(before.bindings[0].claims[0].target);
console.log(after.bindings[0].claims[0].target);
JS
```

Expect exit 0 and exactly:

```text
configured, conflicting, unknown
urn:target:atlas
urn:target:mongodb
```

The readback changes no files; no cleanup is needed. A nonzero exit or different
states/targets fails this check. `npm test` covers malformed data, unsupported
YAML, privacy sentinels, conflicting/exclusive selections and revision/reference
drift. The package check exercises these assets through an installed library.

## Baseline and evidence boundary

On 8 November 2026, inspection of installed Researcher skill **0.1.9** found its
explicit statement that it produces working notes and does not generate validated
research HTML or Surface definitions. This is a prerequisite blocker for the
requested installed-artifact journey, not an attempted AI investigation or proof
of generated artifacts. CLI availability is irrelevant to the standalone skill.
The authorized known gap is implemented here only at the contract/library layer.

The synthetic fixture journey above is the #50 agent rehearsal. It is not
Researcher-produced findings, an installed-skill rehearsal, human acceptance,
a real-instance inspection, or evidence of runtime use. #51 must package usable
standalone artifact production/checking resources; #52 must repeat the actual
installed conversation and independently read back its saved results.
