import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import "./DashboardPage.css";

const API_URL = import.meta.env.VITE_API_URL;

const PERSONAS = [
  { id: "general", label: "⚡ General Assistant", desc: "Fast & helpful" },
  { id: "code", label: "💻 Code Architect", desc: "Clean & structured code" },
  { id: "creative", label: "✍️ Creative Writer", desc: "Engaging stories & copy" },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [persona, setPersona] = useState("general");

  const mutation = useMutation({
    mutationFn: async ({ text, persona }) => {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, persona }),
      });
      if (!res.ok) throw new Error("Failed to create chat");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${data.chatId}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;
    mutation.mutate({ text, persona });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-greeting">
          <h1>What can I help you with?</h1>
          <p>Ask anything — or upload an image to analyze it.</p>
        </div>

        {/* Persona Selector on Dashboard */}
        <div className="dashboard-persona-selector">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`dashboard-persona-pill ${persona === p.id ? "active" : ""}`}
              onClick={() => setPersona(p.id)}
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
        </div>

        <form className="dashboard-form" onSubmit={handleSubmit}>
          <div className="dashboard-input-wrapper">
            <input
              type="text"
              name="text"
              placeholder={`Ask ${PERSONAS.find(p=>p.id===persona)?.label.split(" ")[1]} a question...`}
              className="dashboard-input"
              autoFocus
            />
            <button
              type="submit"
              className="dashboard-send"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <span className="btn-spinner" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
          {mutation.isError && (
            <p className="error-msg">Something went wrong. Please try again.</p>
          )}
        </form>

        {/* Suggestion chips */}
        <div className="suggestion-chips">
          {[
            "Explain quantum computing simply",
            "Write a Python binary search function",
            "What causes the northern lights?",
            "Give me a high-protein vegetarian meal plan",
          ].map((s) => (
            <button
              key={s}
              className="chip"
              onClick={() => {
                if (!mutation.isPending) mutation.mutate({ text: s, persona });
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
