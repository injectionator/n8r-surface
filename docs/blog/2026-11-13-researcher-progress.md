# Making AI system research easier to pick up again

Editorial status: draft for review, not posted. Skill 0.1.14 is available through
the repository marketplace. See the
[publication record](../n8r-surface/marketplace-0.1.14.md).

Investigating an AI application means following connections. Which service
receives a prompt? Where does retrieved text go? What authority does a tool have?
Source code can answer part of that, while configuration and runtime observations
answer different parts. Keeping those answers, their evidence and the remaining
questions together is the work behind n8r-surface.

Since the [5 November experimental release](https://github.com/injectionator/n8r-surface/releases/tag/v0.1.0-experimental.2),
we have concentrated on the Researcher skill: a way to investigate supplied
sources in a Codex conversation and keep a Surface that another session can
continue. Marketplace version 0.1.14 makes the first saved overview
more useful to someone beginning a security investigation.

That November release was the experimental npm command and library. The skill
has developed separately through the repository marketplace; this update does
not announce a new npm release.

## Start with the source you have

A useful first task is to supply an application checkout and ask the Researcher
to explain its AI-relevant architecture, consequential security observations and
important gaps. You can keep the investigation bounded: model connections,
identity, tools or data storage, for example. Source research does not require
you to start the application or provide credentials.

The 0.1.14 overview leads with what the application does, its major internal
areas and external integrations. A connected map sits above the detailed
relationships. Findings link to evidence, and the brief offers a next action.
For a consultant, that should make the saved output a useful starting point for
scoping the next piece of work. The [first-use evidence](../n8r-surface/first-use-overview.md)
records what we exercised and what still needs human verification.

The distinction between a supported integration and an actual connection stays
visible. A repository may support several model providers or identity services.
That does not tell us which one a particular installation uses. An intended
choice, a configuration declaration and a dated observation each carry their
own evidence.

## Keep the investigation with the description

New skill saves use a self-contained CycloneDX 1.7 document. It holds the
components and connections alongside evidence, decisions, gaps and investigation
state. The readable brief, HTML map and journal are generated from that document.
You can supply the saved document to a fresh chat to continue the investigation;
the original conversation is not a required part of the saved format.

We [exercised that continuation](../n8r-surface/skill-bom-verification.md)
with an installed candidate. After a source investigation and a change of research
priority, a fresh session received only the saved BOM. It recovered the objective,
choices, deferred paths and uncertainties, then saved a successor. Independent
readback checked the inherited evidence and unchanged earlier files. This was an
agent rehearsal with bounded sources, rather than a claim that every investigation
will recover correctly.

Corrections also need a history. The latest work removes superseded findings and
actions from the current overview while retaining them in the journal. An old
runtime-access blocker should not keep driving the next step after the scope or
evidence has changed. The source-only retest now points to one source investigation
and leaves deployment settings explicitly unverified.

## What remains experimental

The brief is shorter, but concision still needs work. The latest retest produced
867 words, above our 400–700-word editorial aim. Positive user feedback is useful;
rendered-map usability and the separate intended-setup continuation still have
open acceptance work.

A Surface is also not automatically a complete dependency SBOM. We use standard
CycloneDX inventory and selected dependencies, with a documented property profile
for the richer relationships and investigation state. Other consumers may omit
that detail. The [mapping and consumer checks](../n8r-surface/skill-cyclonedx.md)
describe the boundary. Schema validation cannot establish that the research is
accurate or that a deployed control works.

The skill remains dependent on the host's source access, filesystem and tools.
It does not deploy a system, certify its security or turn source observations into
runtime findings. Cross-host testing and broader runtime verification remain work
to do.

## Help us test useful investigations

We would particularly like security consultants and early users to try a bounded
question against a source they are allowed to inspect. Read the brief, follow a
finding to its evidence, then reopen the saved Surface in a fresh chat. Tell us
where you lost the thread, which unknowns affected your decision and whether the
next action was worth pursuing.

The [installation and verification guide](../n8r-surface/marketplace-0.1.14.md)
identifies the exact bytes to try. The [working manual](../n8r-surface/skill-manual.md)
explains saving and continuation. Share reproducible, synthetic examples through
[the contribution workflow](../../CONTRIBUTING.md); keep client data, credentials
and private deployment details out of public issues.

The AI Surface Model is open and usable independently of a particular application.
Concrete investigation problems, counterexamples and evidence from named consumers
will help us decide what to improve next.
