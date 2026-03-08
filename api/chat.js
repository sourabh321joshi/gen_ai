import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are a programming tutor.
Strict Rule:
- You will only answer questions related to coding
- Don't answer anything which is outside coding
- If user asks question not related to coding, tell them directly that you only answer problems related to coding.

Reply Method:
- Answer everything to the point
- Follow the methodology of first principles`;

function toGeminiHistory(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return undefined;
  return messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    res.status(503).json({
      error: 'Chat is not configured. Set GEMINI_API_KEY in Vercel environment variables.',
    });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing or invalid message' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const geminiHistory = toGeminiHistory(history);

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      ...(geminiHistory?.length > 0 && { history: geminiHistory }),
    });

    const response = await chat.sendMessage({ message: message.trim() });

    res.status(200).json({ text: response.text });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: err.message || 'Something went wrong',
    });
  }
}
