import { Agent, InputGuardrail, run } from "@openai/agents";
import z from "zod";

// Guadrail Agent.
const guardrailAgent = new Agent({
    name: 'Guardrail check',
    instructions: 'Check if the user is using offensive, harmful or inappropriate language.',
    outputType: z.object({
      isOffensive: z.boolean(),
      reasoning: z.string(),
    }),
  });
  
  export const offensiveLanguageGuardrail: InputGuardrail = {
    name: 'Offensive Language Guardrail',
    // Set runInParallel to false to block the model until the guardrail completes.
    runInParallel: false,
    execute: async ({ input, context }) => {
      const result = await run(guardrailAgent, input, { context });
      return {
        outputInfo: result.finalOutput,
        tripwireTriggered: result.finalOutput?.isOffensive === true,
      };
    },
  };