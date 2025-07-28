
// import React, { useState, useEffect } from 'react';
// import { Lock, Mail, Plus, Trash2, Eye, EyeOff, Shield, Check, X } from 'lucide-react';

// const AdminDashboard = () => {
//   // --- Admin Auth State ---
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loginData, setLoginData] = useState({ username: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [authorizedEmails, setAuthorizedEmails] = useState([
//     { id: 1, email: 'newslettertester885@gmail.com', status: 'active', addedDate: '2025-06-10'}
//   ]);
//   const [newEmail, setNewEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   // --- Inbox Email State ---
//   const [emails, setEmails] = useState([]);
//   const [loadingEmails, setLoadingEmails] = useState(true);
//   const [emailError, setEmailError] = useState("");

//   // --- Admin Auth Logic ---
//   const adminCredentials = {
//     username: 'admin',
//     password: 'admin123'
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setTimeout(() => {
//       if (loginData.username === adminCredentials.username && 
//           loginData.password === adminCredentials.password) {
//         setIsAuthenticated(true);
//         setMessage({ type: 'success', text: 'Login successful!' });
//       } else {
//         setMessage({ type: 'error', text: 'Invalid credentials' });
//       }
//       setLoading(false);
//     }, 1000);
//   };

//   const handleAddEmail = (e) => {
//     e.preventDefault();
//     if (!newEmail || !newEmail.includes('@')) {
//       setMessage({ type: 'error', text: 'Please enter a valid email address' });
//       return;
//     }
//     if (authorizedEmails.some(email => email.email === newEmail)) {
//       setMessage({ type: 'error', text: 'Email already exists in the system' });
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

//   const handleRemoveEmail = (id) => {
//     setAuthorizedEmails(authorizedEmails.filter(email => email.id !== id));
//     setMessage({ type: 'success', text: 'Email removed successfully!' });
//   };

//   const toggleEmailStatus = (id) => {
//     setAuthorizedEmails(authorizedEmails.map(email => 
//       email.id === id 
//         ? { ...email, status: email.status === 'active' ? 'inactive' : 'active' }
//         : email
//     ));
//     setMessage({ type: 'success', text: 'Email status updated!' });
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setLoginData({ username: '', password: '' });
//     setMessage({ type: '', text: '' });
//   };

//   // Clear messages after 3 seconds
//   useEffect(() => {
//     if (message.text) {
//       const timer = setTimeout(() => {
//         setMessage({ type: '', text: '' });
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // --- Fetch Inbox Emails ---
//   useEffect(() => {
//     setLoadingEmails(true);
//     setEmailError("");
//     fetch("/api/emails/saved")
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch emails");
//         return res.json();
//       })
//       .then((data) => {
//         setEmails(data);
//         setLoadingEmails(false);
//       })
//       .catch((err) => {
//         setEmailError(err.message);
//         setLoadingEmails(false);
//       });
//   }, []);

//   // Helper to format the "from" field
//   function formatSender(from) {
//     if (!from) return "Unknown";
//     if (typeof from === "string") return from;
//     if (from.name && from.address) return `${from.name} <${from.address}>`;
//     if (from.address) return from.address;
//     return "Unknown";
//   }

//   // --- Styles ---
//   const styles = {
//     container: {
//       minHeight: '100vh',
//       background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '1rem'
//     },
//     loginCard: {
//       background: 'white',
//       borderRadius: '20px',
//       boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
//       padding: '2rem',
//       width: '100%',
//       maxWidth: '400px'
//     },
//     dashboardContainer: {
//       minHeight: '100vh',
//       background: '#f8f9fa'
//     },
//     header: {
//       background: 'white',
//       borderBottom: '1px solid #e9ecef',
//       padding: '1rem 0'
//     },
//     headerContent: {
//       maxWidth: '1200px',
//       margin: '0 auto',
//       padding: '0 1rem',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     },
//     title: {
//       display: 'flex',
//       alignItems: 'center',
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//       color: '#333'
//     },
//     input: {
//       width: '100%',
//       padding: '12px',
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       fontSize: '14px',
//       outline: 'none',
//       transition: 'border-color 0.3s'
//     },
//     button: {
//       background: '#4f46e5',
//       color: 'white',
//       padding: '12px 24px',
//       border: 'none',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       fontWeight: '600',
//       fontSize: '14px',
//       transition: 'background 0.3s'
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//       background: 'white'
//     },
//     th: {
//       background: '#f8f9fa',
//       padding: '12px',
//       textAlign: 'left',
//       borderBottom: '1px solid #dee2e6',
//       fontSize: '12px',
//       fontWeight: '600',
//       color: '#495057',
//       textTransform: 'uppercase'
//     },
//     td: {
//       padding: '12px',
//       borderBottom: '1px solid #dee2e6'
//     },
//     statusBadge: {
//       padding: '4px 8px',
//       borderRadius: '12px',
//       fontSize: '12px',
//       fontWeight: '500'
//     }
//   };

//   // --- Render ---
//   if (!isAuthenticated) {
//     return (
//       <div style={styles.container}>
//         <div style={styles.loginCard}>
//           <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//             <div style={{ 
//               background: '#e0e7ff', 
//               borderRadius: '50%', 
//               width: '64px', 
//               height: '64px', 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'center', 
//               margin: '0 auto 1rem' 
//             }}>
//               <Shield size={32} color="#4f46e5" />
//             </div>
//             <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>Admin Login</h1>
//             <p style={{ color: '#666', margin: '0' }}>Email Authorization Dashboard</p>
//           </div>

//           {message.text && (
//             <div style={{
//               marginBottom: '1rem',
//               padding: '12px',
//               borderRadius: '8px',
//               fontSize: '14px',
//               backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
//               color: message.type === 'error' ? '#dc2626' : '#16a34a',
//               border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
//             }}>
//               {message.text}
//             </div>
//           )}

//           <form onSubmit={handleLogin}>
//             <div style={{ marginBottom: '1.5rem' }}>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem' }}>
//                 Username
//               </label>
//               <input
//                 type="text"
//                 value={loginData.username}
//                 onChange={(e) => setLoginData({...loginData, username: e.target.value})}
//                 style={styles.input}
//                 placeholder="Enter username"
//                 required
//               />
//             </div>
//             <div style={{ marginBottom: '1.5rem' }}>
//               <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem' }}>
//                 Password
//               </label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={loginData.password}
//                   onChange={(e) => setLoginData({...loginData, password: e.target.value})}
//                   style={{...styles.input, paddingRight: '48px'}}
//                   placeholder="Enter password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: 'absolute',
//                     right: '12px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     background: 'none',
//                     border: 'none',
//                     cursor: 'pointer',
//                     color: '#666'
//                   }}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 ...styles.button,
//                 width: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 opacity: loading ? 0.5 : 1
//               }}
//             >
//               {loading ? (
//                 <div style={{
//                   width: '20px',
//                   height: '20px',
//                   border: '2px solid white',
//                   borderTop: '2px solid transparent',
//                   borderRadius: '50%',
//                   animation: 'spin 1s linear infinite'
//                 }}></div>
//               ) : (
//                 <>
//                   <Lock size={20} style={{ marginRight: '8px' }} />
//                   Login
//                 </>
//               )}
//             </button>
//           </form>
//           <div style={{
//             marginTop: '1.5rem',
//             padding: '1rem',
//             background: '#f8f9fa',
//             borderRadius: '8px',
//             textAlign: 'center'
//           }}>
//             <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
//               Demo Credentials:<br />
//               Username: <code>admin</code><br />
//               Password: <code>admin123</code>
//             </p>
//           </div>
//         </div>
//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//           `}
//         </style>
//       </div>
//     );
//   }

//   // --- Dashboard UI ---
//   return (
//     <div style={styles.dashboardContainer}>
//       <div style={styles.header}>
//         <div style={styles.headerContent}>
//           <div style={styles.title}>
//             <Shield size={32} color="#4f46e5" style={{ marginRight: '12px' }} />
//             Email Authorization Dashboard
//           </div>
//           <button
//             onClick={handleLogout}
//             style={{
//               ...styles.button,
//               background: '#dc2626'
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
//         {message.text && (
//           <div style={{
//             marginBottom: '1.5rem',
//             padding: '1rem',
//             borderRadius: '8px',
//             display: 'flex',
//             alignItems: 'center',
//             backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
//             color: message.type === 'error' ? '#dc2626' : '#16a34a',
//             border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
//           }}>
//             {message.type === 'error' ? <X size={20} style={{ marginRight: '8px' }} /> : <Check size={20} style={{ marginRight: '8px' }} />}
//             {message.text}
//           </div>
//         )}

//         {/* --- Authorized Emails Table --- */}
//         <div style={{
//           background: 'white',
//           borderRadius: '12px',
//           boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//           overflow: 'hidden'
//         }}>
//           <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
//             <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0' }}>Authorized Email Addresses</h2>
//           </div>
//           <div style={{ overflowX: 'auto' }}>
//             <table style={styles.table}>
//               <thead>
//                 <tr>
//                   <th style={styles.th}>Email Address</th>
//                   <th style={styles.th}>Status</th>
//                   <th style={styles.th}>Date Added</th>
//                   <th style={styles.th}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {authorizedEmails.map((email) => (
//                   <tr key={email.id} style={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
//                     <td style={styles.td}>
//                       <div style={{ display: 'flex', alignItems: 'center' }}>
//                         <Mail size={20} color="#666" style={{ marginRight: '12px' }} />
//                         <span style={{ fontSize: '14px', fontWeight: '500' }}>{email.email}</span>
//                       </div>
//                     </td>
//                     <td style={styles.td}>
//                       <span style={{
//                         ...styles.statusBadge,
//                         backgroundColor: email.status === 'active' ? '#dcfce7' : email.status === 'inactive' ? '#fee2e2' : '#fef3c7',
//                         color: email.status === 'active' ? '#16a34a' : email.status === 'inactive' ? '#dc2626' : '#d97706'
//                       }}>
//                         {email.status}
//                       </span>
//                     </td>
//                     <td style={styles.td}>
//                       <span style={{ fontSize: '14px', color: '#666' }}>{email.addedDate}</span>
//                     </td>
//                     <td style={styles.td}>
//                       <div style={{ display: 'flex', gap: '8px' }}>
//                         <button
//                           onClick={() => toggleEmailStatus(email.id)}
//                           style={{
//                             padding: '4px 8px',
//                             borderRadius: '4px',
//                             fontSize: '12px',
//                             fontWeight: '500',
//                             border: 'none',
//                             cursor: 'pointer',
//                             backgroundColor: email.status === 'active' ? '#fee2e2' : '#dcfce7',
//                             color: email.status === 'active' ? '#dc2626' : '#16a34a'
//                           }}
//                         >
//                           {email.status === 'active' ? 'Deactivate' : 'Activate'}
//                         </button>
//                         <button
//                           onClick={() => handleRemoveEmail(email.id)}
//                           style={{
//                             padding: '4px 8px',
//                             borderRadius: '4px',
//                             fontSize: '12px',
//                             fontWeight: '500',
//                             border: 'none',
//                             cursor: 'pointer',
//                             backgroundColor: '#fee2e2',
//                             color: '#dc2626',
//                             display: 'flex',
//                             alignItems: 'center'
//                           }}
//                         >
//                           <Trash2 size={12} style={{ marginRight: '4px' }} />
//                           Remove
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* --- Inbox Emails Section --- */}
//         <div style={{ marginTop: "2.5rem" }}>
//           <h2>
//             <Mail size={20} style={{ marginRight: 8 }} />
//             Inbox Emails
//           </h2>
//           {loadingEmails && <p>Loading emails...</p>}
//           {emailError && <p style={{ color: "red" }}>{emailError}</p>}
//           {emails.length === 0 && !loadingEmails && <p>No emails found.</p>}
//           <ul style={{ listStyle: "none", padding: 0 }}>
//             {emails.map((email) => (
//               <li
//                 key={email._id}
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "8px",
//                   marginBottom: "1rem",
//                   padding: "1rem",
//                   background: "#fff"
//                 }}
//               >
//                 <h3>{email.subject || "(No Subject)"}</h3>
//                 <p>
//                   <strong>From:</strong> {formatSender(email.from)}
//                 </p>
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {email.date ? new Date(email.date).toLocaleString() : "N/A"}
//                 </p>
//                 <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "1rem" }}>
//                   {email.text || "No message content"}
//                 </pre>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
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
// };

// export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Mail, Plus, Trash2, Eye, EyeOff, Shield, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  // --- Admin Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [authorizedEmails, setAuthorizedEmails] = useState([
    { id: 1, email: 'newslettertester885@gmail.com', status: 'active', addedDate: '2025-06-10'}
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- Inbox Email State ---
  const [emails, setEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [emailError, setEmailError] = useState("");

  // --- Admin Auth Logic ---
  const adminCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (loginData.username === adminCredentials.username && 
          loginData.password === adminCredentials.password) {
        setIsAuthenticated(true);
        setMessage({ type: 'success', text: 'Login successful!' });
      } else {
        setMessage({ type: 'error', text: 'Invalid credentials' });
      }
      setLoading(false);
    }, 1000);
  };

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    if (authorizedEmails.some(email => email.email === newEmail)) {
      setMessage({ type: 'error', text: 'Email already exists in the system' });
      return;
    }
    const newEmailEntry = {
      id: Date.now(),
      email: newEmail,
      status: 'active',
      addedDate: new Date().toISOString().split('T')[0]
    };
    setAuthorizedEmails([...authorizedEmails, newEmailEntry]);
    setNewEmail('');
    setMessage({ type: 'success', text: 'Email added successfully!' });
  };

  const handleRemoveEmail = (id) => {
    setAuthorizedEmails(authorizedEmails.filter(email => email.id !== id));
    setMessage({ type: 'success', text: 'Email removed successfully!' });
  };

  const toggleEmailStatus = (id) => {
    setAuthorizedEmails(authorizedEmails.map(email => 
      email.id === id 
        ? { ...email, status: email.status === 'active' ? 'inactive' : 'active' }
        : email
    ));
    setMessage({ type: 'success', text: 'Email status updated!' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
    setMessage({ type: '', text: '' });
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // --- Fetch Inbox Emails using Axios ---
  useEffect(() => {
    const fetchEmails = async () => {
      setLoadingEmails(true);
      setEmailError("");
      
      try {
        const response = await axios.get("/api/emails/saved");
        setEmails(response.data);
      } catch (error) {
        // Handle different types of errors
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            "Failed to fetch emails";
        setEmailError(errorMessage);
        console.error("Error fetching emails:", error);
      } finally {
        setLoadingEmails(false);
      }
    };

    fetchEmails();
  }, []);

  // Helper to format the "from" field
  function formatSender(from) {
    if (!from) return "Unknown";
    if (typeof from === "string") return from;
    if (from.name && from.address) return `${from.name} <${from.address}>`;
    if (from.address) return from.address;
    return "Unknown";
  }

  // --- Styles ---
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    loginCard: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      padding: '2rem',
      width: '100%',
      maxWidth: '400px'
    },
    dashboardContainer: {
      minHeight: '100vh',
      background: '#f8f9fa'
    },
    header: {
      background: 'white',
      borderBottom: '1px solid #e9ecef',
      padding: '1rem 0'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    button: {
      background: '#4f46e5',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'background 0.3s'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white'
    },
    th: {
      background: '#f8f9fa',
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #dee2e6',
      fontSize: '12px',
      fontWeight: '600',
      color: '#495057',
      textTransform: 'uppercase'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #dee2e6'
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500'
    }
  };

  // --- Render ---
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              background: '#e0e7ff', 
              borderRadius: '50%', 
              width: '64px', 
              height: '64px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1rem' 
            }}>
              <Shield size={32} color="#4f46e5" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>Admin Login</h1>
            <p style={{ color: '#666', margin: '0' }}>Email Authorization Dashboard</p>
          </div>

          {message.text && (
            <div style={{
              marginBottom: '1rem',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
              color: message.type === 'error' ? '#dc2626' : '#16a34a',
              border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem' }}>
                Username
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                style={styles.input}
                placeholder="Enter username"
                required
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  style={{...styles.input, paddingRight: '48px'}}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? (
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <>
                  <Lock size={20} style={{ marginRight: '8px' }} />
                  Login
                </>
              )}
            </button>
          </form>
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', color: '#666', margin: '0' }}>
              Demo Credentials:<br />
              Username: <code>admin</code><br />
              Password: <code>admin123</code>
            </p>
          </div>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // --- Dashboard UI ---
  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.title}>
            <Shield size={32} color="#4f46e5" style={{ marginRight: '12px' }} />
            Email Authorization Dashboard
          </div>
          <button
            onClick={handleLogout}
            style={{
              ...styles.button,
              background: '#dc2626'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {message.text && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: message.type === 'error' ? '#dc2626' : '#16a34a',
            border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
          }}>
            {message.type === 'error' ? <X size={20} style={{ marginRight: '8px' }} /> : <Check size={20} style={{ marginRight: '8px' }} />}
            {message.text}
          </div>
        )}

        {/* --- Add New Email Form --- */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Add New Email</h2>
          <form onSubmit={handleAddEmail} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={styles.input}
                placeholder="Enter email address"
                required
              />
            </div>
            <button
              type="submit"
              style={{
                ...styles.button,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Plus size={20} style={{ marginRight: '8px' }} />
              Add Email
            </button>
          </form>
        </div>

        {/* --- Authorized Emails Table --- */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0' }}>Authorized Email Addresses</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Email Address</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date Added</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {authorizedEmails.map((email) => (
                  <tr key={email.id} style={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Mail size={20} color="#666" style={{ marginRight: '12px' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{email.email}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: email.status === 'active' ? '#dcfce7' : email.status === 'inactive' ? '#fee2e2' : '#fef3c7',
                        color: email.status === 'active' ? '#16a34a' : email.status === 'inactive' ? '#dc2626' : '#d97706'
                      }}>
                        {email.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontSize: '14px', color: '#666' }}>{email.addedDate}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => toggleEmailStatus(email.id)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: email.status === 'active' ? '#fee2e2' : '#dcfce7',
                            color: email.status === 'active' ? '#dc2626' : '#16a34a'
                          }}
                        >
                          {email.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleRemoveEmail(email.id)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={12} style={{ marginRight: '4px' }} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Inbox Emails Section --- */}
        <div style={{ marginTop: "2.5rem" }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0', display: 'flex', alignItems: 'center' }}>
                <Mail size={20} style={{ marginRight: '8px' }} />
                Inbox Emails
              </h2>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              {loadingEmails && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    border: '3px solid #f3f4f6',
                    borderTop: '3px solid #4f46e5',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <p style={{ color: '#666', margin: '0' }}>Loading emails...</p>
                </div>
              )}
              
              {emailError && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <X size={20} style={{ marginRight: '8px' }} />
                  {emailError}
                </div>
              )}
              
              {emails.length === 0 && !loadingEmails && !emailError && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  <Mail size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p style={{ margin: '0' }}>No emails found.</p>
                </div>
              )}
              
              {emails.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {emails.map((email) => (
                    <div
                      key={email._id}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "1rem",
                        background: "#f9fafb"
                      }}
                    >
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {email.subject || "(No Subject)"}
                      </h3>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: '#374151' }}>From:</span>{' '}
                        <span style={{ color: '#6b7280' }}>{formatSender(email.from)}</span>
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: '600', color: '#374151' }}>Date:</span>{' '}
                        <span style={{ color: '#6b7280' }}>
                          {email.date ? new Date(email.date).toLocaleString() : "N/A"}
                        </span>
                      </div>
                      <pre style={{ 
                        whiteSpace: "pre-wrap", 
                        background: "#ffffff", 
                        padding: "1rem",
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        color: '#374151',
                        margin: '0',
                        overflow: 'auto'
                      }}>
                        {email.text || "No message content"}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
