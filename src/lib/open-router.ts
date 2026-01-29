import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function openRounterInference() {


  const completion = await openai.chat.completions.create({
    model: "arcee-ai/trinity-large-preview:free",
    messages: [
      { role: "user", content: "Say this is a test, in Italian" }
    ],
  })

  const response = await openai.responses.create({
    model: "arcee-ai/trinity-large-preview:free",
    reasoning: { effort: "low" },
    instructions: "Talk like a pirate.",
    input: "Are semicolons optional in JavaScript?",
  });

  console.log(response.output_text);

  return completion.choices[0].message.content
}
