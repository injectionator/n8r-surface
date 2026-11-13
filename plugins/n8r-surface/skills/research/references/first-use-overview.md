# A useful first security overview

For broad initial source research, help the reader understand the application
before explaining the saved format. Preserve a narrow question when one is given.
This is a bounded first pass, not an exhaustive audit or vulnerability verdict.

## Research and record

- Explain what the application does in one plain sentence. Put this in the focus
  component's standard `description`; name that component as the presentation
  focus using the [optional node hints](cyclonedx.md#overview-presentation-hints).
- Group major internal functions and external integrations only where evidence
  establishes their placement relative to the application. A browser is not the
  backend; a supported database option is not an installed store. Preserve shared
  identities and paths across groups. Leave unresolved placement unclassified.
- Record a few consequential observations as `finding` journal entries with
  `status: done`, evidence references, and a `reason` explaining why each matters.
  Keep the finding and its limitation together. A source-backed execution path is
  an investigation lead, not a demonstrated vulnerability or runtime guarantee.
  Do not promote an unsupported inference just to fill the opening.
- Make coverage legible across **identity**, **authorization**, **data handling**,
  **storage**, **secrets**, **exposure** and **observability**. Use named `coverage`
  and `gap` strings, such as “Identity: supported sign-in options inspected” or
  “Observability: runtime trace coverage not researched.” These labels describe
  inspected work, not control effectiveness. Mark unresearched areas explicitly;
  do not expand a first pass into seven exhaustive investigations.
- For integrations within scope, research supported options separately from
  intended selections, safe configuration evidence and dated runtime observations.
  “Identity provider unknown” alone does not describe supported authentication.
  If support was not researched, say so and identify the next useful source read.
- Keep model-request control points distinct from actual tool execution. Preserve
  browser-originated traffic, backend extensions and scheduled execution contexts
  when evidenced; explain their consequences without presuming every app has them.

The generated brief uses descriptions, groups, findings, coverage/gaps and open
next steps. The generated HTML puts a connected overview before full relationships,
source evidence and investigation history. Do not hand-edit these views instead of
recording the relevant evidence in the BOM.

## Scope once, exceptions where needed

State common source/deployment limits in `scope`. Keep per-relationship conditions,
conflicts, bypasses, selection evidence and observations intact. Use `note` for
what is distinctive about a path instead of repeating generic deployment caveats.
The concise brief links to full relationship details; brevity must not erase a
consequential exception from its associated finding.

## Invite the next decision

Match the next step to the established investigation context:

- **Source checkout only:** recommend one concrete source-level trace, naming the
  entry point, authorization boundary and question it can answer. Keep deployment
  settings unverified. Research can continue without a daemon, deployed instance
  or chosen provider. Ask about intended setup only if the user wants planning.
- **Intended setup:** record choices as dated user-basis evidence, then explain
  what configuration evidence would establish them later.
- **Identified deployment:** inspect only the permitted target and relevant safe
  fields. Keep configuration and dated runtime observations separate.
- **Context unclear:** continue useful source research; before requesting runtime
  access, establish whether the user wants source analysis, planning or inspection
  of an existing deployment. A checked-out Compose file identifies a declaration,
  not a running target. An available Docker daemon is not a target identity.

## Keep the successor current and the brief short

Before each save, reconcile the current scope, findings, coverage, gaps and actions:

1. Record new evidence with its date and applicability. Preserve old observations
   and accepted decisions in the journal and predecessor; do not rewrite their text.
2. Mark obsolete entries `superseded` and link a replacement with `supersedes`.
   Mark completed actions `done`; mark out-of-scope work `deferred` with a reason.
   For example, reachable runtime evidence supersedes an unavailable-daemon blocker
   and completes the retry action; it does not establish a deployment's presence.
3. Replace obsolete current scope/gap strings in the successor. Preserve their
   historical content in dated journal entries/evidence. Do not append contradictory
   current statements and leave the reader to determine which applies.
4. Keep one recommended action `active`, with a clear result and access requirement.
   Other genuinely useful choices can remain open or deferred in the journal.
5. Read the generated brief as a newcomer. Aim for roughly 400–700 words: a short
   current scope, major areas, a few current implications, concise coverage/gaps
   and one next action. Consolidate overlapping findings using supersession while
   preserving each consequential exception and its evidence. A word target never
   justifies dropping a limitation or inventing a summary.

The renderer shows at most twelve nodes, five current findings (most recently
recorded, not severity-ranked), seven coverage items, seven gaps and one action
(active first, otherwise recorded order). It explicitly links additional items to
full HTML detail. Complete finding text, reasons and evidence stay together;
long individual entries are not silently truncated. Prioritise and consolidate
research content before saving; list limits alone do not guarantee a short brief.
The journal and full map retain the complete record, including superseded entries.
This skill does not configure or deploy the system.

End the chat with a short statement of what the research clarified, links to the
brief and map (journal/detail links can follow), and the next useful question.
Keep format mechanics underneath. Explain the architecture/research BOM's bounded
machine-readable value when relevant: it is not a comprehensive dependency SBOM;
standard dependencies cover only the selected dependency subset. Other consumers
may ignore the profile's paths and evidence. Conventional SBOM linkage is future
work, not a claim made by this increment.
