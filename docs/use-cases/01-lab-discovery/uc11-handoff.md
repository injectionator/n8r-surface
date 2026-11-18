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
| LibreChat | Identified container filesystem reports v0.8.8. Message route source installs JWT authentication. Mounted YAML selects the private connector and disables title generation and parameter controls. | Application identity and caller context are distinct from connector credentials. Complete ownership checks and who can supply system/developer context remain to be traced. |
| LibreChat → private connector | Mounted endpoint selection and default model are established. Connector container has no host-published port; LibreChat is loopback-published. | UI parameter restrictions do not prove API enforcement. Docker publishing is not a full ingress/egress policy audit. |
| Connector → Codex → managed service | Local source validates bearer authorization, bounded text, catalog membership and serialized requests. Adapter requests ephemeral/read-only execution, checks returned policy and fixes effort low. Mounted bundle and executable hashes identify deployed files. | Source behavior is not proven equal to the running bundle. Current sign-in, Pro entitlement, catalog and inference remain unverified. Model-catalog inspection can start app-server work. |
| LibreChat → Atlas | Safe launch-configuration projection selects an Atlas-domain MongoDB target. Deployed connection source uses Mongoose and maps pool options. | Authentication database does not establish database role. Numeric minimum zero is omitted by the inspected option construction; effective driver values remain unknown. TCP socket state does not prove authenticated database use. |
| LibreChat → local volumes | Writable data, uploads, images and skills mounts exist alongside Atlas. | Restore and retention plans must account for both destinations; contents and successful persistence were not inspected. |
| Host → containers | Non-root user, read-only root filesystem, capability drops, resource limits and no-new-privileges are configured. | Writable mounts and upstream access remain separate authorities. Configuration is not escape-resistance or availability-test evidence. |

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

Atlas management access, current database roles, network allowlisting, tier,
backup/retention policy and allowed disposable resources remain gaps. Existing
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
Current research revision 006 incorporates runtime and node/edge findings;
its SHA-256 is
`f35b12b4c716cf1ea6408a9d6277193ee4080ae4512b6824b513892ff75df2c9`.

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

- [ ] Open the saved brief and map. Expect nine nodes and nine
  paths, preserving the original eight node identities and adding local storage.
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
