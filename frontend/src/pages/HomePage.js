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
import NotificationCenter from "../components/NotificationCenter";
import ToastContainer from "../components/ToastContainer";
import useEmails from "../hooks/useEmails";
import useFilters from "../hooks/useFilters";
import useWebSocket from "../hooks/useWebSocket";

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
    displayedEmails,
    loading,
    error,
    unreadCounts,
    pagination,
    fetchEmails,
    fetchCounts,
    syncEmails,
    markEmailAsRead,
    moveEmail,
    updateTags,
    loadMoreEmails,
    clearCache
  } = useEmails();

  // WebSocket hook
  const {
    isConnected,
    connectionError,
    newEmails,
    notifications,
    toasts,
    markNotificationAsRead,
    clearNotifications,
    clearNewEmails,
    removeToast
  } = useWebSocket();

  const {
    selectedFolder,
    searchQuery,
    daysFilter,
    tagFilter,
    availableTags,
    filteredEmails, // Now this contains the final filtered emails to display
    setSelectedFolder,
    setSearchQuery,
    setDaysFilter,
    setTagFilter,
    getCurrentFolderName,
    formatTagDisplayName
  } = useFilters(displayedEmails, fetchEmails);

    // Initial load effect
  useEffect(() => {
    setFolders(folderConfig);
    // Load initial emails for "all" folder
    fetchEmails({ folderId: "all", page: 1 });
    fetchCounts();
  }, [fetchEmails, fetchCounts]);

  // Handle new emails from WebSocket
  useEffect(() => {
    if (newEmails.length > 0) {
      console.log('New emails received via WebSocket:', newEmails);
      
      // Clear cache first to ensure fresh data
      clearCache();
      
      // Force refresh email list and counts when new emails arrive
      fetchEmails({ 
        folderId: selectedFolder !== "all" ? selectedFolder : undefined,
        page: 1,
        forceRefresh: true  // Force refresh to bypass cache
      });
      fetchCounts();
      
      // Clear new emails after processing
      clearNewEmails();
    }
  }, [newEmails, selectedFolder, fetchEmails, fetchCounts, clearNewEmails, clearCache]);

  // Search query effect with debouncing
  useEffect(() => {
    // Only fetch from server for search queries
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        fetchEmails({ 
          searchQuery: searchQuery.trim(),
          folderId: selectedFolder !== "all" ? selectedFolder : undefined,
          page: 1
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    } else if (searchQuery === "") {
      // If search is cleared, reload current folder
      fetchEmails({ 
        folderId: selectedFolder !== "all" ? selectedFolder : undefined,
        page: 1 
      });
    }
  }, [searchQuery, selectedFolder, fetchEmails]);

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
            {/* WebSocket Connection Status */}
            {connectionError && (
              <div style={{ 
                color: "#dc2626", 
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <AlertCircle size={14} />
                Connection Error
              </div>
            )}

            {/* Notification Center */}
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onClearAll={clearNotifications}
              onEmailClick={handleEmailClick}
              isConnected={isConnected}
            />

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
                (Showing {filteredEmails.length} emails{pagination ? ` of ${pagination.totalEmails}` : ""})
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
              emails={filteredEmails}
              loading={loading}
              error={error}
              selectedFolder={selectedFolder}
              searchQuery={searchQuery}
              selectedEmailForModal={selectedEmailForModal}
              onEmailClick={handleEmailClick}
              folderConfig={folderConfig}
              pagination={pagination}
              onLoadMore={loadMoreEmails}
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
          displayedEmails={filteredEmails}
          onSelectEmail={setSelectedEmailForModal}
          onMarkAsRead={markEmailAsRead}
          onUpdateTags={updateTags}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer 
        toasts={toasts} 
        onRemoveToast={removeToast} 
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}