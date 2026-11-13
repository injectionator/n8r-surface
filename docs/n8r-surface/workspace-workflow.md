# System workspaces and research workflow

Status: proposed workflow for [issue #74](https://github.com/injectionator/n8r-surface/issues/74).
This is documentation only, separate from [PR #73](https://github.com/injectionator/n8r-surface/pull/73).
The agreed direction is a workspace for the system under investigation, with
multiple sources, alternatives and participating chats. The index, effort records
and management behavior below are proposals for review, not installed features.

## Starting point and approaches

[Workspace v1](workspace.md) provides a stable identity, name and optional purpose,
explicit setup and read-only recognition. It needs no repository, vault or app
attachment. It does not implement a workspace catalog, source registry, effort
management or chat registration. Existing [vault conventions](researcher-vault.md)
include source-based research folders; existing locations remain valid.

A folder per application makes a comparison or composite system awkward. A folder
per chat or research attempt creates repeated copies with unclear relationships.
The agreed approach is a persistent system workspace: sources and research efforts
accumulate within it, while Surface revisions retain their own identity and history.
A workspace can investigate LibreChat, Open WebUI, either product or both together.
It need not describe a deployed system or have a final application choice.

## Identity and ownership

| Item | Purpose and identity |
| --- | --- |
| Workspace | Stable identity for the system investigation, independent of its display name, directory and application choices. |
| Research effort | A bounded question or period of work within the workspace, with its own identity, objective, status, dates and continuation links. Several chats may contribute. |
| Source | An identified repository, folder, file, URL, document or API reference, with its role, access state and version/capture evidence where available. |
| Surface | A versioned description of components and relationships. A workspace can hold several scoped descriptions or alternatives; workspace ID is not Surface identity. |
| Chat reference | Optional host-specific navigation to a conversation, associated with the relevant efforts and saved outputs. |

A new chat, newly discovered dependency or later review normally continues the
same workspace. Create a new effort when the question or review period changes;
continue an existing effort when resuming its unfinished question. Neither action
requires another top-level workspace. Efforts are research organization, not
Experiment Runs or new kinds of AI Surface Model.

Create another workspace when the user identifies a separate system investigation
or needs a separate access/sharing boundary. Record explicit relationships such as
“derived from” or “investigates a related system”, including a reason and relevant
Surface references. Similar names or a shared repository do not establish identity.
Separate existing workspaces can reference the same Surface lineage without being
automatically merged. Independent findings require reconciliation before reuse.

## Workspace home and useful index

Propose `~/Documents/n8r-surface/` as the default home; this is a user-relative
example, not a recorded machine path. Honor an explicitly selected home or existing
workspace first. Do not relocate current vault research or reinterpret existing
`research/`, `artifacts/`, `surfaces/` or `runs/` directories as new workspaces.

The index should answer “Have we investigated this system before, and where do I
continue?” Show workspace name and purpose, stable identity, location/access state,
active or archived status, latest recorded research activity, open questions,
effort count, and relevant Surface summaries. Support search by name, purpose and
source, plus filters for active, archived, unavailable and related work. Show
research activity dates from saved records, distinguishing them from file edit
times and the time the index was refreshed. Unknown activity stays unknown.

Illustrative index content, not current product output:

| Workspace | Research efforts | Continue from |
| --- | --- | --- |
| Customer support system | Application comparison; storage options; later security review | Storage options: Atlas candidate remains unselected |
| Internal research assistant | Initial architecture | Identity integration question |

Expanding the first row shows its efforts and their dates, statuses, sources,
chats and exact saved outputs. A fresh chat can select the storage investigation
without guessing which dated folder is newest or treating it as the entire system.

Listing inspects workspace metadata within the selected home and explicitly
registered locations. It is read-only, does not scan arbitrary disks or source
contents, call APIs, create a missing home, or repair metadata. Ordinary folders,
unsupported records and unreadable locations are reported separately. Index
coverage is explicit: an unregistered workspace elsewhere may not appear.

The index is a discovery view over workspace records. Any persisted cache must be
rebuildable and must not become the only copy of identity, decisions or findings.
Registering an external location and changing management state are explicit writes;
a request to list workspaces does not authorize either.

## Find, create and manage

1. **Recognize the selected workspace.** If the chat starts in one, show its
   purpose and resumable efforts. Otherwise offer the home index.
2. **Find before creating.** Search for related systems and sources. Offer to
   continue an effort, start an effort in an existing workspace, or create a
   separate workspace. Similarity is a suggestion, never an automatic merge.
3. **Create on request.** Use a supplied name and brief purpose. Preserve v1's
   nonempty-folder adoption choice and refusal to overwrite conflicting metadata.
   Create content lazily. Setup alone does not start research or attach an app project.
4. **Continue with context.** Read the selected effort's objective, decisions,
   gaps, source access and exact Surface revisions. Present the next useful action.
   Recheck evidence applicability before carrying claims into new findings.
5. **Keep completed work findable.** Mark an effort complete or paused with its
   outcome and next action where applicable. Workspace archive hides it from the
   default active list while preserving files, identity and references. Users can
   list archived work and restore it. Completion does not certify the system.

Do not create dated sibling workspaces merely for repeat reviews. Do not delete
or move folders as automatic housekeeping. Deletion, consolidation and migration
need separate scope and explicit authorization.

For a moved workspace, verify its saved identity before updating its registered
location; retain an unavailable entry until resolved. A copied folder retains its
v1 ID: show duplicate locations as a conflict rather than silently choosing one,
merging histories or issuing a new identity. A future fork operation would need
explicit identity and provenance rules. Broken references remain visible.

## Sources, alternatives and configuration

The proposed workspace manifest indexes sources, efforts, chat references and
saved Surfaces. Exact fields and storage files remain undecided. Keep private
local source bindings separate from portable evidence locators; the current v1
identity record must not acquire unsupported path or authority semantics.
Credentials remain outside the manifest. Registering an API reference does not
authorize calling it; inspection uses the user's scope and available host access.
Report inaccessible sources without replacing their earlier evidence silently.

Attaching a source establishes research input, not system membership or a deployed
dependency. Capture repository revisions, relevant file locations, document
versions and API observation times as applicable. Preserve what each claim was
based on even when the current source changes. Sources can support several efforts
or components without being copied into each effort directory.

Within a workspace, record alternative roles and selection decisions explicitly.
LibreChat and Open WebUI may be competing candidates or serve different roles in
the same system. Do not assume a comparison group is exclusive. Rejecting one
option preserves its findings and the reason for the decision.

The [CycloneDX Surface contract](skill-cyclonedx.md) remains the authority for
saved Surface claims and investigation entries. Workspace management references
those entries and revisions rather than creating a competing findings journal.
An effort may begin before a Surface exists; how its early notes acquire durable
links to later Surface entries remains an implementation design question.

### Example: investigate Atlas before configuration

1. Start a customer support system workspace and compare the two application
   sources at identified revisions. Save the known architecture and open questions.
2. If evidence suggests Atlas as a possible integration, record a candidate and
   the reason to investigate it. If compatibility is unproved, say so.
3. Open a storage-options effort in the same workspace. Attach relevant public
   documentation and investigate compatibility, identity, data flows and security
   requirements. A provisioned service and credentials are not prerequisites for
   this design research. Deployment-specific questions can remain deferred.
4. Record a user's choice as intent. Keep supported capability, intended choice,
   actual configuration, reachability and dated observed use distinct.
5. Later, attach permitted configuration or observations. Save a successor with
   the new evidence, retaining the earlier uncertainty and exact predecessor.

This example specifies interactions to test; it asserts no LibreChat, Open WebUI
or Atlas compatibility result. Research does not provision services or configure
resources. Any later Lab integration remains a separate consumer concern.

## Chat links and continuation

Associate multiple chats with an effort, recording host, title/purpose, known
identifier, link and contributed output references. Capture the current chat only
when the host exposes a supported identifier; do not invent one or search unrelated
chat history. The user can supply other relevant chats. Listing workspaces need
not open conversations or require access to their contents.

Official desktop documentation describes `codex://threads/<thread-id>` for local
chats and a new-chat link with a workspace path and draft prompt. These are host
navigation capabilities, not proof that this skill can capture its own identifier
or attach projects. See the [official deep-link reference](https://learn.chatgpt.com/docs/reference/commands#deep-links)
(consulted 2026-11-13). Verify capture and reopening in the installed host before
claiming support; other hosts may have different links or none.

Saved findings, decisions, source references and continuation instructions must
remain usable when a chat is deleted, inaccessible or opened on another machine.
Chat links are optional private navigation, not portable evidence by themselves.
Export must omit private bindings and chat metadata unless explicitly included
for an authorized audience. A new chat must not silently start new research merely
because it opened a workspace.

## Acceptance scenarios for future implementation

These checks are specified, not exercised product results. Before implementation,
attempt each relevant task through the installed skill and record actual behavior
or a prerequisite blocker. Repeat it after the change and independently read back
outputs, recording the exact skill revision, host and environment.

| Given | User interaction | Expected result and independent verification |
| --- | --- | --- |
| Two known workspaces and a plain folder | “List my workspaces.” | Names, purposes, efforts and access state; plain folder distinguished. Compare bytes before/after: no writes. Missing home is reported without creation. |
| Existing customer support research | “Continue the storage investigation.” | Same workspace and effort identities, cited saved revision and outstanding Atlas question; no sibling workspace. Read back selected records. |
| No matching workspace | “Create a workspace for an internal research assistant.” | One new identity and index visibility; repeat does not duplicate it. No research or source modifications. Nonempty destinations retain the adoption choice. |
| A comparison effort | “Compare LibreChat and Open WebUI; we might use both.” | Both sources and distinct roles/alternatives retained; no unsupported exclusivity or deployed dependency. Inspect saved evidence and choices. |
| An unconfigured candidate | “Investigate Atlas before we choose storage.” | Bounded research, explicit compatibility gaps and access needs; no provisioned resources. Read back evidence and unselected status. |
| A later review of the same system | “Start a new security review using our earlier findings.” | New effort under the existing workspace, references to prior revisions and rechecked applicability; old bytes unchanged. |
| An effort with several chats | “Continue this in a fresh chat.” | Saved context recovers even with chat access unavailable. Where supported, verify the recorded deep link opens the correct chat. |
| Archived, moved and copied workspaces | “Show archived and unavailable work.” | Archive is reversible without deletion; stale locations and duplicate IDs visible; no silent relocation, consolidation or identity rewrite. |

## Document review and remaining decisions

Human review of this documentation increment requires no skill installation or
new research folders:

- [ ] Open this document and [workspace v1](workspace.md). Expect existing setup
  behavior to remain unchanged and every new management feature marked proposed.
- [ ] Walk through “Find, create and manage” using the customer support example.
  Expect application comparison, storage research and a later review to remain
  under one workspace, with identifiable efforts and preserved history.
- [ ] Read the Atlas example and chat continuation rules. Expect useful research
  before configuration and recoverable findings when chat links cannot open.
- [ ] Inspect the index and management rules. Expect related work to be findable,
  duplicate identities and stale paths visible, and archive to preserve files.
- [ ] Report **Pass / Fail / Blocked**, document commit and any ambiguous section
  or missing scenario. Pass means the proposed workflow is clear; it does not
  mean the product implements it. No cleanup is needed for this reading exercise.

Resolve exact manifest/effort schemas and versioning, index persistence and refresh,
external-location registration, early-note linkage, concurrent writes, host chat
capture and migration before implementation. Start with find/create/continue and
bounded indexing; separately scope management mutations and migration. Reuse the
existing workspace helper rather than duplicating its filesystem rules. Update
the [command and conversational intent inventory](command-outcomes.md) alongside
any implemented behavior, with installed-product evidence and human acceptance.

This document authorizes no skill changes, CLI additions, default-path migration,
release or changes to PR #73. No installed-product rehearsal of this proposed
workflow has been performed for this documentation increment.
