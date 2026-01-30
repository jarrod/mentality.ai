import type { ModelProvider } from "@openai/agents";
import { OpenAIProvider } from "@openai/agents";

/**
 * Which LLM provider to use. Set via env LLM_PROVIDER=openai | openrouter.
 * - openai: official OpenAI API (use in production with OPENAI_API_KEY).
 * - openrouter: OpenRouter (use in dev with OPENROUTER_API_KEY).
 * Default: openrouter for backward compatibility.
 */
export type LLMProviderKind = "openai" | "openrouter";

function getProviderKind(): LLMProviderKind {
  const raw = process.env.LLM_PROVIDER?.toLowerCase();
  if (raw === "openai" || raw === "openrouter") return raw;
  return "openrouter";
}

/**
 * Returns the configured model provider so you can plug OpenRouter in dev
 * and official OpenAI in production without code changes.
 *
 * In production: set LLM_PROVIDER=openai and OPENAI_API_KEY; OpenRouter
 * is not loaded. Optionally set OPENAI_DEFAULT_MODEL for default model.
 *
 * OpenRouter is loaded only when LLM_PROVIDER=openrouter, so prod builds
 * that only use OpenAI can omit the OpenRouter dependency from the bundle.
 */
export async function getModelProvider(): Promise<ModelProvider> {
  const kind = getProviderKind();

  if (kind === "openai") {
    return new OpenAIProvider({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  const { OpenRouterModelProvider } = await import("./openrouter-provider");
  return new OpenRouterModelProvider();
}
