import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import NewPrompt from "../components/NewPrompt.jsx";
import "./ChatPage.css";

const API_URL = import.meta.env.VITE_API_URL;

const ChatPage = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chat", id],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/chats/${id}`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch chat");
      return res.json();
    },
    staleTime: 0,
  });

  // ── Export chat to file ────────────────────────────────────────────────────
  const handleExport = (format) => {
    if (!data?.history) return;

    let content = "";
    const title = data.history[0]?.parts[0]?.text?.substring(0, 30) || "chat";

    if (format === "md") {
      content += `# Conversation: ${title}\n\n`;
      data.history.forEach((msg) => {
        const sender = msg.role === "user" ? "### 👤 User" : "### 🤖 Assistant";
        content += `${sender}\n\n${msg.parts[0]?.text}\n\n---\n\n`;
      });
    } else {
      content += `Conversation: ${title}\n${"=".repeat(40)}\n\n`;
      data.history.forEach((msg) => {
        const sender = msg.role === "user" ? "USER" : "ASSISTANT";
        content += `[${sender}]:\n${msg.parts[0]?.text}\n\n`;
      });
    }

    const blob = new Blob([content], {
      type: format === "md" ? "text/markdown" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  if (isLoading) {
    return (
      <div className="chat-page-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="chat-page-error">
        <p>⚠️ Could not load this chat. It may have been deleted or you don't have access.</p>
      </div>
    );
  }

  const chatTitle = data?.history?.[0]?.parts?.[0]?.text?.substring(0, 40) || "Chat";

  return (
    <div className="chat-page">
      {/* ── Chat Header ─────────────────────────────────────────────── */}
      <header className="chat-page-header">
        <div className="header-title-wrapper">
          <span className="header-icon">💬</span>
          <h2 className="header-chat-title">{chatTitle}</h2>
        </div>

        {/* Export action */}
        <div className="header-actions">
          <div className="export-wrapper">
            <button
              className="export-trigger-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
              title="Export conversation"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="export-dropdown">
                <button onClick={() => handleExport("md")}>
                  <span>📥</span> Markdown (.md)
                </button>
                <button onClick={() => handleExport("txt")}>
                  <span>📄</span> Plain Text (.txt)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Chat Thread ────────────────────────────────────────── */}
      <NewPrompt data={data} />
    </div>
  );
};

export default ChatPage;
