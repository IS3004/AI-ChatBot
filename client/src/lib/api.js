/**
 * api.js — Client-side API helpers
 *
 * All AI calls (Claude) go through the server.
 * The server holds the ANTHROPIC_API_KEY securely and streams responses via SSE.
 *
 * This file provides a typed helper for the streaming chat endpoint.
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Sends a message to Claude via the server and returns a ReadableStream of SSE events.
 *
 * @param {string} chatId       - MongoDB chat document ID
 * @param {string} question     - User's text message
 * @param {string|null} imgUrl  - Optional ImageKit image URL
 * @param {string} token        - Clerk auth token
 * @returns {Promise<ReadableStreamDefaultReader>}
 */
export const streamChat = async (chatId, question, imgUrl, token) => {
  const res = await fetch(`${API_URL}/api/chats/${chatId}/chat`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question,
      ...(imgUrl && { img: imgUrl }),
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Server error: ${res.status}`);
  }

  return res.body.getReader();
};

/**
 * Parses a raw SSE line buffer into events.
 * @param {string} buffer - Accumulated SSE text
 * @returns {{ events: Array<object>, remaining: string }}
 */
export const parseSSEBuffer = (buffer) => {
  const lines = buffer.split("\n");
  const remaining = lines.pop() ?? "";
  const events = [];

  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    try {
      events.push(JSON.parse(line.slice(6)));
    } catch {
      // Skip malformed lines
    }
  }

  return { events, remaining };
};
