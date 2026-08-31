import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";
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
 * POST /api/chats
 * Creates a new chat with the user's first message and initial AI answer.
 */
router.post("/", requireAuth, async (req, res) => {
  const { userId } = req;
  const { text, persona = "general" } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const systemInstruction = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.general;

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction,
    });

    let initialAnswer = "";
    try {
      const result = await model.generateContent(text);
      initialAnswer = result.response.text();
    } catch (aiErr) {
      console.error("Gemini initial generation error:", aiErr);
      initialAnswer = "I received your message. How can I help you further?";
    }

    const history = [
      {
        role: "user",
        parts: [{ text }],
      },
    ];

    if (initialAnswer) {
      history.push({
        role: "model",
        parts: [{ text: initialAnswer }],
      });
    }

    const newChat = await Chat.create({
      userId,
      history,
    });

    const userChats = await UserChats.findOne({ userId });
    const chatEntry = {
      _id: newChat._id.toString(),
      title: text.substring(0, 60),
    };

    if (!userChats) {
      await UserChats.create({
        userId,
        chats: [chatEntry],
      });
    } else {
      await UserChats.updateOne(
        { userId },
        { $push: { chats: chatEntry } }
      );
    }

    res.status(201).json({ chatId: newChat._id });
  } catch (err) {
    console.error("POST /api/chats error:", err);
    res.status(500).json({ error: "Failed to create chat." });
  }
});

/**
 * GET /api/chats/:id
 * Fetch a single chat's message history.
 */
router.get("/:id", requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    // Auto-heal unanswered last user message if any
    if (
      chat.history.length > 0 &&
      chat.history[chat.history.length - 1].role === "user"
    ) {
      try {
        const lastUserMessage = chat.history[chat.history.length - 1].parts[0].text;
        const model = genAI.getGenerativeModel({
          model: "gemini-3.6-flash",
          systemInstruction: PERSONA_PROMPTS.general,
        });
        const result = await model.generateContent(lastUserMessage);
        const replyText = result.response.text();

        if (replyText) {
          chat.history.push({
            role: "model",
            parts: [{ text: replyText }],
          });
          await chat.save();
        }
      } catch (genErr) {
        console.error("Auto-recovery AI generation error:", genErr);
      }
    }

    res.json(chat);
  } catch (err) {
    console.error("GET /api/chats/:id error:", err);
    res.status(500).json({ error: "Failed to fetch chat." });
  }
});

/**
 * PUT /api/chats/:id/title
 * Renames an existing chat.
 */
router.put("/:id/title", requireAuth, async (req, res) => {
  const { userId } = req;
  const { title } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    await UserChats.updateOne(
      { userId, "chats._id": req.params.id },
      { $set: { "chats.$.title": title.trim().substring(0, 80) } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Rename chat error:", err);
    res.status(500).json({ error: "Failed to rename chat." });
  }
});

/**
 * DELETE /api/chats/:id
 * Deletes a chat document and removes it from user's chat index.
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const { userId } = req;
  const chatId = req.params.id;

  try {
    await Chat.deleteOne({ _id: chatId, userId });
    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ error: "Failed to delete chat." });
  }
});

export default router;
