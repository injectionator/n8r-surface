# Research with n8r-surface

The current local candidate opens a conversation. From the project folder you
want to investigate, run:

```sh
n8r-surface
```

Tell it what you want to know. For example:

```text
Which AI services does this project connect to, and what is still unclear?
```

You can ask follow-up questions, correct a finding, or change the emphasis.
There is no required research sequence. `/source PATH` at the opening prompt
selects another local folder or file; otherwise it uses the current folder.
Before research starts, you confirm sending source text and messages to OpenAI
through your existing Codex ChatGPT sign-in. Source files stay unchanged.

When you want to keep the result, type:

```text
save
```

The command prepares and checks the saved Surface, preserves your decisions and
unknowns, and shows where to open it. You can keep talking afterward. Type `exit`
when you want to leave.

Next time, run `n8r-surface` again. Choose your saved work by its displayed number.
The command remembers its source and model, opens a fresh conversation and checks
for changed source evidence. Ask whatever comes next. Saving creates a successor
and keeps earlier files intact.

## Installation

The conversation-first experience is a local candidate, not yet a public npm
release. Follow the [local candidate installation](npm-release.md) or use the
candidate already installed by your maintainer. Check the command in the same
terminal where you will use it; npm global commands belong to the active Node
installation.

Prerequisites are Node.js 22, 24 or 26 and Codex CLI 0.166.0 signed in with
ChatGPT. The command uses your configured Codex model. Existing vault settings
are reused; a new installation asks where to save research once. Installation
and upgrades preserve existing settings and research.

The historical registry version `@n8r/surface@0.1.0-experimental.2` does not include
this opening conversation. See the [release record](npm-release.md#verified-scoped-release).

## Other ways to work

Existing explicit commands remain available:

```sh
n8r-surface discover . --model gpt-6-astra
n8r-surface --help
```

`reopen SAVED_FILE --source SOURCE` opens an existing note or Surface by path,
including older files. Those placeholders represent your selected files; ordinary
continuation through the opening saved-work list does not require them.

`/save note` saves a Markdown working note. The explicit `discover` and `reopen`
commands retain their original `/save` Markdown behavior; plain `save` saves a
Surface. `/save surface` saves a current preview. A save request in the opening
conversation can prepare the Surface for you, without a separate preview command.

If a source has moved, select its new location with `/source PATH` before choosing
saved work. If saved bytes were edited or damaged, the command preserves them and
reports the conflict. Older saves without a recent-work entry can still be opened
with `reopen`; saving them adds them to the list.
