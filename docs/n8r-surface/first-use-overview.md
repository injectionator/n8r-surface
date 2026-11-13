# First-use security overview, candidate 0.1.14

Related to [#72](https://github.com/injectionator/n8r-surface/issues/72).
This skill/plugin increment follows merged 0.1.13. It does not change the npm
package version or authorize publication. Human acceptance remains pending.

## Changed behavior

A broad first source investigation should produce a brief that explains the
application, its major areas and external integrations, consequential findings,
coverage gaps and the next useful decision. The skill asks for evidence-backed
findings and distinguishes supported options from intended choices, configuration
and observed behavior. Narrow questions remain narrow.

The HTML starts with a connected graph: each identified node appears once, with
its directed relationships. Explicit, checked presentation hints group nodes
inside the application, externally or as unclassified. Grouping records placement with its evidence basis (including user intent),
not proof of deployed trust boundaries. Full edge
conditions, exceptions, observations, evidence and investigation history remain
below the overview. The brief links to that detail instead of repeating every
relationship's generic uncertainty.

The [hint contract](../../plugins/n8r-surface/skills/research/references/cyclonedx.md#overview-presentation-hints)
is optional node metadata within Surface profile 1. Missing hints produce
Unclassified placement; the renderer never guesses placement from inventory type.
Older readers may ignore hints. Older saved BOMs remain readable, and no prior
files are regenerated in place. The BOM remains the sole saved authority.

The record is an architecture/research BOM, not a comprehensive dependency SBOM.
Generic consumers may omit the profile's research state and possible paths.
No runtime assessment, deployment automation or consumer compatibility is implied.

## Baseline and verification status

The supplied 0.1.13 first-use evaluation identified an opening dominated by storage
mechanics, mixed inventory, repeated relationship rows/caveats and buried security
implications. Read-only inspection of the retained private brief and renderer
confirmed those presentation failures. The earlier product assessment is supplied
baseline evidence; this increment does not claim to have repeated its research.
Original private outputs are preserved and are not public fixtures.

Focused regression checks failed against the previous renderer and now cover
checked placement evidence, old/empty inputs, each identity and directed edge,
cycles/parallel relationships, disconnected nodes, full names, linked findings,
retained exceptions and inert source text. These checks establish bounded rendering
and reference behavior, not the quality or truth of an investigation.

The user-led 0.1.14 rehearsal and follow-up candidate checks are recorded
[below](#follow-up-rehearsal), with exact identity limits. Browser visual acceptance
remains pending. A prior local-file browser-policy refusal remains a blocker for
that route; it must not be bypassed.

## Human verification task list

Maintainer preparation: provide the exact candidate commit and install it using
[the tester setup](tester-candidate.md#install-the-pinned-codex-candidate), substituting that
commit and expecting 0.1.14. Provide readable selected sources, Node 22/24/26 and
a new writable output folder outside the source checkout. Keep earlier research
out of the fresh chat; retain its bytes separately for comparison. The everyday
installation need not be replaced for an isolated candidate rehearsal.

- [ ] In a fresh chat with the candidate and source folder, ask:

  > Explain this application's AI-relevant architecture and security implications.
  > Save an initial Surface overview in the supplied output folder. Keep the first
  > pass useful and bounded, and show me what to do next.

  Expect simple links to the brief, map and journal, plus a useful continuation.
  The first output may be a plan; inspect the latest completed research revision.
- [ ] Open the brief. In your own words, explain what the app does, its major
  internal areas and external integrations, a few consequential observations,
  important unknowns and the next planning decision. Expect source/deployment
  scope near the opening, with storage mechanics underneath. Missing evidence
  must be explicit rather than replaced with plausible findings.
- [ ] Open the HTML in a permitted browser. Expect a connected overview before
  relationship details, each node once, readable names and visible arrow direction.
  Follow a path to its details and a finding to its evidence. Inspect a condition
  or exception; the summary must not hide its consequence. Unclassified placement
  is acceptable where evidence is missing. Report blocked access without bypassing
  host policy. The text inventory/details remain an alternative reading path.
- [ ] Check coverage of identity, authorization, data handling, storage, secrets,
  exposure and observability. Expect researched scope or explicit gaps, not an
  assertion that every control is effective. Supported authentication options must
  be distinguished from a chosen identity service, or honestly marked unresearched.
- [ ] Ask:

  > I want to describe an intended installation next. Help me choose model
  > connections, identity, stores and enabled tools; record choices as intentions
  > and tell me what configuration evidence would be needed later.

  Expect useful choices/questions with no invented deployment or runtime results.
  After making a choice, request a saved successor. Supply only its BOM and source
  access to another fresh chat and ask “Continue this Surface.” Expect choices,
  evidence and unresolved questions to recover, with earlier files unchanged.
- [ ] Report **Pass / Fail / Blocked**, the candidate commit, output links, your
  short explanation and any unclear/misleading part. Fail for fabricated findings,
  lost evidence or nodes, unreadable graph or changed predecessors. Blocked means
  access/runtime/browser prerequisites prevented the task. Names, graph size and
  exact findings vary with the source. Retain outputs for review; cleanup only
  the disposable trial folder after review, never the source or baseline.

## Maintainer technical checks

From the repository root with dependencies installed:

```sh
npm test
npm run check:package
```

Both must exit 0. The package check installs temporary offline consumers and
removes them; it does not publish. For a quick legacy-input compatibility check:

```sh
node plugins/n8r-surface/skills/research/scripts/surface.mjs check examples/researcher/surface-bom/initial.cdx.json
```

Expect exit 0, `checked`, five relationships and three entries. This is structure
validation of synthetic input, not the tester's task or human acceptance.

## Follow-up rehearsal

The 13 November 2026 user-led chat with installed skill 0.1.14 exercised initial
source research, Python-tool authority follow-up, requested deployment inspection
and a runtime availability recheck. Private artifacts and transcript were reviewed
without publishing them. The source was pinned; this was not a runtime security
assessment. Candidate version was observed in the installed path and transcript;
that version string alone does not establish an exact PR commit or bundle digest.

The first completed brief contained 1,138 whitespace-delimited words; after the
follow-ups it contained 2,651. Useful findings distinguished loading from calling
Python tools, browser/backend network origins and retrieval data handling. The
successors nevertheless retained an obsolete daemon blocker and retry action
beside newer reachable-daemon evidence. Deployment-oriented next steps preceded
confirmation that any deployment existed. A broad runtime inventory exposed
unrelated metadata in tool output, although the saved evidence was aggregated.
The user's final source-only clarification was interrupted before a save; it is
unfinished work, not a failed save or ignored completed request.

Readback found matching predecessor digests across six transitions and no broken
internal HTML anchors in four completed-result views. These are bounded integrity
checks, not source-claim validation, rendered-map acceptance or human approval.

The follow-up keeps profile 1. Current views exclude superseded entries, while
journals retain history. The brief bounds lists (12 nodes, 5 findings, 7 coverage
items, 7 gaps, 1 action), links all additional items and preserves complete text
for each displayed finding. Findings use reverse record order, not severity;
actions prefer active entries, then record order. Guidance asks the researcher to
consolidate overlapping findings, reconcile scope/gaps and choose one active
source action. The 400–700-word target is editorial, not a truncation rule.
Runtime filtering is agent guidance, not a new automatic redaction tool.

### Successor results and exact candidate

At code commit `92c1c0bca1e2adfcc2b134b0259ed8856f337bce`, Node 26.13.0:
241 tests, exact skill bundle check, offline installed package/terminal rehearsal,
Markdown lint 0.24.0, local links/fragments with lychee 0.24.2, citation validation
with cffconvert 2.0.0 and diff whitespace checks passed. All 18 JSON example files
parsed. Two new renderer regressions failed before implementation and passed after.
The full suite caught omitted inventory types/IDs during shortening; restoring
those fields passed the suite. Package verification first rejected the obsolete
instruction digest; the reviewed digest was updated and the full package check
passed. These checks do not establish research accuracy.

A fresh-context agent invoked an isolated standalone candidate copy against a
private copy of the prior BOM and the same source checkout. It received the
source-only continuation task below, reread source entry points itself, reconciled
scope and journal states, and saved revision 8. No live runtime was accessed.
Independent readback found one active source action, deployment settings still
unverified, matching predecessor digest and every prior annotation retained.
Old runtime blockers/actions remained historical rather than current requirements.

The agent's copied helper preceded the type/ID restoration (SHA-256
`b7a1572bb6fee44093bb5dad4a9867001a864f506394c4d5e07ece15573b854f`).
Its generated brief was 928 words. The exact committed helper was then copied
independently, used to save the same agent-authored BOM against the same predecessor
in a new directory, and read back: 976 words, no missing internal HTML anchors,
same predecessor digest and retained annotations. Its SHA-256 is
`3087fad27e2f38bde37a251e762cdead220dab2d3b30e07a1c37e7226613b79b`.
No developer-prewritten findings were presented as Researcher output. The 976-word
brief is substantially shorter than 2,651, but exceeds the editorial 400–700-word
aim; list bounds alone do not ensure that target. Human readability acceptance
remains open. This was isolated candidate invocation and helper readback, not a
fresh installation into the user's everyday plugin registry.

A separate fresh-context agent read a synthetic two-resource runtime response
inside a local process and emitted only the selected target identity and an
allowlisted state. Its command and readback were reviewed; unrelated names,
images and paths were absent from tool output and the saved result. This checks
one guidance scenario, not automatic redaction or all live runtime failure modes.
No actual Docker daemon was accessed for this follow-up.

The source rehearsal encountered the existing privacy guard's false positive on
a paragraph separator serialized inside entry text, then an empty authored reason.
It retained the historical text with spaces and supplied the missing reason;
validation and save then succeeded. No guard was disabled or bypassed. Broader
privacy-guard ergonomics are outside this increment. Private prompts, candidate
file hashes, predecessor copy, agent outputs and readback reports remain in the
local rehearsal vault, not in this public repository.

These are agent rehearsals, not human Pass acceptance. Rendered browser usability,
the intended-setup continuation and end-to-end runtime control behavior remain
unproved. Keep the PR draft and issue #72 WIP.

### Follow-up human tasks

Maintainer preparation: install the exact updated PR candidate using the setup
above. Supply a copy of an existing source-based Surface with historical blockers,
its source checkout and a new disposable output directory. Retain the predecessor
bytes. Do not supply credentials or use a production deployment for this check.

- [ ] In a fresh chat, provide the saved BOM and source and ask:

  > It is just a source checkout. Record that in the Surface, keep deployment
  > settings marked as unverified, and show me the most useful source-level
  > security investigation to do next. Save the successor in the supplied folder.

  Expect a source-level next action without daemon startup or runtime inventory.
- [ ] Open the new brief. Expect a concise current scope and one recommended
  action. An old unavailable-daemon statement must not remain a current blocker
  after newer evidence resolves it. Follow the history link to the old observation;
  expect its original wording and provenance to remain. Deployment settings stay
  unverified. Follow any additional-items link to the full detail.
- [ ] For a separate synthetic inspection check, supply a JSON inventory with
  one named target and one unrelated resource. Ask: “Using only this supplied
  synthetic response, report whether the named target is running.” Expect only
  the target's safe identity/status in tool output and saved evidence. Unrelated
  names, images and paths must never appear in output. Do not access a live daemon.
- [ ] Report **Pass / Fail / Blocked**, exact candidate commit, output links and
  any confusing or stale text. Fail for lost evidence, changed predecessor bytes,
  stale current blockers, mandatory runtime setup for source work, or unrelated
  metadata in tool output. Blocked means missing source, candidate or output access.
  Retain outputs until review; cleanup is limited to the disposable trial folder.

Maintainer evidence check: independently compare predecessor bytes and generated
manifest hashes. A helper validation exit 0 is required, but it is not human
acceptance. Browser visual acceptance and the separate intended-setup journey
remain pending until explicitly exercised.

### User retest readback — 13 November 2026

The user reported liking the outputs after the everyday marketplace installation
was pinned to `6d68b9c4c717fb2c5efc78d02f16cf094c538a6d`. The installation
record identifies all 25 plugin files and helper SHA-256
`3087fad27e2f38bde37a251e762cdead220dab2d3b30e07a1c37e7226613b79b`.
Positive feedback is recorded as given; it is not a formal Pass for every task.

Independent readback of the private retest found two saved revisions. The final
brief has 867 whitespace-delimited words, source-only scope, unverified deployment
settings and one active source-level next action. Resolved runtime blockers are
superseded and other deployment actions deferred. Both manifests match all four
saved-file hashes; both predecessor digests match the supplied preceding BOM.
Inherited annotations and component/service identities remain present, and both
HTML files have no missing internal anchors. The candidate profile checker accepts
the final BOM with 22 relationships and 57 journal entries under Node 26.13.0.
These checks establish retained structure and current presentation text, not
independent validation of every source claim or proof of all tool activity.

The 867-word brief still exceeds the editorial 400–700-word aim. Browser visual
acceptance, intended-setup continuation and runtime behavior remain unproved by
this readback. No new research was performed or findings authored for this check.
Private source details, outputs and installation paths remain outside this record.
