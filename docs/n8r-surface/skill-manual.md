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

Planned result: native brief/HTML/JSON plus an exchange directory containing BOM,
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
as a conflict rather than overwritten. Actual rehearsal observations and recovery
notes will be added here before the candidate handoff.

## What this release does not decide

The skill describes and researches; it does not deploy, attack, certify, score or
repair the target. Ask what a gap means and what evidence would resolve it before
expanding the investigation. The [mapping guide](skill-cyclonedx.md) explains the
bounded exchange and its limits.
