import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateAnswer(question, chunks) {
  const context = chunks.map((c) => c.content).join("\n\n---\n\n");

  const prompt = `Answer the question using only the context below. If the answer isn't in the context, say so — don't make things up.

Context:
${context}

Question: ${question}`;

  const response = await client.chat.completions.create({
    model:"llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}