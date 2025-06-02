// import React, { useEffect, useState } from "react";

// function EmailList() {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/emails")
//       .then((res) => res.json())
//       .then((data) => {
//         setEmails(data);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div>Loading emails...</div>;

//   return (
//     <div>
//       <h2>Inbox</h2>
//       {emails.length === 0 && <div>No emails found.</div>}
//       <ul>
//         {emails.map((email, idx) => (
//           <li key={idx} style={{marginBottom: "2em"}}>
//             <strong>Subject:</strong> {email.subject} <br />
//             <strong>From:</strong> {email.from} <br />
//             <strong>Date:</strong> {email.date} <br />
//             <pre style={{whiteSpace: "pre-wrap"}}>{email.text}</pre>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default EmailList;

import React, { useEffect, useState } from "react";

function EmailList() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/emails") // Adjust this if your backend runs elsewhere
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
  }, []);

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
