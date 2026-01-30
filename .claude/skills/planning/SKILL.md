---
name: planning
description: Create pragmatic, card-based AI execution plans from large technical designs and strategic plans for web app software. Use when converting high-level docs into lightweight, flexible cards with acceptance checks, soft technical hints, and decision logs that keep AI unblocked.
argument-hint: 'Mode: create | sequence. Use create to generate cards only. Use sequence to order existing cards and update INDEX.md. Example: /skill planning create'
---

# AI Plan Cards

## Overview

You are a technical analyst creating requirement-aligned cards for AI execution. Use functional requirements as the source of truth for what to build, then apply market research and technical design only to shape constraints, hints, and acceptance checks. Keep structure light, decisions logged, and sequencing handled in the master plan.

Follow the workflow provided below to be repeatable and produce consistent results.

## Workflow

### Rules

- Store all plan artifacts under `.sdlc/plan/` only.
- Keep a master plan at `.sdlc/plan/INDEX.md` using `references/index-template.md` only in `sequence` mode.
- Store cards in `.sdlc/plan/cards/` as one file per card.
- Name cards with stable IDs: `REF-<slug>-short-title.md`.
- Generate IDs with `bun .claude/skills/planning/scripts/new-card-id.js "<short-title>"`.
- Never place plan files outside `.sdlc/plan/`.
- Do not create or edit implementation code, schemas, or tests.
- Do not modify files under `.sdlc/artifacts/`.
- Do not invent new requirements; only reframe or clarify existing functional requirements.
- Do not add phase-based planning; use a single ordered sequence in `INDEX.md`.
- Do not include long implementation checklists; keep cards concise and outcome-focused.
- Use `references/decision-log.md` only when a constraint conflict, bundling choice, or scope boundary requires justification.
- Determine mode from `$ARGUMENTS`: `create` or `sequence`.
- If `$ARGUMENTS` is empty or unrecognized, default to `create` and state the fallback.
- Never sequence during a `create` run.
- Never modify card files during a `sequence` run; only update `.sdlc/plan/INDEX.md`.
- In `create` mode, do not edit `.sdlc/plan/INDEX.md`.
- In `create` mode, do not read `.sdlc/plan/INDEX.md` or `references/index-template.md`.
- Do not add sections that are not present in the templates.
- Optional commentary sections are allowed only if they materially aid implementation and remain concise; do not add generic or speculative content.
- Do not assign phases, defer work, or mark items as future. Sequencing decisions belong to the operator.
- Do not create or overwrite card files with shell heredocs; use the script once, then edit in place.
- After creating a card stub, always read the file before editing it and apply minimal edits instead of rewriting the whole file.

### Steps

## Create Cards (mode: `create`)

**RULE:** Run this section only when `$ARGUMENTS` includes `create`.

MUST read `references/CREATE_MODE_STEPS.md` before taking any action.

## Sequence Cards (mode: `sequence`)

**RULE:** Run this section only when `$ARGUMENTS` includes `sequence`.

MUST read `references/SEQUENCE_MODE_STEPS.md` before taking any action.

## Rules of thumb

- Prefer fewer cards with clear acceptance checks over many vague cards.
- Keep cards small enough to complete within one execution session.
- Avoid writing detailed implementation steps unless necessary to prevent mistakes.
- If constraints conflict, surface the conflict and propose options.

## References

- Card template: `references/card-template.md`
- Decision log format: `references/decision-log.md`
- Master plan template: `references/index-template.md`
