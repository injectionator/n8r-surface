# Experimental Researcher artefact contracts 0.1

Issue [#15](https://github.com/injectionator/n8r-surface/issues/15) introduces a
bounded experimental profile of the **AI Surface Model**, not a released universal
schema. Existing [LibreChat examples](../../examples/README.md) remain illustrative
and use a different shape. No deployment, interoperability or recreation claim
follows from passing these checks.

The TypeScript [types](../../src/contracts.ts), runtime
[checks](../../src/validate.ts) and [synthetic cases](../../examples/researcher/README.md)
make this profile concrete. Other languages can implement the same data contract.
The library reads supplied strings and returns values/strings; it does not read
files, fetch references, call inference or write a corpus.

The separate JSON-only [Capability and Bound contract 0.2](surface-description-contract.md)
adds possible relationships and configured instance bindings without reinterpreting
these selected `0.1` definitions. The APIs accept both versions; their meanings
and fields remain distinct. Installed-skill production is separate work.

## Common envelope and identity

Every artefact has these required fields. Objects are closed except the explicit
`extensions` object; misspelled or future core fields are rejected, never stripped.

| Field | Meaning |
| --- | --- |
| `contract` | Exactly `n8r.research/0.1` or `n8r.surface/0.1`. |
| `id` | Stable namespaced identifier for this artefact across revisions. |
| `title`, `scope` | Nonempty human text; scope states coverage limits. |
| `revision` | `{id, parent, createdAt, author, reason}`. |
| `extensions` | Map of namespaced identifiers to portable values; `{}` is valid. |

Identifiers have a URI-style scheme and non-whitespace remainder. They are opaque
and case-sensitive; the checker does not fetch them or claim URI normalization.
Revision IDs are nonempty alphanumeric/dot/underscore/hyphen tokens, starting with
an alphanumeric character. They identify snapshots, not product release versions
or timestamps. Times use real UTC dates with seconds: `2026-11-04T00:00:00Z`.
Names and locations are labels, never identity matching rules.

`parent` is null for an initial revision, or `{id, revision, digest}` for the
previous snapshot of this same artefact. Revision changes retain the artefact ID
and existing component/finding/relationship IDs when their identity is unchanged.
A fork gets a new artefact ID and may record its origin in an extension. The
library does not infer whether two similarly named entities are the same thing.

`verifySuccessor(previous, next)` checks matching contract and identity, a fresh
revision token and an exact parent revision/digest. It rejects changing the type
or endpoints of a retained relationship ID; assign a new ID for a different
connection. Historical snapshots remain immutable. The caller must preserve old
bytes and prevent ID reuse across its complete history; a two-snapshot check
cannot enforce corpus-wide immutability. A snapshot ID is distinct from a later
Lab's deliberate release/version label.

## Research record

`n8r.research/0.1` carries these required arrays (empty arrays are allowed unless
specified). IDs are unique across the record and all identified entries.

| Array | Entry fields |
| --- | --- |
| `sources` | `id`, `location`, `version`, `digest`, `inspectedAt`, `coverage`. |
| `findings` | `id`, `subject`, `property`, `state`, `note`, `claims`. |
| `alternatives` | `id`, `title`, `findings` (finding IDs), `requirements` (text). |
| `decisions` | `id`, `alternative` (option ID), `choice`, `reason`, `by`, `at`. |
| `questions` | `id`, `text`, `findings` (possibly empty related finding IDs). |
| `notes` | `by`, `at`, `text`; human commentary and corrections. |

A source identifies the supplied snapshot. `digest` is SHA-256 over its exact
UTF-8 bytes; `version` records an applicable document revision or checkout state.
A dirty checkout must not be labeled only with a clean commit. `location` is a
portable relative path, HTTP(S) URL without credentials, or URN; it conveys no
permission to access it. Absolute local paths and traversal are rejected. Coverage
contains at least one `{path, status, note}` entry; status is `inspected`, `missing`,
`unreadable`, `excluded`, `truncated` or `unsupported`. If a source's bytes are
unavailable and cannot be hashed, do not invent a digest: record the missing
material in scope/questions or coverage of the supplied source bundle.

A finding's `subject` is a stable namespaced identifier for the described thing;
it need not already be a selected graph node. `property` names the question being
answered. A claim is `{value, evidence}`. Evidence is a nonempty array of
`{source, locator}` referring to a local source and a human-readable section or
range. `note` states applicability, limitations and the basis for the conclusion.
The contract checks reference existence, not whether prose supports a claim.

States have distinct meanings:

- `known`: at least one sourced claim; all claim values agree.
- `absent`: a scoped, sourced absence assertion; at least one agreed claim value
  describing what is absent. Absence outside that scope is not implied.
- `conflicting`: at least two differing sourced values, with no selected answer.
- `unknown`, `omitted`, `redacted`, `out-of-scope`: no claim values. The note explains
  the distinction. Do not place withheld values in a redacted field's extension.

Decisions use `selected`, `rejected` or `deferred`, at most one current decision
per alternative. An unanswered option has no decision. A changed decision belongs
in a successor record; earlier decisions remain in its predecessor. Research
options are possibilities; selecting one does not prove a working integration.

## Selected Surface definition

`n8r.surface/0.1` has `kind: "definition"`. It contains:

| Field | Shape and interpretation |
| --- | --- |
| `records` | Exact research `{id, revision, digest}` references. |
| `vocabularies` | Unique `{id, version}` references; version is a token. |
| `nodes` | Identified components, each with a human `label`. |
| `relationships` | Identified connections with explicit `from`, `to` and `claim: "declared"`. |
| `requirements` | `{id, kind, description, state}`; kind is `secret`, `resource` or `configuration`. |
| `coverage`, `gaps` | Arrays of human text about what is described and still needed. |

Every node/relationship carries `id`, `type: {vocabulary, term}`, `attributes`,
`basis` and `requirements` (local requirement IDs). Type vocabulary references
must resolve locally; unknown terms/vocabularies remain opaque and preserved.
Their presence does not establish consumer understanding. Graph IDs and requirement
IDs are unique across the Surface. Edges reference node IDs; shared nodes, cycles,
self-loops and distinct parallel edges are legal. Degree is relative to a start
node; no semantic two-hop limit exists.

`attributes` maps property names to `{state, note, value?}`. `known` requires a
portable value (including null); all other states prohibit one. Supported states
are the six draft states above, excluding `conflicting`: a selected definition
can leave an attribute unknown and cite the competing research findings. An
omitted attribute is unspecified, never automatically absent.

`basis` entries are `{record, revision, items}` with nonempty lists of research
finding, alternative, decision or question IDs. Empty basis is allowed for an
explicit author declaration; the envelope's author/reason and attribute notes
remain its attribution. `validateArtefact` checks local structure and references.
`verifyReferences(surface, records)` additionally requires the supplied research
revisions, verifies their logical digests and resolves each basis item. Missing
external context is an error from that explicit check, not evidence of absence.
No reference is fetched. A valid link is not proof that a selection is justified.

Secret requirements name a need, never contain a secret or a recipient's credential
binding. Requirements describe the selected composition; a Lab separately decides
how to satisfy them. Reachability, exercised connections, deployment bindings,
effective settings and Experiment Runs need separate linked records. Those record
formats are outside this profile. Later evidence cannot mutate this definition.

## Portable values and JSON/YAML

JSON is the default; YAML is an alternative representation of the same logical
data. The profile supports null, booleans, well-formed Unicode strings, signed safe
integers from `-9007199254740991` through `9007199254740991`, arrays and string-keyed
objects. JavaScript arrays must have the ordinary `Array.prototype`; subclasses
and arrays with custom prototypes are rejected before inherited methods or
serialization hooks can run. Numeric tokens use decimal integer notation; no
negative zero, fraction, exponent, leading zero, hexadecimal, infinity or NaN.
Use an explicit string plus
unit for decimal quantities or larger identifiers. This deliberately small subset
prevents number precision loss between runtimes.

Reject duplicate keys, non-string mapping keys, custom or explicit YAML tags,
anchors, aliases, unquoted merge keys, directives and multiple YAML documents.
Quoted literal `<<` keys are ordinary extension data and are preserved. YAML comments
and formatting are not semantic and are not preserved by re-encoding. Strings
that resemble booleans, dates or numbers stay strings when emitted. JSON object
order is insignificant; array order is preserved. JavaScript inputs must be plain
data: no accessors, sparse arrays, extra array properties, cycles, class instances,
undefined, symbols or non-enumerable fields.

Unknown `extensions` values are preserved through conversion, revision checks and
HTML. No tool may treat opaque extensions as understood semantics or discard them
silently. Unknown core fields and contract versions fail closed; a later migration
must retain the original and report losses. This profile has no required-extension
mechanism: a consumer must separately report which extension meanings it supports.

The reference implementation bounds each encoded input/output and canonical
logical document to 2 MiB and nested values to depth 64. These are defensive
codec limits, not graph depth semantics. Oversized or unsupported input fails
without producing a replacement document.

## Logical digest and byte digest

`digest(value)` returns `sha256:` plus lowercase hexadecimal SHA-256 over UTF-8
canonical JSON: recursively sort object keys by UTF-16 code units, preserve array
order, emit compact JSON strings/booleans/null/decimal integers, and add no trailing
newline. All fields, including extensions and parent references, participate.
No Unicode normalization occurs. This is this profile's algorithm, not a claim
of implementing a general canonicalization standard.

For example, both key orders of `{"a":1,"b":2}` hash to
`sha256:43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777`.
Research/Surface references use this logical digest. Source digests and future
storage compare-and-swap tokens instead hash exact bytes, including formatting.
A logical digest neither proves authorship nor describes what was running.

## HTML ownership and manual editing

The durable research record is a complete UTF-8 HTML document, readable offline.
Its single inert `script` data block (`type="application/json"`, `id="n8r-record"`)
contains the authoritative research record. All visible facts and notes are a
deterministic projection of that block; there is no second narrative authority.
Source text is escaped as text, including closing-script sequences. Generated
HTML contains no executable code, external assets, active source links or forms.

`readResearchHtml` validates the data and compares the entire supplied document
with `renderResearchHtml(data)`. Any edit to the visible projection, embedded data,
styles or surrounding markup is a conflict. Even benign reformatting requires
review. This strict first profile favors detecting edits over accepting arbitrary
HTML. It is not a general HTML sanitizer; never render arbitrary imported HTML
in a privileged host before validation.

To reconcile an edit, preserve the original bytes and the manually edited copy,
review both data and visible changes with the human, and prepare a corrected
successor data object. Put human prose in `notes` or the relevant structured field;
retain unknown extensions. Check its parent against the last accepted revision,
render a new HTML file, and show what changed. Never regenerate over an edited
file merely because its embedded data still parses. Guarded atomic persistence,
backup retention and byte-conflict tokens are #16's responsibility; this library
returns strings and cannot overwrite a file.

See the [manual-edit fixture](../../examples/researcher/README.md#manual-edit-case)
and [host continuation contract](host-contract.md).
