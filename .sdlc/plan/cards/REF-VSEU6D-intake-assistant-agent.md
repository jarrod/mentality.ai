# Card: Intake assistant agent

Card ID: REF-VSEU6D-intake-assistant-agent
Title: Intake assistant agent
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Define and implement the Mental Health Intake Agent with system instructions, supportive conversation flow, and tools to finalize a needs profile and initiate practitioner search.

Context:

- Agent guides users through a conversation to understand their mental health goals, concerns, and preferences without providing diagnosis or treatment.
- Agent detects high-risk keywords (self-harm, suicide, imminent danger) and provides region-appropriate crisis resources (Australia: 000, Lifeline 13 11 14).
- Agent uses two tools: finalize_profile (structures the conversation into a NeedsProfile) and search_practitioners (finds matching practitioners).
- Conversation is non-clinical; the agent reframes vulnerability into structured insights.
- Agent must be Australia-aware (location, crisis numbers, terminology).

Use cases:

- Happy path: User describes concerns → agent streams responses with clarifying questions → agent calls finalize_profile tool → profile stored → optionally calls search_practitioners → results streamed to UI.
- Edge case: User mentions self-harm → agent detects risk flag → streams crisis information immediately → session flagged.
- Non-goal: Diagnosis, treatment advice, crisis counseling, multi-language support (MVP English-only).

Acceptance checks:

- Agent is instantiated with clear system instructions explaining its role, boundaries, and crisis protocol.
- Agent can receive user messages and stream responses in real-time with natural, supportive language.
- Agent calls finalize_profile tool with structured NeedsProfile data extracted from conversation.
- Agent calls search_practitioners tool after profile is finalized.
- Agent detects high-risk keywords and streams crisis information without ending conversation abruptly.
- Session stores all agent outputs and conversation history for audit.
- Streaming responses are properly formatted for client consumption.

Soft technical hints:

- Targets: OpenAI Agents SDK (Agent class), TanStack server function for API endpoint.
- Concepts: System instructions, tool invocation, multi-turn conversation state, risk detection heuristics.

Dependencies:

- REF-ID19Q1 (OpenAI SDK must be initialized).
- REF-QFO1TP (database must exist to store sessions).

Questions:

- Should risk detection be rule-based (keyword matching) or AI-based (classifier)?
- Should the agent automatically suggest practitioners or ask user permission before searching?
- How many turns should a session allow before timing out?

Amendments (sequence review only):

- Note minor completeness or constraint alignment issues without rewriting the card.
