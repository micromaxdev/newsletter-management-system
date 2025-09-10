import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

export default function AuthPage({ onAuthSuccess }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {showLogin ? (
        <>
          <Login onSuccess={onAuthSuccess} />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span>Don't have an account? </span>
            <button
              onClick={() => setShowLogin(false)}
              style={{
                color: "#4f46e5",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </div>
        </>
      ) : (
        <>
          <Register onSuccess={onAuthSuccess} />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span>Already have an account? </span>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                color: "#4f46e5",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>
        </>
      )}
    </div>
  );
}
