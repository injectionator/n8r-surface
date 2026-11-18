# Injectionator field notes: series and reporting plan

Agreed direction: 15 November 2026. Tracked in [#85](https://github.com/injectionator/n8r-surface/issues/85).
Working series name: **Injectionator field notes**; injectionator-website owns the final name and article titles.

## The promise to the reader

Come behind the scenes as we use n8r-surface to understand real AI applications,
then follow wider Injectionator work as it becomes useful. We have questions and
a plan, but do not know all the answers. Readers should leave each installment
with something useful they can try, a clearer understanding of the system, and a
real reason to return. The series follows development and learning, not a fixed
release campaign. Eight starting ideas are a queue, not a limit or a publication promise.

The first audience is someone building, operating or investigating an AI application
who wants to see what these tools actually do. Start with accessible questions;
link technical depth and reproducible procedures for readers who want them.

## Editorial approach and ownership

Use evidence-led field reports, with a reproducible companion, rather than only
step-by-step tutorials or retrospective release announcements. Tutorials alone
hide uncertainty; announcements alone omit the experience of using the tools.

This repository does the work and assembles source material. **injectionator-website
writes the Dear Reader articles**, selects titles and images, edits the voice,
handles series navigation and publishes through its own workflow. A reporting pack
is not a finished article or permission to publish raw evidence. No website code
or content changes are part of this initial Surface documentation increment.

The voice is irreverent, cheeky, curious and conspiratorial: invite the reader to
look over our shoulder. Break the fourth wall with an occasional “Dear Reader”
aside. Be candid about our assumptions and mistakes; aim humour at ourselves and
the situation, not users, maintainers or people whose systems we inspect.
Specific observations and consequences carry the story; jokes must not replace
explanation or turn an uncertain result into a confident claim.

Keep a contemporaneous decision diary: what we expected, what surprised us, what
we chose and why. These short, explicit reflections supply the article's internal
monologue. They are author/researcher notes, not invented quotations, hidden model
reasoning or hindsight presented as thoughts we had at the time. Mark later
reflections as retrospective. Website editors may condense events, but must not
invent errors, dialogue, screenshots, discoveries or suspense.

An installment usually opens with a consequential question or an actual unexpected
moment, gives enough context to follow, shows selected attempts and decisions,
explains what changed our understanding, and ends with a useful result plus the
next unresolved question. Resolve the installment's question honestly, even when
the answer is Blocked. Earn curiosity through a real next investigation; do not
manufacture cliffhangers or promise results we have not obtained.

## Current priority — Surface UC01

On 18 November 2026, the agreed next investigation became
[Surface UC01: discover the existing lab](../use-cases/01-lab-discovery/README.md),
tracked in [#96](https://github.com/injectionator/n8r-surface/issues/96). Use the
identified 0.1.17 candidate before Labs UC11, covering DigitalOcean hosting and
the LibreChat, Codex Pro and Atlas investigation targets. Save and reopen the
Surface, then open the exact artifact SBOM in n8r-labs Surface and begin work
with it. Record actual consumer behavior and gaps; helper checks do not prove
that handoff. Labs retains ownership of live configuration changes.

Keep raw development notes and infrastructure evidence in the private vault;
retain publication-safe journal summaries and reporting packs here. UC01 testing
may require candidate fixes before releasing skill 0.1.17 and npm experimental.6.
Preserve each tested revision and digest and repeat affected verification.
Prepare separate release facts and investigation reporting packs for the website
chat; publication follows verified release results. The current
[UC01 source pack](uc01-source-pack.md) records source discovery, fresh-chat
continuation, public readback and the blocked external-BOM consumer handoff.

The earlier item 01 preparation remains intact below. Article queue numbers are
not use-case identifiers; prioritize UC01 without rewriting that history.

## Starting queue

| Item | Question and scope | Priority / state |
| --- | --- | --- |
| 01 | What can a fresh skill setup tell us about a fresh LibreChat checkout? Save, inspect and reopen the result. | Earlier preparation retained; resumes after Surface UC01. |
| 02 | What can we learn from remote LibreChat repository/documentation sources, and what access is missing? | Second; planned. |
| 03 | What changes when we bring configuration and a running LibreChat instance into the investigation? | Third; planned, runtime prerequisites to establish. |
| 04 | How do LibreChat, Open WebUI and LobeChat compare under the same questions and evidence budget? | Later. |
| 05 | What do we find when we follow one important identity, tool or retrieval path deeply? | Later; question selected from actual discoveries. |
| 06 | After someone enables Langfuse outside Surface, can a revisit explain the real delta and its evidence? | Later; verify support against the selected version. |
| 07 | How can Surface identify hooks and prerequisites for an externally operated Promptfoo assessment? | Later; external process owns configuration and execution. |
| 08 | Can another person reopen the investigation, spot changes and continue without losing history? | Later; fresh-chat reopening also checked in item 01. |

Remote in item 02 means repository and documentation access, not a remote running
instance. Source comparisons use common questions about model connections,
identity, data, tools/retrieval and observation, with equivalent evidence states.
Missing access is not evidence that a product lacks a capability.

Reorder or add installments when evidence warrants it. Wider Injectionator enters
when an actual task needs it, with its maturity and operator clearly identified.
Surface must remain independently useful. Related continuation work stays in
[#76](https://github.com/injectionator/n8r-surface/issues/76); this series does not
complete that issue or restart deferred Labs implementation.

## How each installment is produced

1. State the question, initial state, permitted interaction and observable result.
   Pin tool/source versions and capture a baseline before investigation.
2. Use the installed skill through an identified host. Keep investigator inputs
   separate from expected results. Do not prepopulate findings or substitute the
   developing agent's investigation for an installed-product rehearsal.
3. Capture actual prompts, commands, outputs, meaningful turns and decisions as
   they happen. Keep failed attempts and corrections in order. Do not quietly fix
   the skill during a walkthrough; record a gap and separately scope any fix.
4. Independently inspect saved files and important source citations. Compare
   predecessor bytes after continuation. Separate agent rehearsal, automated
   checks and human acceptance; record Pass, Fail or Blocked for each.
5. Produce a reporting pack using [the template](reporting-pack-template.md),
   with selected screenshots and examples. Retain full raw evidence privately.
6. Review publication safety, factual claims and image captions. Hand the approved
   pack to injectionator-website with explicit gaps and website follow-ups.
7. Track article draft, publication URL, corrections and next installment here.
   Publication and website implementation remain separate actions.

A fresh checkout and chat are not proof of a clean machine or memory isolation.
Record existing account/host context, installation route and actual restrictions.
Do not describe an isolated CLI install as a desktop installation.

## Evidence and media

Use the selected vault's `runs/` for walkthrough evidence; never commit its local
path or raw transcripts. Preserve exact commands privately; published examples
replace local paths and credentials with explained placeholders. Show exit codes,
version identity and enough output to support the claim, not an indiscriminate log.

Capture screenshots of useful moments: first access, a meaningful failure, the
first map, an evidence drill-down, saved output and a changed understanding.
Record caption, source event, capture time, intended claim, redactions and alt text.
Do not stage screenshots and call them live results. Review browser chrome,
identities and incidental data as well as the central panel before publication.
If no screenshot was captured, mark it missing; a terminal transcript is not one.

Optional screen recordings accompany the written record. Keep the raw timeline;
label cuts, reenactments and speed changes. Recording is not a prerequisite to
useful progress. Do not imply a video exists until it does.

For each mistake retain: expectation, actual result, consequence, correction,
retest and remaining uncertainty. Include our mistaken assumptions and process
errors as well as product defects. Never manufacture a mistake to improve a story.
Separate observation from a hypothesized cause. A later successful retry does
not erase the first failure.

## Website update queue

| Update | Owner | State / dependency |
| --- | --- | --- |
| Choose series title, introduction and index placement in existing article navigation. | injectionator-website | Proposed; use this plan as brief. |
| Add consistent series marker, previous/next links and index links. | injectionator-website | Assess existing article conventions first. |
| Write item 01 from verified reporting pack, including real first-use friction. | injectionator-website | Waiting for investigation and media. |
| Check current get-started guidance against the exact route exercised in item 01. | Both repositories | Version discrepancy found during preparation; cause not established. |
| Prepare item 02 and 03 article slots and useful cross-links. | injectionator-website | Planned; no empty published promises required. |
| Select excerpts, screenshots, cover/social assets and optional video. | injectionator-website | Waiting for approved source material; avoid implying generated art is evidence. |
| Review older release/tutorial links and add a current route where needed. | Both repositories | Preserve dated historical claims and instructions. |
| Record publication links and corrections against source-pack revision. | Both repositories | After editorial review/publication. |

## First delivery and acceptance

Surface UC01 is now the immediate investigation; its acceptance checklist is
maintained in the linked use-case record. The original series checks remain below.

- [x] Record the series charter, queue and reporting responsibilities.
- [x] Open a GitHub issue and prepare a draft documentation PR.
- [ ] Complete item 01 using a fresh installed-product conversation, then reopen.
- [ ] Independently verify key claims, outputs and unchanged predecessors.
- [ ] Assemble approved screenshots/excerpts and record missing material explicitly.
- [ ] Hand a versioned reporting pack to injectionator-website for article writing.
- [ ] Repeat the process for remote sources, then the identified running instance.

For review, open this plan, the template and [item 01](01-fresh-librechat.md).
Confirm the first three priorities, open-ended scope, explicit website ownership,
truthful mistakes policy and distinction between planned and observed results.
Report Pass / Fail / Blocked with the document section and requested correction.
