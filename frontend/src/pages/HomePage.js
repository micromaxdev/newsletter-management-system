import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Shield,
  RefreshCw,
  Search,
  AlertCircle,
  Settings,
  FolderCog,
  Folder,
  ArrowLeft,
} from "lucide-react";
import EmailModal from "../modals/EmailModal";
import AutoSummarizationConfigModal from "../modals/AutoSummarizationConfigModal";
import FolderTree from "../sections/FolderTree";
import EmailList from "../sections/EmailList";
import NotificationCenter from "../components/NotificationCenter";
import ToastContainer from "../components/ToastContainer";
import useEmails from "../hooks/useEmails";
import useFilters from "../hooks/useFilters";
import useWebSocket from "../hooks/useWebSocket";

export default function HomePage({ handleLogout }) {
  const [folders, setFolders] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [selectedEmailForModal, setSelectedEmailForModal] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedFolderSubfolders, setSelectedFolderSubfolders] = useState([]);

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
    clearCache,
  } = useEmails();

  const {
    isConnected,
    connectionError,
    newEmails,
    notifications,
    toasts,
    markNotificationAsRead,
    clearNotifications,
    clearNewEmails,
    removeToast,
  } = useWebSocket();

  const {
    selectedFolder,
    searchQuery,
    daysFilter,
    tagFilter,
    availableTags,
    filteredEmails,
    hasActiveFilters,
    setSelectedFolder,
    setSearchQuery,
    setDaysFilter,
    setTagFilter,
    formatTagDisplayName,
  } = useFilters(displayedEmails, fetchEmails);

  const flattenFolders = useCallback((items) => {
    const result = [];

    const walk = (foldersToWalk) => {
      foldersToWalk.forEach((folder) => {
        if (!folder) return;

        const { children = [], ...rest } = folder;
        result.push(rest);

        if (Array.isArray(children) && children.length > 0) {
          walk(children);
        }
      });
    };

    walk(items || []);
    return result;
  }, []);

  const flatFolders = useMemo(() => flattenFolders(folders), [folders, flattenFolders]);

  const fetchFolders = useCallback(async () => {
    try {
      setFoldersLoading(true);

      const response = await fetch("/api/folders", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch folders");
      }

      const data = await response.json();
      setFolders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching folders:", err);
      setFolders([]);
    } finally {
      setFoldersLoading(false);
    }
  }, []);

  const fetchSelectedFolderSubfolders = useCallback(async () => {
    try {
      if (!selectedFolder || selectedFolder === "all") {
        setSelectedFolderSubfolders([]);
        return;
      }

      const selectedFolderObj = flatFolders.find(
        (folder) => folder.folderId === selectedFolder
      );

      if (!selectedFolderObj || selectedFolderObj.parentFolderId) {
        setSelectedFolderSubfolders([]);
        return;
      }

      const response = await fetch(`/api/folders/${selectedFolder}/subfolders`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subfolders");
      }

      const data = await response.json();
      setSelectedFolderSubfolders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching selected folder subfolders:", err);
      setSelectedFolderSubfolders([]);
    }
  }, [selectedFolder, flatFolders]);

  useEffect(() => {
    fetchFolders();
    fetchEmails({ folderId: "all", page: 1 });
    fetchCounts();
  }, [fetchFolders, fetchEmails, fetchCounts]);

  useEffect(() => {
    fetchSelectedFolderSubfolders();
  }, [fetchSelectedFolderSubfolders]);

  useEffect(() => {
    if (newEmails.length > 0) {
      clearCache();

      fetchEmails({
        folderId: selectedFolder !== "all" ? selectedFolder : undefined,
        page: 1,
        forceRefresh: true,
      });

      fetchCounts();
      clearNewEmails();
    }
  }, [
    newEmails,
    selectedFolder,
    fetchEmails,
    fetchCounts,
    clearNewEmails,
    clearCache,
  ]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        fetchEmails({
          searchQuery: searchQuery.trim(),
          folderId: selectedFolder !== "all" ? selectedFolder : undefined,
          tag: tagFilter || undefined,
          days: daysFilter ? parseInt(daysFilter, 10) : undefined,
          page: 1,
        });
      }, 300);

      return () => clearTimeout(timeoutId);
    } else if (searchQuery === "") {
      fetchEmails({
        folderId: selectedFolder !== "all" ? selectedFolder : undefined,
        tag: tagFilter || undefined,
        days: daysFilter ? parseInt(daysFilter, 10) : undefined,
        page: 1,
      });
    }
  }, [searchQuery, selectedFolder, tagFilter, daysFilter, fetchEmails]);

  const handleEmailClick = useCallback(
    (email) => {
      setSelectedEmailForModal(email);
      if (!email.isRead) {
        markEmailAsRead(email._id);
      }
    },
    [markEmailAsRead]
  );

  const handleCloseEmailModal = useCallback(() => {
    setSelectedEmailForModal(null);
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  const handleDaysFilterChange = useCallback(
    (e) => {
      setDaysFilter(e.target.value);
    },
    [setDaysFilter]
  );

  const handleTagFilterChange = useCallback(
    (e) => {
      setTagFilter(e.target.value);
    },
    [setTagFilter]
  );

  const handleSyncEmails = useCallback(async () => {
    await syncEmails();
    await fetchFolders();
    await fetchCounts();
    await fetchSelectedFolderSubfolders();
  }, [syncEmails, fetchFolders, fetchCounts, fetchSelectedFolderSubfolders]);

  const handleSubfolderClick = useCallback(
    (subfolderId) => {
      setSelectedFolder(subfolderId);
      setSelectedEmailForModal(null);
    },
    [setSelectedFolder]
  );

  const selectedFolderObject = useMemo(() => {
    if (!selectedFolder || selectedFolder === "all") return null;
    return flatFolders.find((folder) => folder.folderId === selectedFolder) || null;
  }, [selectedFolder, flatFolders]);

  const parentFolderOfSelectedSubfolder = useMemo(() => {
    if (!selectedFolderObject?.parentFolderId) return null;

    return (
      flatFolders.find(
        (folder) => folder.folderId === selectedFolderObject.parentFolderId
      ) || null
    );
  }, [selectedFolderObject, flatFolders]);

  const handleBackToParentFolder = useCallback(() => {
    if (!parentFolderOfSelectedSubfolder) return;
    setSelectedFolder(parentFolderOfSelectedSubfolder.folderId);
    setSelectedEmailForModal(null);
  }, [parentFolderOfSelectedSubfolder, setSelectedFolder]);

  const effectivePagination = useMemo(() => {
    if (!pagination) return null;

    if (hasActiveFilters) {
      return {
        ...pagination,
        hasNextPage:
          filteredEmails.length === displayedEmails.length &&
          pagination.hasNextPage,
      };
    }

    return pagination;
  }, [
    pagination,
    hasActiveFilters,
    filteredEmails.length,
    displayedEmails.length,
  ]);

  const filterStatusDisplay = useMemo(() => {
    if (!daysFilter && !tagFilter) return null;

    const parts = [];

    if (daysFilter) {
      parts.push(`last ${daysFilter} day${daysFilter === "1" ? "" : "s"}`);
    }

    if (tagFilter) {
      parts.push(`"${formatTagDisplayName(tagFilter)}" tag`);
    }

    return `filtered by ${parts.join(" and ")}`;
  }, [daysFilter, tagFilter, formatTagDisplayName]);

  const emailCountDisplay = useMemo(() => {
    if (hasActiveFilters) {
      let display = `Showing ${filteredEmails.length} filtered emails`;

      if (displayedEmails.length > filteredEmails.length) {
        display += ` from ${displayedEmails.length} fetched`;
      }

      if (pagination) {
        display += ` of ${pagination.totalEmails} total`;
      }

      return `(${display})`;
    }

    return `(Showing ${filteredEmails.length} emails${
      pagination ? ` of ${pagination.totalEmails}` : ""
    })`;
  }, [
    hasActiveFilters,
    filteredEmails.length,
    displayedEmails.length,
    pagination,
  ]);

  const currentFolderName = useMemo(() => {
    if (selectedFolder === "all") return "All Emails";

    const matchedFolder = flatFolders.find(
      (folder) => folder.folderId === selectedFolder
    );

    if (!matchedFolder) return selectedFolder;

    if (!matchedFolder.parentFolderId) return matchedFolder.name;

    const parent = flatFolders.find(
      (folder) => folder.folderId === matchedFolder.parentFolderId
    );

    return parent ? `${parent.name} / ${matchedFolder.name}` : matchedFolder.name;
  }, [selectedFolder, flatFolders]);

  const LoadingSkeleton = useCallback(
    () => (
      <div style={{ padding: "1rem" }}>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            style={{
              height: "80px",
              backgroundColor: "#f1f5f9",
              marginBottom: "8px",
              borderRadius: "8px",
              animation: "pulse 1.5s infinite",
            }}
          />
        ))}
      </div>
    ),
    []
  );

  const sidebarButtonStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: "1rem",
    marginTop: "1rem",
    border: "none",
    cursor: "pointer",
    width: "300px",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
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
            {connectionError && (
              <div
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <AlertCircle size={14} />
                Connection Error
              </div>
            )}

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
                onChange={handleSearchChange}
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

            <select
              value={daysFilter}
              onChange={handleDaysFilterChange}
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
              <option value="1">Yesterday</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>

            <select
              value={tagFilter}
              onChange={handleTagFilterChange}
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
              onClick={handleSyncEmails}
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

          <Link to="/approval-queue" style={{ textDecoration: "none" }}>
            <button style={sidebarButtonStyle}>
              <Shield size={16} style={{ marginRight: "6px", color: "#f59e0b" }} />
              Approval Queue
            </button>
          </Link>

          <Link to="/manage-folders" style={{ textDecoration: "none" }}>
            <button style={sidebarButtonStyle}>
              <FolderCog size={16} style={{ marginRight: "6px", color: "#4f46e5" }} />
              Manage Folders
            </button>
          </Link>

          <Link to="/manage-subfolders" style={{ textDecoration: "none" }}>
            <button style={sidebarButtonStyle}>
              <FolderCog size={16} style={{ marginRight: "6px", color: "#0f766e" }} />
              Manage Subfolders
            </button>
          </Link>

          <button
            onClick={() => setShowConfigModal(true)}
            style={sidebarButtonStyle}
          >
            <Settings size={16} style={{ marginRight: "6px", color: "#f59e0b" }} />
            Auto Summarization Config
          </button>
        </aside>

        <section
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              marginBottom: "1rem",
              flexShrink: 0,
              minHeight: "60px",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                color: "#1e293b",
                margin: 0,
              }}
            >
              {foldersLoading ? "Loading folders..." : currentFolderName}
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginLeft: "8px",
                }}
              >
                {emailCountDisplay}
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

              {filterStatusDisplay && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#059669",
                    marginLeft: "8px",
                  }}
                >
                  - {filterStatusDisplay}
                </span>
              )}
            </h2>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setDaysFilter("");
                  setTagFilter("");
                  setSearchQuery("");
                }}
                style={{
                  backgroundColor: "#0d5ae8ff",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  marginLeft: "8px",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {parentFolderOfSelectedSubfolder && (
            <div
              style={{
                marginBottom: "1rem",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "12px 16px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleBackToParentFolder}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#eef2ff",
                  color: "#4338ca",
                  border: "1px solid #c7d2fe",
                  borderRadius: "999px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ArrowLeft size={14} />
                Back to {parentFolderOfSelectedSubfolder.name}
              </button>

              <span
                style={{
                  fontSize: "13px",
                  color: "#475569",
                }}
              >
                You are viewing subfolder:{" "}
                <strong>{selectedFolderObject?.name}</strong>
              </span>
            </div>
          )}

          {selectedFolder !== "all" &&
            !selectedFolderObject?.parentFolderId &&
            selectedFolderSubfolders.length > 0 && (
              <div
                style={{
                  marginBottom: "1rem",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  padding: "12px 16px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                    color: "#334155",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  <Folder size={16} />
                  Subfolders in {currentFolderName}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {selectedFolderSubfolders.map((subfolder) => {
                    const isActiveSubfolder = selectedFolder === subfolder.folderId;

                    return (
                      <button
                        key={subfolder.folderId}
                        type="button"
                        onClick={() => handleSubfolderClick(subfolder.folderId)}
                        style={{
                          backgroundColor: isActiveSubfolder ? "#4338ca" : "#eef2ff",
                          color: isActiveSubfolder ? "white" : "#4338ca",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 500,
                          border: isActiveSubfolder
                            ? "1px solid #4338ca"
                            : "1px solid #c7d2fe",
                          cursor: "pointer",
                        }}
                      >
                        {subfolder.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                minHeight: "48px",
              }}
            >
              <AlertCircle size={16} style={{ marginRight: "8px" }} />
              {error}
            </div>
          )}

          <div
            style={{
              flex: 1,
              overflow: "auto",
              minHeight: 0,
              height: "100%",
            }}
          >
            {loading && displayedEmails.length === 0 ? (
              <LoadingSkeleton />
            ) : (
              <EmailList
                emails={filteredEmails}
                loading={loading}
                error={error}
                selectedFolder={selectedFolder}
                searchQuery={searchQuery}
                selectedEmailForModal={selectedEmailForModal}
                onEmailClick={handleEmailClick}
                folders={folders}
                pagination={effectivePagination}
                onLoadMore={loadMoreEmails}
              />
            )}
          </div>
        </section>
      </main>

      {selectedEmailForModal && (
        <EmailModal
          email={selectedEmailForModal}
          onClose={handleCloseEmailModal}
          folders={folders}
          type={"email"}
          onMoveEmail={moveEmail}
          displayedEmails={filteredEmails}
          onSelectEmail={setSelectedEmailForModal}
          onMarkAsRead={markEmailAsRead}
          onUpdateTags={updateTags}
        />
      )}

      {showConfigModal && (
        <AutoSummarizationConfigModal
          onClose={() => setShowConfigModal(false)}
        />
      )}

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}