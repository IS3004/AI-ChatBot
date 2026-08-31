import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ChatList from "../components/ChatList.jsx";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/sign-in" />;

  return (
    <div className={`dashboard-layout ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <ChatList onCloseMobile={() => setMobileOpen(false)} />
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Floating Sidebar Toggle Button */}
        <div className="layout-topbar">
          <button
            className="sidebar-toggle-btn"
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileOpen(!mobileOpen);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <div className="dashboard-outlet-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
