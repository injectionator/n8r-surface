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
inside the application, externally or as unclassified. Grouping is a source
architecture description, not proof of deployed trust boundaries. Full edge
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

Installed-candidate rehearsal and final check results will be recorded here before
handoff. No fresh installed-product success or browser visual acceptance is claimed
by this implementation status. A prior local-file browser-policy refusal remains
a blocker for that route; it must not be bypassed.

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
