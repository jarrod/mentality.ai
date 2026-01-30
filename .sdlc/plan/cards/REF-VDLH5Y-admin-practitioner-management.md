# Card: Admin practitioner management

Card ID: REF-VDLH5Y-admin-practitioner-management
Title: Admin practitioner management
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Build an admin interface to create, update, and manage practitioner profiles and availability slots, with activation/deactivation controls.

Context:

- Admin-only page (behind Clerk authentication) allows CRUD on Practitioner and AvailabilitySlot records.
- Practitioner fields: name, credentials, registration number, bio, specialties (multi-select), modalities (multi-select), location (suburb/state/country), fees (min/max), telehealth flag, photo upload.
- AvailabilitySlot fields: start/end times (manual entry; no calendar UI for MVP).
- Admin can toggle isActive on practitioners to control visibility in matches (soft delete).
- Form validation ensures required fields and registration number uniqueness.
- Clerk is used for authentication; admin role determined by custom metadata or hardcoded user list.

Use cases:

- Happy path: Admin creates a new practitioner with credentials, specialties, fees, and availability → practitioner becomes visible in matches.
- Edge case: Admin tries to create practitioner with duplicate registration number → form shows error.
- Non-goal: Bulk import, calendar UI, recurring availability patterns, verification workflows, photo resizing.

Acceptance checks:

- Admin can create a new Practitioner with all required fields.
- Admin can update Practitioner fields (name, bio, specialties, modalities, fees, location, telehealth).
- Admin can toggle Practitioner.isActive to activate/deactivate from matches.
- Admin can create and delete AvailabilitySlot records for a practitioner.
- Form validation prevents empty required fields and duplicate registration numbers.
- Changes are persisted to the database immediately.
- UI provides feedback (success toast, error message) for all operations.
- Admin page is protected by authentication (or basic check; MVP may not have full auth).

Soft technical hints:

- Targets: TanStack Start routes (admin pages), React form components (shadcn/ui Form, Input, Select, Checkbox, Textarea), TanStack server functions for mutations, Drizzle ORM (create, update, delete).
- Concepts: Form state management, form validation (Zod), CRUD operations, optimistic updates, role-based access control with Clerk.

Dependencies:

- REF-QFO1TP (Practitioner and AvailabilitySlot models must exist).

Questions:

- Should practitioners be able to self-manage their profiles, or admin-only for MVP?
- Should photo upload support drag-and-drop or file input?
- How should practitioners be verified before activation (manual review, credentials check)?
- Should there be a bulk import for practitioners (CSV)?
- Should availability slots support recurring patterns (e.g., "Every Monday 9 AM–1 PM")?
- How should admin role be designated in Clerk (custom metadata field, organization membership, or hardcoded list)?

Amendments (sequence review only):

- Note minor completeness or constraint alignment issues without rewriting the card.
