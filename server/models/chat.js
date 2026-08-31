import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    parts: [partSchema],
    img: {
      type: String, // ImageKit URL for uploaded images
    },
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    history: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
