# Installed Surface skill: two-product usefulness check

Related to [#52](https://github.com/injectionator/n8r-surface/issues/52).
This checks the standalone Surface skill before CLI integration. The products
are research subjects, not new integrations or deployment targets.

## Run identity and scope

- Date: 8 November 2026.
- Skill: 0.1.11, source commit `8e4cb3ade3c9e5ca59ab0a37838ccaf874b7fc42`
  from PR #54. An isolated Codex marketplace installation matched every tracked
  plugin file to that commit before research.
- Host: Codex CLI 0.166.0 app-server, ChatGPT sign-in, configured model
  `gpt-6-astra`, Node 26.13.0. Fresh ephemeral sessions had no prior turns;
  previous-thread and receipt access were independently denied.
- Source access: pinned public file copies, read-only research; no source
  execution, additional fetches or deployment inspection. Each product was
  bounded to model API, storage and identity connections.
- Configuration and reviewer inputs were fictional test fixtures. They do not
  describe a real deployment or constitute human acceptance.

| Product | Pinned source | Files supplied |
| --- | --- | --- |
| LibreChat | [f4154b6](https://github.com/danny-avila/LibreChat/tree/f4154b649efa37e1345ccc517a4d8d1ed2178c82) | README, database connection, OpenID strategy |
| Open WebUI | [b7a005e](https://github.com/open-webui/open-webui/tree/b7a005e5a5c0c0d869f2aebf4b8f051c5fb37245) | README, SQL database layer, OAuth implementation, model API router |

## Interaction exercised

1. Ask the installed Researcher which model API, storage and identity connections
   a reviewer should examine; save a checked Capability with source hashes and
   bounded evidence. Do not infer selected targets from supported options.
2. Supply a fictional configuration declaring Model Service A, Database Service A
   and Identity Service A. Permit only six named nonsecret fields to be projected
   from a fixture containing synthetic sensitive sentinels. Supply a second
   same-revision handover note declaring Identity Service B.
3. Give a scripted Test reviewer preference for Identity Service A in a future
   revision, explicitly leaving the current contradiction unresolved and runtime
   verification deferred. Save a Bound Surface; retain both source claims and
   keep the reviewer decision separate from evidence.
4. Start a fresh session, reopen the saved Bound artifacts and supply a later
   configuration selecting Model Service B. Save a successor with stable
   identities, exact parents, unchanged prior files, retained decision and
   unresolved identity conflict. Independently read all saved directories.

Shell/file tools and Node are permitted. Only the `n8r-surface` product executable
is prohibited. The initial fresh-session prompt mistakenly said “no CLI use”;
both sessions declined file access, accurately reported the blocker and created
no successor. Those receipts are retained. The retry clarified this instruction
in new sessions without changing skill code or overwriting previous artifacts.

For a repeat of the corrected revision step, start a fresh Researcher chat with
that trial's workspace selected and send:

```text
Reopen bound-001 and read change.md. Shell/file tools and Node.js are allowed,
including the installed scripts/artifacts.mjs helper. Do not invoke the
n8r-surface product executable. Save a checked successor in bound-002 selecting
Model Service B. Preserve identities, decisions, unresolved identity evidence,
exact parent references and all previous files. Retain the previous research
as a dependency. Use the existing safe projection; do not expose private fields
from instance.json. Saving is authorized. Read back both revisions, compare
prior-file hashes, return output links and stop.
```

## Useful findings sampled against sources

| Product | Finding | Independent source check |
| --- | --- | --- |
| LibreChat | Model integrations are documented possibilities, not an observed request path. | README lines 74–99 |
| LibreChat | Storage uses a Mongoose/MongoDB connection; stored AI data and controls remain unverified. | `api/db/connect.js` lines 1–27 and 43–74 |
| LibreChat | OIDC discovery and login depend on configuration, including PKCE/nonce settings. | `api/strategies/openidStrategy.js` lines 954–1006 |
| Open WebUI | Chat/Responses routing sends a POST to the selected connection. | `backend/open_webui/routers/openai.py` lines 1506–1587 |
| Open WebUI | SQLAlchemy has SQLite/PostgreSQL paths and rejects SQLCipher in async URL conversion. | `backend/open_webui/internal/db.py` lines 230–250, 264–285 and 450–468 |
| Open WebUI | OAuth identity can affect local authority; effective settings remain unknown. | `backend/open_webui/utils/oauth.py` lines 168–190 and 1618–1650 |

These are bounded agent checks of cited claims, not exhaustive source review,
runtime proof or security certification. The developing agent did not author
the Researcher's findings or saved bundles.

## Observed result

Both products passed the bounded agent rehearsal on the unchanged 0.1.11 skill.
No product-specific code or new skill implementation was needed.

| Independent check | LibreChat | Open WebUI |
| --- | --- | --- |
| Capability, Bound and successor helper readback | Exit 0, checked | Exit 0, checked |
| Model target revision | A to B | A to B |
| Database target | A retained | A retained |
| Conflicting identity declarations | A and B retained | A and B retained |
| Scripted reviewer decision | Exactly preserved | Exactly preserved |
| Research/Surface parent references and Capability pin | Exact match | Exact match |
| Files present before successful revision | 27 unchanged | 24 unchanged |
| Source hash comparisons, including repeated dependency references | 19 matched | 28 matched |
| Files scanned for synthetic sensitive sentinels | 68, no matches | 62, no matches |

The owned raw sentinel input was excluded from the leak scan; artifacts,
projections and execution receipts were included. This is evidence about those
specific sentinels, not complete secret detection. All supplied public source
copies remained byte-identical. Successor checks independently compared node and
relationship identities, role endpoints, decisions, pins and parent digests.

The initial harness recorded completed *turns* before checking whether outputs
existed. That was not artifact success: independent readback found both missing
successors. The retry requires successful helper readback before recording success.
The blocked attempts and corrected requests remain in the private evidence.

Private evidence retains the installation inventory, source identities/hashes,
requests, execution receipts, before/after inventories, independent helper output
and per-product verification reports. Saved briefs, HTML and JSON were read back;
no screenshot or desktop visual acceptance is claimed.

## Human acceptance and completion boundary

**Agent rehearsal: Pass. Human acceptance: pending.** The test-reviewer correction
was scripted input, not a PM decision about a deployment. There is no remaining
skill-code blocker identified by this bounded check. Broader research coverage,
runtime use, CLI integration and Labs compatibility have not been established.
No further presentation polish or additional product trials are required by this
increment. Review and merge of PR #54 remain separate decisions.

For the human check, use the two final `bound-002/brief.md` links supplied with
this run's handoff; no installation or new research is necessary:

- [ ] Read each brief. It must explain Model Service B, the retained database
  target, the unresolved identity disagreement, evidence and unknowns.
- [ ] Open its research HTML or JSON if a claim needs inspection. The reviewer
  preference must remain separate from source evidence and actual runtime use.
- [ ] Report **Pass / Fail / Blocked** for usefulness. For Fail, name the unclear
  or unsupported claim; for Blocked, name the inaccessible file or missing context.

Accepting this evidence completes the human usefulness decision for this scope;
it does not authorize merge, publication or deployment. Keep #52 WIP while its
implementing PRs await review/merge, following the repository's issue policy.
