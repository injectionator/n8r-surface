# Capability and Bound Surface delivery

Agreed intent, 8 November 2026. The contract layer is implemented separately;
these installed-skill outcomes remain planned, not evidence of product acceptance.
Parent: [#17](https://github.com/injectionator/n8r-surface/issues/17).

## Intent and names

The installed Researcher uses artifacts in a selected workspace, supplemented by
authorized research, to produce and revise useful evidence-backed descriptions.
It preserves sources, component identities, human decisions, gaps and history.
There is one AI Surface Model; the following are descriptions within it, not
separate models. Size and depth are independent of these distinctions.

| Description | Question answered | Evidence boundary |
| --- | --- | --- |
| Capability Surface | What connections and capabilities can this product support? | Docs/code establish possibilities, without asserting instance bindings. |
| Bound Surface | Which relationships are configured for this instance? | Explicit instance configuration is enough to mark a relationship bound. Runtime use need not be proved. |
| Observed Surface | What configuration and state were observed for an instance at a particular time? | Dated instance inspection; any runtime claim needs runtime evidence. Deferred from this delivery. |

For example, a Capability Surface may describe support for OIDC authentication
and MongoDB. A Bound Surface may identify OIDC and MongoDB Atlas as the configured
authentication and database relationships. These examples are illustrative, not
findings about an inspected deployment. Actual setting values are outside this
increment. Configured does not mean reachable, exercised or successfully deployed.

Missing evidence means unknown, not unbound. Supported alternatives remain
separate from selected bindings. Conflicting evidence remains visible rather than
being silently resolved. Definitions and instance bindings retain separate
identity/revision meaning; later evidence cannot rewrite prior descriptions or Runs.

## Outputs and privacy

On an authorized save, provide a concise readable Surface brief, a research HTML
record and checked structured Surface output in JSON, with openable file links.
Working Markdown notes remain useful intermediate artifacts. The brief may be
included in the readable record; an additional file is not mandatory. Outputs
identify their description type, scope, evidence, gaps and recommended next step.

For a Bound Surface, retain the target's useful role/product identity and the
fact of its configured relationship. Omit or mask sensitive URLs, IPs, usernames,
passwords and keys. Do not put those values in generated notes, HTML, JSON,
filenames, validation errors or retained evidence. Use opaque identities that do
not encode sensitive values; do not copy a raw value merely to redact it later.
An inability to inspect a source safely is a coverage limit, not permission to
collect secrets. Existing workspace/source secrets are not copied into output.

No raw-secret store is required or introduced. Credentials remain in their
existing stores. Recoverable exact settings and secure storage would require a
separate future design. Observed Surface is deferred, including actual settings
capture and live/runtime inspection; no continuous synchronization is promised.

## Contract boundary and implementation choices

The [current experimental contract](contracts.md) represents selected definitions
and leaves deployment bindings outside its profile. This document does not
silently extend that contract or relabel existing definitions as Bound Surfaces.
The [bounded contract 0.2](surface-description-contract.md) defines the
representation and versioning for #50; installed artifact production remains #51.
Capability alternatives have an explicit representation; mutually exclusive possibilities must not be flattened
into a selected composition. Preserve shared identities and exact evidence links.

Reuse existing codecs, validators, HTML rendering and revision checks where
suitable. The builder selects file layout, helper/API integration and the bounded
representation, documenting compatibility limits and checking them against the
agreed meanings. JSON is the first structured representation. YAML expansion,
other hosts, Lab integration, deployment changes and release work are deferred.
The first supported acceptance environment is the installed skill in Codex.
The skill is standalone: it must not invoke or depend on the `n8r-surface` CLI.
Artifact production and checks must work through the host and bundled skill
resources independently of that executable.

## Intent and verification

**State X:** an identified installed skill, a selected supported workspace and
accessible, permitted docs/code artifacts with recorded source identity. Begin
with no instance binding evidence. Reuse established workspace setup; record any
missing prerequisite as Blocked. Before implementation, attempt the current
installed path and retain actual behavior or its prerequisite blocker.

**Input Y:** ask for a Capability Surface and saved artifacts; then supply permitted
instance configuration, a human correction and a second source, and request a
Bound Surface. In a fresh chat, reopen the saved artifacts and revise one binding.

**Outcome Z:** useful readable and checked structured outputs, supported
capabilities separated from configured relationships, traceable claims and gaps,
privacy-preserving output, and a successor retaining identities and history.
Only authorized workspace artifacts change. Source files and prior outputs remain
unchanged; no configuration, services, credentials or runtime are modified.

### Maintainer preparation and technical evidence

- Identify the installed candidate revision/digests, host/model, source revisions
  and initial workspace inventory. Use the established installation procedure in
  [the skill guide](researcher-skill.md).
- Prepare permitted source packs for two unrelated products, including incomplete
  evidence, a second source and a known configuration change. Synthetic sensitive
  sentinels allow exact leak detection without using real secrets.
- Exercise the actual installed skill; do not seed findings and claim the
  Researcher produced them. Independently read saved bytes, sample consequential
  claims against sources, run contract/reference/successor checks and compare
  prior-file hashes. Scan all generated files and retained evidence for sentinels.
- Keep source transmission within authorized access. Retain private evidence
  outside the public repository; publish only sanitized summaries and fixtures.
- Leave malformed data, reference failures, failed saves and preservation cases
  to focused automation. Fixture checks do not prove research quality or host
  acceptance. Record expected, observed, verified and unproved outcomes separately.

### Human verification task list

These are the target interactions, to be exercised against the installed candidate
once implemented. They have not been rehearsed as passing product behavior by
this documentation increment. The maintainer supplies the selected workspace and
source pack; the tester does not need to choose a schema or run validators.

- [ ] Open the prepared workspace in Codex and select the installed Researcher.
  Ask: “Use the supplied docs/code to create a Capability Surface. Save the brief,
  research HTML and structured Surface in this workspace.” Open the returned
  links. Expect supported possibilities and explicit gaps, without asserted
  instance bindings; the files must exist and answer the question.
- [ ] Supply the prepared instance configuration and second source. Ask: “Create
  a Bound Surface from this evidence. Configuration is sufficient to mark a
  relationship bound. Omit sensitive setting values.” Expect the evidenced
  targets, such as OIDC and MongoDB Atlas, with no runtime-use claim or leaked
  synthetic sensitive values. Missing/conflicting evidence must stay visible.
- [ ] Give the prepared human correction. Expect a scoped decision/correction
  without erasure of contrary source evidence. Authorize a saved successor.
- [ ] Start a fresh chat with the same workspace and the saved artifact selected.
  Supply the prepared changed-binding evidence. Ask: “Reopen this Surface and
  save a successor reflecting this binding change.” Expect retained component
  identities, a clear change and predecessor reference, and unchanged old files.
- [ ] Repeat the bounded journey with the unrelated source pack. Expect the same
  meaningful distinctions without product-specific implementation or user repair.
- [ ] Report **Pass / Fail / Blocked**, the output links, which step failed or was
  blocked, and whether the outputs were useful and understandable. Wording,
  timestamps and generated IDs may vary; unsupported bindings, secret leakage,
  lost decisions/history, broken files or false success claims are failures.

Agent rehearsal and human acceptance are separate records. Fresh chats do not
prove enforced memory/tool isolation. Retain owned trial artifacts for review;
cleanup is a separate authorized action and must not touch borrowed source data.

## Three delivery tasks

1. [#50 — Descriptions and contract](https://github.com/injectionator/n8r-surface/issues/50):
   capture this intent, then define bounded representations, versioning and
   synthetic examples with meaningful checks. See the implemented
   [contract and human check](surface-description-contract.md).
2. [#51 — Installed-skill artifact production and revision](https://github.com/injectionator/n8r-surface/issues/51):
   implement generation, validation, privacy, saving and fresh-chat continuation
   using workspace evidence. Depends on #50.
3. [#52 — Installed-workflow acceptance](https://github.com/injectionator/n8r-surface/issues/52):
   exercise both products, inspect outputs independently, fix observed failures
   and record human acceptance. Depends on #51.

Creating these tasks authorizes neither their implementation nor review readiness,
merge or release. Broader #17 host/live/consumer scope remains separately visible;
finishing this bounded delivery does not automatically complete the parent issue.
