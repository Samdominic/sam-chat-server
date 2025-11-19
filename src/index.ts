import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY, // This is the default and can be omitted
});

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from server" });
});

// Example POST route
app.post("/chat", async (req: Request, res: Response) => {
  const { messages } = req.body;
  const resp = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: 'You are a helpful assistant. Your name is Sam AI.' },
      ...messages
    ]
  });
  res.json({
    reply: resp.choices[0].message.content
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
