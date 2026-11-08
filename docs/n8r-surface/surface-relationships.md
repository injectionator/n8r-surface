# Shared Surface relationships contract 0.3

Capability and Bound Surfaces describe one graph vocabulary: **component nodes
and identified relationship edges with their own data and evidence**. A connection
must explain why it exists, how it integrates and where configuration is defined,
as far as the sources establish. Size/depth remains independent of description kind.

This is the revised bounded #50 contract, following human verification of the
[earlier 0.2 increment](surface-description-contract.md). It implements a reusable
structure, not a universal ontology or a real-product integration claim. The
[synthetic examples](../../examples/researcher/relationships/README.md) are fictional;
their setting names and data purposes are not findings about LibreChat.

## Common graph and relationship data

Both kinds use `contract: "n8r.surface/0.3"`, the existing envelope, `records`,
`vocabularies`, `nodes`, `relationships`, `coverage` and `gaps`. Nodes remain
`{id, label, type: {vocabulary, term}}`. A shared component retains the same ID.
Relationships can share endpoints, form cycles or connect a node to itself.

Every relationship has these required fields:

| Field | Meaning |
| --- | --- |
| `id` | Stable identity of the integration relationship. |
| `from`, `to` | Local component IDs identifying source and target integration roles. |
| `type` | `{vocabulary, term}` giving the relationship's meaning, such as `persists-data` or `authenticates-via`. |
| `purpose` | Why the source uses the target; which task or data requires this integration. |
| `integration` | How it connects: driver, API, protocol or other evidenced mechanism. |
| `configuration` | Safe references identifying who owns the configuration, its mechanism, setting names and documented locations. |
| `basis` | Research finding references establishing support for this relationship. |
| `conditions`, `note` | Material conditions, applicability and remaining limits. |

`purpose`, `integration` and `configuration` each have the same detail shape:
`{state, claims, note}`. Each claim is `{value, basis}` with nonempty basis entries
`{record, revision, items}`. Purpose/integration values are nonempty text;
configuration values are arrays of configuration references. This keeps evidence
on the fact it establishes rather than implying that one citation proves every
property of an edge.

| Detail state | Claims |
| --- | --- |
| `known` | Exactly one agreed value, supported by known findings. |
| `conflicting` | At least two distinct sourced claims with differing values or known-versus-absent assertions; no selected answer. |
| `absent` | Exactly one sourced, scoped absence claim; the note explains what is absent. |
| `unknown`, `omitted`, `redacted`, `out-of-scope` | No values; the note explains the knowledge boundary. |

A detail finding's `subject` is the relationship ID, `property` is exactly
`purpose`, `integration` or `configuration`, and its claim value matches the
corresponding detail claim. All competing values in cited findings must remain
visible. Known/absent details must agree with the finding state. A conflicting
detail can cite conflicting findings, multiple known findings with differing
values, or known and absent findings. Opposed known/absent assertions can use the
same value; keep separate claims/basis links so the source states remain visible.
Two agreeing known sources do not establish conflict. Reference verification also checks uncited findings for the same
relationship/property in the description's referenced research, preventing a
contradiction from disappearing through selective basis links. Unknown details
can remain conservative without asserting absence.

A type vocabulary supplies the meaning of its terms; it does not substitute for
purpose, mechanism or configuration evidence. Unknown terms remain opaque, as in
prior profiles. A broader ontology and executable constraint language are not
required to represent these relationship facts.

## Safe configuration references

A configuration reference is `{owner, mechanism, key, location}`:

- `owner` resolves to a local component node; configuration belongs to that
  component, not implicitly to whichever endpoint a reader guesses.
- `mechanism` is `environment-variable`, `file-key`, `argument`, `admin-setting`
  or `code` in this bounded vocabulary.
- `key` identifies the setting or entry, such as the fictional `CHAT_STORE_URI`.
- `location` is a safe relative documentation/source location, such as
  `config/assistant.env.example`. For an environment variable or admin setting,
  this can point to the source documenting where it is configured.

Locations cannot be absolute paths, URLs, traversal paths or contain query/fragment
syntax. Use the research source locator for a section/line/key within the document.
A location is descriptive metadata, not authority to access a file or proof that
it exists on a user's deployment. Its source finding links to the exact research
revision, source digest and locator; a host resolves the supplied source context.
If the owner/name/location cannot be described safely, retain an unknown/redacted
configuration detail and explain the limit.

There is **no actual setting value** field. A known configuration detail says where
and how configuration is defined; it does not mean the instance is configured.
Passwords, connection strings, IPs, private deployment paths and account names
must not appear in fields, prose, filenames or retained evidence. The checker
rejects unknown setting-value fields and unsafe location syntax, but is not a
secret detector. Producers remain responsible for safe collection and output
inspection. No raw-secret store is introduced.

## Capability and Bound distinctions

A Capability relationship adds `state` using the existing possible/unknown/omitted/
redacted/absent/out-of-scope/conflicting support states. Support basis retains
[0.2's subject/property/target rules](surface-description-contract.md#capability-surface).
`exclusiveGroups` now names relationship IDs. Knowing why/how to integrate does
not assert that any instance selected that relationship.

A Bound Surface pins one Capability revision and identifies one opaque `instance`.
Every included relationship uses the same ID, `from`, `to` and `type` as its pinned
Capability edge. It repeats the useful relationship details with its own exact
research references, so the Bound file can answer why/how/where without forcing
a reader to reconstruct another document. Details may reflect instance-specific
facts or corrections when separately evidenced; the pinned Capability stays intact.

Instead of `state`, each Bound relationship has a `binding` annotation:
`{state, claims, decisions, note}`. These retain [0.2 binding semantics](surface-description-contract.md#bound-surface):
one configured target, multiple conflicting targets, or no claims for unknown/
omitted/redacted/out-of-scope. Claims are `{target, basis}`; targets resolve to local
nodes. Decisions refer separately to human decisions, never substitute for source
configuration evidence, and cannot erase contradictions. Missing evidence is not
unbound. Configuration evidence is sufficient; no runtime-use claim follows.

**Role endpoint versus configured target:** a database relationship's `to` may
identify the MongoDB component role, while `binding.claims[].target` identifies
MongoDB Atlas for this instance. Both are explicit local component nodes. The
relationship keeps its identity and purpose when a successor changes the binding
target to self-hosted MongoDB. A renderer must show the binding annotation/target;
drawing only `from`/`to` shows the role graph, not the full configured view. Unknown
or conflicting bindings must not be rendered as selected concrete edges.

A Bound file may include only the relevant subset of Capability relationships;
omission means unspecified, never absent. A configured binding requires a possible
Capability relationship. Exclusive groups still prevent selecting incompatible
options together. Same-ID nodes must retain their type across the linked graphs.

## Versioning, checking and revision limits

This shape is explicitly `0.3`, not a silent alteration of `0.2`. Existing `0.1`
selected definitions and `0.2` descriptions remain readable with unchanged shapes
and retained fixtures. `0.3` readers reject top-level `capabilities`/`bindings` and
require the shared `relationships` representation. Older readers reject `0.3`.
There is no automatic conversion or downgrade: invented metadata, dropped
property-level evidence and flattened conflicts would be losses. Preserve the
original and review any projection separately. These remain descriptions within
one AI Surface Model, not separate models.

Use the existing APIs: `validateArtefact`, `encode`/`decode` (JSON only),
`verifyReferences` and `verifySuccessor`. Local validation checks fields, states,
node endpoints, config owners and declared research references. Reference checks
require the exact research/Capability revisions and digests, evidence roles and
matching values. No network access or filesystem writes occur. Passing checks
cannot establish that source prose is true or complete.

Successors retain node types and relationship endpoints/type for retained IDs.
Description kind, instance identity and Capability-artifact identity cannot change.
Metadata can gain evidence or corrections in a successor; earlier bytes must remain
unchanged. Changing a concrete binding target does not change role endpoints.
Two-snapshot checks do not enforce corpus-wide identity retention or persistence;
hosts must preserve history and prevent reusing retired IDs for different things.
The existing 2 MiB/depth-64 codec limits, empty extensions and privacy boundaries
remain in effect. Observed Surface and actual settings capture remain deferred.

## Human verification task list

Open [the new relationship fixtures](../../examples/researcher/relationships/README.md).
No CLI, inference, credentials or live instance is required for this contract check.

- [ ] Open `capability.json`, then find `urn:cap:database` in `relationships`.
  Expect Assistant → MongoDB, type `persists-data`, purpose “Persist conversation
  history and user profiles”, and a MongoDB driver/wire-protocol mechanism.
- [ ] Inspect that edge's `configuration`. Expect owner `urn:node:app`, mechanism
  `environment-variable`, key `CHAT_STORE_URI`, and location
  `config/assistant.env.example`. Open that supplied file: it documents the name
  and owner without a connection string. Follow the configuration claim's basis
  to `research-r1.json`, then its source/locator. Expect the config source, while
  purpose and integration cite the separate explanatory source pack.
- [ ] Open `bound-r1.json` and find the same relationship ID. Expect the same
  endpoints and useful integration details plus a **configured** Atlas binding.
  Authentication still has **conflicting** targets and a separate human preference;
  inference purpose/mechanism/configuration and binding remain **unknown**.
- [ ] Compare `bound-r2.json` and `research-r2.json`. Expect the same relationship,
  role endpoints and purpose, new self-hosted MongoDB target and exact predecessor
  references. The old files retain Atlas. No settings values should appear.
- [ ] Report **Pass / Fail / Blocked**, filenames and any missing explanation,
  incorrect configuration reference, lost conflict or exposed value. These are
  developer-authored fixtures, not installed Researcher or human acceptance evidence.

### Maintainer preparation and runnable readback

From the repository root, use Node.js 22, 24 or 26 and npm. `npm ci` and
`npm run build` must exit 0; installation uses the registry. Then run:

```sh
node --input-type=module <<'JS'
import {readFileSync} from 'node:fs';
import {decode, verifyReferences, verifySuccessor} from './dist/index.js';
const read = name => decode(readFileSync(
  `examples/researcher/relationships/${name}.json`, 'utf8'), 'json');
const context = ['research-r1', 'research-r2', 'capability'].map(read);
const before = read('bound-r1'), after = read('bound-r2');
verifyReferences(context[2], context);
verifyReferences(before, context);
verifyReferences(after, context);
verifySuccessor(before, after);
const edge = before.relationships[0];
console.log(edge.purpose.claims[0].value);
const config = edge.configuration.claims[0].value[0];
console.log(`${config.owner}: ${config.key} at ${config.location}`);
console.log(`${edge.binding.claims[0].target} -> ${after.relationships[0].binding.claims[0].target}`);
JS
```

Expect exit 0 and exactly:

```text
Persist conversation history and user profiles.
urn:node:app: CHAT_STORE_URI at config/assistant.env.example
urn:target:atlas -> urn:target:mongodb
```

Readback changes no files and needs no cleanup. Different output or a nonzero exit
fails. `npm test` additionally covers missing/mismatched metadata evidence,
contradictions, local endpoints/config owners, unsupported fields, privacy,
revision integrity and the preserved earlier contracts.

## Baseline and acceptance boundary

Human inspection of #50 at `18478d7` found the generic `uses` edge insufficient.
Library readback of its retained `0.2` fixtures confirmed no structured purpose or
configuration and no Bound `relationships` array. The `0.3` fixtures exercise that
same task: identify a relationship and read its purpose, mechanism, configuration
reference and evidence in both descriptions, then read back a revised binding.

The installed skill 0.1.9's previously recorded artifact-generation blocker remains
unchanged. #51 must implement production/checking through the standalone skill,
without invoking or depending on the `n8r-surface` CLI. #52 owns installed-workflow
and human acceptance. Library/package checks are not evidence of those outcomes.
