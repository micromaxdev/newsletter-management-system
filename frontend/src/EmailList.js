// import React, { useEffect, useState } from "react";

// function EmailList() {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:5007/api/emails") 
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch emails");
//         return res.json();
//       })
//       .then((data) => {
//         setEmails(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
//       <h1>Email Inbox</h1>
//       {loading && <p>Loading emails...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {emails.length === 0 && !loading && <p>No emails found.</p>}

//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {emails.map((email, index) => (
//           <li
//             key={index}
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "8px",
//               marginBottom: "1rem",
//               padding: "1rem",
//             }}
//           >
//             <h3>{email.subject || "(No Subject)"}</h3>
//             <p>
//               <strong>From:</strong> {email.from}
//             </p>
//             <p>
//               <strong>Date:</strong>{" "}
//               {email.date ? new Date(email.date).toLocaleString() : "N/A"}
//             </p>
//             <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "1rem" }}>
//               {email.text || "No message content"}
//             </pre>                                                                                                              
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default EmailList;

import React, { useEffect, useState } from "react";
import axios from 'axios';

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await axios.get("http://localhost:5007/api/emails");
        setEmails(response.data);
      } catch (error) {
        // Handle different types of errors
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error ||
                            error.message || 
                            "Failed to fetch emails";
        setError(errorMessage);
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // Helper function to format sender information
  const formatSender = (from) => {
    if (!from) return "Unknown";
    if (typeof from === "string") return from;
    if (from.name && from.address) return `${from.name} <${from.address}>`;
    if (from.address) return from.address;
    return "Unknown";
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Email Inbox</h1>
      
      {loading && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "3px solid #f3f4f6",
            borderTop: "3px solid #4f46e5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p style={{ color: "#666", margin: "0" }}>Loading emails...</p>
        </div>
      )}
      
      {error && (
        <div style={{
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "1rem",
          border: "1px solid #fecaca"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {emails.length === 0 && !loading && !error && (
        <div style={{ 
          textAlign: "center", 
          padding: "2rem", 
          color: "#666",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}>
          <p style={{ margin: "0", fontSize: "16px" }}>No emails found.</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
            Try refreshing the page or check your email configuration.
          </p>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {emails.map((email, index) => (
          <li
            key={email._id || email.messageId || index}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              marginBottom: "1rem",
              padding: "1.5rem",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <h3 style={{
              margin: "0 0 1rem 0",
              fontSize: "1.2rem",
              color: "#1e293b",
              fontWeight: "600"
            }}>
              {email.subject || "(No Subject)"}
            </h3>
            
            <div style={{ 
              display: "flex", 
              gap: "2rem", 
              marginBottom: "1rem",
              flexWrap: "wrap"
            }}>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: "#64748b"
              }}>
                <strong style={{ color: "#374151" }}>From:</strong> {formatSender(email.from)}
              </p>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: "#64748b"
              }}>
                <strong style={{ color: "#374151" }}>Date:</strong>{" "}
                {email.date ? new Date(email.date).toLocaleString() : "N/A"}
              </p>
              {email.folderId && (
                <p style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#64748b"
                }}>
                  <strong style={{ color: "#374151" }}>Folder:</strong> {email.folderId}
                </p>
              )}
            </div>
            
            {email.text && (
              <pre style={{ 
                whiteSpace: "pre-wrap", 
                background: "#f8fafc", 
                padding: "1rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                fontFamily: "inherit",
                color: "#374151",
                margin: "0",
                overflow: "auto",
                maxHeight: "200px"
              }}>
                {email.text}
              </pre>
            )}
            
            {email.html && !email.text && (
              <div style={{
                background: "#f8fafc",
                padding: "1rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                color: "#374151"
              }}>
                <em>HTML content available (not displayed in plain text view)</em>
              </div>
            )}
            
            {!email.text && !email.html && (
              <div style={{
                background: "#fef3c7",
                padding: "1rem",
                borderRadius: "6px",
                border: "1px solid #fbbf24",
                fontSize: "14px",
                color: "#92400e"
              }}>
                <em>No readable content available</em>
              </div>
            )}
          </li>
        ))}
      </ul>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default EmailList;
