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

Offer a concrete next step: describe intended model connections, identity, stores
and enabled tools. Record human choices with dated user-basis evidence. Later,
inspect permitted configuration and runtime evidence separately; an intention
must never be relabeled as an observed setup. Save a successor without rewriting
prior records. This skill does not configure or deploy the system.

End the chat with a short statement of what the research clarified, links to the
brief and map (journal/detail links can follow), and the next useful question.
Keep format mechanics underneath. Explain the architecture/research BOM's bounded
machine-readable value when relevant: it is not a comprehensive dependency SBOM;
standard dependencies cover only the selected dependency subset. Other consumers
may ignore the profile's paths and evidence. Conventional SBOM linkage is future
work, not a claim made by this increment.
