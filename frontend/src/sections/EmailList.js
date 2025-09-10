import React from "react";
import {
  Mail,
  RefreshCw,
  User,
  Calendar,
  Folder,
  ChevronRight,
} from "lucide-react";

export default function EmailList({
  emails,
  loading,
  error,
  selectedFolder,
  searchQuery,
  selectedEmailForModal,
  onEmailClick,
  folderConfig,
}) {
  const formatSender = (from) => {
    if (!from) return "Unknown";
    if (typeof from === "string") return from;
    return from.name && from.address
      ? `${from.name} <${from.address}>`
      : from.address || "Unknown";
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "2rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px"
      }}>
        <RefreshCw
          size={24}
          style={{
            animation: "spin 1s linear infinite",
            marginBottom: "8px",
          }}
        />
        <p style={{ color: "#64748b" }}>Loading emails...</p>
      </div>
    );
  }

  if (!loading && !error && emails.length === 0) {
    return (
      <div
        style={{ 
          textAlign: "center", 
          padding: "2rem", 
          color: "#64748b",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px"
        }}
      >
        <Mail
          size={48}
          style={{ marginBottom: "1rem", color: "#e2e8f0" }}
        />
        <p>
          No emails found{" "}
          {selectedFolder === "all" ? "" : "in this folder"}.
        </p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>
          {searchQuery
            ? "Try a different search term"
            : selectedFolder === "all"
            ? 'Click "Sync" to fetch new emails'
            : "Emails will appear here when categorized"}
        </p>
      </div>
    );
  }

  if (!loading && !error && emails.length > 0) {
    return (
      <div style={{ 
        transition: "opacity 0.2s ease-in-out", 
        opacity: 1,
        padding: "0 0 4rem 0",
        minHeight: "400px"
      }}>
        {emails.map((email, i) => (
          <div
            key={email._id || i}
            style={{
              backgroundColor: email.isRead ? "white" : "#eff6ff",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
              borderLeft:
                selectedEmailForModal?._id === email._id
                  ? "4px solid #4f46e5"
                  : "4px solid transparent",
              borderTop: "none",
              borderRight: "none", 
              borderBottom: "none",
              transition: "background-color 0.2s, box-shadow 0.2s",
              width: "100%",
              maxWidth: "800px",
              outline: "none",
            }}
            onClick={() => onEmailClick(email)}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
                border: "none",
                outline: "none",
              }}
            >
              <div style={{ width: "calc(100% - 32px)", minWidth: 0, border: "none", outline: "none", boxShadow: "none" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: email.isRead ? "500" : "600",
                    color: "#1e293b",
                    margin: "0 0 8px 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                    lineHeight: "1.4",
                    border: "none",
                    outline: "none",
                  }}
                >
                  {email.subject || "(No Subject)"}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                    border: "none",
                    outline: "none",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      minWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    <User size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
                    <strong style={{ border: "none", outline: "none", boxShadow: "none" }}>From:</strong> 
                    <span style={{ 
                      marginLeft: "4px", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis",
                      border: "none",
                      outline: "none",
                      boxShadow: "none"
                    }}>
                      {formatSender(email.from)}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      minWidth: "120px",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    <Calendar size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
                    <strong style={{ border: "none", outline: "none", boxShadow: "none" }}>Date:</strong>{" "}
                    {email.date
                      ? new Date(email.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      minWidth: "120px",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    <Folder size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
                    <strong style={{ border: "none", outline: "none", boxShadow: "none" }}>Folder:</strong>{" "}
                    {folderConfig.find((f) => f.id === email.folderId)
                      ?.name ||
                      email.folderId ||
                      "Unknown"}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                style={{
                  color: "#64748b",
                  marginLeft: "8px",
                  flexShrink: 0,
                  alignSelf: "center",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
