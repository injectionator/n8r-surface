# Researcher skill: working user manual

This manual grows from actual candidate use for issue #68. It is an early working
manual, not evidence that an unexercised step passes. Maintainer evidence and
installation preparation stay separate from the user journey below.

## Start with the question and sources

Open a workspace with the installed Researcher and readable sources. Introduce
one component first; add other folders, documentation and safe configuration
summaries when relevant. Do not paste credentials or private connection strings.

> Use n8r-surface Researcher to explain the AI-relevant components and connections
> in these sources. Explain what is supported, what is configured and what remains
> unknown. I want a multi-component Surface, with evidence I can inspect.

Expect a concise explanation and useful next enquiries. A list of products is
context, not proof that they are connected. Historical deployment notes are not a
fresh running-state check. If the selected model differs between sources, the
Researcher should show the conflict or limit rather than silently choose one.

## Add evidence and save

> Include this additional component and configuration summary. Save checked
> research and a Surface, then a CycloneDX 1.7 exchange alongside those records.
> Explain which connections the exchange represents and which meanings remain in
> the research records. Show me the saved brief and files.

Observed candidate result: native brief/HTML/JSON plus an exchange directory containing BOM,
native snapshot and mapping report. Read the brief first. Inspect the mapping
report for unknowns and omissions; a valid BOM is not a complete deployment audit.
Do not treat a configured connection as proven working.

## Return and correct

In a fresh chat, supply the saved native and exchange directories and source access.

> Reopen this saved research and CycloneDX exchange. Keep the evidence and my
> decisions. Apply this correction, save successors and leave earlier files
> unchanged. Explain what changed and show me the evidence.

Expected result: new identifiable revisions with preserved history. Missing source
access should be explicit. An edited or damaged saved artifact should be reported
as a conflict rather than overwritten. The fresh-chat rehearsal recovered its evidence from saved files, added an owner
design decision, preserved all ten earlier artifact files and advanced the BOM to
version 2 with the same serial number. The
[verification record](skill-cyclonedx-verification.md) separates exercised steps
from pending human acceptance.

## What we learned from the first use

The installed candidate researched twelve supplied files and saved nine nodes and
nine relationships. It separated five components from four services in CycloneDX.
It also wrote a shorter consultant brief beside the generated native brief. Ask
for that summary when you want the system explanation before the detailed evidence.

The evidence supported a Capability Surface. Consequently its BOM had no concrete
dependency edges, although the native graph retained all nine connections. This is
useful partial output: absence of BOM edges here does not mean the system has no
connections. A [synthetic Bound example](../../examples/researcher/cyclonedx/configured/README.md)
shows what an explicitly selected, configured dependency looks like in the exchange.

The candidate kept the intended model distinct from a different model named in
historical evidence. It found source-level control points but did not claim they
were deployed or effective. No applicable SBOM was supplied, so package versions,
transitive dependencies and complete licence coverage remained gaps.

One readback command initially used the wrong level of the mapping report. The
candidate corrected its inspection to use `mapping.nodes` and
`mapping.dependencies`, reran it, and read the outputs successfully. Export itself
had succeeded; the files were preserved. If a check fails, ask for the actual
failure and corrected readback rather than accepting a bare success statement.

## Report the user check

- Pass: you can explain the system from the brief, follow evidence, inspect the
  exchange limits and reopen/correct it without losing prior records or decisions.
- Fail: missing output, invented connections, an intended setting described as
  observed, lost decisions or altered earlier files. Return the interaction and
  relevant output paths; omit secrets.
- Blocked: installation, source access or required runtime is unavailable. Record
  the missing prerequisite; do not count an unattempted step as passing.

Keep the rehearsal outputs until reviewed. Remove only the disposable workspace
when no longer needed; leave original sources and established research intact.

## What this release does not decide

The skill describes and researches; it does not deploy, attack, certify, score or
repair the target. Ask what a gap means and what evidence would resolve it before
expanding the investigation. The [mapping guide](skill-cyclonedx.md) explains the
bounded exchange and its limits.
