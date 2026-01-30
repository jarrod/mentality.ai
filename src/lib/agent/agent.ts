import { Agent, InputGuardrail, run, Runner, setTracingDisabled, tool } from "@openai/agents";
import { getModelProvider } from "./model-provider";
import z from "zod";
import { offensiveLanguageGuardrail } from "./guardrail";

setTracingDisabled(true);

interface UserContext {
  clientId: string;
}

const TEST_CLIENT_SUMMARY = `
Name: Barry Doe
Age: 30
Gender: Male
Occupation: Software Engineer
Family: 2 children
Previous interactions: 2 weeks ago about needing help with stress management and anxiety.
`;

// Tooling Functions & Agents.
const getClientHistory = tool({
  name: 'get_client_history',
  description: 'Return any historical data about the client from previous interactions.',
  parameters: z.object({
    clientId: z.string(),
  }),
  async execute({ clientId }) {
    console.log(`> Getting client history for client ${clientId}`);

    // Query external data sources for client history and use LLM to summarize.
    return `Client ${clientId} summary: ${TEST_CLIENT_SUMMARY}.`;
  },
});

const greetingAgent = new Agent<UserContext>({
  name: "Greeting Agent",
  instructions: 
  `
    You respond in a friendly and caring manner and greet the client by name and immediately ask 
    them how you can help them today with references to previous interactions. 
    Previous interactions available via the get_client_history tool.
  `,
});

// Primary Agent.
const clientFacingAgent = new Agent<UserContext>({
  name: "Client-facing Agent",
  instructions: 
  `
    You respond in a friendly and caring manner.
    Call the get_client_history tool to gather personalisation information and then immediately greet them to put them at ease. 
  `,
  inputGuardrails: [offensiveLanguageGuardrail],
  tools: [
    getClientHistory, 
    greetingAgent.asTool({
      toolName: 'greeting_agent',
      toolDescription: 'Handles greeting the client and asking how you can help them today as a setup to more engaging conversation.',
    })
  ],
});


export async function openAgent(prompt: string) {
  const modelProvider = await getModelProvider();

  const runner = new Runner({ modelProvider });

  const result = await runner.run(clientFacingAgent, prompt, { context: { clientId: "ABC123" } });

  console.log(result.finalOutput);

  return result;
}
