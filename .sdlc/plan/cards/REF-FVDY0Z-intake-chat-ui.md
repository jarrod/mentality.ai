# Card: Intake chat UI

Card ID: REF-FVDY0Z-intake-chat-ui
Title: Intake chat UI
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Build a React chat interface component (ChatWindow, ChatMessageList, ChatInput) for the intake session that displays conversation, handles user input, and integrates with the intake agent API.

Context:

- Chat UI is the primary user-facing surface for intake; must feel supportive and non-clinical.
- UI sends user messages to a TanStack server function (api.intakeChat) which invokes the intake agent.
- Messages are streamed or returned in batches; UI displays agent responses with natural formatting.
- UI displays a persistent disclaimer: "This is not a crisis service. If you're in danger, call 000 or Lifeline 13 11 14."
- UI uses Tailwind CSS and shadcn/ui components for consistency with the design system.
- Session ID is maintained client-side (localStorage or URL state) to persist conversation across page reloads.

Use cases:

- Happy path: User types message → ChatInput sends to server → agent streams response chunks → UI displays incrementally in ChatMessageList.
- Edge case: Network error during streaming; UI shows partial response and error message with retry option.
- Non-goal: Typing indicators, user read receipts, message reactions, file uploads.

Acceptance checks:

- ChatWindow component renders chat history and input area.
- ChatMessageList displays conversation with distinct styling for user vs. agent messages, with streaming text rendered incrementally.
- ChatInput accepts user text, disables submit during loading, shows loading indicator.
- User messages are sent to API endpoint (POST /api.intakeChat) which returns a streaming response.
- Agent responses are displayed incrementally as they stream in (using ReadableStream or EventSource).
- Disclaimer is prominently visible (sticky header or banner).
- Session ID is maintained and passed with each request.
- UI gracefully handles streaming errors and agent failures mid-stream.
- UI supports cancelling in-flight requests.

Soft technical hints:

- Targets: React functional components with hooks (useState, useEffect), TanStack Start routes (client + server function with streaming), shadcn/ui (Input, Button, Card, ScrollArea).
- Concepts: Client-server streaming (ReadableStream or EventSource), incremental text rendering, loading states, error boundaries, request cancellation.

Dependencies:

- REF-VSEU6D (intake agent must be implemented to receive requests).

Questions:

- Should chat messages be persisted in the database or only session-stored?
- Should users be able to edit/delete sent messages?
- How should the UI transition from intake chat to practitioner results display?

Amendments (sequence review only):

- Note minor completeness or constraint alignment issues without rewriting the card.
