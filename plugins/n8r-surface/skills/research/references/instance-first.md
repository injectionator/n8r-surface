# Investigate an identified running composition

Use this path when the user starts with an instance, service URL or deployed
composition, or continues source research with permitted instance evidence.
A source checkout can describe one component without describing the whole system.
Keep source-only work on its existing path when no instance investigation is asked
for. This guide adds no access adapter, credential store or runtime dependency.

For a newcomer or an inaccessible source, use [first-use access](first-use-access.md)
to help establish one useful source at a time. A short reported system description
is enough to begin; a complete access setup is not an entry requirement.

## Use the host harness

Codex/ChatGPT supplies the tools and access; the skill supplies the investigation
method. Discover the relevant tools actually available in this session. Prefer a
scoped connector or documented read API, then permitted browser or shell access.
Do not assume a tool name, a terminal, SSH, a local clone or a connected account.
A URL identifies a source; a successful scoped read establishes access.

Start with the supplied target and question. State the selected environment and
read-only coverage, carrying forward existing authorization. Ask only for missing
information needed to identify the target or permitted access. Do not make users
choose evidence categories or reproduce information an available source supplies.

| Source | Useful host operation | Identity and limit to retain |
| --- | --- | --- |
| Remote repository | Read selected files at a pinned revision through the available connector/API. | Repository, revision, file and inspected ranges; returned text may not be original file bytes. |
| Local checkout | Read relevant files and working-copy identity. | Commit plus differences and hashes of inspected bytes; not deployed build identity. |
| Document or URL | Read the selected page/section using its available connector or browser. | Document revision/product version, capture time and section; newer docs may not apply to the target. |
| Instance configuration | Read safe fields from the selected instance/admin view. | Target identity, setting scope and time; stored settings may not be loaded. |
| Runtime metadata | Filter to the target and project allowlisted fields before output. | Instance/container/process identity, image/build identity, state and capture time. |
| Existing observations | Read a permitted redacted event/trace or supplied observation. | Request correlation, participating identities, effective setup and coverage; missing events do not prove absence. |

If a source is unavailable, retain the partial graph and identify the consequence:
for example, storage is configured but current use is unverified. A permission
refusal is not a prompt to bypass that route. Ask for an authorized source or
human-supplied redacted evidence when needed. Do not sign in for the user, extract
sessions, install tools or start services to fill the gap. Follow the discovery
guide's [live inspection rules](discovery-map.md#inspect-live-connections-with-the-human).

## Follow the composition

Begin with the selected instance's identity and entry point, then follow evidence
of relevant connections. An endpoint binding can lead to a separate gateway,
inference provider, identity service, storage or telemetry destination. Determine
its role before deciding which source file, document or live view to read next.
Do not replace a custom endpoint with a familiar vendor because its protocol is
compatible. Do not add roadmap components or enumerate unrelated host resources.

Use repositories and operational documents to explain those discovered components.
An old deployment recipe is a navigation clue until current evidence supports it.
Match product documentation to the installed version; mismatches remain visible.
Record supported alternatives separately from the selected instance paths.

For each consequential claim, keep the evidence level precise:

- Source describes support or a code path; it does not establish selection.
- A safe binding establishes configured selection, with its setting scope.
- Process/container state establishes presence at a time, not connection use.
- A response establishes reachability for that operation and vantage point.
- A correlated request/trace can establish the exercised portion of a path,
  within its identity, time and coverage limits.

A mounted file hash identifies inspected bytes, not necessarily the bytes loaded
by a running process. A model name in configuration is not catalog availability
or inference. A health response does not exercise storage, authentication or
model requests. Similarly named fields in public config and process environment
may have different meanings: inspect their version-specific implementation before
calling them equivalent or conflicting. Keep separate login, application actor,
provider credential and upstream identity boundaries when evidence supports them.

Read-only means the operation's behavior, not its HTTP verb. A diagnostic GET
may start a worker, refresh credentials or run a connection test. Use known passive
operations or existing evidence; leave uncertain operations uncalled. Research
does not send prompts or invoke tools to make an edge observable. Those are
separately authorized testing tasks.

## Retain evidence and continue

Keep the journal current while working when saving is authorized. State what was
read, what it established and the next useful question; the user can redirect or
stop at a useful partial result. Save through the existing [Surface helper](cyclonedx.md).
No special whole-Surface observed state is needed: use per-relationship evidence
and dated observations, with unknown composition and explicit coverage/gaps.

Keep source identity distinct from captured evidence identity. If a connector
returns rendered or normalized text, hash a retained safe projection only as that
projection, not as the original remote file. Never fabricate unavailable hashes,
versions or observation times. Preserve actual source capture times separately
from the time the BOM was saved. Do not add transport newlines before hashing
source bytes. See [evidence identity](cyclonedx.md#evidence-identity-and-readback).

On revisit, read the supplied predecessor, re-establish permitted access and
compare equivalent observations for the same target. Explain each material result
in ordinary language:

- **Target change:** comparable evidence establishes a changed setting/build or
  relationship. Say which prior conclusions or tests may need revisiting.
- **Newly learned fact:** previously unread evidence adds detail; discovery time
  alone does not establish when the target changed.
- **Unchanged checked fact:** the same scoped fact was checked again, at a new
  time; do not generalize to unchecked parts of the system.
- **Lost coverage:** access or evidence is missing now; retain prior dated facts
  without presenting them as freshly verified or treating the component as removed.
- **Conflict:** evidence disagrees or identities are inconsistent; preserve both
  and name the evidence needed to resolve it. A mutable image tag is not a digest.

These are explanations, not new schema enums. Retain stable component identities,
previous bytes, decisions and observations. Update current scope/gaps and next
steps; keep old findings in history. A telemetry setting first read today may
predate the baseline, and a file timestamp alone does not prove historical use.

When consolidating earlier findings into a current journal summary, carry the
original evidence IDs for every retained configuration/source claim. A new
runtime-state check supports only its inspected facts; it cannot substitute for
those sources. Open the summary's evidence links during readback and check each
claim, even when the underlying graph still has correct provenance. Correct an
incomplete saved summary in a successor, preserving the earlier revision.

Finish with the useful composition, consequential uncertainties and one practical
next investigation with its access requirement. Independently read back the saved
BOM and generated brief/map/journal. Check that the key claims remain distinguishable
without this chat and that referenced retained evidence is locatable. State any
host persistence or navigation limitation rather than claiming a missing save.
