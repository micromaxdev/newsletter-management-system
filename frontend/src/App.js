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

// //working code pt 2

// import React, { useEffect, useState } from "react";
// import {
//   Mail,
//   Shield,
//   Folder,
//   FolderOpen,
//   ChevronRight,
//   ChevronDown,
// } from "lucide-react";

// /** ------------------ Admin Dashboard ------------------ **/
// const AdminDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loginData, setLoginData] = useState({ username: "", password: "" });
//   const [authorizedEmails, setAuthorizedEmails] = useState([
//     {
//       id: 1,
//       email: "newslettertester885@gmail.com",
//       status: "active",
//       addedDate: "2025-06-10",
//     },
//   ]);
//   const [newEmail, setNewEmail] = useState("");
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const adminCredentials = { username: "admin", password: "admin123" };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (
//       loginData.username === adminCredentials.username &&
//       loginData.password === adminCredentials.password
//     ) {
//       setIsAuthenticated(true);
//       setMessage({ type: "success", text: "Login successful!" });
//     } else {
//       setMessage({ type: "error", text: "Invalid credentials" });
//     }
//   };

//   const handleAddEmail = (e) => {
//     e.preventDefault();
//     if (!newEmail || !newEmail.includes("@")) {
//       setMessage({ type: "error", text: "Please enter a valid email address" });
//       return;
//     }
//     const newEmailEntry = {
//       id: Date.now(),
//       email: newEmail,
//       status: "active",
//       addedDate: new Date().toISOString().split("T")[0],
//     };
//     setAuthorizedEmails([...authorizedEmails, newEmailEntry]);
//     setNewEmail("");
//     setMessage({ type: "success", text: "Email added successfully!" });
//   };

//   if (!isAuthenticated) {
//     return (
//       <div style={{ padding: "2rem", textAlign: "center" }}>
//         <h2>Admin Login</h2>
//         {message.text && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "12px",
//               borderRadius: "8px",
//               backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
//               color: message.type === "error" ? "#dc2626" : "#16a34a",
//             }}
//           >
//             {message.text}
//           </div>
//         )}
//         <form
//           onSubmit={handleLogin}
//           style={{ maxWidth: "300px", margin: "0 auto" }}
//         >
//           <input
//             type="text"
//             placeholder="Username"
//             value={loginData.username}
//             onChange={(e) =>
//               setLoginData({ ...loginData, username: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: "8px",
//               marginBottom: "1rem",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={loginData.password}
//             onChange={(e) =>
//               setLoginData({ ...loginData, password: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: "8px",
//               marginBottom: "1rem",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               width: "100%",
//               padding: "8px",
//               backgroundColor: "#4f46e5",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//             }}
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Admin Dashboard</h2>
//       <div style={{ marginBottom: "2rem" }}>
//         <h3>Add Email</h3>
//         <form
//           onSubmit={handleAddEmail}
//           style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
//         >
//           <input
//             type="email"
//             placeholder="Enter email address"
//             value={newEmail}
//             onChange={(e) => setNewEmail(e.target.value)}
//             style={{
//               flex: 1,
//               padding: "8px",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#4f46e5",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//             }}
//           >
//             Add Email
//           </button>
//         </form>
//         {message.text && (
//           <div
//             style={{
//               padding: "12px",
//               borderRadius: "8px",
//               backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
//               color: message.type === "error" ? "#dc2626" : "#16a34a",
//             }}
//           >
//             {message.text}
//           </div>
//         )}
//       </div>
//       <div>
//         <h3>Authorized Emails</h3>
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {authorizedEmails.map((email) => (
//             <li
//               key={email.id}
//               style={{
//                 padding: "8px",
//                 backgroundColor: "#f8f9fa",
//                 marginBottom: "4px",
//                 borderRadius: "4px",
//               }}
//             >
//               {email.email} - {email.status}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// /** ------------------ Admin Modal ------------------ **/
// const AdminModal = ({ onClose }) => (
//   <div
//     style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(0,0,0,0.5)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//     }}
//   >
//     <div
//       style={{
//         backgroundColor: "white",
//         borderRadius: "12px",
//         maxWidth: "800px",
//         width: "90%",
//         maxHeight: "90vh",
//         overflow: "auto",
//         position: "relative",
//       }}
//     >
//       <button
//         onClick={onClose}
//         style={{
//           position: "absolute",
//           top: "1rem",
//           right: "1rem",
//           backgroundColor: "#dc2626",
//           color: "white",
//           padding: "8px 16px",
//           border: "none",
//           borderRadius: "6px",
//           cursor: "pointer",
//           zIndex: 1001,
//         }}
//       >
//         Close
//       </button>
//       <AdminDashboard />
//     </div>
//   </div>
// );

// /** ------------------ FolderTree ------------------ **/
// const FolderTree = ({ folders, selectedFolder, onFolderSelect, emailCounts }) => (
//   <div
//     style={{
//       backgroundColor: "white",
//       borderRadius: "12px",
//       boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//       padding: "1rem",
//     }}
//   >
//     <h3
//       style={{
//         margin: "0 0 1rem 0",
//         fontSize: "1.1rem",
//         fontWeight: "600",
//         color: "#1e293b",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Folder size={20} style={{ marginRight: "8px" }} />
//       Email Folders
//     </h3>
//     {folders.map((folder) => (
//       <div
//         key={folder._id}
//         onClick={() => onFolderSelect(folder._id)}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "8px 12px",
//           cursor: "pointer",
//           backgroundColor: selectedFolder === folder._id ? "#e0e7ff" : "transparent",
//           borderRadius: "6px",
//           margin: "4px 0",
//         }}
//       >
//         <FolderOpen size={16} color="#f59e0b" style={{ marginRight: "8px" }} />
//         <span
//           style={{
//             flex: 1,
//             fontSize: "14px",
//             fontWeight: selectedFolder === folder._id ? "600" : "400",
//             color: selectedFolder === folder._id ? "#4f46e5" : "#374151",
//           }}
//         >
//           {folder.name}
//         </span>
//         {emailCounts[folder._id] > 0 && (
//           <span
//             style={{
//               backgroundColor: "#e5e7eb",
//               color: "#374151",
//               fontSize: "12px",
//               padding: "2px 8px",
//               borderRadius: "12px",
//               marginLeft: "8px",
//             }}
//           >
//             {emailCounts[folder._id]}
//           </span>
//         )}
//       </div>
//     ))}
//   </div>
// );

// /** ------------------ App Component ------------------ **/
// function App() {
//   const [emails, setEmails] = useState([]);
//   const [folders, setFolders] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState(null);
//   const [emailCounts, setEmailCounts] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showAdmin, setShowAdmin] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Hardcoded folders
//         const hardcoded = [
//           { _id: "supplier", name: "Supplier" },
//           { _id: "competitor", name: "Competitor" },
//           { _id: "information", name: "Information" },
//           { _id: "customers", name: "Customers" },
//           { _id: "tenders", name: "Tenders" },
//         ];
//         setFolders(hardcoded);

//         // Fetch emails
//         const res = await fetch("/api/emails/saved");
//         const data = await res.json();
//         setEmails(data);

//         // Count per folder
//         const counts = {};
//         data.forEach((e) => {
//           if (e.folderId) counts[e.folderId] = (counts[e.folderId] || 0) + 1;
//         });
//         setEmailCounts(counts);
//       } catch (err) {
//         setError("Failed to load emails");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const formatSender = (from) => {
//     if (!from) return "Unknown";
//     if (typeof from === "string") return from;
//     return from.name && from.address
//       ? `${from.name} <${from.address}>`
//       : from.address || "Unknown";
//   };

//   const filteredEmails = selectedFolder
//     ? emails.filter((email) => email.folderId === selectedFolder)
//     : emails;

//   return (
//     <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
//       {/* Header */}
//       <header style={{ backgroundColor: "white", padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Mail size={28} color="#4f46e5" style={{ marginRight: "10px" }} />
//             <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#1e293b" }}>
//               MMX Newsletter Inbox
//             </h1>
//           </div>
//           <button
//             onClick={() => setShowAdmin(true)}
//             style={{
//               backgroundColor: "#4f46e5",
//               color: "white",
//               padding: "8px 16px",
//               borderRadius: "6px",
//               border: "none",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <Shield size={16} style={{ marginRight: "6px" }} />
//             Admin
//           </button>
//         </div>
//       </header>

//       {/* Main */}
//       <main style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem", padding: "2rem 1rem" }}>
//         {/* Sidebar */}
//         <aside>
//           <FolderTree
//             folders={folders}
//             selectedFolder={selectedFolder}
//             onFolderSelect={setSelectedFolder}
//             emailCounts={emailCounts}
//           />
//         </aside>

//         {/* Email Content */}
//         <section>
//           {loading && <p>Loading emails...</p>}
//           {error && <p style={{ color: "red" }}>{error}</p>}
//           {!loading && !error && filteredEmails.length === 0 && (
//             <p style={{ color: "#64748b" }}>No emails found in this folder.</p>
//           )}
//           {filteredEmails.map((email, i) => (
//             <div
//               key={i}
//               style={{
//                 backgroundColor: "white",
//                 borderRadius: "12px",
//                 padding: "1.5rem",
//                 marginBottom: "1rem",
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//               }}
//             >
//               <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#1e293b" }}>
//                 {email.subject || "(No Subject)"}
//               </h3>
//               <p style={{ fontSize: "14px", color: "#64748b" }}>
//                 <strong>From:</strong> {formatSender(email.from)}
//               </p>
//               <p style={{ fontSize: "14px", color: "#64748b" }}>
//                 <strong>Date:</strong> {email.date ? new Date(email.date).toLocaleString() : "N/A"}
//               </p>
//               <pre
//                 style={{
//                   backgroundColor: "#f8fafc",
//                   padding: "1rem",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   color: "#374151",
//                   whiteSpace: "pre-wrap",
//                   border: "1px solid #e2e8f0",
//                 }}
//               >
//                 {email.text || "No message content"}
//               </pre>
//             </div>
//           ))}
//         </section>
//       </main>

//       {/* Admin Modal */}
//       {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useState } from "react";
// import {
//   Mail,
//   Shield,
//   Folder,
//   FolderOpen,
//   RefreshCw,
//   Search,
//   User,
//   Calendar,
//   ChevronRight,
//   Archive,
//   Users,
//   TrendingUp,
//   Info,
//   Package,
//   Inbox,
// } from "lucide-react";

// /** ------------------ Admin Dashboard ------------------ **/
// const AdminDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loginData, setLoginData] = useState({ username: "", password: "" });
//   const [authorizedEmails, setAuthorizedEmails] = useState([
//     {
//       id: 1,
//       email: "newslettertester885@gmail.com",
//       status: "active",
//       addedDate: "2025-06-10",
//     },
//   ]);
//   const [newEmail, setNewEmail] = useState("");
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const adminCredentials = { username: "admin", password: "admin123" };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (
//       loginData.username === adminCredentials.username &&
//       loginData.password === adminCredentials.password
//     ) {
//       setIsAuthenticated(true);
//       setMessage({ type: "success", text: "Login successful!" });
//     } else {
//       setMessage({ type: "error", text: "Invalid credentials" });
//     }
//   };

//   const handleAddEmail = (e) => {
//     e.preventDefault();
//     if (!newEmail || !newEmail.includes("@")) {
//       setMessage({ type: "error", text: "Please enter a valid email address" });
//       return;
//     }
//     const newEmailEntry = {
//       id: Date.now(),
//       email: newEmail,
//       status: "active",
//       addedDate: new Date().toISOString().split("T")[0],
//     };
//     setAuthorizedEmails([...authorizedEmails, newEmailEntry]);
//     setNewEmail("");
//     setMessage({ type: "success", text: "Email added successfully!" });
//   };

//   if (!isAuthenticated) {
//     return (
//       <div style={{ padding: "2rem", textAlign: "center" }}>
//         <h2>Admin Login</h2>
//         {message.text && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "12px",
//               borderRadius: "8px",
//               backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
//               color: message.type === "error" ? "#dc2626" : "#16a34a",
//             }}
//           >
//             {message.text}
//           </div>
//         )}
//         <div style={{ maxWidth: "300px", margin: "0 auto" }}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={loginData.username}
//             onChange={(e) =>
//               setLoginData({ ...loginData, username: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: "8px",
//               marginBottom: "1rem",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={loginData.password}
//             onChange={(e) =>
//               setLoginData({ ...loginData, password: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: "8px",
//               marginBottom: "1rem",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <button
//             onClick={handleLogin}
//             style={{
//               width: "100%",
//               padding: "8px",
//               backgroundColor: "#4f46e5",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//             }}
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Admin Dashboard</h2>
//       <div style={{ marginBottom: "2rem" }}>
//         <h3>Add Email</h3>
//         <div
//           style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
//         >
//           <input
//             type="email"
//             placeholder="Enter email address"
//             value={newEmail}
//             onChange={(e) => setNewEmail(e.target.value)}
//             style={{
//               flex: 1,
//               padding: "8px",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <button
//             onClick={handleAddEmail}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#4f46e5",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//             }}
//           >
//             Add Email
//           </button>
//         </div>
//         {message.text && (
//           <div
//             style={{
//               padding: "12px",
//               borderRadius: "8px",
//               backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
//               color: message.type === "error" ? "#dc2626" : "#16a34a",
//             }}
//           >
//             {message.text}
//           </div>
//         )}
//       </div>
//       <div>
//         <h3>Authorized Emails</h3>
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {authorizedEmails.map((email) => (
//             <li
//               key={email.id}
//               style={{
//                 padding: "8px",
//                 backgroundColor: "#f8f9fa",
//                 marginBottom: "4px",
//                 borderRadius: "4px",
//               }}
//             >
//               {email.email} - {email.status}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// /** ------------------ Admin Modal ------------------ **/
// const AdminModal = ({ onClose }) => (
//   <div
//     style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(0,0,0,0.5)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//     }}
//   >
//     <div
//       style={{
//         backgroundColor: "white",
//         borderRadius: "12px",
//         maxWidth: "800px",
//         width: "90%",
//         maxHeight: "90vh",
//         overflow: "auto",
//         position: "relative",
//       }}
//     >
//       <button
//         onClick={onClose}
//         style={{
//           position: "absolute",
//           top: "1rem",
//           right: "1rem",
//           backgroundColor: "#dc2626",
//           color: "white",
//           padding: "8px 16px",
//           border: "none",
//           borderRadius: "6px",
//           cursor: "pointer",
//           zIndex: 1001,
//         }}
//       >
//         Close
//       </button>
//       <AdminDashboard />
//     </div>
//   </div>
// );

// /** ------------------ FolderTree ------------------ **/
// const FolderTree = ({ folders, selectedFolder, onFolderSelect, emailCounts, onMoveEmail }) => {
//   return (
//     <div
//       style={{
//         backgroundColor: "white",
//         borderRadius: "12px",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//         padding: "1rem",
//       }}
//     >
//       <h3
//         style={{
//           margin: "0 0 1rem 0",
//           fontSize: "1.1rem",
//           fontWeight: "600",
//           color: "#1e293b",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <Folder size={20} style={{ marginRight: "8px" }} />
//         Email Folders
//       </h3>
//       {folders.map((folder) => (
//         <div
//           key={folder.id}
//           onClick={() => onFolderSelect(folder.id)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             padding: "8px 12px",
//             cursor: "pointer",
//             backgroundColor: selectedFolder === folder.id ? "#e0e7ff" : "transparent",
//             borderRadius: "6px",
//             margin: "4px 0",
//           }}
//         >
//           <folder.icon size={16} color="#f59e0b" style={{ marginRight: "8px" }} />
//           <span
//             style={{
//               flex: 1,
//               fontSize: "14px",
//               fontWeight: selectedFolder === folder.id ? "600" : "400",
//               color: selectedFolder === folder.id ? "#4f46e5" : "#374151",
//             }}
//           >
//             {folder.name}
//           </span>
//           {emailCounts[folder.id] > 0 && (
//             <span
//               style={{
//                 backgroundColor: "#e5e7eb",
//                 color: "#374151",
//                 fontSize: "12px",
//                 padding: "2px 8px",
//                 borderRadius: "12px",
//                 marginLeft: "8px",
//               }}
//             >
//               {emailCounts[folder.id]}
//             </span>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// /** ------------------ App Component ------------------ **/
// function App() {
//   const [emails, setEmails] = useState([]);
//   const [folders, setFolders] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState('inbox');
//   const [emailCounts, setEmailCounts] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showAdmin, setShowAdmin] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedEmail, setSelectedEmail] = useState(null);

//   // Enhanced folder configuration with icons
//   const folderConfig = [
//     { id: 'inbox', name: 'Inbox', icon: Inbox },
//     { id: 'supplier', name: 'Suppliers', icon: Package },
//     { id: 'competitor', name: 'Competitors', icon: TrendingUp },
//     { id: 'information', name: 'Information', icon: Info },
//     { id: 'customers', name: 'Customers', icon: Users },
//     { id: 'marketing', name: 'Marketing', icon: Mail },
//     { id: 'archive', name: 'Archive', icon: Archive }
//   ];

//   // Fetch emails for selected folder
//   const fetchEmails = async (folderId = selectedFolder) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`/api/emails/saved?folderId=${folderId}&limit=50`);
//       const data = await response.json();
      
//       if (data.emails) {
//         setEmails(data.emails);
//       } else if (Array.isArray(data)) {
//         // Fallback for older API format
//         setEmails(data.filter(email => email.folderId === folderId));
//       }
//     } catch (error) {
//       console.error('Error fetching emails:', error);
//       setEmails([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch email counts for all folders
//   const fetchEmailCounts = async () => {
//     try {
//       const response = await fetch('/api/emails/counts');
//       const data = await response.json();
//       setEmailCounts(data.counts || data);
//     } catch (error) {
//       console.error('Error fetching email counts:', error);
//     }
//   };

//   // Sync emails from server (POP3 fetch)
//   const syncEmails = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/emails');
//       const data = await response.json();
      
//       if (data.emails) {
//         console.log('Sync complete:', data.categorization);
//         // Refresh current folder and counts
//         await Promise.all([fetchEmails(), fetchEmailCounts()]);
//       }
//     } catch (error) {
//       console.error('Error syncing emails:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Move email to different folder
//   const moveEmail = async (emailId, newFolderId) => {
//     try {
//       const response = await fetch(`/api/emails/${emailId}/folder`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ folderId: newFolderId }),
//       });

//       if (response.ok) {
//         // Remove email from current view if moved to different folder
//         if (newFolderId !== selectedFolder) {
//           setEmails(emails.filter(email => email._id !== emailId));
//         }
//         // Refresh counts
//         fetchEmailCounts();
//       }
//     } catch (error) {
//       console.error('Error moving email:', error);
//     }
//   };

//   // Search emails
//   const searchEmails = async () => {
//     if (!searchQuery.trim()) {
//       fetchEmails();
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`/api/emails/search?q=${encodeURIComponent(searchQuery)}&folderId=${selectedFolder}`);
//       const data = await response.json();
//       setEmails(data.results || []);
//     } catch (error) {
//       console.error('Error searching emails:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return 'Today';
//     if (diffDays === 2) return 'Yesterday';
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   const formatSender = (from) => {
//     if (!from) return "Unknown";
//     if (typeof from === "string") return from;
//     return from.name && from.address
//       ? `${from.name} <${from.address}>`
//       : from.address || "Unknown";
//   };

//   // Initial load
//   useEffect(() => {
//     setFolders(folderConfig);
//     fetchEmailCounts();
//     fetchEmails();
//   }, []);

//   // Refetch emails when folder changes
//   useEffect(() => {
//     fetchEmails(selectedFolder);
//   }, [selectedFolder]);

//   // Search when query changes
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       if (searchQuery) {
//         searchEmails();
//       }
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [searchQuery]);

//   const filteredEmails = emails;

//   return (
//     <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
//       {/* Header */}
//       <header style={{ backgroundColor: "white", padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Mail size={28} color="#4f46e5" style={{ marginRight: "10px" }} />
//             <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#1e293b" }}>
//               MMX Newsletter Inbox
//             </h1>
//           </div>
          
//           {/* Search and Controls */}
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <div style={{ position: "relative" }}>
//               <Search size={16} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
//               <input
//                 type="text"
//                 placeholder="Search emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{
//                   paddingLeft: "32px",
//                   paddingRight: "12px",
//                   paddingTop: "6px",
//                   paddingBottom: "6px",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "6px",
//                   fontSize: "14px",
//                   width: "200px"
//                 }}
//               />
//             </div>
            
//             <button
//               onClick={syncEmails}
//               disabled={loading}
//               style={{
//                 backgroundColor: "#10b981",
//                 color: "white",
//                 padding: "6px 12px",
//                 borderRadius: "6px",
//                 border: "none",
//                 cursor: loading ? "not-allowed" : "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 opacity: loading ? 0.6 : 1
//               }}
//             >
//               <RefreshCw size={16} style={{ marginRight: "6px", animation: loading ? "spin 1s linear infinite" : "none" }} />
//               Sync
//             </button>
            
//             <button
//               onClick={() => setShowAdmin(true)}
//               style={{
//                 backgroundColor: "#4f46e5",
//                 color: "white",
//                 padding: "8px 16px",
//                 borderRadius: "6px",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <Shield size={16} style={{ marginRight: "6px" }} />
//               Admin
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem", padding: "2rem 1rem" }}>
//         {/* Sidebar */}
//         <aside>
//           <FolderTree
//             folders={folders}
//             selectedFolder={selectedFolder}
//             onFolderSelect={setSelectedFolder}
//             emailCounts={emailCounts}
//             onMoveEmail={moveEmail}
//           />
//         </aside>

//         {/* Email Content */}
//         <section>
//           {/* Folder Header */}
//           <div style={{ marginBottom: "1rem" }}>
//             <h2 style={{ fontSize: "1.2rem", color: "#1e293b", margin: 0 }}>
//               {folders.find(f => f.id === selectedFolder)?.name || 'Inbox'} 
//               <span style={{ fontSize: "0.9rem", color: "#64748b", marginLeft: "8px" }}>
//                 ({filteredEmails.length} emails)
//               </span>
//             </h2>
//           </div>

//           {loading && (
//             <div style={{ textAlign: "center", padding: "2rem" }}>
//               <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: "8px" }} />
//               <p style={{ color: "#64748b" }}>Loading emails...</p>
//             </div>
//           )}
          
//           {error && <p style={{ color: "red" }}>{error}</p>}
          
//           {!loading && !error && filteredEmails.length === 0 && (
//             <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
//               <Mail size={48} style={{ marginBottom: "1rem", color: "#e2e8f0" }} />
//               <p>No emails found in this folder.</p>
//               <p style={{ fontSize: "14px", marginTop: "8px" }}>
//                 {selectedFolder === 'inbox' 
//                   ? 'Click "Sync" to fetch new emails'
//                   : 'Emails will appear here when categorized'
//                 }
//               </p>
//             </div>
//           )}
          
//           {filteredEmails.map((email, i) => (
//             <div
//               key={email._id || i}
//               style={{
//                 backgroundColor: "white",
//                 borderRadius: "12px",
//                 padding: "1.5rem",
//                 marginBottom: "1rem",
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                 cursor: "pointer",
//                 borderLeft: selectedEmail === email._id ? "4px solid #4f46e5" : "4px solid transparent"
//               }}
//               onClick={() => setSelectedEmail(selectedEmail === email._id ? null : email._id)}
//             >
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
//                 <div style={{ flex: 1 }}>
//                   <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#1e293b" }}>
//                     {email.subject || "(No Subject)"}
//                   </h3>
//                   <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
//                     <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
//                       <User size={14} style={{ marginRight: "4px" }} />
//                       <strong>From:</strong> {formatSender(email.from)}
//                     </p>
//                     <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
//                       <Calendar size={14} style={{ marginRight: "4px" }} />
//                       <strong>Date:</strong> {email.date ? formatDate(email.date) : "N/A"}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                   <select
//                     value={email.folderId || 'inbox'}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       moveEmail(email._id, e.target.value);
//                     }}
//                     onClick={(e) => e.stopPropagation()}
//                     style={{
//                       fontSize: "12px",
//                       padding: "4px 8px",
//                       border: "1px solid #e2e8f0",
//                       borderRadius: "4px",
//                       backgroundColor: "white"
//                     }}
//                   >
//                     {folders.map((folder) => (
//                       <option key={folder.id} value={folder.id}>
//                         {folder.name}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronRight 
//                     size={16} 
//                     style={{ 
//                       color: "#64748b",
//                       transform: selectedEmail === email._id ? "rotate(90deg)" : "rotate(0deg)",
//                       transition: "transform 0.2s"
//                     }} 
//                   />
//                 </div>
//               </div>

//               {/* Email content preview */}
//               {email.text && (
//                 <div style={{ marginBottom: "1rem" }}>
//                   <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.4", margin: 0 }}>
//                     {selectedEmail === email._id 
//                       ? email.text 
//                       : `${email.text.substring(0, 150)}${email.text.length > 150 ? '...' : ''}`
//                     }
//                   </p>
//                 </div>
//               )}

//               {/* Expanded email details */}
//               {selectedEmail === email._id && email.text && (
//                 <pre
//                   style={{
//                     backgroundColor: "#f8fafc",
//                     padding: "1rem",
//                     borderRadius: "8px",
//                     fontSize: "14px",
//                     color: "#374151",
//                     whiteSpace: "pre-wrap",
//                     border: "1px solid #e2e8f0",
//                     marginTop: "1rem",
//                     maxHeight: "300px",
//                     overflow: "auto"
//                   }}
//                 >
//                   {email.text || "No message content"}
//                 </pre>
//               )}
//             </div>
//           ))}
//         </section>
//       </main>

//       {/* Admin Modal */}
//       {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
      
//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default App;





// import React, { useEffect, useState } from "react";
// import {
//   Mail,
//   Shield,
//   Folder,
//   FolderOpen,
//   RefreshCw,
//   Search,
//   User,
//   Calendar,
//   ChevronRight,
//   Archive,
//   Users,
//   TrendingUp,
//   Info,
//   Package,
//   Inbox,
//   List,
//   AlertCircle,
// } from "lucide-react";

// /** ------------------ Admin Dashboard ------------------ **/
// const AdminDashboard = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loginData, setLoginData] = useState({ username: "", password: "" });
//   const [authorizedEmails, setAuthorizedEmails] = useState([
//     {
//       id: 1,
//       email: "newslettertester885@gmail.com",
//       status: "active",
//       addedDate: "2025-06-10",
//     },
//   ]);
//   const [newEmail, setNewEmail] = useState("");
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const adminCredentials = { username: "admin", password: "admin123" };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (
//       loginData.username === adminCredentials.username &&
//       loginData.password === adminCredentials.password
//     ) {
//       setIsAuthenticated(true);
//       setMessage({ type: "success", text: "Login successful!" });
//     } else {
//       setMessage({ type: "error", text: "Invalid credentials" });
//     }
//   };

//   const handleAddEmail = (e) => {
//     e.preventDefault();
//     if (!newEmail || !newEmail.includes("@")) {
//       setMessage({ type: "error", text: "Please enter a valid email address" });
//       return;
//     }
//     const newEmailEntry = {
//       id: Date.now(),
//       email: newEmail,
//       status: "active",
//       addedDate: new Date().toISOString().split("T")[0],
//     };
//     setAuthorizedEmails([...authorizedEmails, newEmailEntry]);
//     setNewEmail("");
//     setMessage({ type: "success", text: "Email added successfully!" });
//   };

//   if (!isAuthenticated) {
//     return (
//       <div style={{ padding: "2rem", textAlign: "center" }}>
//         <h2>Admin Login</h2>
//         {message.text && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "12px",
//               borderRadius: "8px",
//               backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
//               color: message.type === "error" ? "#dc2626" : "#16a34a",
//             }}
//           >
//             {message.text}
//           </div>
//         )}
//         <div style={{ maxWidth: "300px", margin: "0 auto" }}>
//           <input
//             type="text"
//             placeholder="Username"
//             value={loginData.username}
//             onChange={(e) =>
//               setLoginData({ ...loginData, username: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: "8px",
//               marginBottom: "1rem",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={loginData.password}
//             onChange={(e) =>
//               setLoginData({ ...loginData, password: e.target.value })
//             }
//             style={{
//               width: "100%",
//               padding: "8px",
//               marginBottom: "1rem",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <button
//             onClick={handleLogin}
//             style={{
//               width: "100%",
//               padding: "8px",
//               backgroundColor: "#4f46e5",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//             }}
//           >
//             Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Admin Dashboard</h2>
//       <div style={{ marginBottom: "2rem" }}>
//         <h3>Add Email</h3>
//         <div
//           style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
//         >
//           <input
//             type="email"
//             placeholder="Enter email address"
//             value={newEmail}
//             onChange={(e) => setNewEmail(e.target.value)}
//             style={{
//               flex: 1,
//               padding: "8px",
//               border: "1px solid #ccc",
//               borderRadius: "4px",
//             }}
//           />
//           <button
//             onClick={handleAddEmail}
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#4f46e5",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//             }}
//           >
//             Add Email
//           </button>
//         </div>
//         {message.text && (
//           <div
//             style={{
//               padding: "12px",
//               borderRadius: "8px",
//               backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
//               color: message.type === "error" ? "#dc2626" : "#16a34a",
//             }}
//           >
//             {message.text}
//           </div>
//         )}
//       </div>
//       <div>
//         <h3>Authorized Emails</h3>
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {authorizedEmails.map((email) => (
//             <li
//               key={email.id}
//               style={{
//                 padding: "8px",
//                 backgroundColor: "#f8f9fa",
//                 marginBottom: "4px",
//                 borderRadius: "4px",
//               }}
//             >
//               {email.email} - {email.status}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// /** ------------------ Admin Modal ------------------ **/
// const AdminModal = ({ onClose }) => (
//   <div
//     style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       backgroundColor: "rgba(0,0,0,0.5)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 1000,
//     }}
//   >
//     <div
//       style={{
//         backgroundColor: "white",
//         borderRadius: "12px",
//         maxWidth: "800px",
//         width: "90%",
//         maxHeight: "90vh",
//         overflow: "auto",
//         position: "relative",
//       }}
//     >
//       <button
//         onClick={onClose}
//         style={{
//           position: "absolute",
//           top: "1rem",
//           right: "1rem",
//           backgroundColor: "#dc2626",
//           color: "white",
//           padding: "8px 16px",
//           border: "none",
//           borderRadius: "6px",
//           cursor: "pointer",
//           zIndex: 1001,
//         }}
//       >
//         Close
//       </button>
//       <AdminDashboard />
//     </div>
//   </div>
// );

// /** ------------------ FolderTree ------------------ **/
// const FolderTree = ({ folders, selectedFolder, onFolderSelect, emailCounts, onMoveEmail }) => {
//   const totalEmails = Object.values(emailCounts).reduce((sum, count) => sum + count, 0);
  
//   return (
//     <div
//       style={{
//         backgroundColor: "white",
//         borderRadius: "12px",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//         padding: "1rem",
//       }}
//     >
//       <h3
//         style={{
//           margin: "0 0 1rem 0",
//           fontSize: "1.1rem",
//           fontWeight: "600",
//           color: "#1e293b",
//           display: "flex",
//           alignItems: "center",
//         }}
//       >
//         <Folder size={20} style={{ marginRight: "8px" }} />
//         Email Folders
//       </h3>
      
//       {/* All Emails Option */}
//       <div
//         onClick={() => onFolderSelect('all')}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "8px 12px",
//           cursor: "pointer",
//           backgroundColor: selectedFolder === 'all' ? "#e0e7ff" : "transparent",
//           borderRadius: "6px",
//           margin: "4px 0",
//           borderBottom: "1px solid #e2e8f0",
//           marginBottom: "8px"
//         }}
//       >
//         <List size={16} color="#4f46e5" style={{ marginRight: "8px" }} />
//         <span
//           style={{
//             flex: 1,
//             fontSize: "14px",
//             fontWeight: selectedFolder === 'all' ? "600" : "500",
//             color: selectedFolder === 'all' ? "#4f46e5" : "#374151",
//           }}
//         >
//           All Emails
//         </span>
//         {totalEmails > 0 && (
//           <span
//             style={{
//               backgroundColor: "#4f46e5",
//               color: "white",
//               fontSize: "12px",
//               padding: "2px 8px",
//               borderRadius: "12px",
//               marginLeft: "8px",
//             }}
//           >
//             {totalEmails}
//           </span>
//         )}
//       </div>
      
//       {/* Individual Folders */}
//       {folders.map((folder) => (
//         <div
//           key={folder.id}
//           onClick={() => onFolderSelect(folder.id)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             padding: "8px 12px",
//             cursor: "pointer",
//             backgroundColor: selectedFolder === folder.id ? "#e0e7ff" : "transparent",
//             borderRadius: "6px",
//             margin: "4px 0",
//           }}
//         >
//           <folder.icon size={16} color="#f59e0b" style={{ marginRight: "8px" }} />
//           <span
//             style={{
//               flex: 1,
//               fontSize: "14px",
//               fontWeight: selectedFolder === folder.id ? "600" : "400",
//               color: selectedFolder === folder.id ? "#4f46e5" : "#374151",
//             }}
//           >
//             {folder.name}
//           </span>
//           {emailCounts[folder.id] > 0 && (
//             <span
//               style={{
//                 backgroundColor: "#e5e7eb",
//                 color: "#374151",
//                 fontSize: "12px",
//                 padding: "2px 8px",
//                 borderRadius: "12px",
//                 marginLeft: "8px",
//               }}
//             >
//               {emailCounts[folder.id]}
//             </span>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// /** ------------------ App Component ------------------ **/
// function App() {
//   const [allEmails, setAllEmails] = useState([]); // Store ALL emails from database
//   const [displayedEmails, setDisplayedEmails] = useState([]); // Currently displayed emails
//   const [folders, setFolders] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState('all');
//   const [emailCounts, setEmailCounts] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showAdmin, setShowAdmin] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedEmail, setSelectedEmail] = useState(null);

//   // Enhanced folder configuration with icons
//   const folderConfig = [
//     { id: 'inbox', name: 'Inbox', icon: Inbox },
//     { id: 'supplier', name: 'Suppliers', icon: Package },
//     { id: 'competitor', name: 'Competitors', icon: TrendingUp },
//     { id: 'information', name: 'Information', icon: Info },
//     { id: 'customers', name: 'Customers', icon: Users },
//     { id: 'marketing', name: 'Marketing', icon: Mail },
//     { id: 'archive', name: 'Archive', icon: Archive }
//   ];

//   // Fetch ALL emails from database
//   const fetchAllEmails = async () => {
//     try {
//       const response = await fetch('/api/emails/saved?limit=1000');
//       const data = await response.json();
      
//       let emails = [];
//       if (data.emails && Array.isArray(data.emails)) {
//         emails = data.emails;
//       } else if (Array.isArray(data)) {
//         emails = data;
//       }
      
//       setAllEmails(emails);
//       return emails;
//     } catch (error) {
//       console.error('Error fetching all emails:', error);
//       setAllEmails([]);
//       return [];
//     }
//   };

//   // Filter emails based on selected folder and search query
//   const filterEmails = (emails, folderId, searchTerm = '') => {
//     let filtered = emails;
    
//     // Filter by folder
//     if (folderId !== 'all') {
//       filtered = filtered.filter(email => email.folderId === folderId);
//     }
    
//     // Filter by search term
//     if (searchTerm.trim()) {
//       const query = searchTerm.toLowerCase();
//       filtered = filtered.filter(email => 
//         (email.subject && email.subject.toLowerCase().includes(query)) ||
//         (email.text && email.text.toLowerCase().includes(query)) ||
//         (email.from && typeof email.from === 'string' && email.from.toLowerCase().includes(query)) ||
//         (email.from && email.from.address && email.from.address.toLowerCase().includes(query)) ||
//         (email.from && email.from.name && email.from.name.toLowerCase().includes(query))
//       );
//     }
    
//     return filtered;
//   };

//   // Update displayed emails based on current folder and search
//   const updateDisplayedEmails = () => {
//     const filtered = filterEmails(allEmails, selectedFolder, searchQuery);
//     setDisplayedEmails(filtered);
//   };

//   // Calculate email counts for each folder
//   const calculateEmailCounts = (emails) => {
//     const counts = {};
//     folderConfig.forEach(folder => {
//       counts[folder.id] = emails.filter(email => email.folderId === folder.id).length;
//     });
//     return counts;
//   };

//   // Fetch email counts from API (fallback to calculated counts)
//   const fetchEmailCounts = async () => {
//     try {
//       const response = await fetch('/api/emails/counts');
//       const data = await response.json();
      
//       if (data.counts) {
//         setEmailCounts(data.counts);
//       } else if (data.error) {
//         console.error('Error from counts API:', data.error);
//         // Fallback: calculate counts from allEmails
//         setEmailCounts(calculateEmailCounts(allEmails));
//       } else {
//         setEmailCounts(data);
//       }
//     } catch (error) {
//       console.error('Error fetching email counts:', error);
//       // Fallback: calculate counts from allEmails
//       setEmailCounts(calculateEmailCounts(allEmails));
//     }
//   };

//   // Sync emails from server (POP3 fetch)
//   const syncEmails = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       console.log('Starting email sync...');
//       const response = await fetch('/api/emails');
//       const data = await response.json();
      
//       if (data.emails) {
//         console.log('Sync complete:', data.categorization || 'No categorization data');
//         // Refresh all emails
//         const freshEmails = await fetchAllEmails();
//         setEmailCounts(calculateEmailCounts(freshEmails));
//         // Also try to fetch counts from API
//         fetchEmailCounts();
//       } else if (data.error) {
//         setError(`Sync failed: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error syncing emails:', error);
//       setError('Failed to sync emails. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Move email to different folder
//   const moveEmail = async (emailId, newFolderId) => {
//     try {
//       const response = await fetch(`/api/emails/${emailId}/folder`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ folderId: newFolderId }),
//       });

//       if (response.ok) {
//         // Update the email in our cached data
//         const updatedEmails = allEmails.map(email => 
//           email._id === emailId ? { ...email, folderId: newFolderId } : email
//         );
//         setAllEmails(updatedEmails);
        
//         // Update counts
//         setEmailCounts(calculateEmailCounts(updatedEmails));
        
//         // The displayed emails will automatically update via useEffect
//       }
//     } catch (error) {
//       console.error('Error moving email:', error);
//       setError('Failed to move email');
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return 'Today';
//     if (diffDays === 2) return 'Yesterday';
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   const formatSender = (from) => {
//     if (!from) return "Unknown";
//     if (typeof from === "string") return from;
//     return from.name && from.address
//       ? `${from.name} <${from.address}>`
//       : from.address || "Unknown";
//   };

//   // Get current folder name for display
//   const getCurrentFolderName = () => {
//     if (selectedFolder === 'all') return 'All Emails';
//     return folders.find(f => f.id === selectedFolder)?.name || 'Unknown Folder';
//   };

//   // Initial load
//   useEffect(() => {
//     setFolders(folderConfig);
//     fetchAllEmails().then(emails => {
//       setEmailCounts(calculateEmailCounts(emails));
//       fetchEmailCounts(); // Also try to get counts from API
//     });
//   }, []);

//   // Update displayed emails when folder, search, or all emails change
//   useEffect(() => {
//     updateDisplayedEmails();
//   }, [selectedFolder, searchQuery, allEmails]);

//   return (
//     <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
//       {/* Header */}
//       <header style={{ backgroundColor: "white", padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
//         <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <Mail size={28} color="#4f46e5" style={{ marginRight: "10px" }} />
//             <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#1e293b" }}>
//               MMX Newsletter Inbox
//             </h1>
//           </div>
          
//           {/* Search and Controls */}
//           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//             <div style={{ position: "relative" }}>
//               <Search size={16} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
//               <input
//                 type="text"
//                 placeholder="Search emails..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 style={{
//                   paddingLeft: "32px",
//                   paddingRight: "12px",
//                   paddingTop: "6px",
//                   paddingBottom: "6px",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "6px",
//                   fontSize: "14px",
//                   width: "200px"
//                 }}
//               />
//             </div>
            
//             <button
//               onClick={syncEmails}
//               disabled={loading}
//               style={{
//                 backgroundColor: "#10b981",
//                 color: "white",
//                 padding: "6px 12px",
//                 borderRadius: "6px",
//                 border: "none",
//                 cursor: loading ? "not-allowed" : "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 opacity: loading ? 0.6 : 1
//               }}
//             >
//               <RefreshCw size={16} style={{ marginRight: "6px", animation: loading ? "spin 1s linear infinite" : "none" }} />
//               Sync
//             </button>
            
//             <button
//               onClick={() => setShowAdmin(true)}
//               style={{
//                 backgroundColor: "#4f46e5",
//                 color: "white",
//                 padding: "8px 16px",
//                 borderRadius: "6px",
//                 border: "none",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <Shield size={16} style={{ marginRight: "6px" }} />
//               Admin
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem", padding: "2rem 1rem" }}>
//         {/* Sidebar */}
//         <aside>
//           <FolderTree
//             folders={folders}
//             selectedFolder={selectedFolder}
//             onFolderSelect={setSelectedFolder}
//             emailCounts={emailCounts}
//             onMoveEmail={moveEmail}
//           />
//         </aside>

//         {/* Email Content */}
//         <section>
//           {/* Folder Header */}
//           <div style={{ marginBottom: "1rem" }}>
//             <h2 style={{ fontSize: "1.2rem", color: "#1e293b", margin: 0 }}>
//               {getCurrentFolderName()}
//               <span style={{ fontSize: "0.9rem", color: "#64748b", marginLeft: "8px" }}>
//                 ({displayedEmails.length} emails)
//               </span>
//               {searchQuery && (
//                 <span style={{ fontSize: "0.8rem", color: "#4f46e5", marginLeft: "8px" }}>
//                   - searching for "{searchQuery}"
//                 </span>
//               )}
//             </h2>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div style={{ 
//               backgroundColor: "#fee2e2", 
//               color: "#dc2626", 
//               padding: "12px", 
//               borderRadius: "8px", 
//               marginBottom: "1rem",
//               display: "flex",
//               alignItems: "center"
//             }}>
//               <AlertCircle size={16} style={{ marginRight: "8px" }} />
//               {error}
//             </div>
//           )}

//           {loading && (
//             <div style={{ textAlign: "center", padding: "2rem" }}>
//               <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: "8px" }} />
//               <p style={{ color: "#64748b" }}>Loading emails...</p>
//             </div>
//           )}
          
//           {!loading && !error && displayedEmails.length === 0 && (
//             <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
//               <Mail size={48} style={{ marginBottom: "1rem", color: "#e2e8f0" }} />
//               <p>No emails found {selectedFolder === 'all' ? '' : 'in this folder'}.</p>
//               <p style={{ fontSize: "14px", marginTop: "8px" }}>
//                 {searchQuery 
//                   ? 'Try a different search term'
//                   : selectedFolder === 'all' 
//                     ? 'Click "Sync" to fetch new emails'
//                     : 'Emails will appear here when categorized'
//                 }
//               </p>
//             </div>
//           )}
          
//           {displayedEmails.map((email, i) => (
//             <div
//               key={email._id || i}
//               style={{
//                 backgroundColor: "white",
//                 borderRadius: "12px",
//                 padding: "1.5rem",
//                 marginBottom: "1rem",
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                 cursor: "pointer",
//                 borderLeft: selectedEmail === email._id ? "4px solid #4f46e5" : "4px solid transparent"
//               }}
//               onClick={() => setSelectedEmail(selectedEmail === email._id ? null : email._id)}
//             >
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
//                 <div style={{ flex: 1 }}>
//                   <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#1e293b" }}>
//                     {email.subject || "(No Subject)"}
//                   </h3>
//                   <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
//                     <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
//                       <User size={14} style={{ marginRight: "4px" }} />
//                       <strong>From:</strong> {formatSender(email.from)}
//                     </p>
//                     <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
//                       <Calendar size={14} style={{ marginRight: "4px" }} />
//                       <strong>Date:</strong> {email.date ? formatDate(email.date) : "N/A"}
//                     </p>
//                     <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
//                       <Folder size={14} style={{ marginRight: "4px" }} />
//                       <strong>Folder:</strong> {folderConfig.find(f => f.id === email.folderId)?.name || email.folderId || 'Unknown'}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                   <select
//                     value={email.folderId || 'inbox'}
//                     onChange={(e) => {
//                       e.stopPropagation();
//                       moveEmail(email._id, e.target.value);
//                     }}
//                     onClick={(e) => e.stopPropagation()}
//                     style={{
//                       fontSize: "12px",
//                       padding: "4px 8px",
//                       border: "1px solid #e2e8f0",
//                       borderRadius: "4px",
//                       backgroundColor: "white"
//                     }}
//                   >
//                     {folders.map((folder) => (
//                       <option key={folder.id} value={folder.id}>
//                         {folder.name}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronRight 
//                     size={16} 
//                     style={{ 
//                       color: "#64748b",
//                       transform: selectedEmail === email._id ? "rotate(90deg)" : "rotate(0deg)",
//                       transition: "transform 0.2s"
//                     }} 
//                   />
//                 </div>
//               </div>

//               {/* Email content preview */}
//               {email.text && (
//                 <div style={{ marginBottom: "1rem" }}>
//                   <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.4", margin: 0 }}>
//                     {selectedEmail === email._id 
//                       ? email.text 
//                       : `${email.text.substring(0, 150)}${email.text.length > 150 ? '...' : ''}`
//                     }
//                   </p>
//                 </div>
//               )}

//               {/* Expanded email details */}
//               {selectedEmail === email._id && email.text && (
//                 <pre
//                   style={{
//                     backgroundColor: "#f8fafc",
//                     padding: "1rem",
//                     borderRadius: "8px",
//                     fontSize: "14px",
//                     color: "#374151",
//                     whiteSpace: "pre-wrap",
//                     border: "1px solid #e2e8f0",
//                     marginTop: "1rem",
//                     maxHeight: "300px",
//                     overflow: "auto"
//                   }}
//                 >
//                   {email.text || "No message content"}
//                 </pre>
//               )}
//             </div>
//           ))}
//         </section>
//       </main>

//       {/* Admin Modal */}
//       {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
      
//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
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
  RefreshCw,
  Search,
  User,
  Calendar,
  ChevronRight,
  Archive,
  Users,
  TrendingUp,
  Info,
  Package,
  Inbox,
  List,
  AlertCircle,
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
        <div
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
const FolderTree = ({ folders, selectedFolder, onFolderSelect, emailCounts, onMoveEmail }) => {
  const totalEmails = Object.values(emailCounts).reduce((sum, count) => sum + count, 0);
  
  return (
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
      
      {/* All Emails Option */}
      <div
        onClick={() => onFolderSelect('all')}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          cursor: "pointer",
          backgroundColor: selectedFolder === 'all' ? "#e0e7ff" : "transparent",
          borderRadius: "6px",
          margin: "4px 0",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "8px"
        }}
      >
        <List size={16} color="#4f46e5" style={{ marginRight: "8px" }} />
        <span
          style={{
            flex: 1,
            fontSize: "14px",
            fontWeight: selectedFolder === 'all' ? "600" : "500",
            color: selectedFolder === 'all' ? "#4f46e5" : "#374151",
          }}
        >
          All Emails
        </span>
        {totalEmails > 0 && (
          <span
            style={{
              backgroundColor: "#4f46e5",
              color: "white",
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "12px",
              marginLeft: "8px",
            }}
          >
            {totalEmails}
          </span>
        )}
      </div>
      
      {/* Individual Folders */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          onClick={() => onFolderSelect(folder.id)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: selectedFolder === folder.id ? "#e0e7ff" : "transparent",
            borderRadius: "6px",
            margin: "4px 0",
          }}
        >
          <folder.icon size={16} color="#f59e0b" style={{ marginRight: "8px" }} />
          <span
            style={{
              flex: 1,
              fontSize: "14px",
              fontWeight: selectedFolder === folder.id ? "600" : "400",
              color: selectedFolder === folder.id ? "#4f46e5" : "#374151",
            }}
          >
            {folder.name}
          </span>
          {emailCounts[folder.id] > 0 && (
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
              {emailCounts[folder.id]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

/** ------------------ App Component ------------------ **/
function App() {
  const [allEmails, setAllEmails] = useState([]); // Store ALL emails from database
  const [displayedEmails, setDisplayedEmails] = useState([]); // Currently displayed emails
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all'); // Default to 'all'
  const [emailCounts, setEmailCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Enhanced folder configuration with icons
  const folderConfig = [
    { id: 'inbox', name: 'Inbox', icon: Inbox },
    { id: 'supplier', name: 'Suppliers', icon: Package },
    { id: 'competitor', name: 'Competitors', icon: TrendingUp },
    { id: 'information', name: 'Information', icon: Info },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'marketing', name: 'Marketing', icon: Mail },
    { id: 'archive', name: 'Archive', icon: Archive }
  ];

  // Fetch ALL emails from database
  const fetchAllEmails = async () => {
    try {
      const response = await fetch('/api/emails/saved?limit=1000'); // Fetch a large number or implement pagination if needed
      const data = await response.json();
      
      let emails = [];
      if (data.emails && Array.isArray(data.emails)) {
        emails = data.emails;
      } else if (Array.isArray(data)) { // Fallback for older API format if it returns raw array
        emails = data;
      }
      
      setAllEmails(emails);
      return emails;
    } catch (error) {
      console.error('Error fetching all emails:', error);
      setAllEmails([]);
      return [];
    }
  };

  // Filter emails based on selected folder and search query
  const filterEmails = (emails, folderId, searchTerm = '') => {
    let filtered = emails;
    
    // Filter by folder
    if (folderId !== 'all') {
      filtered = filtered.filter(email => email.folderId === folderId);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(email => 
        (email.subject && email.subject.toLowerCase().includes(query)) ||
        (email.text && email.text.toLowerCase().includes(query)) ||
        (email.from && typeof email.from === 'string' && email.from.toLowerCase().includes(query)) ||
        (email.from && email.from.address && email.from.address.toLowerCase().includes(query)) ||
        (email.from && email.from.name && email.from.name.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  // Update displayed emails based on current folder and search
  const updateDisplayedEmails = () => {
    const filtered = filterEmails(allEmails, selectedFolder, searchQuery);
    setDisplayedEmails(filtered);
  };

  // Calculate email counts for each folder
  const calculateEmailCounts = (emails) => {
    const counts = {};
    folderConfig.forEach(folder => {
      counts[folder.id] = emails.filter(email => email.folderId === folder.id).length;
    });
    return counts;
  };

  // Fetch email counts from API (fallback to calculated counts if API fails)
  const fetchEmailCounts = async () => {
    try {
      const response = await fetch('/api/emails/counts');
      const data = await response.json();
      
      if (data.counts) {
        setEmailCounts(data.counts);
      } else if (data.error) {
        console.error('Error from counts API:', data.error);
        // Fallback: calculate counts from allEmails
        setEmailCounts(calculateEmailCounts(allEmails));
      } else { // Handle case where API might return counts directly without a 'counts' key
        setEmailCounts(data);
      }
    } catch (error) {
      console.error('Error fetching email counts:', error);
      // Fallback: calculate counts from allEmails
      setEmailCounts(calculateEmailCounts(allEmails));
    }
  };

  // Sync emails from server (POP3 fetch)
  const syncEmails = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Starting email sync...');
      const response = await fetch('/api/emails');
      const data = await response.json();
      
      if (data.emails) {
        console.log('Sync complete:', data.categorization || 'No categorization data');
        // Refresh all emails from DB after sync
        const freshEmails = await fetchAllEmails();
        // Update counts based on fresh emails
        setEmailCounts(calculateEmailCounts(freshEmails));
        // Also try to fetch counts from API (for robustness, though calculate should be fine)
        fetchEmailCounts();
      } else if (data.error) {
        setError(`Sync failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error syncing emails:', error);
      setError('Failed to sync emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Move email to different folder
  const moveEmail = async (emailId, newFolderId) => {
    try {
      const response = await fetch(`/api/emails/${emailId}/folder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderId: newFolderId }),
      });

      if (response.ok) {
        // Update the email in our cached allEmails state
        const updatedAllEmails = allEmails.map(email => 
          email._id === emailId ? { ...email, folderId: newFolderId } : email
        );
        setAllEmails(updatedAllEmails);
        
        // Recalculate and set counts immediately from the updated `allEmails`
        setEmailCounts(calculateEmailCounts(updatedAllEmails));
        
        // The `displayedEmails` will automatically update via `useEffect` due to `allEmails` change
      } else {
        const errorData = await response.json();
        setError(`Failed to move email: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error moving email:', error);
      setError('Failed to move email due to network error.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const formatSender = (from) => {
    if (!from) return "Unknown";
    if (typeof from === "string") return from;
    return from.name && from.address
      ? `${from.name} <${from.address}>`
      : from.address || "Unknown";
  };

  // Get current folder name for display
  const getCurrentFolderName = () => {
    if (selectedFolder === 'all') return 'All Emails';
    return folders.find(f => f.id === selectedFolder)?.name || 'Unknown Folder';
  };

  // Initial load: Set folders and fetch all emails
  useEffect(() => {
    setFolders(folderConfig);
    fetchAllEmails().then(emails => {
      // Calculate counts immediately after fetching all emails
      setEmailCounts(calculateEmailCounts(emails));
      // Also try to fetch counts from API as a primary source for more accurate data
      fetchEmailCounts();
    });
  }, []);

  // Effect to update displayed emails whenever allEmails, selectedFolder, or searchQuery changes
  useEffect(() => {
    updateDisplayedEmails();
  }, [allEmails, selectedFolder, searchQuery]); // Depend on allEmails for re-filtering

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "white", padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mail size={28} color="#4f46e5" style={{ marginRight: "10px" }} />
            <h1 style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#1e293b" }}>
              MMX Newsletter Inbox
            </h1>
          </div>
          
          {/* Search and Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: "32px",
                  paddingRight: "12px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "14px",
                  width: "200px"
                }}
              />
            </div>
            
            <button
              onClick={syncEmails}
              disabled={loading}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                opacity: loading ? 0.6 : 1
              }}
            >
              <RefreshCw size={16} style={{ marginRight: "6px", animation: loading ? "spin 1s linear infinite" : "none" }} />
              Sync
            </button>
            
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
            onMoveEmail={moveEmail}
          />
        </aside>

        {/* Email Content */}
        <section>
          {/* Folder Header */}
          <div style={{ marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#1e293b", margin: 0 }}>
              {getCurrentFolderName()}
              <span style={{ fontSize: "0.9rem", color: "#64748b", marginLeft: "8px" }}>
                ({displayedEmails.length} emails)
              </span>
              {searchQuery && (
                <span style={{ fontSize: "0.8rem", color: "#4f46e5", marginLeft: "8px" }}>
                  - searching for "{searchQuery}"
                </span>
              )}
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              backgroundColor: "#fee2e2", 
              color: "#dc2626", 
              padding: "12px", 
              borderRadius: "8px", 
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center"
            }}>
              <AlertCircle size={16} style={{ marginRight: "8px" }} />
              {error}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: "8px" }} />
              <p style={{ color: "#64748b" }}>Loading emails...</p>
            </div>
          )}
          
          {!loading && !error && displayedEmails.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
              <Mail size={48} style={{ marginBottom: "1rem", color: "#e2e8f0" }} />
              <p>No emails found {selectedFolder === 'all' ? '' : 'in this folder'}.</p>
              <p style={{ fontSize: "14px", marginTop: "8px" }}>
                {searchQuery 
                  ? 'Try a different search term'
                  : selectedFolder === 'all' 
                    ? 'Click "Sync" to fetch new emails'
                    : 'Emails will appear here when categorized'
                }
              </p>
            </div>
          )}
          
          {displayedEmails.map((email, i) => (
            <div
              key={email._id || i}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "1rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                cursor: "pointer",
                borderLeft: selectedEmail === email._id ? "4px solid #4f46e5" : "4px solid transparent"
              }}
              onClick={() => setSelectedEmail(selectedEmail === email._id ? null : email._id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#1e293b" }}>
                    {email.subject || "(No Subject)"}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
                      <User size={14} style={{ marginRight: "4px" }} />
                      <strong>From:</strong> {formatSender(email.from)}
                    </p>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
                      <Calendar size={14} style={{ marginRight: "4px" }} />
                      <strong>Date:</strong> {email.date ? formatDate(email.date) : "N/A"}
                    </p>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
                      <Folder size={14} style={{ marginRight: "4px" }} />
                      <strong>Folder:</strong> {folderConfig.find(f => f.id === email.folderId)?.name || email.folderId || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <select
                    value={email.folderId || 'inbox'}
                    onChange={(e) => {
                      e.stopPropagation();
                      moveEmail(email._id, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "4px",
                      backgroundColor: "white"
                    }}
                  >
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight 
                    size={16} 
                    style={{ 
                      color: "#64748b",
                      transform: selectedEmail === email._id ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s"
                    }} 
                  />
                </div>
              </div>

              {/* Email content preview */}
              {email.text && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.4", margin: 0 }}>
                    {selectedEmail === email._id 
                      ? email.text 
                      : `${email.text.substring(0, 150)}${email.text.length > 150 ? '...' : ''}`
                    }
                  </p>
                </div>
              )}

              {/* Expanded email details */}
              {selectedEmail === email._id && email.text && (
                <pre
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#374151",
                    whiteSpace: "pre-wrap",
                    border: "1px solid #e2e8f0",
                    marginTop: "1rem",
                    maxHeight: "300px",
                    overflow: "auto"
                  }}
                >
                  {email.text || "No message content"}
                </pre>
              )}
            </div>
          ))}
        </section>
      </main>

      {/* Admin Modal */}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
