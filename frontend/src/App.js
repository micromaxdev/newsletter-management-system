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

// //working code
// import React, { useEffect, useState } from "react";

// function App() {
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
//       <h1>Newsletter Inbox</h1>
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

// export default App;
// // working code
// import React, { useEffect, useState } from "react";
// import { Mail, Shield, RefreshCw } from "lucide-react";
// import AdminDashboard from "./AdminDashboard"; // Import your actual AdminDashboard

// // Modal wrapper for AdminDashboard
// const AdminModal = ({ onClose }) => {
//   return (
//     <div style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 1000,
//       overflow: 'auto'
//     }}>
//       <div style={{
//         backgroundColor: 'white',
//         borderRadius: '12px',
//         maxWidth: '95vw',
//         maxHeight: '95vh',
//         width: '100%',
//         overflow: 'auto',
//         position: 'relative'
//       }}>
//         <button 
//           onClick={onClose}
//           style={{
//             position: 'absolute',
//             top: '1rem',
//             right: '1rem',
//             backgroundColor: '#dc2626',
//             color: 'white',
//             padding: '8px 16px',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             zIndex: 1001
//           }}
//         >
//           Close
//         </button>
//         <AdminDashboard />
//       </div>
//     </div>
//   );
// };

// function App() {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showAdmin, setShowAdmin] = useState(false);


// const fetchEmails = async () => {
//   setLoading(true);
//   setError("");
//   try {
//     let response;
//     try {
//       response = await fetch("/api/emails");
//     } catch {
//       response = await fetch("http://localhost:5006/api/emails");
//     }
//     if (!response.ok) throw new Error("Failed to fetch emails");
//     const contentType = response.headers.get("content-type");
//     if (!contentType || !contentType.includes("application/json")) {
//       throw new Error("Server did not return JSON. Check your backend.");
//     }
//     const data = await response.json();
//     setEmails(data);
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     fetchEmails();
//   }, []);

//   // Display emails in original order
//   const displayEmails = emails;

//   return (
//     <div style={{ 
//       minHeight: '100vh',
//       backgroundColor: '#f8fafc',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     }}>
//       {/* Header */}
//       <header style={{
//         backgroundColor: 'white',
//         borderBottom: '1px solid #e2e8f0',
//         padding: '1rem 0',
//         position: 'sticky',
//         top: 0,
//         zIndex: 100
//       }}>
//         <div style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           padding: '0 1rem',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <Mail size={32} color="#4f46e5" style={{ marginRight: '12px' }} />
//             <h1 style={{ 
//               margin: 0, 
//               fontSize: '1.5rem', 
//               fontWeight: '600',
//               color: '#1e293b'
//             }}>
//               Newsletter Inbox
//             </h1>
//           </div>
          
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             {/* <button
//               onClick={fetchEmails}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '8px 16px',
//                 backgroundColor: '#f1f5f9',
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 color: '#475569'
//               }}
//             >
//               <RefreshCw size={16} style={{ marginRight: '6px' }} />
//               Refresh
//             </button>
//              */}
//             <button
//               onClick={() => setShowAdmin(true)}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '8px 16px',
//                 backgroundColor: '#4f46e5',
//                 border: 'none',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 color: 'white'
//               }}
//             >
//               <Shield size={16} style={{ marginRight: '6px' }} />
//               Admin
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

//         {/* Status Messages */}
//         {loading && (
//           <div style={{
//             textAlign: 'center',
//             padding: '3rem',
//             color: '#64748b'
//           }}>
//             <div style={{
//               display: 'inline-block',
//               width: '32px',
//               height: '32px',
//               border: '3px solid #e2e8f0',
//               borderTop: '3px solid #4f46e5',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite',
//               marginBottom: '1rem'
//             }}></div>
//             <p>Loading emails...</p>
//           </div>
//         )}

//         {error && (
//           <div style={{
//             backgroundColor: '#fef2f2',
//             border: '1px solid #fecaca',
//             color: '#dc2626',
//             padding: '1rem',
//             borderRadius: '8px',
//             marginBottom: '1rem'
//           }}>
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {!loading && !error && displayEmails.length === 0 && (
//           <div style={{
//             textAlign: 'center',
//             padding: '3rem',
//             backgroundColor: 'white',
//             borderRadius: '12px',
//             boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//           }}>
//             <Mail size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
//             <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
//               No emails found.
//             </p>
//           </div>
//         )}

//         {/* Email List */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//           {displayEmails.map((email, index) => (
//             <div
//               key={index}
//               style={{
//                 backgroundColor: 'white',
//                 borderRadius: '12px',
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                 overflow: 'hidden',
//                 transition: 'transform 0.2s, box-shadow 0.2s'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.transform = 'translateY(-1px)';
//                 e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
//               }}
//             >
//               <div style={{ padding: '1.5rem' }}>
//                 <div style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-start',
//                   marginBottom: '1rem'
//                 }}>
//                   <h3 style={{
//                     margin: 0,
//                     fontSize: '1.1rem',
//                     fontWeight: '600',
//                     color: '#1e293b',
//                     lineHeight: '1.4'
//                   }}>
//                     {email.subject || "(No Subject)"}
//                   </h3>
//                   <span style={{
//                     fontSize: '14px',
//                     color: '#64748b',
//                     whiteSpace: 'nowrap',
//                     marginLeft: '1rem'
//                   }}>
//                     {email.date ? new Date(email.date).toLocaleDateString() : "N/A"}
//                   </span>
//                 </div>
                
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   marginBottom: '1rem',
//                   fontSize: '14px',
//                   color: '#64748b'
//                 }}>
//                   <Mail size={16} style={{ marginRight: '8px' }} />
//                   <strong>From:</strong> 
//                   <span style={{ marginLeft: '8px' }}>{email.from}</span>
//                 </div>

//                 <div style={{
//                   backgroundColor: '#f8fafc',
//                   padding: '1rem',
//                   borderRadius: '8px',
//                   border: '1px solid #e2e8f0'
//                 }}>
//                   <pre style={{
//                     whiteSpace: 'pre-wrap',
//                     wordWrap: 'break-word',
//                     margin: 0,
//                     fontSize: '14px',
//                     lineHeight: '1.5',
//                     color: '#374151',
//                     fontFamily: 'inherit'
//                   }}>
//                     {email.text || "No message content"}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Email Count */}
//         {!loading && displayEmails.length > 0 && (
//           <div style={{
//             textAlign: 'center',
//             marginTop: '2rem',
//             padding: '1rem',
//             color: '#64748b',
//             fontSize: '14px'
//           }}>
//             Showing {displayEmails.length} emails
//           </div>
//         )}
//       </main>

//       {/* Admin Modal */}
//       {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}

//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default App;

// working

// import React, { useEffect, useState } from "react";
// import { Mail, Shield, RefreshCw } from "lucide-react";
// import AdminDashboard from "./AdminDashboard"; // Import your actual AdminDashboard

// // Modal wrapper for AdminDashboard
// const AdminModal = ({ onClose }) => {
//   return (
//     <div style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 1000,
//       overflow: 'auto'
//     }}>
//       <div style={{
//         backgroundColor: 'white',
//         borderRadius: '12px',
//         maxWidth: '95vw',
//         maxHeight: '95vh',
//         width: '100%',
//         overflow: 'auto',
//         position: 'relative'
//       }}>
//         <button 
//           onClick={onClose}
//           style={{
//             position: 'absolute',
//             top: '1rem',
//             right: '1rem',
//             backgroundColor: '#dc2626',
//             color: 'white',
//             padding: '8px 16px',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             zIndex: 1001
//           }}
//         >
//           Close
//         </button>
//         <AdminDashboard />
//       </div>
//     </div>
//   );
// };

// function App() {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showAdmin, setShowAdmin] = useState(false);

//   // Fetch emails from the database (use /api/emails/saved)
//   const fetchEmails = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       let response;
//       try {
//         response = await fetch("/api/emails/saved");
//       } catch {
//         response = await fetch("http://localhost:5007/api/emails/saved");
//       }
//       if (!response.ok) throw new Error("Failed to fetch emails");
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         throw new Error("Server did not return JSON. Check your backend.");
//       }
//       const data = await response.json();
//       setEmails(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmails();
//   }, []);

//   // Helper to format the "from" field
//   function formatSender(from) {
//     if (!from) return "Unknown";
//     if (typeof from === "string") return from;
//     if (from.name && from.address) return `${from.name} <${from.address}>`;
//     if (from.address) return from.address;
//     return "Unknown";
//   }

//   // Display emails in original order
//   const displayEmails = emails;

//   return (
//     <div style={{ 
//       minHeight: '100vh',
//       backgroundColor: '#f8fafc',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     }}>
//       {/* Header */}
//       <header style={{
//         backgroundColor: 'white',
//         borderBottom: '1px solid #e2e8f0',
//         padding: '1rem 0',
//         position: 'sticky',
//         top: 0,
//         zIndex: 100
//       }}>
//         <div style={{
//           maxWidth: '1200px',
//           margin: '0 auto',
//           padding: '0 1rem',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <Mail size={32} color="#4f46e5" style={{ marginRight: '12px' }} />
//             <h1 style={{ 
//               margin: 0, 
//               fontSize: '1.5rem', 
//               fontWeight: '600',
//               color: '#1e293b'
//             }}>
//               Newsletter Inbox
//             </h1>
//           </div>
          
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             {/* <button
//               onClick={fetchEmails}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '8px 16px',
//                 backgroundColor: '#f1f5f9',
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 color: '#475569'
//               }}
//             >
//               <RefreshCw size={16} style={{ marginRight: '6px' }} />
//               Refresh
//             </button>
//              */}
//             <button
//               onClick={() => setShowAdmin(true)}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: '8px 16px',
//                 backgroundColor: '#4f46e5',
//                 border: 'none',
//                 borderRadius: '6px',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//                 color: 'white'
//               }}
//             >
//               <Shield size={16} style={{ marginRight: '6px' }} />
//               Admin
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

//         {/* Status Messages */}
//         {loading && (
//           <div style={{
//             textAlign: 'center',
//             padding: '3rem',
//             color: '#64748b'
//           }}>
//             <div style={{
//               display: 'inline-block',
//               width: '32px',
//               height: '32px',
//               border: '3px solid #e2e8f0',
//               borderTop: '3px solid #4f46e5',
//               borderRadius: '50%',
//               animation: 'spin 1s linear infinite',
//               marginBottom: '1rem'
//             }}></div>
//             <p>Loading emails...</p>
//           </div>
//         )}

//         {error && (
//           <div style={{
//             backgroundColor: '#fef2f2',
//             border: '1px solid #fecaca',
//             color: '#dc2626',
//             padding: '1rem',
//             borderRadius: '8px',
//             marginBottom: '1rem'
//           }}>
//             <strong>Error:</strong> {error}
//           </div>
//         )}

//         {!loading && !error && displayEmails.length === 0 && (
//           <div style={{
//             textAlign: 'center',
//             padding: '3rem',
//             backgroundColor: 'white',
//             borderRadius: '12px',
//             boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//           }}>
//             <Mail size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
//             <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
//               No emails found.
//             </p>
//           </div>
//         )}

//         {/* Email List */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//           {displayEmails.map((email, index) => (
//             <div
//               key={index}
//               style={{
//                 backgroundColor: 'white',
//                 borderRadius: '12px',
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                 overflow: 'hidden',
//                 transition: 'transform 0.2s, box-shadow 0.2s'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.transform = 'translateY(-1px)';
//                 e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.transform = 'translateY(0)';
//                 e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
//               }}
//             >
//               <div style={{ padding: '1.5rem' }}>
//                 <div style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-start',
//                   marginBottom: '1rem'
//                 }}>
//                   <h3 style={{
//                     margin: 0,
//                     fontSize: '1.1rem',
//                     fontWeight: '600',
//                     color: '#1e293b',
//                     lineHeight: '1.4'
//                   }}>
//                     {email.subject || "(No Subject)"}
//                   </h3>
//                   <span style={{
//                     fontSize: '14px',
//                     color: '#64748b',
//                     whiteSpace: 'nowrap',
//                     marginLeft: '1rem'
//                   }}>
//                     {email.date ? new Date(email.date).toLocaleDateString() : "N/A"}
//                   </span>
//                 </div>
                
//                 <div style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   marginBottom: '1rem',
//                   fontSize: '14px',
//                   color: '#64748b'
//                 }}>
//                   <Mail size={16} style={{ marginRight: '8px' }} />
//                   <strong>From:</strong> 
//                   <span style={{ marginLeft: '8px' }}>
//                     {formatSender(email.from)}
//                   </span>
//                 </div>

//                 <div style={{
//                   backgroundColor: '#f8fafc',
//                   padding: '1rem',
//                   borderRadius: '8px',
//                   border: '1px solid #e2e8f0'
//                 }}>
//                   <pre style={{
//                     whiteSpace: 'pre-wrap',
//                     wordWrap: 'break-word',
//                     margin: 0,
//                     fontSize: '14px',
//                     lineHeight: '1.5',
//                     color: '#374151',
//                     fontFamily: 'inherit'
//                   }}>
//                     {email.text || "No message content"}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Email Count */}
//         {!loading && displayEmails.length > 0 && (
//           <div style={{
//             textAlign: 'center',
//             marginTop: '2rem',
//             padding: '1rem',
//             color: '#64748b',
//             fontSize: '14px'
//           }}>
//             Showing {displayEmails.length} emails
//           </div>
//         )}
//       </main>

//       {/* Admin Modal */}
//       {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}

//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { Mail, Shield } from "lucide-react";
import AdminDashboard from "./AdminDashboard";

// Admin Modal
const AdminModal = ({ onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, overflow: 'auto'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      width: '100%',
      overflow: 'auto',
      position: 'relative'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 1001
        }}
      >
        Close
      </button>
      <AdminDashboard />
    </div>
  </div>
);

function App() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);


useEffect(() => {
  const fetchEmails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/emails/saved");
      if (!res.ok) throw new Error("Failed to fetch emails");
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON. Check your backend.");
      }
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


    fetchEmails();
  }, []);

  const formatSender = (from) => {
    if (!from) return "Unknown";
    if (typeof from === "string") return from;
    if (from.name && from.address) return `${from.name} <${from.address}>`;
    if (from.address) return from.address;
    return "Unknown";
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Mail size={32} color="#4f46e5" style={{ marginRight: '12px' }} />
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
              MMX Newsletter Inbox
            </h1>
          </div>
          <button
            onClick={() => setShowAdmin(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'white'
            }}
          >
            <Shield size={16} style={{ marginRight: '6px' }} />
            Admin
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {loading && (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Loading emails...</p>
        )}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        {!loading && !error && emails.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Mail size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No emails found.</p>
          </div>
        )}

        {/* Email List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {emails.map((email, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '0.5rem'
              }}>
                {email.subject || "(No Subject)"}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                <Mail size={14} style={{ marginRight: '6px' }} />
                <strong>From:</strong> {formatSender(email.from)}
              </p>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                <strong>Date:</strong> {email.date ? new Date(email.date).toLocaleString() : "N/A"}
              </p>
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                backgroundColor: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                color: '#374151'
              }}>
                {email.text || "No message content"}
              </pre>
            </div>
          ))}
        </div>
      </main>

      {/* Admin Modal */}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
    </div>
  );
}

export default App;