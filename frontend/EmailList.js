
import React, { useEffect, useState } from "react";

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetches emails from the API when the component mounts.
  useEffect(() => {
    fetch("http://localhost:5000/api/emails") 
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch emails");
        return res.json();
      })
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Email Inbox</h1>
      {loading && <p>Loading emails...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {emails.length === 0 && !loading && <p>No emails found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {emails.map((email, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "1rem",
              padding: "1rem",
            }}
          >
            <h3>{email.subject || "(No Subject)"}</h3>
            <p>
              <strong>From:</strong> {email.from}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {email.date ? new Date(email.date).toLocaleString() : "N/A"}
            </p>
            <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "1rem" }}>
              {email.text || "No message content"}
            </pre>                                                                                                              
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmailList;
