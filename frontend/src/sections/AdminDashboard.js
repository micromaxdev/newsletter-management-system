import React, { useState } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [authorizedEmails, setAuthorizedEmails] = useState([
    {
      id: 1,
      email: "newslettertester885@gmail.com",
      status: "active",
      addedDate: "2025-06-10",
    },
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const adminCredentials = { username: "admin", password: "admin123" };

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginData.username === adminCredentials.username &&
      loginData.password === adminCredentials.password
    ) {
      setIsAuthenticated(true);
      setMessage({ type: "success", text: "Login successful!" });
    } else {
      setMessage({ type: "error", text: "Invalid credentials" });
    }
  };

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }
    const newEmailEntry = {
      id: Date.now(),
      email: newEmail,
      status: "active",
      addedDate: new Date().toISOString().split("T")[0],
    };
    setAuthorizedEmails([...authorizedEmails, newEmailEntry]);
    setNewEmail("");
    setMessage({ type: "success", text: "Email added successfully!" });
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Admin Login</h2>
        {message.text && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
              color: message.type === "error" ? "#dc2626" : "#16a34a",
            }}
          >
            {message.text}
          </div>
        )}
        <div style={{ maxWidth: "300px", margin: "0 auto" }}>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <div style={{ marginBottom: "2rem" }}>
        <h3>Add Email</h3>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Enter email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleAddEmail}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Add Email
          </button>
        </div>
        {message.text && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
              color: message.type === "error" ? "#dc2626" : "#16a34a",
            }}
          >
            {message.text}
          </div>
        )}
      </div>
      <div>
        <h3>Authorized Emails</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {authorizedEmails.map((email) => (
            <li
              key={email.id}
              style={{
                padding: "8px",
                backgroundColor: "#f8f9fa",
                marginBottom: "4px",
                borderRadius: "4px",
              }}
            >
              {email.email} - {email.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
