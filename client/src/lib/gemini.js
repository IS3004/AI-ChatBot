import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Creates a Gemini chat session with the provided history.
 * @param {Array} history - Array of {role, parts} message objects
 * @returns {ChatSession}
 */
export const createChatSession = (history = []) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings,
    systemInstruction:
      "You are a helpful, knowledgeable, and friendly AI assistant. " +
      "Format your responses with markdown when appropriate — use code blocks for code, " +
      "bold for emphasis, and bullet points for lists. " +
      "Be concise but thorough.",
  });

  return model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
    },
  });
};

/**
 * Converts an image URL or base64 string to an inline data part for Gemini vision.
 * @param {string} base64 - Base64-encoded image data (without the data: prefix)
 * @param {string} mimeType - e.g. "image/jpeg"
 * @returns {object} Gemini inline data part
 */
export const imageToGenerativePart = (base64, mimeType = "image/jpeg") => ({
  inlineData: {
    data: base64,
    mimeType,
  },
});
