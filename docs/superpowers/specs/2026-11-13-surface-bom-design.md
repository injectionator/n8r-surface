# Self-contained Surface investigation

Issue #68; supersedes the alongside-records destination in the initial candidate.
Implementation and verification are authorized by the continuation request.

## Intent

A consultant can investigate supplied sources, see supported and selected paths,
save the Surface and continue from that saved file alone. Internal evidence states
must not become questions users must answer before receiving useful findings.

## Approach

Use one CycloneDX 1.7 BOM per immutable revision. A linked BOM set is unnecessary
for this bounded increment; versioned BOM-Link identifies its predecessor.
Keeping a second native authority is rejected by the user. Embedding the old
native bundle is also rejected: inventory lives in standard components/services,
commentary in annotations, attribution in citations and selected dependencies
in the standard graph. A documented property profile stores individual typed
relationships and investigation entries where the standard has no equivalent.
These are inspectable records, not a serialized native contract.

Possible, selected and observed are independent dimensions per relationship.
Optionality is independent of confidence. Selected dependencies alone project to
`dependsOn`; integration, hosting and observed flow retain their distinct kinds.
Sources identify inspected bytes/version/coverage; findings and decisions carry
references and dates. Static configuration can establish selection. Placeholder
values cannot. Unknown selection is not absence.

## Persistence and presentation

The BOM is authoritative. Immutable numbered revision folders contain the BOM,
a generated brief, investigation journal and standalone HTML graph/evidence view.
Their manifest detects edits. Reopening the BOM alone must recover all semantic
state, without requiring the manifest or generated files. Saving a successor
checks identity, version, predecessor digest and retained decisions/node IDs.
Changed generated views cause refusal with reconciliation guidance; the host
reads the edit as proposed input, records accepted changes in a successor BOM,
and preserves the edited predecessor. It never silently parses prose as truth.

The profile is bounded and versioned, not a universal model schema or registered
CycloneDX namespace. Generic consumers see the supported inventory and selected
dependency subset; full investigation rendering requires the profile reader.
No runtime use or completeness is inferred from validity or dependency presence.
Lifecycle metadata describes capture context, not a whole-Surface evidence state.

## Context and assessment

Use sources/notes explicitly supplied in the current chat. Do not search old
chats or vault notes. Identify historical context supplied by the host and explain
that the user can exclude it; never promise unverified host-memory isolation.
Start a useful investigation map, adapt it to findings and human choices, retain
diversions/deferred paths and explain the access needed for next steps. Offer a
few useful choices while allowing inspection, redirection or stopping.

Preserve old saves. Keep the legacy reader and an explicit migration path with
loss/refusal diagnostics; new saves use only the BOM authority. The standalone
product CLI remains unchanged in this skill-first increment.

## Verification

Use synthetic alternatives/selection/observation, evidence and decisions to prove
BOM-only recovery and reference failures. Test changed views, preservation,
malicious HTML and unsupported profile versions. Evaluate Sunshine against this
exact BOM, including services and models, before selecting a renderer.

Install exact candidate bytes in a separate private test home. Let the installed
Researcher inspect explicitly supplied LibreChat sources and save its own work.
Exercise a diversion and fresh-session continuation; independently read outputs,
compare predecessor hashes and record environment/revision and limits. Historical
rehearsal findings are not fresh assessment input. Agent rehearsal is not human
acceptance. Keep issue WIP and PR draft; no merge/release or Labs changes.
