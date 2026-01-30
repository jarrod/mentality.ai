# Card: Database schema and models

Card ID: REF-QFO1TP-database-schema-and-models
Title: Database schema and models
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Create and migrate Drizzle ORM schema defining User, Session, Practitioner, AvailabilitySlot, and Booking tables for persistent storage in Turso SQLite.

Context:

- MVP uses Turso SQLite with Drizzle ORM for edge-friendly, lightweight data persistence.
- Sessions store intake chat history and auto-generated needs profiles as JSON.
- Practitioners must have active/verified status before appearing in matches.
- Availability slots are non-recurring manual entries (no complex scheduling for MVP).
- No complex relationships; simple one-to-many and optional fields are sufficient.
- Drizzle provides type-safe queries and simpler schema management than Prisma.

Use cases:

- Happy path: Admin seeds practitioner records; system stores session data and needs profiles during intake.
- Edge case: Session created before user signs up (anonymous intake); booking request maps to practitioner availability.
- Non-goal: Recurring availability patterns, complex permissions, audit trails.

Acceptance checks:

- Drizzle schema is defined with all required tables (User, Session, Practitioner, AvailabilitySlot, Booking).
- Schema validates that practitioners have name, credentials, specialties, modalities, location, fees, telehealth flag.
- Schema enforces isActive boolean on practitioners to control visibility in matches.
- Drizzle configuration connects to Turso SQLite (local dev and production).
- Session table stores JSON fields for needsProfile and matches.
- All types are exported from schema for use in server functions and components.

Soft technical hints:

- Targets: Drizzle ORM with Turso SQLite driver.
- Concepts: Relationships (User→Session, Practitioner→AvailabilitySlot, Practitioner→Booking), JSON fields, default values, unique constraints on registration numbers.

Dependencies:

- None (foundational).

Questions:

- Should sessions auto-expire after X hours, or persist indefinitely?
- Do practitioners need verification workflows or is a simple isActive flag sufficient for MVP?
- Should Turso database be shared or separate for local dev vs. production?

Amendments (sequence review only):

- **Tech decision:** Using Drizzle ORM with Turso SQLite (edge-friendly, lightweight). Schema should export types for TypeScript usage in server functions and components.
