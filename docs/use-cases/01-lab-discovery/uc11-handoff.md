# UC01 handoff to Labs UC11

Status: partial, source and runtime evidence handoff on 18 November 2026. Related to
[Surface #96](https://github.com/injectionator/n8r-surface/issues/96) and
[Labs UC11](https://github.com/injectionator/n8r-labs/blob/main/docs/use-cases/11-lab-equipment-controls/README.md).
No live configuration changes or behavioural experiments were performed.

## Evidence and control scope

The private Surface distinguishes current source, Docker launch configuration,
mounted-file contents and dated runtime state. On 18 November, independent SSH
readbacks identified the same running, healthy LibreChat and connector containers.
Mounted configuration selects the connector and Atlas; this does not prove successful
inference, authenticated storage or complete loaded configuration. Local source
revision remains `2d50313ccdc81d7a0090cc99f2c521db201a6b5f` in n8r-labs;
concurrent Labs import edits are preserved and outside this investigation.

| Node or edge | What is established | Control significance and remaining question |
| --- | --- | --- |
| LibreChat | Identified container filesystem reports v0.8.8. Message route source installs JWT authentication. Mounted YAML selects the private connector and disables title generation and parameter controls. | Application identity and caller context are distinct from connector credentials. Browser JWT, conversation ownership and agent checks have a source trace. Request/model-spec prompt prefixes can become instructions; effective model-spec policy and complete enforcement remain unverified. |
| LibreChat → private connector | Mounted endpoint selection and default model are established. Connector container has no host-published port; LibreChat is loopback-published. | UI parameter restrictions do not prove API enforcement. Docker publishing is not a full ingress/egress policy audit. |
| Connector → Codex → managed service | Local source validates bearer authorization, bounded text, catalog membership and serialized requests. Adapter requests ephemeral/read-only execution, checks returned policy and fixes effort low. Mounted bundle and executable hashes identify deployed files. | Mounted bundle inspection confirms bearer, context conversion and returned-policy checks in source; running-memory identity and enforcement remain unproved. Current sign-in, Pro entitlement, catalog and inference remain unverified. Model-catalog inspection can start app-server work. |
| LibreChat → Atlas | Safe launch-configuration projection selects an Atlas-domain MongoDB target. Deployed connection source uses Mongoose and maps pool options. | Authentication database does not establish database role. Numeric minimum zero is omitted by the inspected option construction; effective driver values remain unknown. TCP socket state does not prove authenticated database use. |
| LibreChat → local volumes | Writable data, uploads, images and skills mounts exist alongside Atlas. | Restore and retention plans must account for both destinations; contents and successful persistence were not inspected. |
| Host → containers | Non-root user, read-only root filesystem, capability drops, resource limits and no-new-privileges are configured. | Writable mounts and upstream access remain separate authorities. Configuration is not escape-resistance or availability-test evidence. |

## Caller-context and management boundaries

The source trace is: authenticated browser request → agent/conversation checks →
parsed endpoint options and model-spec processing → ephemeral instructions →
system/developer message serialization → separately authenticated connector →
Codex developer instructions. Persistent agents load instructions from database
instead. The separate LibreChat Agent API has its own authentication/permission
chain; browser JWT checks cannot be presumed to cover it.

The connector retains user/assistant history as reference text while combining
system/developer content into instructions. Authentication authorizes a caller;
it does not establish that caller text is trusted policy. A controlled test should
capture synthetic requests at each boundary and verify identity, role conversion,
policy precedence and rejection before dispatch, using the exact relevant build.
No prompt-injection exploit or runtime bypass was demonstrated.

Atlas management navigation adds a distinct observed edge from the operator browser.
It does not grant database connectivity or authorize changes to network policy.
Management-plane settings and application database behavior need separate evidence.

## Codex and LLM control scope

The mounted connector source launches app-server workers over stdio with a bounded
child environment, temporary working directory and command-line policy overrides.
It reads and validates effective configuration before account/catalog inspection.
Catalog inspection closes its worker; generation uses another session. These are
source-described effects, so a model-list GET is not used as a passive diagnostic.

Model selection is per request and checked against the catalog. Reasoning effort
is fixed in adapter code, rather than established as a writable service setting.
The configured default identifier does not identify an immutable model artifact.
Returned policy, event correlation, forbidden tool requests, cancellation and final
completion are useful isolated-test boundaries. The SSE output is assembled after
completion; incremental token timing should not be an assumed consumer contract.
Ephemeral workers/threads are distinct from application storage and provider retention.

The current snapshot showed no app-server process. A bounded log projection found
no recognized outcome events; neither result establishes no past inference.
Current sign-in, plan, catalog and inference remain unverified. Caller-effective
model specs and memory configuration remain unverified because actor-specific
configuration can differ from the mounted base. Signed-in Settings revealed user
preferences, but not that complete effective server policy. No live worker was started for these checks.

## Candidate controlled tests

These are proposals for separately authorized isolated experiments. No target
inference, Atlas query, lifecycle command or connection-test operation was run.
Each test needs a selected Surface revision, exact deployed identities, expected
outcome, correlated receipt and restoration or cleanup readback. A different build
requires rechecking the applicable source claims.

| Target and prerequisite | Candidate input/change | Expected proof and restoration |
| --- | --- | --- |
| Connector request boundary in an isolated instance | Missing bearer credential; unsupported tool-shaped or oversized request using a synthetic credential and payload | Rejection before provider dispatch, verified by a test double or correlated events. No real prompts or credentials. Remove the test instance afterward. |
| LibreChat configuration binding in a disposable setup | Change application title through a verified UC11 binding | Visible title changes, then restore the baseline and independently read it back. Application title and generated conversation titles are different controls. |
| Model selection, after authorized catalog/inference access | Same benign request with two available models | Correlate requested and returned model plus completion. Restore original selection; this is per-request selection, not a persistent reasoning-effort writer. |
| MongoDB options in an isolated matching build | Compare omitted, zero and positive pool minimum with synthetic connection settings | Inspect constructed/effective driver options and bounded connection behavior. Do not assume declared environment text equals an effective option; restore baseline and remove disposable data. |
| Persistence and recovery after Atlas role/backup policy readback | Synthetic conversation and attachment in a disposable database and volume set | Identify which store receives each artifact, then exercise approved backup/restore and cleanup. No production role or backup changes are preselected. |

Atlas management UI reads are now available after human sign-in and project
selection. Role, network and cluster recovery settings were observed and retained
privately. Process-start cluster/principal correspondence is now confirmed through safe
comparisons and DNS membership. Effective database operations, recovery behavior
and permitted disposable resources remain untested; further Atlas depth is deferred
by user direction. Existing
credentials were neither extracted nor used for database queries. Source landmarks
include `api/db/connect.js` in the identified container, and the local
`compositions/librechat-vps/provider.ts`, `apps/lab/server/codex.ts`,
`codex-session.ts` and `codex-config.ts`. Private receipts retain exact hashes,
observation times, inspected ranges and limits.

## Consumer handoff boundary

Deferred to separate Labs import work by user direction. This acceptance item
does not block component discovery; its historical result is not a pass.

The exact revision 002 BOM selected for the UI attempt has SHA-256:
`69dacf5304ee1fd64522eaf25b112d17ae77d839d15c6df34b5441b0113e57d4`.
Fresh-chat successor revision 003 has SHA-256:
`4bf3884452b624a8d3db81899cb9fe893782e29964260f838d6703e0457822c7`.
Neither has passed Labs import and useful-continuation acceptance.
Current research revision 012 incorporates runtime and node/edge findings;
its SHA-256 is
`facb47205f103c4f30e4a972e1a9ed1c4c6c3face4973c51c0f97a77f36fbacb`.

The running UI became reachable after user startup. The initial upload was
blocked by browser permission; after the user enabled it, the exact file arrived.
The normal file preview displayed the matching digest and the assistant recovered
the graph and limitations. It reported no external-BOM open/import operation and
refused to assign a replacement identity. Its answer persisted in chat; no Surface
successor was saved. A generic file preview is not a Surface import.
Do not overwrite the existing Labs Surface bearing a similar use-case name.
Keep source serial, component identities, evidence and predecessor history visible;
record any mapping loss explicitly. Do not substitute a freshly generated inventory.

Source inspection found host serial reassignment in the assistant save adapter.
This is a separately scoped consumer question: provide a supported external-BOM
opening and continuation path that preserves provenance or reports its mapping.
It is not authorization to implement Labs changes. No actual mapping loss has yet
been measured because the artifact was attached as reference data, not imported as a Surface.
Runtime metadata identified Bun 1.4.4 in development mode; it did not establish
the loaded consumer commit or package digest. The checked-out vendor archive
digest independently matched its provenance record.
The consumer also lacked the locally referenced receipt and predecessor bytes;
its source hashes were not independently reverified there.

## Human verification task list

Prerequisites: the maintainer supplies the private saved revision and receipt,
and appropriate read-only access. A running Labs UI is needed only for the separate
import acceptance. Use the existing installation;
do not publish raw research or credentials.

- [ ] Open the saved brief and map. Expect ten nodes and thirteen
  paths, preserving earlier identities and adding a configured-default model node.
  Its selection must say configured default, not observed inference or availability.
  Hosting, connector, Atlas and volume selections have configuration evidence;
  inference and authenticated database use remain unproved. Follow each important
  claim to its source/configuration receipt and check the observation time.
- [ ] Open the fresh-chat receipt. Expect revision 002 → 003, the same serial and
  component identities, a provenance correction, and unchanged predecessor hashes.
  This is an agent rehearsal; make a separate human judgement of usefulness.
- [ ] Separately, when the import work is ready: in Labs, open Surfaces and locate
  a normal external-file opening route.
  In the exercised UI, Lab → Tools → Files and notes → Attach file was available.
  Select the exact supplied BOM. Expect either a supported Surface opening or an
  explicit limitation; merely attaching or previewing JSON does not pass.
- [ ] If opened as a Surface, inspect components, connections, uncertainty, journal
  and source evidence. Continue one useful question, save, reopen the result and
  compare identities, predecessor digest and retained evidence. Record losses.
- [ ] Return **Pass / Fail / Blocked** for graph usefulness, fresh-chat continuation
  and Labs continuation separately, with artifact digest, consumer build identity,
  actual interaction and private receipt location. Missing import support or access
  is Blocked; silently replaced identity or missing evidence is a failure to retain.

No cleanup of earlier research is required. Preserve the imported artifact and
continuation evidence. Any test-only attachment cleanup is a separate user choice.

Signed-in Settings sections expose memory and prompt preferences. The initial
category-only inspection was incomplete and is corrected in revision 011. The
actor-effective server policy gap remains; no settings or messages were submitted.

## Saved memories and selected prompts

Revision 012 traces two source-supported input paths. Selected production prompts
undergo variable substitution and enter ordinary User-message submission. The
observed auto-send preference means selecting one can submit immediately; discovery
did not select a prompt. Saved memories require user-preference, permission and
resolved-configuration gates, are queried by user and agent partition, and can join
additional instructions. The connector combines system/developer messages into
Codex developer instructions while retaining user/assistant history separately.

These are source paths, not captured live transfers. The enabled memory preference
does not establish stored memory, effective server policy or inclusion in a request.
Codex's own disabled memory feature does not exclude memory text supplied by its
caller. No exploit, filtering effectiveness or isolation guarantee was demonstrated.
The private Surface retains ten nodes and thirteen paths with stable identities;
new memory and prompt paths have unknown selection and no observed transfer.
BOM SHA-256: `facb47205f103c4f30e4a972e1a9ed1c4c6c3face4973c51c0f97a77f36fbacb`.

### Additional isolated proofs

- Use synthetic memory markers with two users and two agent partitions. Capture
  outbound context and require markers only from the authorized partition. Vary
  opt-out, USE permission and disabled configuration; require marker exclusion.
- Distinguish an empty eligible memory pool from a failed memory read. Verify the
  memory preamble and failure handling using a test double, without real records.
- Use a synthetic production prompt with variables. Capture the resulting user
  message, prompt revision and substituted text; compare auto-send on/off without
  sending any real prompt to a live provider.
- Capture both the connector input and Codex thread/turn arguments. Verify role
  placement, bounds and rejected tool requests. A response alone does not prove
  exclusion or pre-dispatch rejection. Retain effective settings and exact builds.

These tests are proposals, not executed acceptance. Clean up disposable users,
records and instances and independently verify the restored baseline.
