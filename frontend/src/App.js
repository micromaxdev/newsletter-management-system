
import React, { useEffect, useState } from "react";
import {
  Mail,
  Shield,
  Folder,
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
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon, // Rename ChevronRight to avoid conflict if used differently
} from "lucide-react";

//Admin Dashboard
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

//Admin Modal
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

//FolderTree 
const FolderTree = ({ folders, selectedFolder, onFolderSelect, unreadCounts }) => {
  const totalUnread = unreadCounts.all || 0;

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
        {totalUnread > 0 && (
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
            {totalUnread}
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
          {unreadCounts[folder.id] > 0 && (
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
              {unreadCounts[folder.id]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

//Email Modal Component
const EmailModal = ({ email, onClose, folderConfig, onMoveEmail, displayedEmails, onSelectEmail, onMarkAsRead }) => {
  if (!email) return null;

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

  // Find the index of the current email within the displayedEmails list
  const currentIndex = displayedEmails.findIndex(e => e._id === email._id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < displayedEmails.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      const prevEmail = displayedEmails[currentIndex - 1];
      onSelectEmail(prevEmail); // Update the selected email in the parent
      if (!prevEmail.isRead) {
        onMarkAsRead(prevEmail._id); // Mark the new email as read
      }
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextEmail = displayedEmails[currentIndex + 1];
      onSelectEmail(nextEmail); // Update the selected email in the parent
      if (!nextEmail.isRead) {
        onMarkAsRead(nextEmail._id); // Mark the new email as read
      }
    }
  };


  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)", 
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
          maxWidth: "900px", // Slightly wider for email content
          width: "90%",
          maxHeight: "90vh",
          overflow: "hidden", // Keep scrollbar inside
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "2rem", // Padding inside the modal
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", margin: 0, color: "#1e293b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email.subject || "(No Subject)"}
          </h2>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              style={{
                backgroundColor: hasPrevious ? "#4f46e5" : "#ccc",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: hasPrevious ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                opacity: hasPrevious ? 1 : 0.6,
              }}
            >
              <ChevronLeft size={16} style={{ marginRight: "4px" }} /> Previous
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!hasNext}
              style={{
                backgroundColor: hasNext ? "#4f46e5" : "#ccc",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: hasNext ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                opacity: hasNext ? 1 : 0.6,
              }}
            >
              Next <ChevronRightIcon size={16} style={{ marginLeft: "4px" }} />
            </button>

            <select
              value={email.folderId || 'inbox'}
              onChange={(e) => onMoveEmail(email._id, e.target.value)}
              style={{
                fontSize: "14px",
                padding: "6px 10px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              {folderConfig.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  Move to {folder.name}
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "50%", // Circular button
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                flexShrink: 0,
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
            <User size={16} style={{ marginRight: "6px" }} />
            <strong>From:</strong> {formatSender(email.from)}
          </p>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
            <Calendar size={16} style={{ marginRight: "6px" }} />
            <strong>Date:</strong> {email.date ? formatDate(email.date) : "N/A"}
          </p>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
            <Folder size={16} style={{ marginRight: "6px" }} />
            <strong>Current Folder:</strong> {folderConfig.find(f => f.id === email.folderId)?.name || email.folderId || 'Unknown'}
          </p>
        </div>

        {/* Email content area */}
        <div
          style={{
            flex: 1, // Allows content to take available space and scroll
            overflowY: "auto", // Scrollable content
            paddingRight: "10px", // To account for scrollbar width if present
          }}
        >
          {email.html ? (
            <div dangerouslySetInnerHTML={{ __html: email.html }} />
          ) : email.text ? (
            <p style={{ whiteSpace: "pre-wrap", fontSize: "1rem", lineHeight: "1.6", color: "#374151" }}>
              {email.text}
            </p>
          ) : (
            <p style={{ fontSize: "1rem", color: "#64748b", textAlign: "center", padding: "2rem" }}>
              No readable content (text or HTML) for this email.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


//App Component 
function App() {
  const [allEmails, setAllEmails] = useState([]);
  const [displayedEmails, setDisplayedEmails] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [emailCounts, setEmailCounts] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailForModal, setSelectedEmailForModal] = useState(null);

  const folderConfig = [
    { id: 'inbox', name: 'Inbox', icon: Inbox },
    { id: 'supplier', name: 'Suppliers', icon: Package },
    { id: 'competitor', name: 'Competitors', icon: TrendingUp },
    { id: 'information', name: 'Information', icon: Info },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'marketing', name: 'Marketing', icon: Mail },
    { id: 'archive', name: 'Archive', icon: Archive }
  ];

  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedFolder !== 'all') {
        params.append('folderId', selectedFolder);
      }
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }

      const response = await fetch(`/api/emails/saved?${params.toString()}`);
      const data = await response.json();

      if (data.emails) {
        setAllEmails(data.emails);
        setDisplayedEmails(data.emails); // Ensure this is always up-to-date for modal navigation
      } else {
        setAllEmails([]);
        setDisplayedEmails([]);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setError('Failed to fetch emails.');
      setAllEmails([]);
      setDisplayedEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await fetch('/api/emails/counts');
      const data = await response.json();

      if (data.counts && data.unreadCounts) {
        setEmailCounts(data.counts);
        setUnreadCounts(data.unreadCounts);
      } else if (data.error) {
        console.error('Error from counts API:', data.error);
        setError(`Failed to load counts: ${data.error}`);
      }
    } catch (error) {
      console.error('Error fetching email counts:', error);
      setError('Failed to fetch email counts.');
    }
  };


  const syncEmails = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Starting email sync...');
      const response = await fetch('/api/emails');
      const data = await response.json();

      if (response.ok) {
        console.log('Sync complete:', data.categorization || 'No categorization data');
        await fetchEmails();
        await fetchCounts();
        setSelectedEmailForModal(null); // Close modal if open after sync
      } else {
        setError(`Sync failed: ${data.message || data.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error syncing emails:', error);
      setError('Failed to sync emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markEmailAsRead = async (emailId) => {
    try {
      const response = await fetch(`/api/emails/${emailId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setAllEmails(prevEmails =>
          prevEmails.map(email =>
            email._id === emailId ? { ...email, isRead: true } : email
          )
        );
        // Only update displayedEmails if necessary (it will be re-fetched anyway)
        setDisplayedEmails(prevEmails =>
            prevEmails.map(email =>
                email._id === emailId ? { ...email, isRead: true } : email
            )
        );
        // Update the email in the modal if it's the one displayed
        setSelectedEmailForModal(prev =>
            prev && prev._id === emailId ? { ...prev, isRead: true } : prev
        );
        fetchCounts();
      } else {
        const errorData = await response.json();
        console.error('Failed to mark email as read:', errorData.error);
      }
    } catch (error) {
      console.error('Error marking email as read:', error);
    }
  };

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
        setAllEmails(prevEmails =>
          prevEmails.map(email =>
            email._id === emailId ? { ...email, folderId: newFolderId } : email
          )
        );
        setSelectedEmailForModal(prev =>
            prev && prev._id === emailId ? { ...prev, folderId: newFolderId } : prev
        );

        await fetchEmails(); // Re-fetch emails to reflect potential list changes for current folder
        await fetchCounts(); // Re-fetch counts
      } else {
        const errorData = await response.json();
        setError(`Failed to move email: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error moving email:', error);
      setError('Failed to move email due to network error.');
    }
  };

  const getCurrentFolderName = () => {
    if (selectedFolder === 'all') return 'All Emails';
    return folderConfig.find(f => f.id === selectedFolder)?.name || 'Unknown Folder';
  };

  const handleEmailClick = (email) => {
    setSelectedEmailForModal(email); // Set the full email object
    if (!email.isRead) {
      markEmailAsRead(email._id); // Mark as read when opened in modal
    }
  };

  const handleCloseEmailModal = () => {
    setSelectedEmailForModal(null);
  };

  useEffect(() => {
    setFolders(folderConfig);
    fetchEmails();
    fetchCounts();
  }, [selectedFolder, searchQuery]); // Re-fetch when folder or search query changes


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
            unreadCounts={unreadCounts}
          />
        </aside>

        {/* Email List Content */}
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

          {!loading && !error && displayedEmails.length > 0 && (
            <div>
              {displayedEmails.map((email, i) => (
                <div
                  key={email._id || i}
                  style={{
                    backgroundColor: email.isRead ? "white" : "#eff6ff",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    borderLeft: selectedEmailForModal?._id === email._id ? "4px solid #4f46e5" : "4px solid transparent", // Highlight selected in list
                    fontWeight: email.isRead ? "normal" : "bold",
                  }}
                  onClick={() => handleEmailClick(email)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#1e293b" }}>
                        {email.subject || "(No Subject)"}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
                          <User size={14} style={{ marginRight: "4px" }} />
                          <strong>From:</strong> {email.from?.name || email.from?.address || "Unknown"}
                        </p>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
                          <Calendar size={14} style={{ marginRight: "4px" }} />
                          <strong>Date:</strong> {email.date ? (new Date(email.date)).toLocaleDateString() : "N/A"}
                        </p>
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, display: "flex", alignItems: "center" }}>
                          <Folder size={14} style={{ marginRight: "4px" }} />
                          <strong>Folder:</strong> {folderConfig.find(f => f.id === email.folderId)?.name || email.folderId || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon // Using ChevronRightIcon to differentiate from the prop 'ChevronRight'
                      size={16}
                      style={{
                        color: "#64748b",
                        marginLeft: "8px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Admin Modal */}
      {showAdmin && <AdminModal onClose={() => setShowAdmin(false)} />}

      {/* Email Modal */}
      {selectedEmailForModal && (
        <EmailModal
          email={selectedEmailForModal}
          onClose={handleCloseEmailModal}
          folderConfig={folderConfig}
          onMoveEmail={moveEmail}
          displayedEmails={displayedEmails} // Pass the filtered/searched list
          onSelectEmail={setSelectedEmailForModal} // Pass the setter for internal modal navigation
          onMarkAsRead={markEmailAsRead} // Pass markAsRead for next/previous
        />
      )}

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

