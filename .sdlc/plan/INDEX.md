# Mental Health Matching App — Execution Plan

**Last updated:** 2026-01-30

## Objectives

- Build a functioning MVP intake and practitioner matching system that guides users through AI-assisted intake and surfaces matched practitioners.
- Implement core user flow: chat intake → needs profile → practitioner matches → booking requests.
- Ensure safety guardrails (crisis detection) are in place from the start.
- Provide admin tooling to seed and manage practitioner data.

## Constraints and Assumptions

**Hard Constraints:**
- MVP database: Turso SQLite with Drizzle ORM; no migration complexity, edge-friendly.
- AI agent: OpenAI Agents SDK with streaming enabled (real-time agent responses).
- Styling: Tailwind CSS + shadcn/ui for consistency.
- Authentication: Clerk (already integrated in repo); use for admin checks and user identity.
- Practitioners are manually seeded by admin; no bulk import or verification workflows.

**Soft Constraints:**
- Availability slots are non-recurring manual entries (no calendar UI).
- Matching algorithm is simple (specialty overlap + preference filtering); no ML/ranking refinement for MVP.
- Booking requests are pending status only; practitioner confirmation is admin-driven (no automation).
- Crisis detection is keyword/heuristic-based; no AI classifier for MVP.

**Assumptions:**
- Users may start intake without signing up (anonymous sessions possible).
- Practitioners have stable registration numbers for uniqueness.
- Email/phone validation is sufficient for booking contact; no multi-factor authentication.

## Current Focus

- **Active card(s):** None (plan ready for execution)
- **Next card:** REF-QFO1TP
- **Blockers:** None

## Sequence

Ordered list of cards to execute:

1. REF-QFO1TP — Database schema and models
2. REF-ID19Q1 — OpenAI agent SDK setup
3. REF-VSEU6D — Intake assistant agent
4. REF-QEII46 — Crisis detection safety
5. REF-EB54UF — Practitioner matching tool
6. REF-FVDY0Z — Intake chat UI
7. REF-54VWRM — Practitioner cards display
8. REF-CO26AQ — Booking and shortlist
9. REF-VDLH5Y — Admin practitioner management *(can run in parallel with user flow, or last)*

## Card Tracker

| Card ID | Title | Status | Last Updated | Notes |
|---------|-------|--------|--------------|-------|
| REF-QFO1TP | Database schema and models | todo | 2026-01-30 | Foundational; unblocks all others. Must clarify DB provider and session expiry policy. |
| REF-ID19Q1 | OpenAI agent SDK setup | todo | 2026-01-30 | Depends on API key. Clarify model choice (gpt-4 vs gpt-4-turbo) before implementation. |
| REF-VSEU6D | Intake assistant agent | todo | 2026-01-30 | Core logic; enables all downstream flows. Risk detection is integrated here, not separate. |
| REF-QEII46 | Crisis detection safety | todo | 2026-01-30 | Implemented as part of VSEU6D; kept separate for clarity on safety guardrails. |
| REF-EB54UF | Practitioner matching tool | todo | 2026-01-30 | Depends on VSEU6D (agent invokes) and QFO1TP (data queries). Simple ranking sufficient for MVP. |
| REF-FVDY0Z | Intake chat UI | todo | 2026-01-30 | Depends on VSEU6D (API endpoint). Implement after agent is functional for integration testing. |
| REF-54VWRM | Practitioner cards display | todo | 2026-01-30 | Depends on FVDY0Z (flow transition) and EB54UF (data). Keep responsive for mobile. |
| REF-CO26AQ | Booking and shortlist | todo | 2026-01-30 | Final user-facing flow. Shortlist state can be client-side for MVP; consider DB persistence for future. |
| REF-VDLH5Y | Admin practitioner management | todo | 2026-01-30 | Independent from user flow; can run in parallel or after REF-CO26AQ. No auth system assumed for MVP; assume single admin. |

## Key Decision Points (Unresolved)

- **Model Choice:** gpt-4, gpt-4-turbo, or gpt-3.5-turbo? (Consider cost vs. latency for streaming responses)
- **Risk Detection:** Keyword-based or AI-classifier? (Keyword-based recommended for MVP simplicity)
- **Shortlist Persistence:** Client-side or database-persisted? (Client-side sufficient for MVP)
- **Clerk Admin Role:** How to designate admin users in Clerk (custom metadata, organization role, or hardcoded list)?

## Next Steps for Operator

1. Review and approve the sequence above.
2. Clarify unresolved decision points (especially DB provider and OpenAI model).
3. Assign each card to an executor and begin with REF-QFO1TP.
4. Update Card Tracker as work progresses (status → in-progress → done).
5. Amend any card if constraints change during implementation.
