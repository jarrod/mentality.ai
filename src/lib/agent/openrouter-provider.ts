import OpenAI from "openai";
import {
  Model,
  ModelProvider,
  OpenAIChatCompletionsModel,
} from "@openai/agents";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL_NAME ?? "google/gemini-2.5-flash-lite";

export class OpenRouterModelProvider implements ModelProvider {
  getModel(modelName?: string): Model {
    // SDK passes empty string when no model is set; OpenRouter requires a valid model name
    const model = modelName?.trim() || DEFAULT_MODEL;
    return new OpenAIChatCompletionsModel(openai, model);
  }
}
