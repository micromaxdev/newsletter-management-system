import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  RefreshCw,
  User,
  Calendar,
  Folder,
  ChevronRight,
  Tag,
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
  pagination,
  onLoadMore,
}) {
  // Animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const formatSender = (from) => {
    if (!from) return "Unknown";
    if (typeof from === "string") return from;
    return from.name && from.address
      ? `${from.name} <${from.address}>`
      : from.address || "Unknown";
  };

  const getTagColor = (tag) => {
    return "#64748b"; // default gray
  };

  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginTop: "8px",
        flexWrap: "wrap"
      }}>
        <Tag size={14} style={{ color: "#64748b", flexShrink: 0 }} />
        {tags.map((tag, index) => {
          let displayTag = tag;
          if (tag.length === 2) displayTag = tag.toUpperCase();
          else displayTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
          return (
            <span
              key={index}
              style={{
                backgroundColor: getTagColor(tag),
                color: "white",
                fontSize: "11px",
                fontWeight: "500",
                padding: "2px 8px",
                borderRadius: "12px",
                textTransform: "capitalize",
                display: "inline-block",
              }}
            >
              {displayTag}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait" key={selectedFolder}>
      {loading ? (
        <motion.div 
          key="loading"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ 
            textAlign: "center", 
            padding: "2rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px"
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw
              size={24}
              style={{
                marginBottom: "8px",
              }}
            />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            style={{ color: "#64748b" }}
          >
            Loading emails...
          </motion.p>
        </motion.div>
      ) : !error && emails.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
          >
            <Mail
              size={48}
              style={{ marginBottom: "1rem", color: "#e2e8f0" }}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            No emails found{" "}
            {selectedFolder === "all" ? "" : "in this folder"}.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            style={{ fontSize: "14px", marginTop: "8px" }}
          >
            {searchQuery
              ? "Try a different search term"
              : selectedFolder === "all"
              ? 'Click "Sync" to fetch new emails'
              : "Emails will appear here when categorized"}
          </motion.p>
        </motion.div>
      ) : !error && emails.length > 0 ? (
      <motion.div
        key={`email-list-${selectedFolder}-${searchQuery || 'no-search'}-${pagination?.currentPage || 1}`}
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ 
          transition: "opacity 0.2s ease-in-out", 
          opacity: 1,
          padding: "0 0 4rem 0",
          minHeight: "400px"
        }}
      >
        <AnimatePresence mode="wait" key={`emails-${selectedFolder}`}>
          {emails.map((email, i) => (
            <motion.div
              key={email._id || i}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ 
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
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
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
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
                {renderTags(email.tags)}
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
          </motion.div>
        ))}
        
        {/* Load More Button */}
        {pagination && pagination.hasNextPage && !loading && (
          <motion.div 
            key={`load-more-${selectedFolder}-${pagination.currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem 0",
              marginTop: "1rem",
              borderTop: "1px solid #e2e8f0"
            }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.05,
                y: -2,
                boxShadow: "0 4px 8px rgba(79, 70, 229, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => {
                console.log("Load More button clicked"); // Debug log
                onLoadMore();
              }}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: loading ? "#f1f5f9" : "#4f46e5",
                color: loading ? "#64748b" : "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: loading ? "none" : "0 2px 4px rgba(79, 70, 229, 0.2)"
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#4338ca";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(79, 70, 229, 0.3)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#4f46e5";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
                }
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={16} />
                </motion.div>
              ) : (
                <Mail size={16} />
              )}
              {loading ? "Loading..." : `Load More (${pagination.totalEmails - emails.length} remaining)`}
            </motion.button>
          </motion.div>
        )}
        
        {/* Loading indicator for Load More */}
        {loading && pagination && pagination.currentPage > 1 && (
          <motion.div 
            key={`loading-more-${selectedFolder}-${pagination.currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem 0",
              marginTop: "1rem",
              borderTop: "1px solid #e2e8f0"
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#64748b",
              fontSize: "14px"
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={16} />
              </motion.div>
              Loading more emails...
            </div>
          </motion.div>
        )}
        
        {/* Pagination Info */}
        {pagination && (
          <motion.div 
            key={`pagination-info-${selectedFolder}-${pagination.currentPage}-${pagination.totalEmails}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
            style={{
              textAlign: "center",
              padding: "1rem",
              fontSize: "14px",
              color: "#64748b",
              borderTop: pagination.hasNextPage ? "none" : "1px solid #e2e8f0"
            }}
          >
            Showing {emails.length} of {pagination.totalEmails} emails
            {pagination.totalPages > 1 && (
              <span> • Page {pagination.currentPage} of {pagination.totalPages}</span>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
