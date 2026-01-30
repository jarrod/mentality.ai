# Prioritization Guidance

Use a lightweight scoring pass and record the result in `INDEX.md`.

## Scoring rubric

Score each card 1-5 in each category:

- **Value**: User impact or business leverage.
- **Dependency**: Unblocks other cards (higher = more blocking).
- **Risk**: Technical uncertainty or failure cost (higher = riskier).
- **Effort**: Estimated size (higher = larger).

## Priority formula

Compute:

- **Priority score** = (Value + Dependency + Risk) - Effort

Then assign:

- **H** if score >= 9
- **M** if score 6-8
- **L** if score <= 5

## Sequencing rules

- Sort by dependency first, then priority score.
- Schedule at least one high-risk spike early if it can change the plan.
- If a card exceeds one session, split by outcome or interface boundary.
- Re-score after each completed card or when decisions change assumptions.
