import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./ChatList.css";

const API_URL = import.meta.env.VITE_API_URL;

const ChatList = ({ onCloseMobile }) => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { id: currentChatId } = useParams();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/userchats`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch chats");
      return res.json();
    },
  });

  // ── Delete chat mutation ───────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (chatId) => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete chat");
      return { chatId };
    },
    onSuccess: ({ chatId }) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      if (currentChatId === chatId) {
        navigate("/dashboard");
      }
    },
  });

  // ── Rename chat mutation ───────────────────────────────────────────────────
  const renameMutation = useMutation({
    mutationFn: async ({ chatId, title }) => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/chats/${chatId}/title`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to rename chat");
      return { chatId, title };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      setEditingChatId(null);
      setNewTitle("");
    },
  });

  const handleStartRename = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChatId(chat._id);
    setNewTitle(chat.title);
  };

  const handleSaveRename = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    if (newTitle.trim()) {
      renameMutation.mutate({ chatId, title: newTitle.trim() });
    } else {
      setEditingChatId(null);
    }
  };

  const handleDelete = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteMutation.mutate(chatId);
    }
  };

  const filteredChats = (data?.chats || []).filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="chat-list-header">
        <Link to="/" className="sidebar-logo" onClick={onCloseMobile}>
          <span className="logo-icon">✦</span>
          <span>AI Chat</span>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* ── New Chat ────────────────────────────────────────────── */}
      <div className="new-chat-area">
        <button
          className="new-chat-btn"
          onClick={() => {
            navigate("/dashboard");
            if (onCloseMobile) onCloseMobile();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      {/* ── Search Bar ─────────────────────────────────────────── */}
      <div className="sidebar-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sidebar-search-input"
        />
        {searchTerm && (
          <button className="search-clear-btn" onClick={() => setSearchTerm("")}>
            ✕
          </button>
        )}
      </div>

      {/* ── Chat History List ────────────────────────────────────── */}
      <nav className="chat-nav">
        <p className="chat-nav-label">
          {searchTerm ? `Search Results (${filteredChats.length})` : "Recent Chats"}
        </p>

        {isLoading && (
          <div className="sidebar-loading">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-item" />
            ))}
          </div>
        )}

        {isError && (
          <p className="sidebar-error">Could not load chats.</p>
        )}

        {!isLoading && filteredChats.length === 0 && (
          <p className="sidebar-empty">
            {searchTerm ? "No matching chats found." : "No chats yet. Start a conversation!"}
          </p>
        )}

        {filteredChats.map((chat) => {
          const isActive = chat._id === currentChatId;
          const isEditing = editingChatId === chat._id;

          return (
            <div
              key={chat._id}
              className={`chat-item-wrapper ${isActive ? "active" : ""}`}
            >
              {isEditing ? (
                <form
                  className="inline-rename-form"
                  onSubmit={(e) => handleSaveRename(e, chat._id)}
                >
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    autoFocus
                    className="inline-rename-input"
                    onBlur={(e) => handleSaveRename(e, chat._id)}
                  />
                </form>
              ) : (
                <Link
                  to={`/dashboard/chats/${chat._id}`}
                  className="chat-item"
                  onClick={onCloseMobile}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="chat-item-title">{chat.title}</span>
                </Link>
              )}

              {/* Action buttons (Rename & Delete) */}
              {!isEditing && (
                <div className="chat-item-actions">
                  <button
                    className="item-action-btn"
                    title="Rename chat"
                    onClick={(e) => handleStartRename(e, chat)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button
                    className="item-action-btn delete"
                    title="Delete chat"
                    onClick={(e) => handleDelete(e, chat._id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default ChatList;
