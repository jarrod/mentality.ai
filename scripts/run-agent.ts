#!/usr/bin/env bun
/**
 * Run the greeting agent without the web app.
 * Bun loads .env from the project root automatically.
 *
 * Usage:
 *   bun run scripts/run-agent.ts
 *   bun run scripts/run-agent.ts "Explain recursion in one haiku"
 */

import { openAgent } from "../src/lib/agent/agent";

const prompt = process.argv[2] ?? "Hello, clientId is ABC123";

console.log(`> Running agent with prompt: ${prompt}`);

await openAgent(prompt);
