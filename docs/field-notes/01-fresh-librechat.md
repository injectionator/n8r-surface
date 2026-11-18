# Item 01: a fresh LibreChat investigation

Date: 15 November 2026. State: **Preparation verified; research and article pending.**
Part of the [field-notes series](README.md), tracked in
[#85](https://github.com/injectionator/n8r-surface/issues/85).

Current priority: [Surface UC01](../use-cases/01-lab-discovery/README.md) precedes
this walkthrough as agreed on 18 November. The 0.1.16 preparation below is a
historical receipt, not the current candidate installation.

## Question and intended result

Can someone start with an identified skill installation and a fresh LibreChat
checkout, get a useful evidence-backed account of its AI connections, and reopen
that account in a fresh chat? This is source research, not a running-system check.

Expected output: a concise brief, component/connection map, investigation journal
and saved Surface, with inspectable evidence and explicit gaps. Those are expected
results, not outputs already produced by this installment.

## Actual preparation and decision diary

1. Read existing repository walkthroughs and the website's current messaging and
   0.1.16 article. Existing walkthroughs include historical 0.1.11 installation
   instructions with warnings that they are historical. A newcomer still needs a
   clear current path; the series will test that path rather than assume it works.
2. Checked the normal CLI: `codex --version` returned `codex-cli 0.166.0`.
   `codex plugin list --marketplace n8r-surface --json` reported enabled 0.1.15.
   This planning chat exposes skill 0.1.16. The mismatch's cause is unestablished;
   neither receipt proves which version a new desktop chat will invoke.
3. Chose a separate pinned installation and fresh shallow LibreChat clone in a
   new private vault run directory. Preserve the existing installation and older
   research. Record exact revisions, command receipts and failures privately.

Contemporaneous editorial note: “Fresh setup” needs a definition. We already have
an account, installed tools and historical context. A new checkout is fresh source;
a separate installation is fresh plugin state; neither is a clean-machine test.
The tempting mistake would be to describe all three as the same thing.
This is a caution from preparation, not an invented failed research attempt.

## Preparation results

All three isolated plugin commands and the clone exited 0. The isolated plugin
list reports installed/enabled 0.1.16. All 27 tracked plugin files match merged
revision `44c68ee7ebbf4ad82a36d6db181c46c52c62677e` byte for byte; a private SHA-256
inventory is retained. Node.js is 26.13.0. The fresh LibreChat checkout is clean at
`5473f91036bbe388cdcdd60f3ecac22e6138cf47`.
The normal plugin registration was not changed. This establishes preparation,
not fresh-host invocation or successful research. No source investigation ran.

## Maintainer preparation

Use Git, Codex CLI 0.166.0 and Node.js 22, 24 or 26. Keep setup separate from
investigation. The isolated installation uses the existing
[maintainer procedure](../n8r-surface/workspace-installation.md#isolated-maintainer-installation)
with merged revision `44c68ee7ebbf4ad82a36d6db181c46c52c62677e` and expected skill
0.1.16, rather than that historical page's candidate version.

Actual command forms (publication placeholders replace private destinations):

```sh
codex --version
codex plugin list --marketplace n8r-surface --json
env CODEX_HOME="$RUN/codex" codex plugin marketplace add injectionator/n8r-surface --ref 44c68ee7ebbf4ad82a36d6db181c46c52c62677e --json
env CODEX_HOME="$RUN/codex" codex plugin add n8r-surface@n8r-surface --json
env CODEX_HOME="$RUN/codex" codex plugin list --marketplace n8r-surface --json
git clone --depth 1 https://github.com/danny-avila/LibreChat.git "$RUN/LibreChat"
git -C "$RUN/LibreChat" rev-parse HEAD
```

`RUN` is a new private vault run directory, created before these commands; its
`codex` child is a separate installation home. Network access is required for
installation and clone. These commands do not start LibreChat or install its
dependencies. Retain command exits and compare installed plugin bytes with the
pinned revision before claiming an exact installation. Record the clone commit;
the default branch can move between rehearsals.

## Fresh-chat walkthrough to exercise

The investigator receives the source, destination and prompts below, not this
preparation diary, old research or an expected findings list. Use a fresh host
conversation that actually loads the verified installation; an isolated CLI home
does not change the existing desktop process. Establish sign-in through the host
if required; do not copy authentication files into the evidence pack.

- [ ] Start the identified host in the fresh LibreChat checkout. Confirm that
  `n8r-surface:research` 0.1.16 is available. Record actual host/model identity.
- [ ] Ask: “Use n8r-surface Researcher to help me understand this LibreChat checkout.
  Start with a brief map of the AI-relevant components and connections, show the
  source evidence and gaps, and suggest what is worth investigating next. Do not
  install dependencies, execute repository scripts or start services. Save the
  investigation in the supplied new destination.” Expect a source-backed partial
  graph, not claims about an actual deployed instance.
- [ ] Select one consequential connection from the actual output. Ask: “Explain
  this connection and show me the evidence. What does it establish, and what
  would we need to check next?” Open the cited source independently.
- [ ] Open the saved brief, map, journal and Surface. Verify their important claims
  and coverage agree. Retain file hashes and capture useful screenshots.
- [ ] Open another fresh conversation with only the saved investigation and source
  access. Ask: “Reopen this investigation. What do we know, what remains unknown,
  and what should we do next? Save a successor if we add evidence.” Check that
  identities and history survive and predecessor files remain unchanged.
- [ ] Report Pass / Fail / Blocked with evidence references, incorrect claims,
  missing outputs and the reader's practical takeaway. Wording and identifiers
  may vary. Unsupported deployment claims, broken citations, missing saved files
  or overwritten history fail the relevant step. Missing access blocks it.

No research interaction, saved Surface, fresh-chat reopening or human acceptance
has been completed by this preparation record. Retain the task-owned run directory
for continuation; no cleanup has been performed. Later cleanup must preserve
unique evidence and remove only explicitly selected task-owned files.

## Article source material and website follow-ups

Possible story question: “We have a checkout. Do we understand the system yet?”
This is an editorial suggestion, not a claim about the outcome.

Available: preparation decisions and version-check receipts. Missing: actual
research turns, findings, inspected saved outputs, screenshots, recording and
human feedback. No screenshot or video is claimed.

- [x] Verify the isolated installation and record exact installed bytes.
- [ ] Establish the fresh investigator host session using that installation.
- [ ] Complete the investigation and populate the [reporting pack](reporting-pack-template.md).
- [ ] Capture an actual first map, evidence drill-down and any meaningful failure.
- [ ] Decide whether current website installation links need clarification based
  on the exercised route; preserve historical release records.
- [ ] Hand verified source material to injectionator-website for the article,
  series introduction and next-item link. Do not write the article from expected
  results or describe this preparation as a completed walkthrough.
