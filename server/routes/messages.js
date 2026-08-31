import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/chat.js";
import requireAuth from "../middlewares/clerkAuth.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const PERSONA_PROMPTS = {
  general:
    "You are a helpful, knowledgeable, and friendly AI assistant. Format your responses with markdown when appropriate — use code blocks for code, bold for emphasis, and bullet points for lists. Be concise but thorough.",
  code:
    "You are an expert Senior Software Engineer and Code Architect. Provide production-grade, bug-free, and well-commented code snippets. Explain the algorithmic complexity, best practices, and edge cases clearly.",
  creative:
    "You are an imaginative, expressive, and engaging Creative Writer. Craft vivid narratives, brainstorming concepts, engaging copy, and compelling prose with eloquence and originality.",
};

/**
 * POST /api/chats/:id/chat
 * Streams a Gemini response with persona support and clean history mapping.
 */
router.post("/:id/chat", requireAuth, async (req, res) => {
  const { userId } = req;
  const { question, img, persona = "general" } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ error: "Question is required." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) {
      sendEvent({ error: "Chat not found." });
      return res.end();
    }

    const systemInstruction = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.general;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction,
    });

    // Clean stored history to strictly conform to Gemini's expected format (no _id fields)
    const history = chat.history.map((msg) => ({
      role: msg.role,
      parts: (msg.parts || []).map((p) => ({ text: p.text || "" })),
    }));

    const chatSession = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
    });

    const parts = [];

    if (img) {
      try {
        const imageRes = await fetch(img);
        const arrayBuffer = await imageRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = imageRes.headers.get("content-type") || "image/jpeg";
        parts.push({ inlineData: { data: base64, mimeType } });
      } catch {
        console.warn("Could not fetch image for Gemini Vision, proceeding text-only.");
      }
    }

    parts.push({ text: question });

    let fullAnswer = "";
    const result = await chatSession.sendMessageStream(parts);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullAnswer += text;
        sendEvent({ text });
      }
    }

    await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: [
              {
                role: "user",
                parts: [{ text: question }],
                ...(img && { img }),
              },
              {
                role: "model",
                parts: [{ text: fullAnswer }],
              },
            ],
          },
        },
      }
    );

    sendEvent({ done: true });
    res.end();
  } catch (err) {
    console.error("Gemini streaming error:", err);
    sendEvent({ error: "AI service error. Please try again." });
    res.end();
  }
});

export default router;
