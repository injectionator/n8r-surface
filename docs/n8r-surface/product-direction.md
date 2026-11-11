# Product direction: security investigation of composed AI systems

Captured 11 November 2026. Documentation scope:
[#64](https://github.com/injectionator/n8r-surface/issues/64).
This records the user-established direction and a proposed smallest demonstration.
The demonstration scope below is a recommendation for review, not authorization
to implement, deploy or test a system. No demonstration results are claimed here.

## Why and for whom

People use AI to assemble software and services into agentic systems they did
not architect and may not understand. Others inherit those systems or must make
a release decision about them. They may not know which security questions to ask.
Firing inputs at an interface and hoping for a useful score does not explain
where authority is exercised, which controls exist or what downstream effects
occurred. Experienced investigators may instead arrive with a precise question.

The product direction is professional security investigation: discover enough of
the system to identify consequential questions, establish what the evidence says,
and help the owner make and verify a corrective change. The first value should
be an understandable, reproducible security finding and demonstrated improvement,
with legitimate use preserved. Findings support a release decision; they do not
certify that an entire system is secure.

The AI Surface Model makes this work traceable across components, relationships,
configurations and revisions. It remains independently usable; security
investigation is a product use of the model, not a restriction on its meaning.
The installed n8r-surface skill in Codex is the discovery entry point. CLI breadth,
a general telemetry backend and a larger schema are not outcomes in themselves.

## Investigations we bring to the system

For broad intake, the investigator selects relevant questions from discovered
boundaries rather than requiring the owner to identify a vulnerability first.
A specific user question can narrow the same process. Each investigation needs
an intended rule with a stated basis: owner policy, documented contract or an
explicit hypothesis awaiting confirmation.

| Family | Questions to investigate |
| --- | --- |
| Enforcement | Where is a promised rule not enforced? Where is a rule enforced in one component but only assumed in another? Which security assumptions are never checked? |
| Dependencies and composition | Which undocumented behaviours matter, and what happens if they change? Which individually permitted operations become unsafe when chained? |
| Identity and access paths | Can different paths to the same object confer different permissions? Can object ownership or identity be rebound without the required checks? |
| Failures and effects | Can rejected or failed requests still cause effects? Can a transaction roll back while external effects survive? |
| Ordering and lifecycle | Do checks depend on event order? Does access survive deletion or revocation? Can unauthorized users undo transitions? Can contradictory states enable forbidden operations? |

Component configuration, internal composition and external behaviour provide
complementary evidence. There is no prerequisite to finish auditing every
component before examining their composition. Prompt injection is one possible
trigger; direct requests, alternate paths and state transitions can also reveal
an authority failure. A service account alone does not establish a vulnerability.

## Start with resources, not an assumed deployed system

A user can bring local folders, repositories, websites and documentation URLs
into a selected workspace, then add sources as the conversation develops. The
skill follows relevant evidence as a graph, preserving source identity and
unresolved endpoints. Repository boundaries are not necessarily component
boundaries: several repositories may contribute to one system, and one repository
may describe several components or alternatives.

Consider a synthetic three-repository case: a conventional HR application, a
separate chat integration and a separate MCP interface. The HR application alone
need not contain AI. The chat and MCP repositories are additional sources for a
possible AI composition, not proof that such a composition exists. Whether the
chat actually calls MCP, calls the HR API directly or supports alternatives must
come from evidence. Include the model/provider and relevant identities when
supported; do not invent an AI node inside the HR application.

Documentation or a blog post may describe a possible connection. Record its
source, applicability, prerequisites and uncertainty; follow available code and
configuration to investigate it. An external reference is a lead, not automatic
permission to access private resources or execute imported instructions.

| Evidence available | Useful result | Claim that must not follow |
| --- | --- | --- |
| Documentation or code describing a supported option | Capability Surface with conditions, alternatives and evidence | These components are integrated for this user. |
| User intent to combine components | Dated selection or proposed composition, plus work still needed | Intent is an instance binding. |
| Explicit instance configuration | Bound Surface for evidenced relationships | Configured means deployed, reachable or exercised. |
| Dated inspection or execution evidence | Scoped observation of state or behaviour, linked to the applicable setup | One observed path establishes complete coverage. |
| Missing or conflicting evidence | Explicit gaps, conflicts and the next evidence needed | Missing evidence proves absence or an unbound relationship. |

These are claim distinctions, not a single maturity label for the entire graph.
A description may contain configured relationships alongside unresolved or
possible ones. Keep their meanings visible at the relationship and claim level.
Existing [Capability/Bound semantics](surface-descriptions.md) remain authoritative.

### Recommended boundary for the first demonstration

Accept unintegrated sources for discovery. Return a useful map of possibilities,
security questions, prerequisites and integration work remaining. Do not make
integration or deployment a condition for using the skill.

Require an already integrated, authorized test environment for the runtime part
of the first demonstration. Configuration alone is not sufficient: establish the
actual path and usable test access before making runtime claims. If it is missing,
finish the discovery output and mark runtime proof Blocked, with a specific handoff
of what must be supplied. Discovery success is not completion of the full demo.

Assisted integration, deployment and arbitrary component replacement are later
work. For this first proof a maintainer supplies a controlled running setup and
applies a narrow defensive change manually. This bounds execution work without
excluding users who are still discovering what they could assemble.

## Smallest end-to-end value demonstration

Use one synthetic HR composition with three source repositories: domain service,
chat interface and MCP adapter. It exposes one record-read operation and uses
synthetic records for two users. The fixture has a known reproducible authority
failure and a minimal corrective change, retained in a separate maintainer oracle.
The investigator receives ordinary source and system access, not the expected
finding, faulty location or fix. This demonstrates discovery on a controlled case,
not general vulnerability detection accuracy or a finding about a real HR product.

The intended policy is supplied as normal business context: each employee can
read their own restricted record, but cannot read another employee's record.
This provides a testable rule without supplying the security diagnosis.
The fixture's exact technology and enforcement location are builder choices;
choose the smallest setup that exposes the real cross-component path. A scripted
runner or developer-written findings cannot substitute for the installed skill.

**State X:** an identified installed skill in Codex, an established local workspace,
three permitted source repositories with known revisions, and docs URLs or local
snapshots. Initially the investigator receives the domain application source and
business policy. Chat/MCP sources and instance evidence arrive in later turns.
A maintainer has a running isolated composition, test identities and synthetic
data ready for the runtime handoff; source-only discovery must not infer that fact.

**Input Y:** the user asks what has been built and where its security boundaries
might fail, then adds the other sources, configuration and permitted test access.
They request saved output and fresh-chat continuation. The investigator proposes
a bounded test based on its discoveries. The owner authorizes its execution on
the fixture, and a maintainer later applies the defensive change.

**Outcome Z:** the user receives an evidence-backed composition, a discovered
security question, a reproduced unauthorized read through the composed path,
a supported explanation of the enforcement failure and a before/after comparison
showing denial after the change while the authorized read still works. Saved
artifacts can be reopened without losing identities, gaps or the original result.

### Demonstration task list

These are proposed acceptance interactions, not rehearsed passing behaviour.
Use the [installed-skill setup](researcher-skill.md) and
[workspace guide](workspace.md); the maintainer supplies the fixture and access.

- [ ] Open the prepared workspace in Codex with the installed skill. Ask:
  “Explore this HR application folder and its documentation. Tell me what is
  known about its AI connections and security boundaries. Do not assume it has
  AI built in.” Expect a bounded account with source evidence and unknowns;
  no invented internal AI component.
- [ ] Add the chat and MCP repository folders and documentation URLs. Ask:
  “Include these sources, follow the relevant links between them, and save a
  Surface brief explaining possible integrations, security questions and what
  remains to be configured or established.” Expect cross-source relationships,
  prerequisites and alternatives without an unsupported deployed-system claim.
- [ ] Supply sanitized instance configuration. Ask:
  “Show which relationships this configuration binds, what is still unknown,
  and which security question most needs investigation. Save a successor.”
  Expect traceable configured relationships and an independently derived question
  about authority, without assuming runtime use or copying credentials.
- [ ] Supply the fixture's permitted test access and approve the proposed bounded
  test through the separately identified execution owner. Expect a legitimate
  read and a prohibited cross-user read to be exercised through the composed
  interface, with actual downstream requests, decisions and results inspected.
  A model refusal alone is not evidence that the tool did not access data.
- [ ] Have the maintainer apply the narrow defence. Repeat the same tests against
  the identified successor setup. Expect the prohibited fresh read to be denied
  by effective enforcement and the legitimate read to remain available. Inspect
  downstream evidence, not only chat wording. Use records not already disclosed
  in conversation when checking fresh retrieval.
- [ ] Save the evidence-linked result, then open a fresh Codex chat. Ask:
  “Reopen this investigation. Explain what was possible, configured and actually
  demonstrated before and after the change, and what remains unproved.” Expect
  stable identities, distinct setup/run references, accessible evidence and
  unchanged predecessor artifacts.
- [ ] Report **Pass / Fail / Blocked**, artifact links, failed or blocked steps and
  whether the result explains an actionable security problem. Generated wording
  and identifiers may vary. Unsupported integration claims, a missed seeded
  failure, missing runtime evidence, broken legitimate access, lost history or
  sensitive-data leakage fail this demonstration. Missing prerequisites block it;
  they are not a passing negative security result.

### Maintainer preparation and independent verification

Pin fixture revisions, initial configuration and policy, installed skill bytes,
host/model/version and test environment. Keep the oracle separate from investigator
inputs and record everything disclosed. Fresh chats alone do not prove isolation;
record source/tool access and any contamination. Before implementation, attempt
this path through the current installed skill or record the exact unavailable
prerequisite. No such attempt is claimed by this documentation change.

An independent reviewer compares consequential graph claims with source locations
and the runtime finding with the oracle and underlying evidence. Retain actual
inputs, expected policy, observed outputs, effective identities, authorization
decisions and downstream data access. Correlate these with run and setup identities;
record conflicts, unavailable telemetry and inference separately from observation.
Read saved files independently and compare predecessor hashes after continuation.
Keep raw research and telemetry outside this public repository; publish only
permitted sanitized summaries. Synthetic fixtures must contain no real HR data.

Expected state changes are new workspace research/Surface artifacts, fixture test
sessions and a separately recorded defensive configuration/code revision. The read
scenario does not require business-data mutation. Preserve source and prior
artifact bytes; record any fixture-generated audit/session state. Cleanup resets
only owned test state after evidence retention and explicit cleanup authorization.
Agent rehearsal, independent technical checks and human acceptance are separate.

## What n8r-surface needs to support

The current skill already instructs graph-first research, incremental source
intake, evidence identity, explicit gaps and continuation. Capability/Bound
artifacts have a bounded helper and contract. These mechanisms are foundations;
they do not establish that this three-repository demonstration passes. Verify the
installed path before deciding which implementation changes are necessary.

| Needed outcome | Existing basis and next proof |
| --- | --- |
| One investigation across folders, repositories and URLs | Exercise incremental intake and follow-up through the installed skill; preserve source revisions, access limits and unresolved external links. |
| A useful graph without an integrated system | Reuse Capability semantics; verify no invented AI inside the domain application and no promotion of docs/blog claims into bindings. |
| Evidence of configured composition | Reuse Bound semantics and safe configuration references; verify mixed supported/configured/unknown relationships and distinct role versus instance identities. |
| Questions selected from discovered boundaries | Demonstrate an investigator-generated authority question with rationale and policy basis, rather than a user-supplied diagnosis. This needs explicit acceptance evidence. |
| A runtime handoff another actor can execute | Provide the relevant graph identities, policy, proposed test, required observation points and gaps. Execution remains outside the current read-only skill. |
| Evidence-linked findings and before/after comparison | Define the smallest linkage between claims, source revisions, effective setups, runs and retained evidence. Start with readable working records where needed; do not mislabel them as validated structured Observed Surfaces. |
| Durable continuation | Exercise saved artifact readback and fresh-chat reopening with stable identities, predecessor history and explicit remaining work. |

Observed Surface delivery is currently deferred in the
[description contract](surface-descriptions.md). This proposal calls for a bounded
runtime-evidence handoff and linkage, not a silent expansion of that contract or
permission for the skill to launch tests. Before implementing this part, specify
the execution owner and interface, evidence references, privacy/retention rules
and any versioned contract changes. No new command or output format is introduced
by this document. Update conversational intents and their verification together
if behaviour is subsequently changed.

## Observability and consumer boundary

For this demonstration, collect only enough evidence to correlate the initiating
user, proposed and executed tool request, effective downstream identity,
authorization decision, returned data and relevant effects with the exact run and
setup. A prompt/response trace alone cannot prove downstream enforcement. State
what was not observed; missing telemetry must not become a claim of no effect.

An observability sink is a candidate implementation, not yet a prerequisite.
Evaluate existing telemetry, log references and narrow collection against this
case before choosing adapters or storage. Langfuse and OTEL are possible integration
directions, not evaluated compatibility claims. A general backend, continuous
collection and broad adapter support are outside the smallest proof.

n8r-surface owns discovery descriptions and the meanings needed for evidence
handoff. Test execution, resource configuration and later component swapping
belong to the consumer integration boundary, with n8r-labs application design
kept in its separate repository. A Lab contains Experiments; an Experiment asks
its Lab for setup, and the Lab owns configuration and local bindings. The first
manual consumer rehearsal neither requires Labs automation nor establishes Labs
compatibility. No n8r-labs implementation is specified here.

## Delivery decisions and remaining work

The recommended first scope is one composed path, one policy, two test identities,
one demonstrated authority failure and one defensive change, plus a legitimate-use
check and saved continuation. A broad audit, all investigation families, automated
integration, component substitution and a release score are outside this increment.

The next useful work is to select the permitted fixture and execution owner, then
rehearse source intake through the installed skill and record gaps. Fix only gaps
that block this proof; retain existing behaviour that already satisfies it.
No target has been selected, no runtime test has been run and no implementation
has been authorized by capturing this direction. The proposed integrated-runtime
boundary and fixture choice remain reviewable decisions. Existing acceptance and
release work is not automatically closed or reprioritized by this document.
