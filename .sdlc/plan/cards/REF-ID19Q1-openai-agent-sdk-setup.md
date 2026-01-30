# Card: OpenAI agent SDK setup

Card ID: REF-ID19Q1-openai-agent-sdk-setup
Title: OpenAI agent SDK setup
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Set up OpenAI Node SDK and Agents SDK with environment variables, client initialization, streaming support, and basic tool scaffolding.

Context:

- OpenAI Agents SDK for TypeScript (`openai-agents-js`) is the backbone for the intake assistant and tool execution.
- API key must be securely stored in environment (OPENAI_API_KEY).
- Agent streaming is enabled for real-time response delivery to the UI (vs. buffered responses).
- Agents SDK tools use Zod for input validation and type safety.
- Agent instructions define the assistant's role (supportive, non-clinical, Australia-focused crisis awareness).
- Tool outputs must be persisted to the database for audit and matching refinement.

Use cases:

- Happy path: OpenAI client is initialized, agent can call tools (finalize_profile, search_practitioners) and stream real-time responses back to client.
- Edge case: API rate limits or temporary outages are handled gracefully with retry logic or user-friendly error.
- Non-goal: Custom model fine-tuning, multi-turn state persistence (handled by TanStack routes).

Acceptance checks:

- OpenAI client is initialized with API key from environment.
- Agent is created with clear system instructions for intake assistant role.
- Tool definitions (finalize_profile, search_practitioners) are scaffolded with Zod schemas.
- Agent streaming is configured and can be invoked from a TanStack server function.
- Streaming responses are properly handled and can be sent to the client via streaming API.
- No hardcoded API keys or credentials in source code.

Soft technical hints:

- Targets: TanStack server function, OpenAI Agents SDK with streaming, Zod for validation.
- Concepts: Tool definitions, agent instructions, input validation, error boundaries, stream handling.

Dependencies:

- REF-QFO1TP (database must exist to store tool outputs).

Questions:

- Should the agent use gpt-4, gpt-4-turbo, or gpt-3.5-turbo for cost/latency balance? (Consider latency with streaming)
- How should API errors (rate limit, auth) propagate to the UI during streaming?
- Should streaming chunks be persisted to the database or only final results?

Amendments (sequence review only):

- Note minor completeness or constraint alignment issues without rewriting the card.
