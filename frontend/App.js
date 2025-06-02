// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useEffect, useState } from "react";

function App() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/emails")
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading emails...</div>;

  return (
    <div>
      <h1>Newsletter Inbox</h1>
      {emails.length === 0 && <div>No emails found.</div>}
      <ul>
        {emails.map((email, idx) => (
          <li key={idx} style={{marginBottom: "2em"}}>
            <strong>Subject:</strong> {email.subject} <br />
            <strong>From:</strong> {email.from} <br />
            <strong>Date:</strong> {email.date} <br />
            <pre style={{whiteSpace: "pre-wrap"}}>{email.text}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;