import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";

import chatsRouter from "./routes/chats.js";
import userChatsRouter from "./routes/userChats.js";
import messagesRouter from "./routes/messages.js";
import imagekitRouter from "./routes/imagekit.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/upload", imagekitRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/userchats", userChatsRouter);
app.use("/api/chats", messagesRouter);

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
