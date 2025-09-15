import React, { useEffect, useState } from "react";
import {
  Mail,
  Shield,
  RefreshCw,
  Search,
  AlertCircle,
  Package,
  Users,
  TrendingUp,
  Archive,
  Inbox,
  Info,
} from "lucide-react";
import EmailModal from "../modals/EmailModal";
import AdminModal from "../modals/AdminModal";
import FolderTree from "../sections/FolderTree";
import EmailList from "../sections/EmailList";

const folderConfig = [
  { id: "inbox", name: "Inbox", icon: Inbox },
  { id: "supplier", name: "Suppliers", icon: Package },
  { id: "competitor", name: "Competitors", icon: TrendingUp },
  { id: "information", name: "Information", icon: Info },
  { id: "customers", name: "Customers", icon: Users },
  { id: "marketing", name: "Marketing", icon: Mail },
  { id: "archive", name: "Archive", icon: Archive },
];

export default function HomePage({ handleLogout }) {
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [folders, setFolders] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [displayedEmails, setDisplayedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailCounts, setEmailCounts] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedEmailForModal, setSelectedEmailForModal] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Initial load effect
  useEffect(() => {
    setFolders(folderConfig);
    fetchEmails();
    fetchCounts();
    // eslint-disable-next-line
  }, []);

  // Folder/search change effect with client-side filtering for better performance
  useEffect(() => {
    if (!isInitialLoad) {
      // If we have all emails and we're just changing folders (not searching), filter client-side
      if (!searchQuery.trim() && allEmails.length > 0) {
        filterEmailsClientSide();
      } else {
        // For search queries, we need to fetch from server
        const timeoutId = setTimeout(() => {
          fetchEmails();
        }, 300); // Debounce search queries
        
        return () => clearTimeout(timeoutId);
      }
    }
    // eslint-disable-next-line
  }, [selectedFolder, searchQuery]);

  const filterEmailsClientSide = () => {
    if (selectedFolder === "all") {
      setDisplayedEmails(allEmails);
    } else {
      const filtered = allEmails.filter(email => email.folderId === selectedFolder);
      setDisplayedEmails(filtered);
    }
  };

  const fetchEmails = async () => {
    // Only show loading spinner on initial load or when there are no emails
    if (isInitialLoad || displayedEmails.length === 0) {
      setLoading(true);
    }
    
    setError("");
    try {
      const params = new URLSearchParams();
      
      // For initial load or search queries, fetch from server
      if (searchQuery.trim()) {
        params.append("q", searchQuery.trim());
        if (selectedFolder !== "all") {
          params.append("folderId", selectedFolder);
        }
      }
      // For initial load, get all emails

      const response = await fetch(`${API_URL}/api/emails/saved?${params.toString()}`, { credentials: "include" });
      const data = await response.json();

      if (data.emails) {
        setAllEmails(data.emails);
        
        // Filter immediately based on current folder selection
        if (searchQuery.trim()) {
          setDisplayedEmails(data.emails);
        } else if (selectedFolder === "all") {
          setDisplayedEmails(data.emails);
        } else {
          const filtered = data.emails.filter(email => email.folderId === selectedFolder);
          setDisplayedEmails(filtered);
        }
      } else {
        setAllEmails([]);
        setDisplayedEmails([]);
      }
      
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setError("Failed to fetch emails.");
      setAllEmails([]);
      setDisplayedEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/emails/counts`, { credentials: "include" });
      const data = await response.json();

      if (data.counts && data.unreadCounts) {
        setEmailCounts(data.counts);
        setUnreadCounts(data.unreadCounts);
      } else if (data.error) {
        console.error("Error from counts API:", data.error);
        setError(`Failed to load counts: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching email counts:", error);
      setError("Failed to fetch email counts.");
    }
  };

  const syncEmails = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Starting email sync...");
      const response = await fetch(`${API_URL}/api/emails`, { credentials: "include" });
      const data = await response.json();

      if (response.ok) {
        console.log(
          "Sync complete:",
          data.categorization || "No categorization data"
        );
        // Refresh the entire page to ensure all data is reloaded
        window.location.reload();
      } else {
        setError(
          `Sync failed: ${data.message || data.error || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error syncing emails:", error);
      setError("Failed to sync emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markEmailAsRead = async (emailId) => {
    try {
      const response = await fetch(`${API_URL}/api/emails/${emailId}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (response.ok) {
        setAllEmails((prevEmails) =>
          prevEmails.map((email) =>
            email._id === emailId ? { ...email, isRead: true } : email
          )
        );
        setDisplayedEmails((prevEmails) =>
          prevEmails.map((email) =>
            email._id === emailId ? { ...email, isRead: true } : email
          )
        );
        setSelectedEmailForModal((prev) =>
          prev && prev._id === emailId ? { ...prev, isRead: true } : prev
        );
        fetchCounts();
      } else {
        const errorData = await response.json();
        console.error("Failed to mark email as read:", errorData.error);
      }
    } catch (error) {
      console.error("Error marking email as read:", error);
    }
  };

  const moveEmail = async (emailId, newFolderId) => {
    try {
      const response = await fetch(`${API_URL}/api/emails/${emailId}/folder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId: newFolderId }),
        credentials: "include"
      });

      if (response.ok) {
        setAllEmails((prevEmails) =>
          prevEmails.map((email) =>
            email._id === emailId ? { ...email, folderId: newFolderId } : email
          )
        );
        setSelectedEmailForModal((prev) =>
          prev && prev._id === emailId
            ? { ...prev, folderId: newFolderId }
            : prev
        );

        await fetchEmails();
        await fetchCounts();
      } else {
        const errorData = await response.json();
        setError(
          `Failed to move email: ${errorData.error || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error moving email:", error);
      setError("Failed to move email due to network error.");
    }
  };

  const updateTags = async (emailId, tags) => {
    try {
      const response = await fetch(`${API_URL}/api/emails/tag/${emailId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        // Update the email in both allEmails and displayedEmails
        setAllEmails((prevEmails) =>
          prevEmails.map((email) =>
            email._id === emailId ? { ...email, tags: data.email.tags } : email
          )
        );
        setDisplayedEmails((prevEmails) =>
          prevEmails.map((email) =>
            email._id === emailId ? { ...email, tags: data.email.tags } : email
          )
        );
        setSelectedEmailForModal((prev) =>
          prev && prev._id === emailId ? { ...prev, tags: data.email.tags } : prev
        );
      } else {
        const errorData = await response.json();
        setError(
          `Failed to update tags: ${errorData.message || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error updating tags:", error);
      setError("Failed to update tags due to network error.");
    }
  };

  const getCurrentFolderName = () => {
    if (selectedFolder === "all") return "All Emails";
    return (
      folderConfig.find((f) => f.id === selectedFolder)?.name ||
      "Unknown Folder"
    );
  };

  const handleEmailClick = (email) => {
    setSelectedEmailForModal(email);
    if (!email.isRead) {
      markEmailAsRead(email._id);
    }
  };

  const handleCloseEmailModal = () => {
    setSelectedEmailForModal(null);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f8fafc",
        fontFamily: "sans-serif",
        overflow: "hidden",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "white",
          padding: "1rem",
          borderBottom: "1px solid #e2e8f0",
          height: "80px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mail size={28} color="#4f46e5" style={{ marginRight: "10px" }} />
            <h1
              style={{
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#1e293b",
              }}
            >
              MMX Newsletter Inbox
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                }}
              />
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
                  width: "200px",
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
                opacity: loading ? 0.6 : 1,
              }}
            >
              <RefreshCw
                size={16}
                style={{
                  marginRight: "6px",
                  animation: loading ? "spin 1s linear infinite" : "none",
                }}
              />
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

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          height: "calc(100vh - 80px)",
          padding: "2rem 1rem",
          gap: "2rem",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: "300px",
            flexShrink: 0,
          }}
        >
          <FolderTree
            folders={folders}
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
            unreadCounts={unreadCounts}
          />
        </aside>

        {/* Email List Content */}
        <section
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Folder Header */}
          <div style={{ marginBottom: "1rem", flexShrink: 0, height: "60px", display: "flex", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.2rem", color: "#1e293b", margin: 0 }}>
              {getCurrentFolderName()}
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginLeft: "8px",
                }}
              >
                ({displayedEmails.length} emails)
              </span>
              {searchQuery && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#4f46e5",
                    marginLeft: "8px",
                  }}
                >
                  - searching for "{searchQuery}"
                </span>
              )}
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                height: "48px",
              }}
            >
              <AlertCircle size={16} style={{ marginRight: "8px" }} />
              {error}
            </div>
          )}

          {/* Fixed Email List Container */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              minHeight: 0,
              height: "100%",
            }}
          >
            <EmailList
              emails={displayedEmails}
              loading={loading}
              error={error}
              selectedFolder={selectedFolder}
              searchQuery={searchQuery}
              selectedEmailForModal={selectedEmailForModal}
              onEmailClick={handleEmailClick}
              folderConfig={folderConfig}
            />
          </div>
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
          displayedEmails={displayedEmails}
          onSelectEmail={setSelectedEmailForModal}
          onMarkAsRead={markEmailAsRead}
          onUpdateTags={updateTags}
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
