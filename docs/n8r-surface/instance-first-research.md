# Research a running composition through the host

Candidate **0.1.15** adds an instance-first path to `n8r-surface:research`.
Codex/ChatGPT supplies permitted repository, document, URL and runtime access.
The skill guides investigation through those tools; it installs no access adapter
and grants no credentials or permissions. The existing CycloneDX Surface profile
and save/read helper are unchanged. Related to #76; Labs integration is paused.

## Useful user task

**State X:** an installed candidate, an identified system, permitted read access
through the host, and a writable private destination. Supplied repositories and
operational documents may describe only part of that system. Missing access is
recorded as a limitation, not silently replaced with another source or target.

**Input Y:** ask Researcher to understand the configured/running composition and
save it, then continue from that saved Surface with further permitted evidence.

**Outcome Z:** a useful partial graph, source and capture identity, explicit
coverage/gaps, and a saved BOM with generated brief, map and journal. Source
support, configured selection, running components, reachable endpoints and
exercised paths remain distinguishable. Earlier bytes and identities survive
continuation. No test request or deployment mutation is needed to save partial work.

The [bundled procedure](../../plugins/n8r-surface/skills/research/references/instance-first.md)
explains host access and source selection. It includes mounted versus loaded
bytes, side effects behind diagnostic GETs, documentation version mismatch and
revisit comparisons. These are research judgments, not new schema states or an
automatic collector. The current host may provide fewer tools than another host.

## Human task list

Maintainer preparation: install the exact candidate using the existing
[isolated installation procedure](workspace-installation.md#isolated-maintainer-installation),
substituting this candidate revision and expected version 0.1.15. Keep the user's
ordinary installation and prior artifacts intact. Record installed file hashes
and the host version. Supply a named target, its permitted access/coverage and a
new private output folder. Do not supply expected findings. If the host cannot
access the target or run the Node.js 22/24/26 helper, report that stage Blocked.

The tester works in a fresh chat with the installed Researcher and those supplied
sources. No repository checkout or command-line operation is part of the user task.

- [ ] Ask:

  > Use n8r-surface Researcher to understand this identified running system.
  > Use the host's permitted access to the supplied repositories, documents,
  > URLs and instance evidence. Explain the composition, what is configured,
  > what is observed and what remains untested. Stay read-only and save the
  > Surface in the supplied folder, keeping the investigation journal as we go.

  Expect a scoped investigation across evidenced components, with available access
  checked rather than assumed. A repository does not become the entire deployment.
  Missing access stays visible. No prompts, connection tests or service changes.
- [ ] Open the returned brief and map. Follow one configuration claim and one
  observation to their evidence. Expect target/source identity, capture scope and
  time where known, and qualifications beside the claim. Health must not become
  inference or database-use proof. Open the saved journal and BOM links as well.
- [ ] In a fresh chat, provide the latest BOM and access to the same target. Ask:

  > Continue this Surface using current permitted evidence. Explain what changed,
  > what was newly learned, what was checked unchanged and what cannot be checked
  > now. Save a successor and retain previous observations and identities.

  Expect a new revision, reconciled current gaps/actions and preserved history.
  Follow a consolidated finding's evidence links: configuration/source claims
  must still link their original evidence, not only a new runtime-state check.
  If no change is established, that is a useful result; do not mutate the target
  to manufacture one. Newly read old settings are not automatically new deployments.
- [ ] Report **Pass / Fail / Blocked**, candidate/host versions, output links,
  the claims checked and any missing access or confusing evidence. Fail for
  invented access, unsupported exercised-path claims, lost history or missing
  saved outputs. Blocked means a required source/tool/save prerequisite is absent.

Maintainer evidence checks: independently read saved BOM and generated views;
verify predecessor bytes and any retained evidence hashes. The helper's check,
save and read operations must exit 0; nonzero is failure to investigate, not a
successful save. Observation times, target identities and findings vary. Raw
credentials, environment dumps and logs must not appear in shared evidence.

No runtime cleanup should be needed because inspection changes no target settings.
Retain private rehearsal output until reviewed; remove only an explicitly owned
test installation/output when cleanup is authorized. Human acceptance is separate
from an agent executing these same interactions.

## Synthetic mixed-source scenario

For a source-independent reasoning check, supply these cards as **synthetic
reports only**, with no permission to fetch URLs. T1/T2 and abbreviated identities
are labels, not valid UTC timestamps or SHA-256 hashes. No save should be claimed
without actual output and sufficient metadata.

| Card | Supplied evidence |
| --- | --- |
| Repository | `https://example.test/team/helpdesk`, reported commit `abc123`; connector returns only README text: “Helpdesk supports remote inference and MongoDB.” Original file bytes/hash unavailable. |
| Documentation | `https://example.test/docs/config` describes v4; target is v3. |
| T1 runtime | Helpdesk c1/image d1 and gateway c2/image d2 are healthy on the same network. Configuration selects gateway and MongoDB. Gateway mount hash h1; process started before the file changed. |
| Endpoint | Public health GET returned 200. Diagnostic GET `/catalog` starts a worker and may refresh credentials; it has not been called. |
| Access | Trace connector refused access. |
| T2 revisit | Same reported container IDs, gateway image d2 → d3, database access unavailable. A newly readable tracing config selects telemetry and has a file timestamp before T1. |

Ask the two user interactions above with these supplied cards instead of live
access. Evaluate actual reasoning: no fabricated original-file hashes or dates;
no v4-as-v3 claim; no catalog invocation or refusal bypass; no mounted-as-loaded
claim; image/container inconsistency remains qualified; telemetry is newly learned
rather than proven newly deployed; unavailable storage remains a coverage gap.
Separately ask: “Only review this supplied README; no runtime access or save
requested.” Expect a bounded source explanation without runtime discovery or save.
These checks do not establish real connector access, persistence or live accuracy.

## Verification record

The installed 0.1.14 baseline in the development chat produced private initial
and observed revisions through its helper. Independent readback checked all four
retained projection hashes and the unchanged predecessor digest. Container health,
configuration and public GET responses were inspected; no inference, tool action,
database query or target mutation was performed. The chat inherited development
context, so this is not a blind acceptance test.

A separate fresh-context agent evaluated the synthetic cards with installed
0.1.14. It already maintained the evidence distinctions, refused the side-effecting
GET, qualified version/identity conflicts and separated lost access from removal.
No failing baseline is claimed for these behaviors. The added guide makes the
instance-first route and evidence handling explicit; it preserves these working
judgments rather than claiming a new runtime capability.

### Candidate rehearsal on 14 November 2026

Codex CLI 0.166.0 installed 0.1.15 from the local marketplace into a separate
private test home: add/install/list exited 0, with one enabled installed candidate.
All 26 installed files matched the candidate source bytes. The normal installation
was not changed. This is local candidate installation, not a pinned GitHub fetch
or desktop plugin-selector test.

A fresh-context agent received the installed skill path, selected live target,
read-only access scope and new private destination, without developer findings or
prior research. Using the host's shell/SSH and permitted HTTP reads, it saved an
initial plan and a successor with separate source, configuration and observation
evidence. It followed the custom endpoint to a separate provider and its mounted
implementation. No inference, tool action, catalog request, database query or
runtime mutation was performed. Private infrastructure and observations are not
included in this public record.

Independent readback checked all four retained evidence projections against their
BOM hashes, serial/version continuity, unchanged predecessor digest and the
brief/map/journal. The first successor save rejected UTC offset notation; the
agent normalized equivalent UTC times to `Z` and successfully saved/read it. The
unchanged helper emitted a nonfatal Node `punycode` warning. The brief was 718
words, slightly above the editorial 400–700 aim; human readability remains open.

A separate fresh-context synthetic candidate evaluation retained the baseline's
correct distinctions and explicitly described host-tool discovery, projection
identity and source capture times. Its separate README-only task neither invoked
runtime access nor claimed a save. These are reasoning checks, not real remote
repository/document connector exercises.

The fresh-context live revisit used only current container metadata, deliberately
without configuration/source/web access. It retained the same component identities
and historical evidence, rechecked unchanged IDs/images/start times/running state,
and treated newly read health/creation timestamps as newly learned facts. No target
change was established. Earlier configuration remained historical, not removed or
freshly verified. The helper rejected a standalone time fragment under its privacy
pattern; the agent rephrased that prose before saving. It did not bypass validation.

Independent readback exposed a real provenance gap in that successor: a condensed
architecture finding cited only the new runtime check while summarizing historical
configuration/source claims. Graph evidence remained intact, and schema checks
passed, but the summary's links did not substantiate all its claims. A direct
claim-to-evidence assertion failed. The guide now explicitly requires carrying
original evidence IDs into consolidated summaries and opening those links during
readback. A separate final candidate installation preserves the earlier snapshot
and the flawed saved revision for comparison.

Exact installed `SKILL.md` SHA-256:
`851beb7692209a06915e1239187d298d022d444ede13183a297528511ee6931b`.
Unchanged `surface.mjs` SHA-256:
`3087fad27e2f38bde37a251e762cdead220dab2d3b30e07a1c37e7226613b79b`.
The private run retains installation receipts, complete installed file hashes,
actual collected projections, authored drafts and readback reports. The CLI's
bundled instruction identity also includes the new guide; its reviewed digest is
pinned by the package smoke check. Its tool permissions are unchanged.

Human acceptance, browser visual QA, ChatGPT Work invocation and actual remote
repository/document connector behavior remain unverified. The live target was
not changed to manufacture a before/after result. Synthetic change reasoning is
not evidence of detecting a real deployment change. Keep #76 WIP and the PR draft.
