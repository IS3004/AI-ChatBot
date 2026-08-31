import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/clerk-react";
import "./HomePage.css";

const HomePage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate("/dashboard");
    } else {
      navigate("/sign-up");
    }
  };

  return (
    <div className="home-page">
      {/* ─── Nav ─────────────────────────────────────────────────── */}
      <nav className="home-nav">
        <div className="home-logo">
          <span className="logo-icon">✦</span>
          <span className="logo-text">Nexa AI</span>
        </div>
        <div className="home-nav-actions">
          {isSignedIn ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link to="/sign-in" className="nav-link">Sign In</Link>
              <Link to="/sign-up" className="nav-btn">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Powered by Gemini 1.5 Flash — Free</div>
          <h1 className="hero-title">
            Your AI<br />
            <span className="hero-accent">Your Way</span>
          </h1>
          <p className="hero-subtitle">
            Think, create, explore, and solve problems with one powerful assistant.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={handleGetStarted}>
              {isSignedIn ? "Open Dashboard" : "Start Chatting — Free"}
            </button>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Learn about Gemini ↗
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="chat-preview">
            <div className="chat-bubble user">What's the capital of France?</div>
            <div className="chat-bubble ai">
              The capital of France is <strong>Paris</strong>. It's the largest city in France and has been the country's capital since 987 AD. 🗼
            </div>
            <div className="chat-bubble user">Explain quantum entanglement simply.</div>
            <div className="chat-bubble ai typing">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────── */}
      <section className="features">
        {[
          {
            icon: "💬",
            title: "Persistent Chat History",
            desc: "All your conversations are saved and organized by date. Pick up right where you left off.",
          },
          {
            icon: "🖼️",
            title: "Image Understanding",
            desc: "Upload any image and ask questions about it. Gemini Vision analyzes photos, charts, and screenshots.",
          },
          {
            icon: "🔐",
            title: "Secure & Private",
            desc: "Your chats are private to your account. Powered by Clerk authentication and MongoDB.",
          },
          {
            icon: "⚡",
            title: "Streaming Responses",
            desc: "Responses stream in real-time just like ChatGPT, so you never wait for a full reply.",
          },
        ].map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="home-footer">
        <p>Built with React · Claude AI · MongoDB · Clerk · ImageKit</p>
      </footer>
    </div>
  );
};

export default HomePage;
