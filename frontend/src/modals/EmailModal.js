// import React, { useState } from "react";
// import {
//   User,
//   Calendar,
//   Folder,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Tag,
//   Plus,
// } from "lucide-react";
// import DOMPurify from "dompurify";
// import SummaryModal from "./SummaryModal";
// import { useSummarization } from "../hooks/useSummarization";

// export default function EmailModal({
//   email,
//   onClose,
//   folderConfig,
//   onMoveEmail,
//   displayedEmails,
//   onSelectEmail,
//   onMarkAsRead,
//   onUpdateTags,
//   type  // "email" or "summary"
// }) {
//   const [editingTags, setEditingTags] = useState(false);
//   const [tempTags, setTempTags] = useState([]);
//   const [currentEmail, setCurrentEmail] = useState(email); // Local state for email to update UI
  
//   // Use the custom summarization hook
//   const {
//     isGenerating: isGeneratingSummary,
//     summaryResult,
//     showSummaryModal,
//     error: summaryError,
//     generateSummary,
//     closeSummaryModal,
//     clearError
//   } = useSummarization();

//   // Update currentEmail when email prop changes
//   React.useEffect(() => {
//     setCurrentEmail(email);
//   }, [email]);

//   if (!currentEmail) return null;

//   const getTagColor = (tag) => {
//     return "#64748b"; // default gray
//   };

//   const handleEditTags = () => {
//     setEditingTags(true);
//     setTempTags([...(currentEmail.tags || [])]);
//   };

//   const handleSaveTags = async () => {
//     try {
//       await onUpdateTags(currentEmail._id, tempTags);
//       // Update the local email state with the new tags
//       setCurrentEmail(prevEmail => ({
//         ...prevEmail,
//         tags: [...tempTags]
//       }));
//       setEditingTags(false);
//     } catch (error) {
//       console.error("Error updating tags:", error);
//     }
//   };

//   const handleCancelEditTags = () => {
//     setEditingTags(false);
//     setTempTags([]);
//   };

//   const handleAddTag = (newTag) => {
//     if (newTag && !tempTags.includes(newTag) && tempTags.length < 2) {
//       setTempTags([...tempTags, newTag]);
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setTempTags(tempTags.filter(tag => tag !== tagToRemove));
//   };

//   const handleSummarizeEmail = async () => {
//     if (!email._id) return;
    
//     // Let the backend handle default configuration
//     // Only pass options if you want to override backend defaults
//     const options = null; // or specify custom options like { temperature: 0.2 }
    
//     await generateSummary(email._id, options);
    
//     // Handle error display (you can customize this)
//     if (summaryError) {
//       alert(`Failed to generate summary: ${summaryError}`);
//       clearError();
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     if (diffDays === 1) return "Today";
//     if (diffDays === 2) return "Yesterday";
//     if (diffDays <= 7) return `${diffDays - 1} days ago`;
//     return date.toLocaleDateString();
//   };

//   const formatSender = (from) => {
//     if (!from) return "Unknown";
//     if (typeof from === "string") return from;
//     return from.name && from.address
//       ? `${from.name} <${from.address}>`
//       : from.address || "Unknown";
//   };

//   const currentIndex = displayedEmails.findIndex((e) => e._id === email._id);
//   const hasPrevious = currentIndex > 0;
//   const hasNext = currentIndex < displayedEmails.length - 1;

//   const handlePrevious = () => {
//     if (hasPrevious) {
//       const prevEmail = displayedEmails[currentIndex - 1];
//       onSelectEmail(prevEmail);
//       if (!prevEmail.isRead) onMarkAsRead(prevEmail._id);
//     }
//   };

//   const handleNext = () => {
//     if (hasNext) {
//       const nextEmail = displayedEmails[currentIndex + 1];
//       onSelectEmail(nextEmail);
//       if (!nextEmail.isRead) onMarkAsRead(nextEmail._id);
//     }
//   };

//   const sanitizedHTML = currentEmail.html
//     ? DOMPurify.sanitize(currentEmail.html, { ADD_ATTR: ["target"] })
//     : "";

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: "rgba(0,0,0,0.6)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 1000,
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: "white",
//           borderRadius: "12px",
//           maxWidth: "900px",
//           width: "90%",
//           maxHeight: "90vh",
//           overflow: "hidden",
//           position: "relative",
//           display: "flex",
//           flexDirection: "column",
//           padding: "2rem",
//         }}
//       >
//         {/* Modal Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "1.5rem",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "1.5rem",
//               margin: 0,
//               color: "#1e293b",
//               flex: 1,
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {currentEmail.subject || "(No Subject)"}
//           </h2>
//           <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
//             {type === "email" && (
//               <>
//                 {/* Previous Button */}
//                 <button
//                   onClick={handlePrevious}
//                   disabled={!hasPrevious}
//                   style={{
//                     backgroundColor: hasPrevious ? "#4f46e5" : "#ccc",
//                     color: "white",
//                     padding: "8px 12px",
//                     border: "none",
//                     borderRadius: "6px",
//                     cursor: hasPrevious ? "pointer" : "not-allowed",
//                     opacity: hasPrevious ? 1 : 0.6,
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <ChevronLeft size={16} style={{ marginRight: "4px" }} /> Previous
//                 </button>

//                 {/* Next Button */}
//                 <button
//                   onClick={handleNext}
//                   disabled={!hasNext}
//                   style={{
//                     backgroundColor: hasNext ? "#4f46e5" : "#ccc",
//                     color: "white",
//                     padding: "8px 12px",
//                     border: "none",
//                     borderRadius: "6px",
//                     cursor: hasNext ? "pointer" : "not-allowed",
//                     opacity: hasNext ? 1 : 0.6,
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   Next <ChevronRight size={16} style={{ marginLeft: "4px" }} />
//                 </button>

//                 {/* Move Folder Dropdown */}
//                 <select
//                   value={currentEmail.folderId || "inbox"}
//                   onChange={(e) => onMoveEmail(email._id, e.target.value)}
//                   style={{
//                     fontSize: "14px",
//                     padding: "6px 10px",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "6px",
//                     backgroundColor: "white",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {folderConfig.map((folder) => (
//                     <option key={folder.id} value={folder.id}>
//                       Move to {folder.name}
//                     </option>
//                   ))}
//                 </select>
//               </>
//             )}

//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               style={{
//                 backgroundColor: "#dc2626",
//                 color: "white",
//                 padding: "8px",
//                 border: "none",
//                 borderRadius: "50%",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "32px",
//                 height: "32px",
//               }}
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Email Meta Info */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "1.5rem",
//             marginBottom: "1.5rem",
//             borderBottom: "1px solid #e2e8f0",
//             paddingBottom: "1rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "15px",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <User size={16} style={{ marginRight: "6px" }} />
//             <strong>From:</strong> {formatSender(currentEmail.from)}
//           </p>
//           <p
//             style={{
//               fontSize: "15px",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <Calendar size={16} style={{ marginRight: "6px" }} />
//             <strong>Date:</strong> {currentEmail.date ? formatDate(currentEmail.date) : "N/A"}
//           </p>
//           <p
//             style={{
//               fontSize: "15px",
//               color: "#64748b",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <Folder size={16} style={{ marginRight: "6px" }} />
//             <strong>Folder:</strong>{" "}
//             {folderConfig.find((f) => f.id === currentEmail.folderId)?.name ||
//               currentEmail.folderId ||
//               "Unknown"}
//           </p>
//         </div>

//         {/* Tags and Summary Section - Side by Side */}
//         <div style={{ 
//           display: "flex", 
//           gap: "1rem", 
//           marginBottom: "1.5rem",
//           alignItems: "flex-start"
//         }}>
//           {/* Tags Section */}
//           <div
//             style={{
//               flex: 1,
//               padding: "1rem",
//               backgroundColor: "#f8fafc",
//               borderRadius: "8px",
//               border: "1px solid #e2e8f0",
//             }}
//           >
//           <div style={{ 
//             display: "flex", 
//             alignItems: "center", 
//             justifyContent: "space-between",
//             marginBottom: "0.5rem"
//           }}>
//             <h4 style={{ 
//               margin: 0, 
//               fontSize: "14px", 
//               fontWeight: "600", 
//               color: "#374151",
//               display: "flex",
//               alignItems: "center"
//             }}>
//               <Tag size={16} style={{ marginRight: "6px" }} />
//               Tags
//             </h4>
//             {type === "email" && (
//               <div style={{ display: "flex", gap: "0.5rem" }}>
//                 {!editingTags && (
//                   <button
//                     onClick={handleEditTags}
//                     style={{
//                       backgroundColor: "#6366f1",
//                       color: "white",
//                       border: "none",
//                       borderRadius: "4px",
//                       padding: "4px 8px",
//                       fontSize: "12px",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center"
//                     }}
//                   >
//                     <Plus size={12} style={{ marginRight: "4px" }} />
//                     Edit
//                   </button>
//                 )}
//               </div>
//             )}

//           </div>

//           {editingTags ? (
//             <div>
//               <div style={{ 
//                 display: "flex", 
//                 flexWrap: "wrap", 
//                 gap: "0.5rem", 
//                 marginBottom: "0.5rem" 
//               }}>
//                 {tempTags.map((tag, index) => (
//                   <span
//                     key={index}
//                     style={{
//                       backgroundColor: getTagColor(tag),
//                       color: "white",
//                       fontSize: "12px",
//                       fontWeight: "500",
//                       padding: "4px 8px",
//                       borderRadius: "12px",
//                       textTransform: "capitalize",
//                       display: "flex",
//                       alignItems: "center",
//                       cursor: "pointer"
//                     }}
//                     onClick={() => handleRemoveTag(tag)}
//                   >
//                     {tag} ×
//                   </span>
//                 ))}
//                 <input
//                   type="text"
//                   placeholder={tempTags.length >= 2 ? "Max 2 tags" : "Add tag and press Enter"}
//                   disabled={tempTags.length >= 2}
//                   style={{
//                     border: "1px solid #d1d5db",
//                     borderRadius: "4px",
//                     padding: "4px 8px",
//                     fontSize: "12px",
//                     width: "130px",
//                     backgroundColor: tempTags.length >= 2 ? "#f3f4f6" : "white",
//                     color: tempTags.length >= 2 ? "#9ca3af" : "#374151"
//                   }}
//                   onKeyPress={(e) => {
//                     if (e.key === 'Enter' && e.target.value.trim() && tempTags.length < 2) {
//                       let value = e.target.value.trim();

//                       if (value.length === 2) {
//                         value = value.toUpperCase();
//                       } else if (value.length > 2) {
//                         value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
//                       }

//                       handleAddTag(value);
//                       e.target.value = '';
//                     }
//                   }}
//                 />
//               </div>
//               {/* End of Summary button section */}
//               <div style={{ display: "flex", gap: "0.5rem" }}>
//                 <button
//                   onClick={handleSaveTags}
//                   style={{
//                     backgroundColor: "#10b981",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "4px",
//                     padding: "4px 8px",
//                     fontSize: "12px",
//                     cursor: "pointer"
//                   }}
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={handleCancelEditTags}
//                   style={{
//                     backgroundColor: "#6b7280",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "4px",
//                     padding: "4px 8px",
//                     fontSize: "12px",
//                     cursor: "pointer"
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div style={{ 
//               display: "flex", 
//               flexWrap: "wrap", 
//               gap: "0.5rem",
//               minHeight: "24px"
//             }}>
//               {currentEmail.tags && currentEmail.tags.length > 0 ? (
//                 currentEmail.tags.map((tag, index) => {
//                   let displayTag = tag;
//                   if (tag.length === 2) displayTag = tag.toUpperCase();
//                   else displayTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
//                   return (
//                     <span
//                       key={index}
//                       style={{
//                         backgroundColor: getTagColor(tag),
//                         color: "white",
//                         fontSize: "12px",
//                         fontWeight: "500",
//                         padding: "4px 8px",
//                         borderRadius: "12px",
//                         textTransform: "capitalize",
//                       }}
//                     >
//                       {displayTag}
//                     </span>
//                   );
//                 })
//               ) : (
//                 <span style={{ 
//                   color: "#9ca3af", 
//                   fontSize: "12px", 
//                   fontStyle: "italic" 
//                 }}>
//                   No tags assigned
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//          {type === "email" && (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 gap: "0.5rem",
//               }}
//             >
//               <button
//                 onClick={() => handleSummarizeEmail()}
//                 disabled={isGeneratingSummary}
//                 style={{
//                   backgroundColor: isGeneratingSummary ? "#9ca3af" : "#f59e0b",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   padding: "12px 16px",
//                   fontSize: "13px",
//                   fontWeight: "600",
//                   cursor: isGeneratingSummary ? "not-allowed" : "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "6px",
//                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                   transition: "all 0.2s ease",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {isGeneratingSummary ? "⏳ Generating..." : "✨ Generate AI Summary"}
//               </button>
//             </div>
//           )}
//         </div>
//         {/* Email Content */}
//         <div
//           style={{
//             flex: 1,
//             overflow: "auto",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             padding: "1rem",
//             backgroundColor: "#fafafa",
//           }}
//         >
//           {sanitizedHTML ? (
//             <div
//               dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
//               style={{
//                 fontFamily: "Arial, sans-serif",
//                 lineHeight: "1.6",
//                 color: "#374151",
//               }}
//             />
//           ) : email.text ? (
//             <pre
//               style={{
//                 whiteSpace: "pre-wrap",
//                 wordWrap: "break-word",
//                 fontFamily: "Arial, sans-serif",
//                 fontSize: "14px",
//                 color: "#374151",
//                 margin: 0,
//               }}
//             >
//               {email.text}
//             </pre>
//           ) : (
//             <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
//               No content available
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Summary Modal */}
//       {showSummaryModal && summaryResult && (
//         <SummaryModal 
//           summaryData={summaryResult}
//           onClose={closeSummaryModal}
//           type={"email"}
//         />
//       )}
//     </div>
//   );
// }

import React, { useMemo, useState } from "react";
import {
  User,
  Calendar,
  Folder,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  Plus,
  MoveRight,
  Check,
} from "lucide-react";
import DOMPurify from "dompurify";
import SummaryModal from "./SummaryModal";
import { useSummarization } from "../hooks/useSummarization";

export default function EmailModal({
  email,
  onClose,
  folders = [],
  onMoveEmail,
  displayedEmails,
  onSelectEmail,
  onMarkAsRead,
  onUpdateTags,
  type,
}) {
  const [editingTags, setEditingTags] = useState(false);
  const [tempTags, setTempTags] = useState([]);
  const [currentEmail, setCurrentEmail] = useState(email);

  const [selectedFolderId, setSelectedFolderId] = useState(email?.folderId || "uncategorised");
  const [showMoveConfirm, setShowMoveConfirm] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);

  const {
    isGenerating: isGeneratingSummary,
    summaryResult,
    showSummaryModal,
    error: summaryError,
    generateSummary,
    closeSummaryModal,
    clearError,
  } = useSummarization();

  React.useEffect(() => {
    setCurrentEmail(email);
    setSelectedFolderId(email?.folderId || "uncategorised");
    setShowMoveConfirm(false);
  }, [email]);

  const folderMap = useMemo(() => {
    const map = new Map();

    const walk = (items) => {
      items.forEach((item) => {
        if (!item) return;

        map.set(item.folderId, item);

        if (Array.isArray(item.children) && item.children.length > 0) {
          walk(item.children);
        }
      });
    };

    walk(folders);
    return map;
  }, [folders]);

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

  const topLevelFolders = useMemo(() => {
    return flattenedFolders.filter((folder) => !folder.parentFolderId);
  }, [flattenedFolders]);

  const getSubfolders = (parentFolderId) => {
    return flattenedFolders
      .filter((folder) => folder.parentFolderId === parentFolderId)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  };

  const getFolderName = (folderId) => {
    const folder = folderMap.get(folderId);

    if (!folder) return folderId || "Unknown";

    if (!folder.parentFolderId) {
      return folder.name;
    }

    const parent = folderMap.get(folder.parentFolderId);
    return parent ? `${parent.name} / ${folder.name}` : folder.name;
  };

  const getTagColor = () => "#64748b";

  const handleEditTags = () => {
    setEditingTags(true);
    setTempTags([...(currentEmail.tags || [])]);
  };

  const handleSaveTags = async () => {
    try {
      await onUpdateTags(currentEmail._id, tempTags);
      setCurrentEmail((prevEmail) => ({
        ...prevEmail,
        tags: [...tempTags],
      }));
      setEditingTags(false);
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  const handleCancelEditTags = () => {
    setEditingTags(false);
    setTempTags([]);
  };

  const handleAddTag = (newTag) => {
    if (newTag && !tempTags.includes(newTag) && tempTags.length < 2) {
      setTempTags([...tempTags, newTag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTempTags(tempTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSummarizeEmail = async () => {
    if (!email._id) return;

    const options = null;
    await generateSummary(email._id, options);

    if (summaryError) {
      alert(`Failed to generate summary: ${summaryError}`);
      clearError();
    }
  };

  const handleMoveRequest = () => {
    if (!currentEmail?._id) return;
    if (!selectedFolderId || selectedFolderId === currentEmail.folderId) return;

    setShowMoveConfirm(true);
  };

  const handleConfirmMove = async () => {
    if (!currentEmail?._id) return;
    if (!selectedFolderId || selectedFolderId === currentEmail.folderId) return;

    try {
      setMoveLoading(true);

      await onMoveEmail(currentEmail._id, selectedFolderId);

      setCurrentEmail((prevEmail) => ({
        ...prevEmail,
        folderId: selectedFolderId,
      }));

      setShowMoveConfirm(false);
    } catch (error) {
      console.error("Error moving email:", error);
    } finally {
      setMoveLoading(false);
    }
  };

  const handleCancelMove = () => {
    setSelectedFolderId(currentEmail.folderId || "uncategorised");
    setShowMoveConfirm(false);
  };

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

  if (!currentEmail) return null;

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

  const sanitizedHTML = currentEmail.html
    ? DOMPurify.sanitize(currentEmail.html, { ADD_ATTR: ["target"] })
    : "";

  const hasMoveChanged =
    selectedFolderId &&
    currentEmail.folderId &&
    selectedFolderId !== currentEmail.folderId;

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            gap: "1rem",
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
            {currentEmail.subject || "(No Subject)"}
          </h2>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            {type === "email" && (
              <>
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
                  <ChevronLeft size={16} style={{ marginRight: "4px" }} />
                  Previous
                </button>

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
              </>
            )}

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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "15px", color: "#64748b", display: "flex", alignItems: "center" }}>
            <User size={16} style={{ marginRight: "6px" }} />
            <strong>From:</strong>&nbsp;{formatSender(currentEmail.from)}
          </p>

          <p style={{ fontSize: "15px", color: "#64748b", display: "flex", alignItems: "center" }}>
            <Calendar size={16} style={{ marginRight: "6px" }} />
            <strong>Date:</strong>&nbsp;
            {currentEmail.date ? formatDate(currentEmail.date) : "N/A"}
          </p>

          <p style={{ fontSize: "15px", color: "#64748b", display: "flex", alignItems: "center" }}>
            <Folder size={16} style={{ marginRight: "6px" }} />
            <strong>Folder:</strong>&nbsp;{getFolderName(currentEmail.folderId)}
          </p>
        </div>

        {type === "email" && (
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "end",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: "260px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Move email to folder or subfolder
                </label>

                <select
                  value={selectedFolderId || "uncategorised"}
                  onChange={(e) => {
                    setSelectedFolderId(e.target.value);
                    setShowMoveConfirm(false);
                  }}
                  style={{
                    width: "100%",
                    fontSize: "14px",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                >
                  {topLevelFolders.map((folder) => {
                    const subfolders = getSubfolders(folder.folderId);

                    return (
                      <React.Fragment key={folder.folderId}>
                        <option value={folder.folderId}>{folder.name}</option>

                        {subfolders.map((subfolder) => (
                          <option key={subfolder.folderId} value={subfolder.folderId}>
                            {folder.name} / {subfolder.name}
                          </option>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={handleMoveRequest}
                disabled={!hasMoveChanged}
                style={{
                  backgroundColor: hasMoveChanged ? "#4f46e5" : "#cbd5e1",
                  color: "white",
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: hasMoveChanged ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <MoveRight size={16} />
                Move
              </button>
            </div>

            {showMoveConfirm && hasMoveChanged && (
              <div
                style={{
                  marginTop: "0.9rem",
                  padding: "0.9rem",
                  backgroundColor: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "14px",
                    color: "#3730a3",
                    fontWeight: "500",
                  }}
                >
                  Move this email from <strong>{getFolderName(currentEmail.folderId)}</strong> to{" "}
                  <strong>{getFolderName(selectedFolderId)}</strong>?
                </p>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={handleConfirmMove}
                    disabled={moveLoading}
                    style={{
                      backgroundColor: "#4f46e5",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      cursor: moveLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: moveLoading ? 0.7 : 1,
                    }}
                  >
                    <Check size={14} />
                    {moveLoading ? "Moving..." : "Confirm Move"}
                  </button>

                  <button
                    onClick={handleCancelMove}
                    disabled={moveLoading}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "13px",
                      cursor: moveLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tag size={16} style={{ marginRight: "6px" }} />
                Tags
              </h4>

              {type === "email" && !editingTags && (
                <button
                  onClick={handleEditTags}
                  style={{
                    backgroundColor: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Plus size={12} style={{ marginRight: "4px" }} />
                  Edit
                </button>
              )}
            </div>

            {editingTags ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {tempTags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: getTagColor(tag),
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "500",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        textTransform: "capitalize",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </span>
                  ))}

                  <input
                    type="text"
                    placeholder={tempTags.length >= 2 ? "Max 2 tags" : "Add tag and press Enter"}
                    disabled={tempTags.length >= 2}
                    style={{
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      width: "130px",
                      backgroundColor: tempTags.length >= 2 ? "#f3f4f6" : "white",
                      color: tempTags.length >= 2 ? "#9ca3af" : "#374151",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim() && tempTags.length < 2) {
                        e.preventDefault();

                        let value = e.target.value.trim();

                        if (value.length === 2) {
                          value = value.toUpperCase();
                        } else if (value.length > 2) {
                          value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                        }

                        handleAddTag(value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleSaveTags}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>

                  <button
                    onClick={handleCancelEditTags}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  minHeight: "24px",
                }}
              >
                {currentEmail.tags && currentEmail.tags.length > 0 ? (
                  currentEmail.tags.map((tag, index) => {
                    let displayTag = tag;
                    if (tag.length === 2) displayTag = tag.toUpperCase();
                    else displayTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();

                    return (
                      <span
                        key={index}
                        style={{
                          backgroundColor: getTagColor(tag),
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "500",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          textTransform: "capitalize",
                        }}
                      >
                        {displayTag}
                      </span>
                    );
                  })
                ) : (
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    No tags assigned
                  </span>
                )}
              </div>
            )}
          </div>

          {type === "email" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => handleSummarizeEmail()}
                disabled={isGeneratingSummary}
                style={{
                  backgroundColor: isGeneratingSummary ? "#9ca3af" : "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: isGeneratingSummary ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  whiteSpace: "nowrap",
                }}
              >
                {isGeneratingSummary ? "⏳ Generating..." : "✨ Generate AI Summary"}
              </button>
            </div>
          )}
        </div>

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
          ) : currentEmail.text ? (
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
              {currentEmail.text}
            </pre>
          ) : (
            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
              No content available
            </p>
          )}
        </div>
      </div>

      {showSummaryModal && summaryResult && (
        <SummaryModal
          summaryData={summaryResult}
          onClose={closeSummaryModal}
          type={"email"}
        />
      )}
    </div>
  );
}