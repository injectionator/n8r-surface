# Researcher skill: working user manual

For installation and a short first trial, use the [tester guide](tester-candidate.md).

Candidate 0.1.13 saves the Surface with a brief, visual map and investigation
journal. This manual develops through actual use; the
[verification record](skill-bom-verification.md) distinguishes exercised behavior
from pending human acceptance. The earlier [0.1.12 rehearsal](skill-cyclonedx-verification.md)
used historical material and a different save format; it was not a neutral fresh
assessment.

## Start with your question and sources

Open a fresh chat with the Researcher and explicitly supply a checkout, source
pack or permitted documentation. You do not need to classify the Surface.

> Explain the AI-relevant components and paths in this source for a security
> engineer. Save the Surface in this folder and maintain an investigation journal
> as we go. Show me what is known, what remains uncertain and useful next steps.

Expect a useful initial plan and a shallow map, then evidence-driven investigation.
The Researcher uses this chat's supplied sources. It should not search old chats or
vault research automatically. If the host supplies recognizable historical context,
it should disclose that context; ask it to exclude it when inappropriate. This
is not a promise that the host has no memory.

## Start with an existing system

If your question concerns a running composition, identify the instance and the
read-only access you permit. Supply relevant remote repositories, documents or
URLs through tools available in your Codex/ChatGPT host. A URL alone does not
provide private access, and a local checkout may describe only one component.
Candidate 0.1.15 follows this [instance-first workflow](instance-first-research.md).

> Understand this running system using the host access I have provided. Explain
> its components and connections, what is configured, what has been observed and
> what remains untested. Keep inspection read-only and save the Surface here.

Expect partial progress when an integration cannot be inspected. Researcher does
not start a service, sign in for you or send a test prompt to complete the graph.
On a later visit, it distinguishes actual target changes from newly learned facts
and missing access. The existing source-only workflow remains available.

## Inspect the developing Surface

Open the latest brief for the current explanation, the HTML map for paths and
expandable evidence, and the journal for the investigation journey. The Researcher
should provide the working folder and absolute file links without changing projects.
The journal retains scope, available evidence, findings, choices, questions,
diversions, deferred paths and reasons. Each next step explains its purpose and
needed access. You can inspect the whole map, redirect or stop at any time.

A supported database is a possibility; it is not necessarily the selected target.
Safe static configuration may establish selection, while a placeholder cannot.
Missing configuration means unknown selection. Solid paths are selected; dashed
paths require inspecting their support/selection details. Dated observed use is
separate. Optional does not mean weak evidence.

## Redirect and save

> Pause this path and investigate authentication first. Keep the deferred work,
> explain what access would help, and save the updated Surface.

Expect the choice and its reason in the journal, useful next options and a new
numbered revision. Previous files remain unchanged. Saving generates a brief,
map and journal from the same Surface; there is no separate native data authority.
The technical file is CycloneDX 1.7 with a bounded Surface profile. Ordinary users
need not choose that format or ask for a separate export.

## Return in a fresh chat

Supply the latest `surface.cdx.json` and selected sources. The BOM alone retains
relationships, evidence, choices, uncertainty and the investigation journey.

> Continue this Surface. What did I choose, what remains uncertain, and what
> should we investigate next? Keep earlier decisions and revisions.

The Researcher reads the supplied Surface, re-establishes access and tells you
when evidence cannot be refreshed. A new observation does not rewrite old ones.
If you edit a generated journal, supply that edited folder and ask to reconcile
it. The Researcher treats edits as proposals, records accepted changes in a new
revision and preserves the edited original. It must not silently overwrite it.

Old native/exchange saves remain readable when deliberately supplied. Migration
requires reviewing their evidence and recording limits; no automatic lossless
conversion is claimed. See the [format details](skill-cyclonedx.md).

## What the fresh rehearsal showed

The installed Researcher saved an initial plan before inspecting sources, then a
second revision with the partial graph and next options. It worked from the
explicitly supplied checkout, without the old operational notes. It reported that
Git inspection was unavailable in its session and used inspected-file hashes.
That is a useful distinction: source identity can be bounded without pretending
the entire checkout or deployment has been verified.

A scripted user diversion successfully moved the investigation to authentication.
The journal kept the tool/document paths as deferred, with reasons, and retained
the choice as a rehearsal decision. Earlier files were unchanged. The agent's
presentation check initially missed a setting name because Markdown escaped its
underscores; it normalized that escaping and completed readback. If a check fails,
ask what failed and how readback was verified, rather than accepting a bare success
claim.

The fresh continuation received only a copied BOM and source access. It recovered
the authentication-first choice and deferred work, proposed two next steps with
access requirements, and saved another revision. Earlier files, relationships and
source evidence remained intact. This exercises the ordinary “continue this
Surface” interaction; human visual review and acceptance remain separate.

## Report your check

Pass when the brief is useful, evidence is inspectable, choices survive reopening
and earlier files remain intact. Fail for invented relationships, lost decisions,
missing state or unsupported claims of observed use. Blocked means a prerequisite
such as source access or Node is unavailable. Return the interaction and relevant
file paths without secrets. Agent rehearsals do not substitute for your acceptance.

The Researcher describes and investigates; it does not deploy, attack, certify or
score the target. A schema check is not evidence that a selected connection works.
