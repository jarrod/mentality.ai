# Card: Practitioner cards display

Card ID: REF-54VWRM-practitioner-cards-display
Title: Practitioner cards display
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Create PractitionerCard and PractitionerList React components that display matched practitioners with key details and enable user selection.

Context:

- Practitioners are displayed after intake chat finishes and matching tool returns results.
- Each card shows: photo, name, credentials, bio (excerpt), specialties, modalities, fees (range), location, telehealth flag, availability snippet.
- Cards are responsive and mobile-friendly; display reason for match (e.g., "Specializes in anxiety").
- User can click to add practitioner to shortlist (local state initially) or view full profile.
- List is sorted by match ranking; no pagination required for MVP (expect <20 practitioners).

Use cases:

- Happy path: User sees ranked list of 5 practitioners; clicks on one to add to shortlist or view details.
- Edge case: No practitioners match criteria; UI shows explanatory message with option to restart intake.
- Non-goal: Practitioner profile deep-dive, real-time availability checking, booking from card (deferred to separate step).

Acceptance checks:

- PractitionerCard component displays name, photo, credentials, bio excerpt, specialties, modalities, fees, location, telehealth flag.
- Card shows match reason or relevance score.
- Card has interactive affordances (click to select, hover states).
- PractitionerList renders multiple cards in a grid or list layout.
- List is responsive on mobile (single column) and desktop (2–3 columns).
- Empty state is displayed with helpful message if no practitioners match.
- Cards are styled consistently with Tailwind + shadcn/ui.

Soft technical hints:

- Targets: React functional components, shadcn/ui Card, Avatar, Badge, Button, Grid/Flex layouts, Tailwind CSS.
- Concepts: Component composition, prop drilling (practitioners array), conditional rendering, responsive design.

Dependencies:

- REF-FVDY0Z (chat flow must transition to practitioner list).
- REF-EB54UF (matching tool provides practitioner list).

Questions:

- Should practitioners show real-time availability slots or a "Request booking" button that opens a modal?
- Should the card include a rating or review system?
- How many practitioners should be displayed before pagination/truncation kicks in?

Amendments (sequence review only):

- Note minor completeness or constraint alignment issues without rewriting the card.
