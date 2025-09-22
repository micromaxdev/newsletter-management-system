import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ApprovalQueue from "./pages/ApprovalQueue";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/me`, { credentials: "include" });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  // Handler for successful login/register
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // Handler for logout
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setIsAuthenticated(false);
  };

  // Show spinner while checking auth
  if (!authChecked) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        Checking authentication...
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/"
        element={isAuthenticated ? <HomePage handleLogout={handleLogout} /> : <Navigate to="/auth" />}
      />
      <Route 
        path="/auth"
        element={!isAuthenticated ? <AuthPage onAuthSuccess={handleAuthSuccess} /> : <Navigate to="/" />}
      />
      <Route 
        path="/approval-queue"
        element={isAuthenticated ? <ApprovalQueue /> : <Navigate to="/auth" />}
      />
    </Routes>
  );
}

export default App;
