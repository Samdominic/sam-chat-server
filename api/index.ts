import { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import dotenv from "dotenv";

dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper for CORS
function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // GET /
  if (req.method === "GET" && req.url === "/api") {
    return res.status(200).json({ message: "Hello from Vercel server" });
  }

  // POST /chat
  if (req.method === "POST" && req.url === "/api/chat") {
    const { messages } = req.body;

    const resp = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful assistant. Your name is Sam AI." },
        ...messages
      ],
    });

    return res.status(200).json({
      reply: resp.choices[0].message.content,
    });
  }

  // Not found
  return res.status(404).json({ error: "Not found" });
}
