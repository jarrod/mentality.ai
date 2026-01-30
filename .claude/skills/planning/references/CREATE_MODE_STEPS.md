# Create Mode Steps (MUST READ)

1. Create cards from functional requirements

- Announce start: `Planning: Creating requirement-based cards.`
- Treat `.sdlc/artifacts/3_functional-requirements.md` as the sole source for card scope.
- IMPORTANT: Before creating any card files, write a short requirements digest (1–2 lines per requirement) and a provisional card list that maps each requirement to a card.
- Default to 1 functional requirement per card.
- Bundle multiple requirements only when they are tightly coupled and still fit within one execution session.
- Draft each card using `references/card-template.md`.
- Save each card to `.sdlc/plan/cards/`.
- Use `bun .claude/skills/planning/scripts/new-card-id.js "<short-title>"` to create the card stub with ID, title, and template sections.
- Fill in the stub with a short title and a one-sentence Goal per card.

2. Enrich cards with outcomes, constraints, and acceptance checks

- Announce start: `Planning: Enriching cards with constraints and acceptance checks.`
- Review the goal, refine and expand if required but keep aligned to the card intent.
- Use `.sdlc/artifacts/1_market-research-report.md` and `.sdlc/artifacts/2_technical-design.md` only for constraints, hints, and acceptance checks.
- Extract key outcomes, hard constraints (musts), soft constraints (preferences).
- Note unknowns that should become explicit questions.
- Use these to shape each card’s Context and Acceptance checks.
- Keep acceptance checks observable and implementation-agnostic.
