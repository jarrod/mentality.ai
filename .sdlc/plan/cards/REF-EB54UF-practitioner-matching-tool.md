# Card: Practitioner matching tool

Card ID: REF-EB54UF-practitioner-matching-tool
Title: Practitioner matching tool
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Implement a search_practitioners tool that filters and ranks active practitioners based on a user's needs profile (concerns, preferences, location, budget, modality).

Context:

- Matching is simple for MVP: filters on active status, location, telehealth preference, budget range, and modalities; scores by specialty/concern overlap.
- Practitioners are pre-seeded by admin; no real-time practitioner directory sync (future enhancement).
- Preferences may be partial; system provides sensible defaults and continues matching even if some preferences are unspecified.
- Rankings should be transparent and repeatable for QA.
- Tool is called by the intake agent after a needs profile is finalized.

Use cases:

- Happy path: User's needs profile (concerns: anxiety, preference: telehealth, budget: $100–150) matches 5 active practitioners; tool returns ranked list.
- Edge case: No practitioners match all criteria; tool returns best partial matches or empty list with explanation.
- Non-goal: Complex ML-based ranking, outcome-based scoring, practitioner availability real-time updates.

Acceptance checks:

- Tool queries Practitioner table filtering by isActive = true.
- Tool applies user preferences: telehealth, state/suburb, budget range, modality.
- Tool returns practitioners ranked by specialty/concern overlap score (descending).
- Tool handles missing or partial preferences gracefully.
- Tool returns structured list with all practitioner fields (name, bio, modalities, fees, location, etc.) for UI display.
- No sensitive data (credentials, internal IDs) is returned.

Soft technical hints:

- Targets: OpenAI Agents SDK tool, Prisma queries (findMany with where conditions), scoring algorithm.
- Concepts: Filtering, basic ranking, data shape transformation, error handling for empty results.

Dependencies:

- REF-QFO1TP (Practitioner records must exist in database).
- REF-VSEU6D (tool is invoked by intake agent).

Questions:

- Should the tool return a limited number of practitioners (e.g., top 10) or all matches?
- How should tied scores be broken (alphabetical, newest first, random)?
- Should the tool provide a match confidence score for each result?

Amendments (sequence review only):

- Note minor completeness or constraint alignment issues without rewriting the card.
