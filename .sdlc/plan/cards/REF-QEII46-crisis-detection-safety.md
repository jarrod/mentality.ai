# Card: Crisis detection safety

Card ID: REF-QEII46-crisis-detection-safety
Title: Crisis detection safety
Status: todo | in-progress | blocked | done
Last updated: 2026-01-30

Goal:

- Implement risk detection in the intake agent to identify high-risk content (self-harm, suicide, imminent danger) and provide region-appropriate crisis resources without terminating the session abruptly.

Context:

- High-risk keywords trigger an immediate response with Australian crisis resources: 000 (emergency), Lifeline 13 11 14, Beyond Blue 1300 224 636.
- Agent provides these resources prominently and reassures user that crisis services are the appropriate next step.
- Session is flagged with riskFlag = true in database for audit and follow-up.
- Crisis detection should not falsely flag normal therapeutic language (e.g., "I feel overwhelmed"); threshold must be carefully calibrated.
- No automated contact to emergency services; system provides information only.

Use cases:

- Happy path: User mentions depression and anxiety; system continues normal intake without triggering crisis protocol.
- Edge case: User says "I want to hurt myself"; agent provides crisis information immediately, flags session, and continues to allow user to engage further if desired.
- Non-goal: Real-time monitoring, law enforcement contact, forced counseling referral, non-Australia regions.

Acceptance checks:

- Risk detection heuristic (keyword-based or AI-classifier) is applied to incoming user messages.
- If risk is detected, agent responds with prominent crisis information (resource names, phone numbers, explanation of when to use each).
- Session record is updated with riskFlag = true and risk_context (keywords/phrases detected).
- Agent does not abruptly end session; user can continue chatting if desired.
- Crisis disclaimer is reinforced but does not invalidate the intake conversation.
- Risk detection is documented in session audit trail.
- No false positives on therapeutic language (e.g., "overwhelmed," "struggling").

Soft technical hints:

- Targets: Keyword matching or LLM-based classification, Session.riskFlag and Session.riskContext fields, agent system instructions.
- Concepts: Risk thresholds, safeguard patterns, audit logging, user autonomy vs. safety.

Dependencies:

- REF-VSEU6D (agent must implement risk detection logic).
- REF-QFO1TP (Session model must include riskFlag and riskContext fields).

Questions:

- Should risk detection be keyword-based (simple) or AI-classifier (robust but higher latency/cost)?
- What is the minimum threshold for flagging a session as risky?
- Should flagged sessions trigger a human review, or is audit trail sufficient for MVP?
- Should the system provide resources for non-suicidal self-harm (e.g., skin picking, eating disorders)?

Amendments (sequence review only):

- **Sequencing note:** Crisis detection is integrated into REF-VSEU6D (agent implementation) rather than a separate task. This card remains for clarity on safety guardrails and to define the acceptance criteria for risk detection. Executor should implement both simultaneously during VSEU6D.
