# UC01 handoff to Labs UC11

Status: partial, source-backed handoff on 18 November 2026. Related to
[Surface #96](https://github.com/injectionator/n8r-surface/issues/96) and
[Labs UC11](https://github.com/injectionator/n8r-labs/blob/main/docs/use-cases/11-lab-equipment-controls/README.md).
No live configuration changes or behavioural experiments were performed.

## Evidence and control scope

The private Surface distinguishes source support, historical operator reports,
current access attempts and unverified effective state. Current deployment
selection is not inferred from repository recipes. Source revision:
`2d50313ccdc81d7a0090cc99f2c521db201a6b5f` in n8r-labs.

| Component | Starting evidence | Required access and unresolved question | Candidate reversible experiment, for later authorization |
| --- | --- | --- | --- |
| LibreChat | Retained endpoint YAML declares a private text connector and disables title generation and parameter controls. Compose declares registration/login flags. Passive public configuration and independent repeat returned matching title/login/registration fields. | Public response readback is available; private loaded configuration and authenticated behaviour remain unknown. Distinguish application title from conversation-title generation. | Use the UC11 application-title control only after its binding and baseline are verified. Change a test title, inspect it in LibreChat, restore it and independently read back. |
| Codex Pro path | Provider handler checks the managed catalog and passes the requested model; adapter requests ephemeral threads and fixes effort to low. | Establish current deployed adapter identity, sign-in and supported controls. Catalog inspection can start app-server work; it is not presumed passive. | Compare two available models on a benign, fixed request if UC11 authorizes inference. Restore the original selection. Record request scope; do not claim a persistent service setting or a reasoning-effort writer. |
| Atlas | Historical operator record describes a storage binding and role checks. No current authenticated management read was obtained. | Establish the bound deployment, current roles, tier/backup settings and permitted management route without exposing credentials. | Select a low-impact control on a disposable test resource only after access and impact are understood. No specific Atlas write is preselected; preserve baseline, change/readback/behaviour and restoration evidence. |

Source landmarks: `docs/operations/librechat-vps-codex.librechat.yaml`,
`docs/operations/librechat-vps.compose.yaml`,
`compositions/librechat-vps/provider.ts`, `apps/lab/server/codex.ts`, and
`docs/operations/librechat-vps.md`. Old operator checks are not current receipts.
No target inference, Atlas query, lifecycle command or connection-test operation was run.
The Lab assistant was invoked solely to read and assess the uploaded artifact.

## Consumer handoff boundary

The exact revision 002 BOM selected for the UI attempt has SHA-256:
`69dacf5304ee1fd64522eaf25b112d17ae77d839d15c6df34b5441b0113e57d4`.
Fresh-chat successor revision 003 has SHA-256:
`4bf3884452b624a8d3db81899cb9fe893782e29964260f838d6703e0457822c7`.
Neither has passed Labs import and useful-continuation acceptance.
Current research revision 005 incorporates the subsequent UI/public-readback results;
its SHA-256 is
`7cbdf82608c490feba1945dca353cc8fc97022ba1d23fab44b508e043d30fa5b`.

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
a running Labs UI, and appropriate read-only access. Use the existing installation;
do not publish raw research or credentials.

- [ ] Open the saved brief and map. Expect eight component identities and eight
  source-backed paths, with deployment selection still unknown. Follow the
  connector evidence to both its entry point and provider handler.
- [ ] Open the fresh-chat receipt. Expect revision 002 → 003, the same serial and
  component identities, a provenance correction, and unchanged predecessor hashes.
  This is an agent rehearsal; make a separate human judgement of usefulness.
- [ ] In Labs, open Surfaces and locate a normal external-file opening route.
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
