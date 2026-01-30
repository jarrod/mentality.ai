# Sequence Mode Steps (MUST READ)

1. Sequence cards (after all cards are written)

- Announce start: `Planning: Sequencing cards.`
- Read every card in `.sdlc/plan/cards/` before making any sequencing decisions.
- Write a short dependency note (2–5 bullets) that highlights blocking relationships and prerequisites.
- Define the execution order in the `Sequence` section of `.sdlc/plan/INDEX.md`.
- Update the Card Tracker in `INDEX.md` to reflect the same ordering.
- Use sequencing heuristics (keep it short):
  - Enablement first (auth, data access, scaffolding).
  - Core user flows next, then secondary flows.
  - Hard dependencies before soft dependencies.
  - Risky/uncertain work early to unblock decisions.
  - Polish and non-critical optimizations last.

2. Finalize plan set

- Announce start: `Planning: Finalizing plan set.`
- Review cards for completeness and consistency with `.sdlc/artifacts/3_functional-requirements.md`.
- Review cards for consistency with constraints and hints in `.sdlc/artifacts/2_technical-design.md`.
- If a card needs a minor correction, append a short note under `Amendments (sequence review only)` instead of rewriting the card.
- Do not label anything as deferred or phase-based; if ordering is ambiguous, add a short neutral note in the Card Tracker `Notes` for operator decision.
- Ensure `.sdlc/plan/INDEX.md` reflects the final sequence and priorities.
