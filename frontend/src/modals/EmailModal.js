import React from "react";
import {
  User,
  Calendar,
  Folder,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import DOMPurify from "dompurify";

export default function EmailModal({
  email,
  onClose,
  folderConfig,
  onMoveEmail,
  displayedEmails,
  onSelectEmail,
  onMarkAsRead,
}) {
  if (!email) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
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

  const currentIndex = displayedEmails.findIndex((e) => e._id === email._id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < displayedEmails.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      const prevEmail = displayedEmails[currentIndex - 1];
      onSelectEmail(prevEmail);
      if (!prevEmail.isRead) onMarkAsRead(prevEmail._id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      const nextEmail = displayedEmails[currentIndex + 1];
      onSelectEmail(nextEmail);
      if (!nextEmail.isRead) onMarkAsRead(nextEmail._id);
    }
  };

  const sanitizedHTML = email.html
    ? DOMPurify.sanitize(email.html, { ADD_ATTR: ["target"] })
    : "";

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
          maxWidth: "900px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              margin: 0,
              color: "#1e293b",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
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
                opacity: hasPrevious ? 1 : 0.6,
                display: "flex",
                alignItems: "center",
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
                opacity: hasNext ? 1 : 0.6,
                display: "flex",
                alignItems: "center",
              }}
            >
              Next <ChevronRight size={16} style={{ marginLeft: "4px" }} />
            </button>

            {/* Move Folder Dropdown */}
            <select
              value={email.folderId || "inbox"}
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

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "8px",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Email Meta Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <User size={16} style={{ marginRight: "6px" }} />
            <strong>From:</strong> {formatSender(email.from)}
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Calendar size={16} style={{ marginRight: "6px" }} />
            <strong>Date:</strong> {email.date ? formatDate(email.date) : "N/A"}
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Folder size={16} style={{ marginRight: "6px" }} />
            <strong>Folder:</strong>{" "}
            {folderConfig.find((f) => f.id === email.folderId)?.name ||
              email.folderId ||
              "Unknown"}
          </p>
        </div>

        {/* Email Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#fafafa",
          }}
        >
          {sanitizedHTML ? (
            <div
              dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
              style={{
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
                color: "#374151",
              }}
            />
          ) : email.text ? (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                color: "#374151",
                margin: 0,
              }}
            >
              {email.text}
            </pre>
          ) : (
            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
              No content available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
