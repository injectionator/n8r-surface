# Start with what the user has

Use this guide when a newcomer asks how to begin, provide sources or establish
access, or mentions sources this session cannot yet read. It applies across hosts;
no Lab, prepared workspace, repository attachment or live access is required.

## First useful response

Read accessible material before asking for more. A short description is enough
for a provisional map: identify the reported components and connections, their
basis and the consequential unknowns. A document's claim remains a document claim.
If no source is supplied, ask for the easiest starting point: a short description,
an architecture/deployment excerpt or a repository/document link.

Then recommend one useful next source, explain the question it would answer and
help make it accessible. For example, a deployment note's custom gateway points
to its endpoint configuration or entrypoint; those can reveal the next component.
Ask one focused question, not a checklist of every repository, account and host.
Use facts already supplied rather than making the user repeat them. If the user
cannot provide that source, offer an easier alternative and retain the partial map.

Keep a lightweight source/access record in working notes or the journal:
source identity, mentioned/available/read/blocked/deferred, actual access route,
inspected scope and next step. Available means a tool/attachment is present; read
means a successful scoped read occurred. A blocked source needs its reason and
consequence, not repeated retries. These are working-note labels, not new BOM
properties or evidence classifications. Do not turn this record into an intake form.

## Help establish the next access route

Discover the current host's relevant tools and supported connection/upload flows.
Use tools already available within the authorized scope. If a connection is needed,
explain the smallest supported user action; verify access by reading the selected
source afterward. Consult current host help or visible UI rather than inventing
menu names. Installing this skill supplies no repository, SSH or account access.

| User's starting point | Useful next action | What to keep explicit |
| --- | --- | --- |
| Description or document | Read the supplied text/attachment; follow relevant links or ask for one missing section. | Reported architecture, document date/version and unverified deployment claims. |
| GitHub or another remote repository | Read selected files through an authorized connector/API or permitted public web access. For private sources, guide the supported host sign-in/connection flow. | A link or sign-in is not a successful repository read; check repository, revision and permitted scope. |
| Laptop folder | If approved local tools can read it, use the selected folder. Otherwise help the user upload selected files or use a supported connected-computer route. | A web Project's uploaded files are snapshots, not a live folder mount or automatic synchronization. A local path alone is inaccessible remotely. |
| VPS/SSH clue | Establish target, inspection scope and an available authorized execution route. Host/user/port and an existing connection alias may identify it; ask only for missing details needed next. | An IP or SSH command supplies no credentials, network reachability or shell tool. Existing laptop access is not inherited by a cloud chat. |
| Existing admin UI/API | Use an approved scoped read interface and the user's supported sign-in handoff. | Public views may reveal only a small part of the setup; diagnostic operations can have side effects. |

For laptop uploads, suggest the smallest useful selection: a README section,
source tree excerpt, deployment manifest with sensitive values removed, or the
entrypoint named by existing evidence. Explain why each requested file matters.
Offer an archive only if the host supports inspecting it and the user prefers it;
do not require the whole repository. Preserve relative paths and ask for revision
or capture identity when available. Uploads and connected folders are alternatives,
not mandatory steps or permission to publish code.

For a VPS, first determine where commands could run: an authorized tool/service,
an explicitly connected computer with permitted SSH, or the user's own terminal.
Only claim SSH capability after checking the actual tools and approved connection.
Keep authentication in the host's supported flow or existing credential store;
never request passwords, tokens or private keys in chat or uploads. A key offered
in chat should be declined with a concrete alternative. Do not disable host-key
checks, expose SSH publicly or add credentials/agents to make onboarding work.
If the host cannot provide a supported secure access route, say so and continue
with available documents/source or the human-assisted route below.

## Human-assisted evidence

When direct access is unavailable and the user wants to continue, offer a small
read-only collection step they can perform in their own environment. Establish
the target/runtime first. Explain what it reads, the expected safe fields and
what finding they could support. Filter before output; avoid raw environment,
connection strings, logs and complete inspection/config dumps. Ask them to review
for sensitive content before sharing. Do not hide a state change in a diagnostic
command. An access denial remains a blocker, not a reason to bypass permissions.

Treat returned material as user-supplied evidence, with reported target, time,
command/scope and redactions where available. Do not claim the agent accessed the
host or independently observed the command. Missing metadata limits the claim;
keep useful partial findings rather than inventing timestamps or source hashes.

## Saving and returning

Research readiness is separate from local workspace creation. Before promising a
save, check the installed helper, supported Node runtime, writable destination and
host file-delivery tools. For explicit local workspace setup, use
[workspace operations](workspace.md); do not run its local-folder procedure merely
because a user starts research in a web Project.

If helper execution and file delivery are available in the cloud, use
[Surface persistence](cyclonedx.md), read back the outputs and provide the actual
supported download/attachment links. Distinguish cloud files/downloads from a
local vault and from a Project source. Do not promise persistence across chats or
claim an attachment action that has not occurred. Deliver retained evidence with
the Surface when its relative references need it, or disclose the missing sources.

If execution or delivery is unavailable, provide a useful copyable map and notes;
name the specific blocked save step. Do not call prose a validated saved Surface.
Explain what the user should retain and supply on return. Reopening starts from
supplied artifacts and rechecks access; it does not assume local keys, connections
or research were carried into a fresh session.
