import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Upload from "./Upload.jsx";
import "./NewPrompt.css";

const API_URL = import.meta.env.VITE_API_URL;

const PERSONAS = [
  { id: "general", label: "⚡ General Assistant", desc: "Fast & helpful" },
  { id: "code", label: "💻 Code Architect", desc: "Clean & structured code" },
  { id: "creative", label: "✍️ Creative Writer", desc: "Engaging stories & copy" },
];

/**
 * Custom CodeBlock component with a floating "Copy" button
 */
const CodeBlock = ({ children, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!className) {
    return <code className="inline-code" {...props}>{children}</code>;
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang">{language || "code"}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
};

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [persona, setPersona] = useState("general");
  const [copiedMsgIndex, setCopiedMsgIndex] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  const endRef = useRef(null);
  const formRef = useRef(null);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.history, question, answer]);

  // Stop speech when navigating away
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Text-to-Speech handler ─────────────────────────────────────────────────
  const handleToggleSpeak = (text, index) => {
    if (!("speechSynthesis" in window)) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean out markdown symbols for cleaner speech
    const plainText = text.replace(/[`*#_~[\]]/g, "");
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // ── Copy full message text ─────────────────────────────────────────────────
  const handleCopyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgIndex(index);
    setTimeout(() => setCopiedMsgIndex(null), 2000);
  };

  // ── Core: stream from Gemini via server SSE ────────────────────────────────
  const sendMessage = async (text) => {
    if (!text.trim() || streaming) return;

    setQuestion(text);
    setAnswer("");
    setError(null);
    setStreaming(true);

    try {
      const token = await getToken();

      const res = await fetch(`${API_URL}/api/chats/${data._id}/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: text,
          img: imgUrl || undefined,
          persona,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Server error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullAnswer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.error) {
              setError(event.error);
            } else if (event.text) {
              fullAnswer += event.text;
              setAnswer(fullAnswer);
            } else if (event.done) {
              queryClient.invalidateQueries({ queryKey: ["chat", data._id] });
              queryClient.invalidateQueries({ queryKey: ["userChats"] });
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      setQuestion("");
      setAnswer("");
      setImgUrl(null);
    } catch (err) {
      console.error("Streaming error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = formRef.current?.querySelector("input[name='prompt']");
    const text = input?.value?.trim();
    if (text) {
      input.value = "";
      sendMessage(text);
    }
  };

  const handleUploadSuccess = (res) => {
    setUploading(false);
    setImgUrl(res.url);
  };

  const handleUploadError = (err) => {
    setUploading(false);
    console.error("Upload error:", err);
  };

  return (
    <div className="new-prompt">
      {/* ── Chat History ──────────────────────────────────────────────────── */}
      <div className="chat-history">
        {data?.history?.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.img && (
              <img src={msg.img} alt="uploaded" className="message-img" />
            )}
            {msg.role === "model" ? (
              <div className="model-content-wrapper">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code: CodeBlock,
                  }}
                >
                  {msg.parts[0].text}
                </ReactMarkdown>

                {/* Message action bar (Copy + Speak) */}
                <div className="msg-action-bar">
                  <button
                    className="msg-action-btn"
                    title="Copy full message"
                    onClick={() => handleCopyMessage(msg.parts[0].text, i)}
                  >
                    {copiedMsgIndex === i ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    className={`msg-action-btn ${speakingIndex === i ? "active-speech" : ""}`}
                    title={speakingIndex === i ? "Stop audio" : "Read aloud"}
                    onClick={() => handleToggleSpeak(msg.parts[0].text, i)}
                  >
                    {speakingIndex === i ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="6" width="12" height="12" />
                        </svg>
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p>{msg.parts[0].text}</p>
            )}
          </div>
        ))}

        {/* ── Streaming optimistic UI ────────────────────────────────────── */}
        {question && (
          <div className="message user fade-in">
            {imgUrl && <img src={imgUrl} alt="uploaded" className="message-img" />}
            <p>{question}</p>
          </div>
        )}

        {(answer || streaming) && (
          <div className="message model fade-in">
            {answer ? (
              <div className="model-content-wrapper">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{ code: CodeBlock }}
                >
                  {answer}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="message-error fade-in">⚠️ {error}</div>
        )}

        <div ref={endRef} />
      </div>

      {/* ── Input Area ─────────────────────────────────────────────────────── */}
      <div className="input-area">
        {/* Persona Switcher */}
        <div className="persona-selector">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`persona-pill ${persona === p.id ? "active" : ""}`}
              onClick={() => setPersona(p.id)}
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Image preview strip */}
        {imgUrl && (
          <div className="img-preview">
            <img src={imgUrl} alt="preview" />
            <button
              type="button"
              className="img-remove"
              onClick={() => setImgUrl(null)}
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        <form ref={formRef} className="input-form" onSubmit={handleSubmit}>
          <Upload
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            uploading={uploading}
            setUploading={setUploading}
          />
          <input
            type="text"
            name="prompt"
            placeholder={imgUrl ? "Ask about the image..." : `Message ${PERSONAS.find(p=>p.id===persona)?.label.split(" ")[1]}...`}
            className="prompt-input"
            disabled={streaming || uploading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="send-btn"
            disabled={streaming || uploading}
            title="Send"
          >
            {streaming ? (
              <span className="btn-spinner" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>

        <p className="input-disclaimer">
          Powered by Gemini 3.6 Flash · Responses may be inaccurate
        </p>
      </div>
    </div>
  );
};

export default NewPrompt;
