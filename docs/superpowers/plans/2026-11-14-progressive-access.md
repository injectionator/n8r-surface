# Progressive Access Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Work in the normal checkout; no worktrees.

**Goal:** Help a first-time Researcher user supply sources and establish access progressively.

**Architecture:** Add a focused first-use reference and route newcomers to it. Adapt workspace/save guidance to observed host capabilities; preserve existing helpers and model semantics.

**Tech Stack:** Markdown skill/reference package, TypeScript instruction loader, existing Node tests.

**Spec:** [Approved design](../specs/2026-11-14-progressive-access-design.md).

## Global constraints

Keep Surface profile 1 and read-only target inspection. No connector, credential
store, runtime installation or target changes. Work on the existing #76 branch/PR.

## Review focus

Check uploaded files versus live folders, offered SSH keys, unavailable GitHub
access, missing save runtime and source-only requests with no runtime intent.
Use fresh bounded scenarios; textual guards alone cannot prove these behaviors.

## Tasks

- [x] Record installed 0.1.15 newcomer and setup-follow-up responses before editing.
- [x] Add `references/first-use-access.md`; link from `SKILL.md` and instance guidance.
- [x] Clarify workspace prerequisites and cloud/download save boundaries without changing helpers.
- [x] Bump plugin candidate to 0.1.16; include reference in instruction digest and update existing version guards.
- [x] Run fresh candidate scenarios and review observed responses against the design.
- [x] Run repository checks, inspect final diff and create a reviewable commit.
- [x] Install the exact archived candidate in ChatGPT web and start a fresh synthetic trial; record any concrete blocker.
- [x] Record the web blocker, runnable human steps and limitations; update draft PR and push.

## Execution notes

Baseline already handled partial graphs and credential refusal correctly; this
increment makes access guidance explicit rather than claiming a regression fix.
Two-turn baseline/candidate simulations were manually reviewed. No statistical
wording benchmark is claimed. Independent final review found no actionable issues.

Actual web installation and the two-turn synthetic invocation completed after the
user enabled browser file-URL access. Progressive source guidance passed the
bounded agent rehearsal. Initial draft download delivery did not pass; record
recovery and output readback separately in the first-use evidence. This is not
human acceptance or a real repository/SSH test.
