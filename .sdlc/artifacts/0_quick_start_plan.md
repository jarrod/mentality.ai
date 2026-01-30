# MVP Implementation Plan – Mental Health Matching Web App (TypeScript, TanStack Start, OpenAI Agents SDK)

This document is organized to support ongoing planning. Focus here is structure/formatting; fill in or revise content as decisions are made.

## Table of contents

- [Pitch statement](#pitch-statement)
- [Vision statement](#vision-statement)
- [Functional requirements](#functional-requirements)
  - [User-facing](#user-facing)
  - [Practitioner-facing (MVP-lite)](#practitioner-facing-mvp-lite)
  - [Safety & compliance (scope-appropriate)](#safety--compliance-scope-appropriate)
- [Tech stack and project structure](#tech-stack-and-project-structure)
  - [Technologies](#technologies)
  - [Suggested project layout](#suggested-project-layout)
- [Data model (TypeScript & Prisma)](#data-model-typescript--prisma)
  - [Core types (shared)](#core-types-shared)
  - [Prisma schema (high-level)](#prisma-schema-high-level)
- [OpenAI Agents SDK setup (TypeScript)](#openai-agents-sdk-setup-typescript)
  - [OpenAI client](#openai-client)
  - [Needs profile schema and tools](#needs-profile-schema-and-tools)
  - [Matching tool](#matching-tool)
  - [Agent definition](#agent-definition)
  - [Agent runner](#agent-runner)
- [Planning workspace (TBD)](#planning-workspace-tbd)

## Pitch statement

An AI-guided AI Assisted Matching for therapists” that helps people translate a vulnerable first conversation into a clear understanding of their needs, then matches them with emotionally aligned, clinically appropriate mental health practitioners they actually want to see.

## Vision statement

We imagine a world where starting therapy feels intuitive, safe, and personalised—more like a supportive conversation than a clinical intake form. Our AI intake companion gently guides people through their story, translates it into a structured needs profile, and curates a transparent shortlist of high-quality practitioners who align with their goals, preferences, identity, and practical constraints. Rather than assigning the “next available” clinician, we empower users to choose from a set of thoughtfully matched options, each presented with clear language about why they might be a good fit. Over time, as more sessions and outcomes flow through the platform, our matching becomes smarter and more nuanced, helping people in moments of need to quickly find their “right-fit” therapist while giving practitioners a steady stream of clients who are well-aligned to their expertise and style.

## Functional requirements

### User-facing

- Users can chat with an AI intake assistant to:
  - Understand that the assistant is **not** a crisis or emergency service.
  - Describe their current mental health goals, concerns, and context.
  - Specify preferences (practitioner gender, modality, budget, location, telehealth vs in-person, availability windows).
- The system generates a structured “needs profile” from the chat.
- The system returns a ranked list of matching practitioners.
- Users can:
  - View practitioner cards (photo, title, bio, modalities, specialties, fees, availability, telehealth/in‑person, location).
  - Select practitioners they feel comfortable with (shortlist).
  - Initiate a booking request (simple time selection + confirmation message).

### Practitioner-facing (MVP-lite)

- Admin-only CRUD for practitioners:
  - Name, credentials, registration number.
  - Bio, specialties, modalities, fees.
  - Location and telehealth options.
  - Availability slots (manual, non-recurring is enough for MVP).
- Practitioner record must be active/verified before appearing in matches.

### Safety & compliance (scope-appropriate)

- Clear, persistent disclaimer: AI assistant is not a crisis service, not a replacement for professional medical advice.
- If high‑risk content is detected (e.g. self-harm, imminent danger):
  - The agent responds with region-appropriate crisis information (e.g. AU emergency numbers) and stops the intake session.
- No diagnoses or treatment plans are provided by the agent; only matching and informational guidance.

---

## Tech stack and project structure

### Technologies

- **Framework**: TanStack Start (React + TypeScript).[web:6][web:34][web:37]
- **AI**:
  - OpenAI Node SDK.
  - OpenAI Agents SDK for TypeScript (`openai-agents-js`).[web:16][web:18]
- **DB/ORM**: Prisma (or similar) with PostgreSQL (cloud-hosted like Supabase/Neon – pick one).
- **Styling**: Tailwind CSS (or CSS-in-JS; Tailwind assumed below).
- **Deployment**:
  - TanStack Start app deployed to a Node-capable platform (e.g. Cloudflare Workers, Netlify, etc., both of which support Start).[web:15][web:38]
  - Single repo for full stack.

### Suggested project layout

```text
app/
  agents/
    intakeAgent.ts
    matcherTools.ts
    types.ts
  components/
    ChatWindow.tsx
    ChatMessageList.tsx
    ChatInput.tsx
    PractitionerCard.tsx
    PractitionerList.tsx
  db/
    client.ts
    schema.prisma
  routes/
    __root.tsx
    index.tsx
    intake.tsx
    matches.tsx
    practitioners.$id.tsx
    api.intakeChat.tsx
    api.matches.tsx
    api.bookings.tsx
  styles/
    app.css
  lib/
    openai.ts
    safety.ts
    session.ts
```

## Data model (TypeScript & Prisma)

### Core types (shared)

```ts
// app/agents/types.ts
export interface Practitioner {
  id: string
  name: string
  registrationNumber: string
  bio: string
  specialties: string[]
  modalities: string[]
  telehealth: boolean
  suburb: string
  state: string
  country: string
  feeMin: number
  feeMax: number
  photoUrl?: string
  isActive: boolean
}

export interface Booking {
  id: string
  practitionerId: string
  userId: string
  startTime: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface NeedsProfile {
  primaryConcerns: string[]
  severity: 'mild' | 'moderate' | 'severe'
  preferences: {
    modality?: string[]
    practitionerGender?: string
    telehealth?: boolean
    budgetMin?: number
    budgetMax?: number
    suburb?: string
    state?: string
    availabilityWindows?: string[]
  }
}
```

These interfaces should be used by:

- Prisma schema (mapped appropriately).
- Agent tools input/output.
- React components props.

### Prisma schema (high-level)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  sessions  Session[]
  bookings  Booking[]
}

model Session {
  id             String   @id @default(cuid())
  user           User?    @relation(fields: [userId], references: [id])
  userId         String?
  createdAt      DateTime @default(now())
  status         String   // e.g. "active" | "completed"
  needsProfile   Json?
  riskFlag       Boolean  @default(false)
  matches        Json?
}

model Practitioner {
  id                 String   @id @default(cuid())
  name               String
  registrationNumber String   @unique
  bio                String
  specialties        String[]
  modalities         String[]
  telehealth         Boolean
  suburb             String
  state              String
  country            String
  feeMin             Int
  feeMax             Int
  photoUrl           String?
  isActive           Boolean  @default(false)
  availabilitySlots  AvailabilitySlot[]
  bookings           Booking[]
}

model AvailabilitySlot {
  id              String       @id @default(cuid())
  practitioner    Practitioner @relation(fields: [practitionerId], references: [id])
  practitionerId  String
  startTime       DateTime
  endTime         DateTime
}

model Booking {
  id              String       @id @default(cuid())
  user            User?        @relation(fields: [userId], references: [id])
  userId          String?
  practitioner    Practitioner @relation(fields: [practitionerId], references: [id])
  practitionerId  String
  startTime       DateTime
  status          String       // "pending" | "confirmed" | "cancelled"
}
```

## OpenAI Agents SDK setup (TypeScript)
### OpenAI client

```ts
// app/lib/openai.ts
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})
```

### Needs profile schema and tools

Use Zod for validation and to keep types in sync.

```ts
// app/agents/intakeAgent.ts
import { Agent, tool, run } from 'openai-agents-js'
import { z } from 'zod'
import { openai } from '../lib/openai'
import { searchPractitionersTool } from './matcherTools'

const NeedsProfileSchema = z.object({
  primaryConcerns: z.array(z.string()),
  severity: z.enum(['mild', 'moderate', 'severe']),
  preferences: z.object({
    modality: z.array(z.string()).optional(),
    practitionerGender: z.string().optional(),
    telehealth: z.boolean().optional(),
    budgetMin: z.number().optional(),
    budgetMax: z.number().optional(),
    suburb: z.string().optional(),
    state: z.string().optional(),
    availabilityWindows: z.array(z.string()).optional(),
  }),
})

export type NeedsProfile = z.infer<typeof NeedsProfileSchema>

const finalizeProfileTool = tool({
  name: 'finalize_profile',
  description: 'Create a structured mental health needs profile',
  inputSchema: NeedsProfileSchema,
  async execute(input) {
    return input
  },
})
```

### Matching tool

```ts
// app/agents/matcherTools.ts
import { tool } from 'openai-agents-js'
import { z } from 'zod'
import { prisma } from '../db/client'

export const searchPractitionersTool = tool({
  name: 'search_practitioners',
  description: 'Find and rank practitioners that match a needs profile',
  inputSchema: z.object({
    primaryConcerns: z.array(z.string()),
    preferences: z.any(),
  }),
  async execute({ primaryConcerns, preferences }) {
    // Basic filtering
    const practitioners = await prisma.practitioner.findMany({
      where: {
        isActive: true,
        telehealth: preferences.telehealth ?? undefined,
        state: preferences.state ?? undefined,
        // further filters...
      },
    })

    // Very simple scoring example
    const scored = practitioners.map((p) => {
      const matches = p.specialties.filter((s) =>
        primaryConcerns.some((c: string) =>
          s.toLowerCase().includes(c.toLowerCase()),
        ),
      )
      const score = matches.length
      return { ...p, score }
    })

    return scored.sort((a, b) => b.score - a.score)
  },
})
```

### Agent definition

```ts
// app/agents/intakeAgent.ts (continued)
import { searchPractitionersTool } from './matcherTools'

export const intakeAgent = new Agent({
  name: 'Mental Health Intake Agent',
  instructions: `
You are a supportive, non-crisis mental health intake assistant for users in Australia.
Your job is to ask focused questions, summarise the user's concerns and goals, and then
produce a structured needs profile. You then optionally call the practitioner matching tool
to suggest practitioners. You do not provide diagnoses or treatment plans.
If you detect self-harm, suicide, or immediate danger, show crisis information for Australia
(e.g. 000, Lifeline 13 11 14) and stop the session.
  `,
  tools: [finalizeProfileTool, searchPractitionersTool],
})
```

### Agent runner

```ts
// app/agents/runIntake.ts
import { run } from 'openai-agents-js'
import { intakeAgent } from './intakeAgent'
import { openai } from '../lib/openai'
import { prisma } from '../db/client'

export async function runIntakeSession(params: {
  sessionId: string
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
}) {
  const result = await run(intakeAgent, {
    messages: params.messages,
    client: openai,
  })

  // Optionally inspect result for crisis markers, tools used, etc.
  // Persist needsProfile and matches if the tools were invoked.
  // Shape of result.finalOutput / tool traces depends on SDK version.[1][2][3]

  await prisma.session.update({
    where: { id: params.sessionId },
    data: {
      // Example: store everything for now
      needsProfile: result.toolOutputs?.finalize_profile ?? null,
      matches: result.toolOutputs?.search_practitioners ?? null,
    },
  })

  return result
}
```

## Planning workspace (TBD)

- Open decisions: TBD
- Milestones: TBD
- Open questions: TBD
- Notes: TBD
