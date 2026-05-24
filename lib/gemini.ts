import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables.");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateText(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content ?? "";
}

// Keep geminiModel export as compatibility shim
export const geminiModel = {
  generateContent: async (prompt: string) => ({
    response: { text: () => generateText(prompt) },
  }),
};