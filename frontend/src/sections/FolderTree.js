import React from "react";
import { Folder, List } from "lucide-react";

export default function FolderTree({
  folders,
  selectedFolder,
  onFolderSelect,
  unreadCounts,
}) {
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
        onClick={() => onFolderSelect("all")}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          cursor: "pointer",
          backgroundColor: selectedFolder === "all" ? "#e0e7ff" : "transparent",
          borderRadius: "6px",
          margin: "4px 0",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "8px",
        }}
      >
        <List size={16} color="#4f46e5" style={{ marginRight: "8px" }} />
        <span
          style={{
            flex: 1,
            fontSize: "14px",
            fontWeight: selectedFolder === "all" ? "600" : "500",
            color: selectedFolder === "all" ? "#4f46e5" : "#374151",
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
            backgroundColor:
              selectedFolder === folder.id ? "#e0e7ff" : "transparent",
            borderRadius: "6px",
            margin: "4px 0",
          }}
        >
          <folder.icon
            size={16}
            color="#f59e0b"
            style={{ marginRight: "8px" }}
          />
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
}
