# AI Surface discovery guide

The goal is an evidence-backed graph of AI-relevant components and connections,
not a complete application inventory. Follow how information enters, reaches
models/tools/data, and produces effects. Include supporting storage, identity,
infrastructure and observability when they explain those paths or boundaries.
Settings are supporting evidence: inspect them when they change a node, edge,
route, authority, data flow or a material uncertainty about the graph.

This is provisional research guidance within the AI Surface Model, not another
model, a universal schema or a mandatory list of components.

## Start with the available evidence

Establish the task: **discover** a graph, **continue** saved research, or
**reconcile** an existing Surface with current evidence. Honor a bounded question.
For broad requests, identify the application boundary and shallow AI-related
connections before detailed subsystem research. Degree is relative to the start
node; follow a useful route beyond one hop without imposing a depth ceiling.

| Available material | Use and limit |
| --- | --- |
| Unknown folder | Inspect structure, entry points and manifests to locate evidence of AI relevance. Unread files and dependency names are clues, not findings. |
| Code without docs | Follow calls, configuration readers and dependencies relevant to graph edges; runtime state remains separate. |
| Docs without code | Use navigation, headings and examples to map documented capabilities; implementation and effective setup remain unverified. |
| Local/remote documentation | Follow relevant links into source or setup material. Record the URL, applicable version, section and inspection time; current vendor docs may describe another release. |
| Product guide or earlier research | Reuse navigation, evidence and gaps after checking identity, scope and revision. Distinguish inherited from rechecked findings. |
| Surface definition(s) | Establish each composition's identity and claims. Compare applicable claims; omitted detail is not absence. |
| Supplied configuration | Establish environment, revision, defaults and overrides when relevant. An example is not a selected setup; a file is not proof it was loaded. |
| Human input | Record scoped intent, corrections and decisions separately from source or runtime evidence. |
| Live UI/API observations | Identify the target environment and dated observed settings; reading a setting does not exercise its connection. |

Use what is available. Record unavailable, unreadable, excluded or truncated
material without inventing its contents. A locator does not grant access.
Enough evidence for the user's question, with visible gaps, is a useful stopping
point; obtaining every source type is not a completion requirement.

## Reuse product knowledge

Look for related material in supplied notes, selected local libraries or a
connected collection that the host can actually search. Do not scan unrelated
folders/accounts or presume an n8r-labs connection. A simple index of versioned
documents and links is sufficient; this skill creates no registry service.

Distinguish a product guide (capabilities/navigation), a particular selected
Surface (composition), and research (evidence/decisions/gaps). Match repository
identity, forks, releases and scope rather than a display name alone. An older
guide can direct reads without establishing current behavior. Several Surfaces
may select different providers; never union their selections into one deployment.
Retain provenance and contradictions. A library's origin is not automatic
authority, and a note repeating a source is not independent corroboration.

When saving, retain reusable product findings separately from private deployment
choices. Making private research public requires its own authorization.

## Follow graph clues

Documentation indexes and navigation often provide the first paths. Follow
relevant headings, setup examples and links into code. When links are absent,
search distinctive configuration keys, symbols and route names. If documentation
is absent, use entry points and manifests. Read scripts as evidence; do not run
them merely to discover architecture.

| Area | Clue leads to next useful read |
| --- | --- |
| Inputs and effects | Web/chat UI, API, CLI, bot, upload, webhook or scheduled task → handler → AI processing and returned result/action. A generic UI alone is not AI evidence. |
| Models and inference | Inference call or endpoint → configuration source → proxy/router/aggregator → service → model identity. Cover embeddings, speech, vision and other AI operations, not only chat. A provider SDK or compatible API does not identify the service behind a custom URL. |
| Agents and orchestration | Prompt/workflow/agent definition → context assembly, model selection, delegation, tools and stopping conditions relevant to connections. |
| Tools and actions | MCP or other integration → host/client/server role, exposed/consumed capability, transport, executor, target and authority. SDK installation alone does not establish a configured connection. |
| Knowledge and retrieval | Upload/source connector → parsing/chunking → embeddings/index/store → retrieval/reranking → model context. RAG need not be a separate server; identify who provides and consumes each capability. |
| State and storage | Conversation, memory or document persistence call → storage adapter → configured store. Include a database such as MongoDB for its AI-related data role; avoid unrelated application tables. |
| Identity and controls | Login/provider gate, permission check or approval → identity/authority boundary governing relevant access and actions. OIDC enablement and issuer can explain an edge; credential values do not belong in the graph. |
| Observability and evaluation | Tracing/evaluation hook → instrumentation → destination and covered AI operations. A logging dependency alone does not establish a live telemetry connection. |
| Software identity and delivery | Manifest, lockfile, entry point, container or deployment declaration → relevant component/version/runtime and configuration binding. These support graph identity; do not enumerate every package or setting. |

For example, `package.json` suggests JavaScript package/tooling context. Inspect
scripts, engines, workspaces and relevant imports before inferring a runtime;
it may describe browser tooling alongside a Python service. Keep application,
package, source revision, deployed build and model versions distinct.

A CRM can have no identified AI capability in the inspected scope, or participate
as an evidenced tool/data source in a larger AI Surface. Neither a database nor a
generic API alone establishes AI membership. Report scoped negative findings and
insufficient evidence distinctly; do not force an AI graph into every repository.

## Reconcile a Surface with current sources

Preserve the supplied bytes and establish format/version, vocabulary, component
identity, scope and intended versus observed meaning. Only claim validation for
a supported format actually checked. Unrecognized meanings remain unsupported;
successful JSON parsing does not make arbitrary Surface JSON understood.

Use the graph as the comparison spine. For each relevant node/edge or supporting
setting, report: prior claim and basis; current evidence and applicability;
agreement, difference, additional discovery, conflict, unknown or unsupported
meaning; and the next useful check. These are prose comparison outcomes, not new
contract states. Missing search hits or omitted attributes do not establish that
a node/edge was removed. Preserve stable identities where evidence supports them.

Compare like with like: documented support, implemented support, human intent,
declared configuration, observed effective configuration, reachability and
exercised behavior answer different questions. Example: a baseline selects OIDC;
current code supports OIDC; a staging file declares it disabled. That can establish
a declared difference for the same staging target, but not its running state or
that the historical baseline was wrong. Locate applicable override/effective
evidence if that distinction matters. Do not dump unrelated settings into the diff.

Save the comparison as research. A proposed successor must preserve the original,
its evidence and unresolved claims. For requested checked Capability/Bound JSON
and research HTML, follow [standalone artifacts](artifacts.md). The skill does
not modify deployments.

## Inspect live connections with the human

Identify the user's target before listing runtime resources. For source-only
research, continue source analysis without runtime inventory. If inspection is
requested but the target is unknown, ask for its identity or location while
continuing the source work; do not expand into unrelated projects or contexts.

Filter at collection time, before stdout, stderr, tool results or saved evidence.
Use a server-side target filter and a narrow field projection when available.
If only a broad response is available, capture it inside the local process,
select the target and safe fields there, then emit only that projection. Report
sanitized failure categories without dumping raw responses or stderr. Do not
print unrelated names, images, IDs, mount paths or Compose file locations and
then redact them only in the saved artifact. No match means only that the scoped
query did not identify the target; it does not establish global absence.

Use live inspection when the user's task calls for it and the host provides
authorized access. Establish the selected application, environment/tenant and
question from available context; ask only for missing information needed to
identify the target. Prefer a suitable connected read tool or documented admin
API; use browser/computer tools where they provide the required access. Respect
the tools' scopes and restrictions. A blocked route must not be bypassed.

Let the user complete password, MFA or private sign-in flows directly using the
host's supported handoff. Do not ask for credentials in chat, extract sessions,
reveal masked secrets, export credentials or copy passwords/keys/tokens into
notes. Prefer narrow nonsecret fields or settings views to raw configuration
dumps. If incidental secrets appear, do not repeat or retain them. Avoid saving
screenshots or payloads containing secrets; record a sanitized observation and
its location, with the resulting evidence limitation.

Ask graph questions: is this connection enabled; which service/issuer is the
target; what role, protocol and authority does it use? A masked configured-secret
indicator may establish presence, never credential validity. Keep target identity
as specific as needed in private notes; redact sensitive infrastructure details
from portable/shared output and keep the stable component ID.

Remain read-only: do not toggle/save settings, reveal secrets, rotate keys,
create clients or invoke a connection test as part of inspection. Those are
separate user tasks. Do not invent API endpoints or assume any product exposes
all its configuration through an admin UI.

Record the actual page/section or API operation, environment, time, available
version and nonsecret result. Distinguish an editable stored setting from a
runtime-effective setting. Re-read the relevant view/field when verifying the
observation; inaccessible fields remain unknown. Keep source declarations and
earlier observations even when they disagree. Live settings are dated evidence,
not proof of a successful login, inference call, database query or complete setup.

## Present and retain the graph

Lead with a compact graph or edge table: stable components, directed/purposed
connections, evidence basis and unresolved endpoints. Put supported alternatives
in a separate view/list from selected composition. Label a connection as declared
only when an applicable declaration supports it; keep possibilities, inferences
and unresolved clues explicit. Do not turn a UI settings read into an exercised edge. Include shared
components and useful deeper routes without inventing separate services for every
route, configuration key or package. Keep graph-relevant settings beside the edge
they explain, followed by evidence, coverage and the next consequential question.

Use the [working-note convention](working-notes.md) for durable progress. Sources
and observation summaries may be incomplete; a successful save does not establish
runtime behavior, universal compatibility or security certification.
