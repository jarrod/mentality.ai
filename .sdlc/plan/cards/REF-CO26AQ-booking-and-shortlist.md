# Card: Booking and shortlist

Card ID: REF-CO26AQ-booking-and-shortlist
Title: Booking and shortlist
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Implement shortlist management and a booking flow that allows users to select practitioners and submit booking requests with time selection.

Context:

- Users can add practitioners to a shortlist (client-side state initially); shortlist persists during session.
- Booking flow: user selects a time slot from practitioner's availability, confirms contact details, submits request.
- Booking request creates a Booking record with status "pending"; practitioner can confirm via admin dashboard (out of scope for MVP).
- No payment processing for MVP; system assumes sessions are PAYG or under practitioner's own arrangement.
- Confirmation message thanks user and explains next steps (practitioner will confirm within X days).

Use cases:

- Happy path: User clicks "Book" on a practitioner → selects available time → enters email/phone → confirms → booking request saved.
- Edge case: Practitioner has no available slots; UI shows "Not currently available" or offers to join waitlist (scope TBD).
- Non-goal: Payment, calendar sync, automated confirmations, recurring bookings, dispute resolution.

Acceptance checks:

- Users can add/remove practitioners from shortlist in the UI.
- Shortlist is displayed in a summary modal or page.
- User can click "Book" on a practitioner → modal/page with available time slots.
- User can select a time slot and enter contact details (email, phone).
- Booking submission (POST /api.bookings) creates a Booking record with status "pending".
- Confirmation message displays with expected response timeline.
- Booking records are queryable by practitioner and user (for admin and future user dashboard).

Soft technical hints:

- Targets: React state (useState for shortlist), TanStack server function (api.bookings), Prisma mutation (Booking.create), shadcn/ui Modal, Select, Form components.
- Concepts: Client state management, form validation, error handling, optimistic updates.

Dependencies:

- REF-54VWRM (practitioner cards must enable selection).
- REF-QFO1TP (Booking model must exist).

Questions:

- Should shortlist be persisted to the database or only in session state?
- Should users be able to book multiple practitioners at once or only one?
- What email/phone validation is required?
- Should practitioners receive automated email notifications of new booking requests?

Amendments (sequence review only):

- Note minor completeness or constraint alignment issues without rewriting the card.
