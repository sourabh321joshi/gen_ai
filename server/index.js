import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY not set. Set it in .env to enable the tutor.');
}

const ai = GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY })
  : null;

const SYSTEM_INSTRUCTION = `You are a programming tutor.
Strict Rule:
- You will only answer questions related to coding
- Don't answer anything which is outside coding
- If user asks question not related to coding, tell them directly behen ke lode coding releted puch!

Reply Method:
- Answer everything to the point
- Follow the methodology of first principles`;

const chats = new Map();

function getOrCreateChat(sessionId) {
  if (!ai) throw new Error('Gemini API is not configured');
  let chat = chats.get(sessionId);
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    chats.set(sessionId, chat);
  }
  return chat;
}

app.use(cors({ origin: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Chat is not configured. Set GEMINI_API_KEY in the server environment.',
      });
    }
    const { sessionId: rawId, message } = req.body;
    const sessionId = rawId || randomUUID();
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid message' });
    }
    const chat = getOrCreateChat(sessionId);
    const response = await chat.sendMessage({ message: message.trim() });
    res.json({ text: response.text, sessionId });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: err.message || 'Something went wrong',
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
