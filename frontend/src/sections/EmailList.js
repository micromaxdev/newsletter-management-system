// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Mail,
//   RefreshCw,
//   User,
//   Calendar,
//   Folder,
//   ChevronRight,
//   Tag,
//   FileText,
// } from "lucide-react";

// export default function EmailList({
//   emails,
//   loading,
//   error,
//   selectedFolder,
//   searchQuery,
//   selectedEmailForModal,
//   onEmailClick,
//   folderConfig,
//   pagination,
//   onLoadMore,
// }) {
//   // Animation variants for better performance
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         duration: 0.4,
//         ease: "easeOut",
//         staggerChildren: 0.05
//       }
//     },
//     exit: { 
//       opacity: 0, 
//       y: -20,
//       transition: { duration: 0.3, ease: "easeIn" }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.95 },
//     visible: { 
//       opacity: 1, 
//       y: 0, 
//       scale: 1,
//       transition: {
//         duration: 0.4,
//         ease: "easeOut"
//       }
//     },
//     exit: { 
//       opacity: 0, 
//       y: -20, 
//       scale: 0.95,
//       transition: { duration: 0.2 }
//     }
//   };

//   const formatSender = (from) => {
//     if (!from) return "Unknown";
//     if (typeof from === "string") return from;
//     return from.name && from.address
//       ? `${from.name} <${from.address}>`
//       : from.address || "Unknown";
//   };

//   const getTagColor = (tag) => {
//     const tagColors = {
//       'summary': '#10b981',
//       'pending-approval': '#f59e0b',
//       'approved': '#3b82f6',
//       'rejected': '#ef4444',
//       'urgent': '#dc2626',
//       'important': '#7c3aed',
//       'newsletter': '#06b6d4',
//       'promotion': '#ec4899',
//       'invoice': '#f97316',
//       'support': '#14b8a6'
//     };
//     return tagColors[tag.toLowerCase()] || "#64748b"; // default gray
//   };

//   const renderTags = (tags) => {
//     if (!tags || tags.length === 0) return null;
    
//     return (
//       <div style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "0.5rem",
//         marginTop: "8px",
//         flexWrap: "wrap"
//       }}>
//         <Tag size={14} style={{ color: "#64748b", flexShrink: 0 }} />
//         {tags.map((tag, index) => {
//           let displayTag = tag;
//           if (tag.length === 2) displayTag = tag.toUpperCase();
//           else displayTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
//           return (
//             <span
//               key={index}
//               style={{
//                 backgroundColor: getTagColor(tag),
//                 color: "white",
//                 fontSize: "11px",
//                 fontWeight: "500",
//                 padding: "2px 8px",
//                 borderRadius: "12px",
//                 textTransform: "capitalize",
//                 display: "inline-block",
//               }}
//             >
//               {displayTag}
//             </span>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <AnimatePresence mode="wait" key={selectedFolder}>
//       {loading ? (
//         <motion.div 
//           key="loading"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.95 }}
//           transition={{ duration: 0.3, ease: "easeOut" }}
//           style={{ 
//             textAlign: "center", 
//             padding: "2rem",
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "400px"
//           }}
//         >
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           >
//             <RefreshCw
//               size={24}
//               style={{
//                 marginBottom: "8px",
//               }}
//             />
//           </motion.div>
//           <motion.p 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.3 }}
//             style={{ color: "#64748b" }}
//           >
//             Loading emails...
//           </motion.p>
//         </motion.div>
//       ) : !error && emails.length === 0 ? (
//         <motion.div
//           key="empty"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.4, ease: "easeOut" }}
//           style={{ 
//             textAlign: "center", 
//             padding: "2rem", 
//             color: "#64748b",
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "400px"
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
//           >
//             <Mail
//               size={48}
//               style={{ marginBottom: "1rem", color: "#e2e8f0" }}
//             />
//           </motion.div>
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.3 }}
//           >
//             No emails found{" "}
//             {selectedFolder === "all" ? "" : "in this folder"}.
//           </motion.p>
//           <motion.p 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.3 }}
//             style={{ fontSize: "14px", marginTop: "8px" }}
//           >
//             {searchQuery
//               ? "Try a different search term"
//               : selectedFolder === "all"
//               ? 'Click "Sync" to fetch new emails'
//               : "Emails will appear here when categorized"}
//           </motion.p>
//         </motion.div>
//       ) : !error && emails.length > 0 ? (
//       <motion.div
//         key={`email-list-${selectedFolder}-${searchQuery || 'no-search'}-${pagination?.currentPage || 1}`}
//         layout
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         exit="exit"
//         style={{ 
//           transition: "opacity 0.2s ease-in-out", 
//           opacity: 1,
//           padding: "0 0 4rem 0",
//           minHeight: "400px"
//         }}
//       >
//         <AnimatePresence mode="wait" key={`emails-${selectedFolder}`}>
//           {emails.map((email, i) => (
//             <motion.div
//               key={email._id || i}
//               layout
//               variants={itemVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               whileHover={{ 
//                 scale: 1.02,
//                 y: -2,
//                 transition: { duration: 0.2, ease: "easeOut" }
//               }}
//               whileTap={{ scale: 0.98 }}
//               style={{
//                 backgroundColor: email.isRead ? "white" : "#eff6ff",
//                 borderRadius: "12px",
//                 padding: "1.5rem",
//                 marginBottom: "1rem",
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                 cursor: "pointer",
//                 borderLeft:
//                   selectedEmailForModal?._id === email._id
//                     ? "4px solid #4f46e5"
//                     : "4px solid transparent",
//                 borderTop: "none",
//                 borderRight: "none", 
//                 borderBottom: "none",
//                 transition: "background-color 0.2s, box-shadow 0.2s",
//                 width: "100%",
//                 maxWidth: "800px",
//                 outline: "none",
//               }}
//               onClick={() => onEmailClick(email)}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
//               }}
//             >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-start",
//                 width: "100%",
//                 border: "none",
//                 outline: "none",
//               }}
//             >
//               <div style={{ width: "calc(100% - 32px)", minWidth: 0, border: "none", outline: "none", boxShadow: "none" }}>
//                 <div style={{ 
//                   display: "flex", 
//                   alignItems: "center", 
//                   gap: "0.5rem",
//                   marginBottom: "8px"
//                 }}>
//                   <h3
//                     style={{
//                       fontSize: "1rem",
//                       fontWeight: email.isRead ? "500" : "600",
//                       color: "#1e293b",
//                       margin: 0,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                       flex: 1,
//                       lineHeight: "1.4",
//                       border: "none",
//                       outline: "none",
//                     }}
//                   >
//                     {email.subject || "(No Subject)"}
//                   </h3>
//                   {email.hasSummary && (
//                     <div style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "0.25rem",
//                       padding: "2px 6px",
//                       backgroundColor: "#10b981",
//                       color: "white",
//                       borderRadius: "4px",
//                       fontSize: "10px",
//                       fontWeight: "500",
//                       flexShrink: 0
//                     }}>
//                       <FileText size={10} />
//                       SUMMARY
//                     </div>
//                   )}
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "1rem",
//                     marginBottom: "8px",
//                     flexWrap: "wrap",
//                     border: "none",
//                     outline: "none",
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: "14px",
//                       color: "#64748b",
//                       margin: 0,
//                       display: "flex",
//                       alignItems: "center",
//                       minWidth: "200px",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                       border: "none",
//                       outline: "none",
//                       boxShadow: "none",
//                     }}
//                   >
//                     <User size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
//                     <strong style={{ border: "none", outline: "none", boxShadow: "none" }}>From:</strong> 
//                     <span style={{ 
//                       marginLeft: "4px", 
//                       overflow: "hidden", 
//                       textOverflow: "ellipsis",
//                       border: "none",
//                       outline: "none",
//                       boxShadow: "none"
//                     }}>
//                       {formatSender(email.from)}
//                     </span>
//                   </p>
//                   <p
//                     style={{
//                       fontSize: "14px",
//                       color: "#64748b",
//                       margin: 0,
//                       display: "flex",
//                       alignItems: "center",
//                       minWidth: "120px",
//                       border: "none",
//                       outline: "none",
//                       boxShadow: "none",
//                     }}
//                   >
//                     <Calendar size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
//                     <strong style={{ border: "none", outline: "none", boxShadow: "none" }}>Date:</strong>{" "}
//                     {email.date
//                       ? new Date(email.date).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: "14px",
//                       color: "#64748b",
//                       margin: 0,
//                       display: "flex",
//                       alignItems: "center",
//                       minWidth: "120px",
//                       border: "none",
//                       outline: "none",
//                       boxShadow: "none",
//                     }}
//                   >
//                     <Folder size={14} style={{ marginRight: "4px", flexShrink: 0 }} />
//                     <strong style={{ border: "none", outline: "none", boxShadow: "none" }}>Folder:</strong>{" "}
//                     {folderConfig.find((f) => f.id === email.folderId)
//                       ?.name ||
//                       email.folderId ||
//                       "Unknown"}
//                   </p>
//                 </div>
//                 {renderTags(email.tags)}
//               </div>
//               <ChevronRight
//                 size={16}
//                 style={{
//                   color: "#64748b",
//                   marginLeft: "8px",
//                   flexShrink: 0,
//                   alignSelf: "center",
//                 }}
//               />
//             </div>
//           </motion.div>
//         ))}
        
//         {/* Load More Button */}
//         {pagination && pagination.hasNextPage && !loading && (
//           <motion.div 
//             key={`load-more-${selectedFolder}-${pagination.currentPage}`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               padding: "2rem 0",
//               marginTop: "1rem",
//               borderTop: "1px solid #e2e8f0"
//             }}
//           >
//             <motion.button
//               whileHover={{ 
//                 scale: 1.05,
//                 y: -2,
//                 boxShadow: "0 4px 8px rgba(79, 70, 229, 0.3)"
//               }}
//               whileTap={{ scale: 0.95 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               onClick={() => {
//                 console.log("Load More button clicked"); // Debug log
//                 onLoadMore();
//               }}
//               disabled={loading}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0.5rem",
//                 padding: "0.75rem 1.5rem",
//                 backgroundColor: loading ? "#f1f5f9" : "#4f46e5",
//                 color: loading ? "#64748b" : "white",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 cursor: loading ? "not-allowed" : "pointer",
//                 transition: "all 0.2s ease",
//                 boxShadow: loading ? "none" : "0 2px 4px rgba(79, 70, 229, 0.2)"
//               }}
//               onMouseOver={(e) => {
//                 if (!loading) {
//                   e.target.style.backgroundColor = "#4338ca";
//                   e.target.style.transform = "translateY(-1px)";
//                   e.target.style.boxShadow = "0 4px 8px rgba(79, 70, 229, 0.3)";
//                 }
//               }}
//               onMouseOut={(e) => {
//                 if (!loading) {
//                   e.target.style.backgroundColor = "#4f46e5";
//                   e.target.style.transform = "translateY(0)";
//                   e.target.style.boxShadow = "0 2px 4px rgba(79, 70, 229, 0.2)";
//                 }
//               }}
//             >
//               {loading ? (
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 >
//                   <RefreshCw size={16} />
//                 </motion.div>
//               ) : (
//                 <Mail size={16} />
//               )}
//               {loading ? "Loading..." : `Load More (${pagination.totalEmails - emails.length} remaining)`}
//             </motion.button>
//           </motion.div>
//         )}
        
//         {/* Loading indicator for Load More */}
//         {loading && pagination && pagination.currentPage > 1 && (
//           <motion.div 
//             key={`loading-more-${selectedFolder}-${pagination.currentPage}`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               padding: "2rem 0",
//               marginTop: "1rem",
//               borderTop: "1px solid #e2e8f0"
//             }}
//           >
//             <div style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.5rem",
//               color: "#64748b",
//               fontSize: "14px"
//             }}>
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               >
//                 <RefreshCw size={16} />
//               </motion.div>
//               Loading more emails...
//             </div>
//           </motion.div>
//         )}
        
//         {/* Pagination Info */}
//         {pagination && (
//           <motion.div 
//             key={`pagination-info-${selectedFolder}-${pagination.currentPage}-${pagination.totalEmails}`}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
//             style={{
//               textAlign: "center",
//               padding: "1rem",
//               fontSize: "14px",
//               color: "#64748b",
//               borderTop: pagination.hasNextPage ? "none" : "1px solid #e2e8f0"
//             }}
//           >
//             Showing {emails.length} of {pagination.totalEmails} emails
//             {pagination.totalPages > 1 && (
//               <span> • Page {pagination.currentPage} of {pagination.totalPages}</span>
//             )}
//           </motion.div>
//         )}
//         </AnimatePresence>
//       </motion.div>
//       ) : null}
//     </AnimatePresence>
//   );
// }


import React, { useMemo } from "react";
import { Mail, Folder, Calendar, Tag } from "lucide-react";

export default function EmailList({
  emails = [],
  loading = false,
  error = "",
  selectedFolder,
  searchQuery,
  selectedEmailForModal,
  onEmailClick,
  folders = [],
  pagination,
  onLoadMore,
}) {
  const flattenedFolders = useMemo(() => {
    const result = [];

    const walk = (items) => {
      items.forEach((item) => {
        if (!item) return;

        const { children = [], ...rest } = item;
        result.push(rest);

        if (Array.isArray(children) && children.length > 0) {
          walk(children);
        }
      });
    };

    walk(folders);
    return result;
  }, [folders]);

  const folderMap = useMemo(() => {
    const map = new Map();

    flattenedFolders.forEach((folder) => {
      map.set(folder.folderId, folder);
    });

    return map;
  }, [flattenedFolders]);

  const getFolderName = (folderId) => {
    const folder = folderMap.get(folderId);

    if (!folder) return folderId || "Unknown";

    if (!folder.parentFolderId) {
      return folder.name;
    }

    const parent = folderMap.get(folder.parentFolderId);
    return parent ? `${parent.name} / ${folder.name}` : folder.name;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString();
  };

  const getPreviewText = (email) => {
    if (email.text && email.text.trim()) {
      return email.text.trim().slice(0, 180);
    }

    if (email.html && email.html.trim()) {
      const stripped = email.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return stripped.slice(0, 180);
    }

    return "No preview available";
  };

  const getTagColor = () => "#64748b";

  if (loading && emails.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            style={{
              height: "88px",
              backgroundColor: "#f1f5f9",
              borderRadius: "10px",
              marginBottom: "10px",
              animation: "pulse 1.5s infinite",
            }}
          />
        ))}
      </div>
    );
  }

  if (error && emails.length === 0) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#dc2626",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "12px",
        }}
      >
        {error}
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#64748b",
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Mail size={28} style={{ marginBottom: "12px", color: "#94a3b8" }} />
        <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>
          No emails found
        </div>
        <div style={{ fontSize: "14px" }}>
          {searchQuery
            ? `No emails matched "${searchQuery}".`
            : selectedFolder && selectedFolder !== "all"
            ? "No emails available in this folder."
            : "No emails available."}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {emails.map((email) => {
        const isSelected = selectedEmailForModal?._id === email._id;
        const previewText = getPreviewText(email);

        return (
          <div
            key={email._id}
            onClick={() => onEmailClick(email)}
            style={{
              backgroundColor: isSelected ? "#eef2ff" : "white",
              border: isSelected ? "1px solid #c7d2fe" : "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  {!email.isRead && (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "999px",
                        backgroundColor: "#4f46e5",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: email.isRead ? "500" : "700",
                      color: "#0f172a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {email.subject || "(No Subject)"}
                  </h3>
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#475569",
                    marginBottom: "0.4rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email.from?.name
                    ? `${email.from.name} <${email.from.address || ""}>`
                    : email.from?.address || "Unknown sender"}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {previewText}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Calendar size={12} />
                  {formatDate(email.date)}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem 0.75rem",
                alignItems: "center",
                marginTop: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  color: "#475569",
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "999px",
                  padding: "4px 8px",
                }}
              >
                <Folder size={12} />
                {getFolderName(email.folderId)}
              </span>

              {email.tags?.length > 0 &&
                email.tags.map((tag, index) => {
                  let displayTag = tag;
                  if (tag.length === 2) {
                    displayTag = tag.toUpperCase();
                  } else if (tag.length > 2) {
                    displayTag =
                      tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
                  }

                  return (
                    <span
                      key={`${email._id}-tag-${index}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        color: "white",
                        backgroundColor: getTagColor(tag),
                        borderRadius: "999px",
                        padding: "4px 8px",
                      }}
                    >
                      <Tag size={11} />
                      {displayTag}
                    </span>
                  );
                })}

              {email.isNewsletter && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#0369a1",
                    backgroundColor: "#e0f2fe",
                    borderRadius: "999px",
                    padding: "4px 8px",
                    fontWeight: "500",
                  }}
                >
                  Newsletter
                </span>
              )}
            </div>
          </div>
        );
      })}

      {pagination?.hasNextPage && (
        <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}>
          <button
            onClick={onLoadMore}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#cbd5e1" : "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}