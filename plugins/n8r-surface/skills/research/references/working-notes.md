# Working research notes

Use Markdown for the first portable research increment. These are readable
working notes, not a released interchange schema or a validated experimental
HTML/Surface artefact. Use the user's requested prose format when practical;
retain the same evidence and limitations. Do not impose a large empty template.

## Where notes live

Use a user-selected destination first. For work explicitly scoped to a recognized
Surface workspace, keep new notes under `research/<source-slug>/` within that
workspace, creating directories only on an authorized save. Do not redirect that
work to a global vault or the default below. When continuing a supplied note,
retain its folder unless the user asks to move it. Workspace setup itself creates
no notes or content directories. When an applicable vault convention places
Surface descriptions under `surfaces/<source-slug>/`, propose a numbered file
such as `surface-draft-001.md` there. A save offer does not create directories or
files; wait for acceptance. Without that convention, use the default below for
the same Markdown working draft. When continuing a saved note, use its
folder unless the user requests a move. Otherwise, on a host with a persistent
user-owned local filesystem, use:

```text
~/Documents/n8r-surface/research/<source-slug>/<topic>-001.md
```

Derive short lowercase hyphenated slugs from the source and question. For a
LibreChat authentication investigation, use `librechat/authentication-001.md`.
Resolve the user's actual home directory through the host, expand `~`, and show
the absolute folder and filename before writing. Create missing directories as
part of an authorized save. Keep that local locator in the conversation, not in
portable note content. Do not treat a temporary execution container as the user's
persistent filesystem. If local saving is unavailable, explain that limitation
and offer a named Markdown download or text without claiming the default exists.

List existing notes for that topic first. Use the next unused three-digit number
(`002`, `003`, and so on; grow beyond three digits if needed). An existing filename
is never permission to overwrite. For continuation, read the predecessor and any
human edits, name it in the successor and record the change. Recheck its bytes
before saving; if they changed, reread and reconcile before choosing a new output.
Check that existing notes describe the same source before continuing them;
matching directory names alone do not establish source identity.

Provide the actual saved file as a clickable link after readback. On a local
host, use an absolute file link. The user should be able to open it without
searching the plugin cache or scrolling back through tool output. Skill removal
must leave this research folder and every previous note intact.

## What a note retains

A saved note should let another person or a fresh chat continue the task:

- Identify the question, scope, date, skill version and host/tool capabilities
  actually used. Do not guess a hidden model ID or application version.
- Identify the supplied sources using portable relative names or public locators.
  Record available revision/version information and exact hashes for inspected
  files when supported. Explicitly mark unavailable identity evidence.
- Lead with the partial AI Surface graph or edge table, stable component labels
  and evidence locations. Keep supported possibilities separate from selected
  connections. Include only settings needed to explain the graph, not an app-wide
  configuration inventory.
- Preserve conflicting claims, unknowns, coverage limits and scoped absences.
- Retain human decisions and unanswered questions separately from source evidence.
- State what was actually read or exercised and what remains to be done. Include
  **Recommended next steps** as described below, and a useful next question when
  a user decision is needed.

Keep source links usable when the notes are moved, or explain what accompanying
source files are needed. Do not copy whole repositories or credentials into the
notes. A source digest identifies bytes, not truth, completeness or compatibility.

## Recommended next steps

Include a **Recommended next steps** section in the latest Surface note for the
same source and scope. If no Surface note exists, include it in the latest research
note. A Surface note here is a saved prose description of the Surface; this rule
does not add validated structured-output support or require creating one.

For each recommendation, state:

- **Next investigation:** the concrete question or connection to investigate.
- **Why it matters:** which uncertainty or user decision it would resolve.
- **Where to resume:** the relevant source file/section, component ID, saved note
  or permitted view, plus any access or missing evidence needed to proceed.

Use portable references, not local absolute paths or credentials. For example:

> **Next investigation:** establish the selected document-search target.
> **Why it matters:** the optional search path has no address in the supplied
> settings, so its selected connection remains unresolved.
> **Where to resume:** `current.env`, `DOCUMENT_SEARCH_URL`, and `system.md` →
> Uploaded documents; request applicable deployment settings if available.

When continuing, read this section alongside the predecessor and human edits,
re-establish source identity, and use it to choose the next investigation within
the user's current scope. Recommendations are proposed work, not permission for
new access or evidence that a connection exists. If the needed evidence is
unavailable, retain the blocker and a concrete resumption point.

In the saved successor, update the section to reflect what was resolved, what
remains and the next useful investigation. Explain a changed priority or superseded
recommendation briefly. Preserve earlier notes unchanged. If an older note has
no recommendations, derive them from its supported gaps and current evidence in
the successor; do not retrofit the predecessor. If no further investigation is
needed within scope, say so and explain why rather than inventing work.

## Save and read back

If the destination already exists or changed since it was read, stop that write
and propose a new file or a reviewed merge. Do not claim atomic guarded storage
or byte-conflict guarantees that the host has not provided.

After saving, read the saved bytes through an available tool and check that the
findings, references, uncertainties, human choices and current recommendations
survived. Provide the actual path or download and report any readback limitation. Merely printing a filename
is not a save. Reopening in a fresh chat is a separate continuation check.

Installing or removing the skill changes its availability in the host. User notes
belong to the user and must remain outside the plugin installation/cache folders.
Never delete research as part of skill removal. Uninstallation does not erase
instructions or source content already present in an old conversation.
