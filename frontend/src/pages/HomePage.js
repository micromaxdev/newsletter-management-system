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
import useEmails from "../hooks/useEmails";
import useFilters from "../hooks/useFilters";

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
  const [folders, setFolders] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedEmailForModal, setSelectedEmailForModal] = useState(null);

  // Use custom hooks
  const {
    allEmails,
    displayedEmails,
    loading,
    error,
    unreadCounts,
    isInitialLoad,
    fetchEmails,
    fetchCounts,
    syncEmails,
    markEmailAsRead,
    moveEmail,
    updateTags,
    updateDisplayedEmails
  } = useEmails();

  const {
    selectedFolder,
    searchQuery,
    daysFilter,
    tagFilter,
    availableTags,
    setSelectedFolder,
    setSearchQuery,
    setDaysFilter,
    setTagFilter,
    getCurrentFolderName,
    formatTagDisplayName
  } = useFilters(allEmails, updateDisplayedEmails);

    // Initial load effect
  useEffect(() => {
    setFolders(folderConfig);
    fetchEmails();
    fetchCounts();
    // eslint-disable-next-line
  }, [fetchEmails, fetchCounts]);

  // Folder/search change effect with debouncing
  useEffect(() => {
    if (isInitialLoad) return;

    // Only fetch from server for search queries and folder changes
    // Days and tag filters are handled locally by useFilters
    const timeoutId = setTimeout(() => {
      fetchEmails({ 
        searchQuery: searchQuery.trim(), 
        folderId: selectedFolder !== "all" ? selectedFolder : null 
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedFolder, searchQuery, isInitialLoad, fetchEmails]);

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

            {/* Days filter dropdown */}
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <option value="">All time</option>
              <option value="1">Today</option>
              <option value="2">Yesterday</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>

            {/* Tag filter dropdown */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              style={{
                padding: "6px 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                cursor: "pointer",
                minWidth: "120px",
              }}
            >
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {formatTagDisplayName(tag)}
                </option>
              ))}
            </select>

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
          <div
            style={{
              marginBottom: "1rem",
              flexShrink: 0,
              height: "60px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                color: "#1e293b",
                margin: 0,
              }}
            >
              {getCurrentFolderName(folderConfig)}
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