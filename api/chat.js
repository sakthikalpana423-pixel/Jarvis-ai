import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const messages = (req.body?.messages || [])
      .slice(-30)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "")
      }));

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "You are JARVIS, a friendly personal AI assistant. Answer clearly and naturally. Keep responses concise unless the user asks for detail.",
      input: messages
    });

    return res.status(200).json({
      reply: response.output_text || "I couldn't generate a response."
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "JARVIS could not connect to the AI service."
    });
  }
}
