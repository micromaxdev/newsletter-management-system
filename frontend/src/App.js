// //working code
// // import React, { useEffect, useState } from "react";
// // import { Mail, Shield } from "lucide-react";
// // import AdminDashboard from "./AdminDashboard";

// // // Admin Modal
// // const AdminModal = ({ onClose }) => (
// //   <div style={{
// //     position: 'fixed',
// //     top: 0, left: 0, right: 0, bottom: 0,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     display: 'flex', alignItems: 'center', justifyContent: 'center',
// //     zIndex: 1000, overflow: 'auto'
// //   }}>
// //     <div style={{
// //       backgroundColor: 'white',
// //       borderRadius: '12px',
// //       maxWidth: '95vw',
// //       maxHeight: '95vh',
// //       width: '100%',
// //       overflow: 'auto',
// //       position: 'relative'
// //     }}>
// //       <button
// //         onClick={onClose}
// //         style={{
// //           position: 'absolute',
// //           top: '1rem',
// //           right: '1rem',
// //           backgroundColor: '#dc2626',
// //           color: 'white',
// //           padding: '8px 16px',
// //           border: 'none',
// //           borderRadius: '6px',
// //           cursor: 'pointer',
// //           zIndex: 1001
// //         }}
// //       >
// //         Close
// //       </button>
// //       <AdminDashboard />
// //     </div>
// //   </div>
// // );

// // function App() {
// //   const [emails, setEmails] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [showAdmin, setShowAdmin] = useState(false);


// // useEffect(() => {
// //   const fetchEmails = async () => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await fetch("/api/emails/saved");
// //       if (!res.ok) throw new Error("Failed to fetch emails");
// //       const contentType = res.headers.get("content-type");
// //       if (!contentType || !contentType.includes("application/json")) {
// //         throw new Error("Server did not return JSON. Check your backend.");
// //       }
// //       const data = await res.json();
// //       setEmails(data);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };


// //     fetchEmails();
// //   }, []);

// //   const formatSender = (from) => {
// //     if (!from) return "Unknown";
// //     if (typeof from === "string") return from;
// //     if (from.name && from.address) return `${from.name} <${from.address}>`;
// //     if (from.address) return from.address;
// //     return "Unknown";
// //   };

// //   return (
// //     <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
// //       {/* Header */}
// //       <header style={{
// //         backgroundColor: 'white',
// //         borderBottom: '1px solid #e2e8f0',
// //         padding: '1rem 0',
// //         position: 'sticky',
// //         top: 0,
// //         zIndex: 100
// //       }}>
// //         <div style={{
// //           maxWidth: '1200px',
// //           margin: '0 auto',
// //           padding: '0 1rem',
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'space-between'
// //         }}>
// //           <div style={{ display: 'flex', alignItems: 'center' }}>
// //             <Mail size={32} color="#4f46e5" style={{ marginRight: '12px' }} />
// //             <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
// //               MMX Newsletter Inbox
// //             </h1>
// //           </div>
// //           <button
// //             onClick={() => setShowAdmin(true)}
// //             style={{
// //               display: 'flex',
// //               alignItems: 'center',
// //               padding: '8px 16px',
// //               backgroundColor: '#4f46e5',
// //               border: 'none',
// //               borderRadius: '6px',
// //               cursor: 'pointer',
// //               fontSize: '14px',
// //               color: 'white'
// //             }}
// //           >
// //             <Shield size={16} style={{ marginRight: '6px' }} />
// //             Admin
// //           </button>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
// //         {loading && (
// //           <p style={{ textAlign: 'center', color: '#64748b' }}>Loading emails...</p>
// //         )}
// //         {error && (
// //           <div style={{
// //             backgroundColor: '#fef2f2',
// //             border: '1px solid #fecaca',
// //             color: '#dc2626',
// //             padding: '1rem',
// //             borderRadius: '8px',
// //             marginBottom: '1rem'
// //           }}>
// //             <strong>Error:</strong> {error}
// //           </div>
// //         )}
// //         {!loading && !error && emails.length === 0 && (
// //           <div style={{
// //             textAlign: 'center',
// //             padding: '3rem',
// //             backgroundColor: 'white',
// //             borderRadius: '12px',
// //             boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
// //           }}>
// //             <Mail size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
// //             <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No emails found.</p>
// //           </div>
// //         )}

// //         {/* Email List */}
// //         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
// //           {emails.map((email, i) => (
// //             <div key={i} style={{
// //               backgroundColor: 'white',
// //               borderRadius: '12px',
// //               boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
// //               padding: '1.5rem'
// //             }}>
// //               <h3 style={{
// //                 fontSize: '1.1rem',
// //                 fontWeight: '600',
// //                 color: '#1e293b',
// //                 marginBottom: '0.5rem'
// //               }}>
// //                 {email.subject || "(No Subject)"}
// //               </h3>
// //               <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
// //                 <Mail size={14} style={{ marginRight: '6px' }} />
// //                 <strong>From:</strong> {formatSender(email.from)}
// //               </p>
// //               <p style={{ fontSize: '14px', color: '#64748b' }}>
// //                 <strong>Date:</strong> {email.date ? new Date(email.date).toLocaleString() : "N/A"}
// //               </p>
// //               <pre style={{
// //                 whiteSpace: 'pre-wrap',
// //                 wordWrap: 'break-word',
// //                 backgroundColor: '#f8fafc',
// //                 padding: '1rem',
// //                 borderRadius: '8px',
// //                 border: '1px solid #e2e8f0',
// //                 fontSize: '14px',
// //                 color: '#374151'
// //               }}>
// //                 {email.text || "No message content"}
// //               </pre>
// //             </div>
// //           ))}
// //         </div>
// //       </main>

// //       {/* Admin Modal */}
// //       {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
// //     </div>
// //   );
// // }

// // export default App;


// //working code pt2
// import React, { useEffect, useState } from "react";
// import { Mail, Shield, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";

// // Admin Dashboard Component (simplified for space)
// const AdminDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loginData, setLoginData] = useState({ username: '', password: '' });
//   const [authorizedEmails, setAuthorizedEmails] = useState([
//     { id: 1, email: 'newslettertester885@gmail.com', status: 'active', addedDate: '2025-06-10'}
//   ]);
//   const [newEmail, setNewEmail] = useState('');
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const adminCredentials = { username: 'admin', password: 'admin123' };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (loginData.username === adminCredentials.username && 
//         loginData.password === adminCredentials.password) {
//       setIsAuthenticated(true);
//       setMessage({ type: 'success', text: 'Login successful!' });
//     } else {
//       setMessage({ type: 'error', text: 'Invalid credentials' });
//     }
//   };

//   const handleAddEmail = (e) => {
//     e.preventDefault();
//     if (!newEmail || !newEmail.includes('@')) {
//       setMessage({ type: 'error', text: 'Please enter a valid email address' });
//       return;
//     }
//     const newEmailEntry = {
//       id: Date.now(),
//       email: newEmail,
//       status: 'active',
//       addedDate: new Date().toISOString().split('T')[0]
//     };
//     setAuthorizedEmails([...authorizedEmails, newEmailEntry]);
//     setNewEmail('');
//     setMessage({ type: 'success', text: 'Email added successfully!' });
//   };

//   if (!isAuthenticated) {
//     return (
//       <div style={{ padding: '2rem', textAlign: 'center' }}>
//         <h2>Admin Login</h2>
//         {message.text && (
//           <div style={{
//             marginBottom: '1rem',
//             padding: '12px',
//             borderRadius: '8px',
//             backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
//             color: message.type === 'error' ? '#dc2626' : '#16a34a'
//           }}>
//             {message.text}
//           </div>
//         )}
//         <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: '0 auto' }}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={loginData.username}
//             onChange={(e) => setLoginData({...loginData, username: e.target.value})}
//             style={{ width: '100%', padding: '8px', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={loginData.password}
//             onChange={(e) => setLoginData({...loginData, password: e.target.value})}
//             style={{ width: '100%', padding: '8px', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//           <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}>
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Admin Dashboard</h2>
//       <div style={{ marginBottom: '2rem' }}>
//         <h3>Add Email</h3>
//         <form onSubmit={handleAddEmail} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
//           <input
//             type="email"
//             placeholder="Enter email address"
//             value={newEmail}
//             onChange={(e) => setNewEmail(e.target.value)}
//             style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//           <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}>
//             Add Email
//           </button>
//         </form>
//         {message.text && (
//           <div style={{
//             padding: '12px',
//             borderRadius: '8px',
//             backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
//             color: message.type === 'error' ? '#dc2626' : '#16a34a'
//           }}>
//             {message.text}
//           </div>
//         )}
//       </div>
//       <div>
//         <h3>Authorized Emails</h3>
//         <ul style={{ listStyle: 'none', padding: 0 }}>
//           {authorizedEmails.map((email) => (
//             <li key={email.id} style={{ padding: '8px', backgroundColor: '#f8f9fa', marginBottom: '4px', borderRadius: '4px' }}>
//               {email.email} - {email.status}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// // Admin Modal
// const AdminModal = ({ onClose }) => (
//   <div style={{
//     position: 'fixed',
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     zIndex: 1000
//   }}>
//     <div style={{
//       backgroundColor: 'white',
//       borderRadius: '12px',
//       maxWidth: '800px',
//       maxHeight: '80vh',
//       width: '90%',
//       overflow: 'auto',
//       position: 'relative'
//     }}>
//       <button
//         onClick={onClose}
//         style={{
//           position: 'absolute',
//           top: '1rem',
//           right: '1rem',
//           backgroundColor: '#dc2626',
//           color: 'white',
//           padding: '8px 16px',
//           border: 'none',
//           borderRadius: '6px',
//           cursor: 'pointer',
//           zIndex: 1001
//         }}
//       >
//         Close
//       </button>
//       <AdminDashboard />
//     </div>
//   </div>
// );

// // Folder Tree Component
// const FolderTree = ({ folders, selectedFolder, onFolderSelect, emailCounts }) => {
//   const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

//   const toggleFolder = (folderId) => {
//     const newExpanded = new Set(expandedFolders);
//     if (newExpanded.has(folderId)) {
//       newExpanded.delete(folderId);
//     } else {
//       newExpanded.add(folderId);
//     }
//     setExpandedFolders(newExpanded);
//   };

//   const renderFolder = (folder, level = 0) => {
//     const hasChildren = folder.children && folder.children.length > 0;
//     const isExpanded = expandedFolders.has(folder._id);
//     const isSelected = selectedFolder === folder._id;
//     const emailCount = emailCounts[folder._id] || 0;

//     return (
//       <div key={folder._id}>
//         <div
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             padding: '8px 12px',
//             marginLeft: `${level * 20}px`,
//             cursor: 'pointer',
//             backgroundColor: isSelected ? '#e0e7ff' : 'transparent',
//             borderRadius: '6px',
//             margin: '2px 0',
//             transition: 'all 0.2s'
//           }}
//           onClick={() => onFolderSelect(folder._id)}
//         >
//           {hasChildren && (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleFolder(folder._id);
//               }}
//               style={{
//                 background: 'none',
//                 border: 'none',
//                 padding: '2px',
//                 cursor: 'pointer',
//                 marginRight: '4px',
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//             </button>
//           )}
//           {!hasChildren && <div style={{ width: '20px' }} />}
          
//           {isExpanded || !hasChildren ? (
//             <FolderOpen size={16} color="#f59e0b" style={{ marginRight: '8px' }} />
//           ) : (
//             <Folder size={16} color="#f59e0b" style={{ marginRight: '8px' }} />
//           )}
          
//           <span style={{ 
//             flex: 1, 
//             fontSize: '14px',
//             fontWeight: isSelected ? '600' : '400',
//             color: isSelected ? '#4f46e5' : '#374151'
//           }}>
//             {folder.name}
//           </span>
          
//           {emailCount > 0 && (
//             <span style={{
//               backgroundColor: '#e5e7eb',
//               color: '#374151',
//               fontSize: '12px',
//               padding: '2px 8px',
//               borderRadius: '12px',
//               marginLeft: '8px'
//             }}>
//               {emailCount}
//             </span>
//           )}
//         </div>
        
//         {hasChildren && isExpanded && (
//           <div>
//             {folder.children.map(child => renderFolder(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div style={{
//       backgroundColor: 'white',
//       borderRadius: '12px',
//       boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//       padding: '1rem',
//       height: 'fit-content'
//     }}>
//       <h3 style={{ 
//         margin: '0 0 1rem 0', 
//         fontSize: '1.1rem', 
//         fontWeight: '600',
//         color: '#1e293b',
//         display: 'flex',
//         alignItems: 'center'
//       }}>
//         <Folder size={20} style={{ marginRight: '8px' }} />
//         Email Folders
//       </h3>
//       <div>
//         {folders.map(folder => renderFolder(folder))}
//       </div>
//     </div>
//   );
  
  
// };

// function App() {
//   const [emails, setEmails] = useState([]);
//   const [folders, setFolders] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showAdmin, setShowAdmin] = useState(false);
//   const [emailCounts, setEmailCounts] = useState({});

//   // Fetch folders and emails
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError("");
      
//       try {
//         // Fetch folders
//         const foldersRes = await fetch("/api/folders");
//         if (foldersRes.ok) {
//           const foldersData = await foldersRes.json();
//           setFolders(foldersData);
//         }

//         // Fetch emails
//         const emailsRes = await fetch("/api/emails/saved");
//         if (emailsRes.ok) {
//           const emailsData = await emailsRes.json();
//           setEmails(emailsData);
          
//           // Calculate email counts per folder
//           const counts = {};
//           emailsData.forEach(email => {
//             if (email.folderId) {
//               counts[email.folderId] = (counts[email.folderId] || 0) + 1;
//             }
//           });
//           setEmailCounts(counts);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter emails based on selected folder
//   const filteredEmails = selectedFolder 
//     ? emails.filter(email => email.folderId === selectedFolder)
//     : emails;

//   const formatSender = (from) => {
//     if (!from) return "Unknown";
//     if (typeof from === "string") return from;
//     if (from.name && from.address) return `${from.name} <${from.address}>`;
//     if (from.address) return from.address;
//     return "Unknown";
//   };

//   const getFolderName = (folderId) => {
//     const findFolder = (folders, id) => {
//       for (const folder of folders) {
//         if (folder._id === id) return folder.name;
//         if (folder.children) {
//           const found = findFolder(folder.children, id);
//           if (found) return found;
//         }
//       }
//       return null;
//     };
//     return findFolder(folders, folderId) || 'Unknown Folder';
//   };

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
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
//             <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
//               MMX Newsletter Inbox
//             </h1>
//           </div>
//           <button
//             onClick={() => setShowAdmin(true)}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               padding: '8px 16px',
//               backgroundColor: '#4f46e5',
//               border: 'none',
//               borderRadius: '6px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               color: 'white'
//             }}
//           >
//             <Shield size={16} style={{ marginRight: '6px' }} />
//             Admin
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main style={{ 
//         maxWidth: '1200px', 
//         margin: '0 auto', 
//         padding: '2rem 1rem',
//         display: 'grid',
//         gridTemplateColumns: '300px 1fr',
//         gap: '2rem'
//       }}>
//         {/* Sidebar with Folders */}
//         <aside>
//           <FolderTree 
//             folders={folders}
//             selectedFolder={selectedFolder}
//             onFolderSelect={setSelectedFolder}
//             emailCounts={emailCounts}
//           />
//         </aside>

//         {/* Email Content */}
//         <div>
//           {selectedFolder && (
//             <div style={{ marginBottom: '1.5rem' }}>
//               <h2 style={{ 
//                 fontSize: '1.3rem', 
//                 fontWeight: '600', 
//                 color: '#1e293b',
//                 margin: '0 0 0.5rem 0',
//                 display: 'flex',
//                 alignItems: 'center'
//               }}>
//                 <FolderOpen size={20} color="#f59e0b" style={{ marginRight: '8px' }} />
//                 {getFolderName(selectedFolder)}
//               </h2>
//               <p style={{ color: '#64748b', margin: 0 }}>
//                 {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''}
//               </p>
//             </div>
//           )}

//           {loading && (
//             <p style={{ textAlign: 'center', color: '#64748b' }}>Loading emails...</p>
//           )}
          
//           {error && (
//             <div style={{
//               backgroundColor: '#fef2f2',
//               border: '1px solid #fecaca',
//               color: '#dc2626',
//               padding: '1rem',
//               borderRadius: '8px',
//               marginBottom: '1rem'
//             }}>
//               <strong>Error:</strong> {error}
//             </div>
//           )}
          
//           {!loading && !error && filteredEmails.length === 0 && (
//             <div style={{
//               textAlign: 'center',
//               padding: '3rem',
//               backgroundColor: 'white',
//               borderRadius: '12px',
//               boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//             }}>
//               <Mail size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
//               <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No emails in this folder.</p>
//             </div>
//           )}

//           {/* Email List */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//             {filteredEmails.map((email, i) => (
//               <div key={email._id || i} style={{
//                 backgroundColor: 'white',
//                 borderRadius: '12px',
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//                 padding: '1.5rem'
//               }}>
//                 <h3 style={{
//                   fontSize: '1.1rem',
//                   fontWeight: '600',
//                   color: '#1e293b',
//                   marginBottom: '0.5rem'
//                 }}>
//                   {email.subject || "(No Subject)"}
//                 </h3>
//                 <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
//                   <Mail size={14} style={{ marginRight: '6px' }} />
//                   <strong>From:</strong> {formatSender(email.from)}
//                 </p>
//                 <p style={{ fontSize: '14px', color: '#64748b' }}>
//                   <strong>Date:</strong> {email.date ? new Date(email.date).toLocaleString() : "N/A"}
//                 </p>
//                 <pre style={{
//                   whiteSpace: 'pre-wrap',
//                   wordWrap: 'break-word',
//                   backgroundColor: '#f8fafc',
//                   padding: '1rem',
//                   borderRadius: '8px',
//                   border: '1px solid #e2e8f0',
//                   fontSize: '14px',
//                   color: '#374151'
//                 }}>
//                   {email.text || "No message content"}
//                 </pre>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* Admin Modal */}
//       {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import {
  Mail,
  Shield,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

/** ------------------ Admin Dashboard ------------------ **/
const AdminDashboard = () => {
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
        <form
          onSubmit={handleLogin}
          style={{ maxWidth: "300px", margin: "0 auto" }}
        >
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
            type="submit"
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
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <div style={{ marginBottom: "2rem" }}>
        <h3>Add Email</h3>
        <form
          onSubmit={handleAddEmail}
          style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
        >
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
            type="submit"
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
        </form>
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
};

/** ------------------ Admin Modal ------------------ **/
const AdminModal = ({ onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        maxWidth: "800px",
        width: "90%",
        maxHeight: "90vh",
        overflow: "auto",
        position: "relative",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          backgroundColor: "#dc2626",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          zIndex: 1001,
        }}
      >
        Close
      </button>
      <AdminDashboard />
    </div>
  </div>
);

/** ------------------ FolderTree ------------------ **/
const FolderTree = ({ folders, selectedFolder, onFolderSelect, emailCounts }) => (
  <div
    style={{
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      padding: "1rem",
    }}
  >
    <h3
      style={{
        margin: "0 0 1rem 0",
        fontSize: "1.1rem",
        fontWeight: "600",
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Folder size={20} style={{ marginRight: "8px" }} />
      Email Folders
    </h3>
    {folders.map((folder) => (
      <div
        key={folder._id}
        onClick={() => onFolderSelect(folder._id)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          cursor: "pointer",
          backgroundColor: selectedFolder === folder._id ? "#e0e7ff" : "transparent",
          borderRadius: "6px",
          margin: "4px 0",
        }}
      >
        <FolderOpen size={16} color="#f59e0b" style={{ marginRight: "8px" }} />
        <span
          style={{
            flex: 1,
            fontSize: "14px",
            fontWeight: selectedFolder === folder._id ? "600" : "400",
            color: selectedFolder === folder._id ? "#4f46e5" : "#374151",
          }}
        >
          {folder.name}
        </span>
        {emailCounts[folder._id] > 0 && (
          <span
            style={{
              backgroundColor: "#e5e7eb",
              color: "#374151",
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "12px",
              marginLeft: "8px",
            }}
          >
            {emailCounts[folder._id]}
          </span>
        )}
      </div>
    ))}
  </div>
);

/** ------------------ App Component ------------------ **/
function App() {
  const [emails, setEmails] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [emailCounts, setEmailCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Hardcoded folders
        const hardcoded = [
          { _id: "supplier", name: "Supplier" },
          { _id: "competitor", name: "Competitor" },
          { _id: "information", name: "Information" },
          { _id: "customers", name: "Customers" },
          { _id: "tenders", name: "Tenders" },
        ];
        setFolders(hardcoded);

        // Fetch emails
        const res = await fetch("/api/emails/saved");
        const data = await res.json();
        setEmails(data);

        // Count per folder
        const counts = {};
        data.forEach((e) => {
          if (e.folderId) counts[e.folderId] = (counts[e.folderId] || 0) + 1;
        });
        setEmailCounts(counts);
      } catch (err) {
        setError("Failed to load emails");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatSender = (from) => {
    if (!from) return "Unknown";
    if (typeof from === "string") return from;
    return from.name && from.address
      ? `${from.name} <${from.address}>`
      : from.address || "Unknown";
  };

  const filteredEmails = selectedFolder
    ? emails.filter((email) => email.folderId === selectedFolder)
    : emails;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "white", padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mail size={28} color="#4f46e5" style={{ marginRight: "10px" }} />
            <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#1e293b" }}>
              MMX Newsletter Inbox
            </h1>
          </div>
          <button
            onClick={() => setShowAdmin(true)}
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Shield size={16} style={{ marginRight: "6px" }} />
            Admin
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem", padding: "2rem 1rem" }}>
        {/* Sidebar */}
        <aside>
          <FolderTree
            folders={folders}
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
            emailCounts={emailCounts}
          />
        </aside>

        {/* Email Content */}
        <section>
          {loading && <p>Loading emails...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && filteredEmails.length === 0 && (
            <p style={{ color: "#64748b" }}>No emails found in this folder.</p>
          )}
          {filteredEmails.map((email, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#1e293b" }}>
                {email.subject || "(No Subject)"}
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                <strong>From:</strong> {formatSender(email.from)}
              </p>
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                <strong>Date:</strong> {email.date ? new Date(email.date).toLocaleString() : "N/A"}
              </p>
              <pre
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#374151",
                  whiteSpace: "pre-wrap",
                  border: "1px solid #e2e8f0",
                }}
              >
                {email.text || "No message content"}
              </pre>
            </div>
          ))}
        </section>
      </main>

      {/* Admin Modal */}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
    </div>
  );
}

export default App;
