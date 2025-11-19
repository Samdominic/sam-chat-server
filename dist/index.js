"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const groq_sdk_1 = __importDefault(require("groq-sdk"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const client = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY, // This is the default and can be omitted
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Default route
app.get("/", (req, res) => {
    res.json({ message: "Hello from server" });
});
// Example POST route
app.post("/chat", async (req, res) => {
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
