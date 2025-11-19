import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express server" });
});

app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  const resp = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are Sam AI." },
      ...messages,
    ],
  });

  res.json({ reply: resp.choices[0].message.content });
});

// IMPORTANT: Export handler instead of app.listen()
export default app;
