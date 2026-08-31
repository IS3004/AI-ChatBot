import { Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./RootLayout.css";

const RootLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users away from landing page
  useEffect(() => {
    if (isLoaded && isSignedIn && window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="root-layout">
      <Outlet />
    </div>
  );
};

export default RootLayout;
