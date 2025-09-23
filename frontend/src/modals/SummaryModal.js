import React, { useState } from "react";
import { X } from "lucide-react";
import EmailModal from "./EmailModal";
import approvalService from "../services/approvalService";
import ConfirmationModal from "./confirmationModal";

// Summary Modal Component
function SummaryModal({ summaryData, onClose, type }) {
  const { data } = summaryData;
  const [showOriginalEmailModal, setShowOriginalEmailModal] = useState(false);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
  const handleViewOriginalEmail = () => {
    // Check if original email data is available
    if (data.email && data.email.originalEmail) {
      setShowOriginalEmailModal(true);
    } else if (data.email && data.email.originalEmailId) {
      // If we have an originalEmailId but no original email data, it means fetching failed
      alert("Original email could not be loaded. This may be due to the email being deleted or a connection issue.");
    } else {
      // No original email reference at all
      console.warn("Original email data not available");
      alert("No original email is associated with this summary.");
    }
  };

  const handleCloseOriginalEmailModal = () => {
    setShowOriginalEmailModal(false);
  };
  const handleApproval = () => {
    approvalService.approveEmailSummary(data.id)
      .then((res) => {
        console.log("Approval successful:", res);
        window.location.reload(); // Refresh the page to reflect changes
        onClose(); // Close the summary modal after approval
      })
      .catch((err) => {
        console.error("Approval failed:", err);
        alert("Failed to approve the summary. Please try again.");
      });
  };
const handleRejection = () => {
    approvalService.rejectEmailSummary(data.id)
      .then((res) => {
        console.log("Rejection successful:", res);
        window.location.reload(); // Refresh the page to reflect changes
        onClose(); // Close the summary modal after rejection
      })
      .catch((err) => {
        console.error("Rejection failed:", err);
        alert("Failed to reject the summary. Please try again.");
      });
  }; 

  const handleConfirmRejection = () => {
    handleRejection();
    setShowRejectConfirmation(false);
  };

  const handleCancelRejection = () => {
    setShowRejectConfirmation(false);
  };

  const handleConfirmApproval = () => {
    handleApproval();
    setShowApprovalConfirmation(false);
  };

  const handleCancelApproval = () => {
    setShowApprovalConfirmation(false);
  };




  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              margin: 0,
              color: "#1e293b",
            }}
          >
            📄 Email Summary
          </h2>
            {type === "summary" && (
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: "1rem",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: data.email && data.email.originalEmail ? "#2e26c8ff" : "#9ca3af",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: data.email && data.email.originalEmail ? "pointer" : "not-allowed",
                      opacity: data.email && data.email.originalEmail ? 1 : 0.7,
                    }}
                    onClick={handleViewOriginalEmail}
                    disabled={!data.email || !data.email.originalEmail}
                    title={data.email && data.email.originalEmail ? "View the original email" : "Original email not available"}
                  >
                    Original Email
                  </button>
                  <button
                    style={{
                      backgroundColor: "#ec9717ff",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                    onClick={() => console.log("HandlePreviewNewsletter")} // Implement this function to preview the newsletter
                  >
                    Preview
                  </button>
                  {data.status !== "approved" && (
                    <>
                      <button
                      style={{
                        backgroundColor: "#42b13aff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowApprovalConfirmation(true)}
                    >
                      Approve
                    </button>
                      <button
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowRejectConfirmation(true)} // Show confirmation modal
                    >
                      Reject
                    </button>
                    </>
                  )}
                </div>
            )}
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

        {/* Summary Content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {/* Title */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", color: "#374151", marginBottom: "0.5rem" }}>
              📰 Title
            </h3>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#1e293b",
                fontWeight: "600",
                padding: "0.75rem",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                margin: 0,
              }}
            >
              {data.title}
            </p>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", color: "#374151", marginBottom: "0.5rem" }}>
              📝 Summary
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#374151",
                lineHeight: "1.6",
                padding: "1rem",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                margin: 0,
              }}
            >
              {data.summary}
            </p>
          </div>

          {/* SEO Tags */}
          {data.seoTags && data.seoTags.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", color: "#374151", marginBottom: "0.5rem" }}>
                🏷️ SEO Tags
              </h3>
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {data.seoTags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#4f46e5",
                      color: "white",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SEO Data */}
          {data.seo && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", color: "#374151", marginBottom: "0.5rem" }}>
                🔍 SEO Information
              </h3>
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {data.seo.title && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <strong style={{ color: "#4f46e5" }}>Title Tag:</strong>
                    <br />
                    <code style={{ fontSize: "0.85rem", color: "#374151" }}>
                      {data.seo.title}
                    </code>
                  </div>
                )}
                {data.seo.description && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <strong style={{ color: "#4f46e5" }}>Description:</strong>
                    <br />
                    <code style={{ fontSize: "0.85rem", color: "#374151" }}>
                      {data.seo.description}
                    </code>
                  </div>
                )}
                {data.seo.keywords && (
                  <div>
                    <strong style={{ color: "#4f46e5" }}>Keywords:</strong>
                    <br />
                    <code style={{ fontSize: "0.85rem", color: "#374151" }}>
                      {data.seo.keywords}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Generation Options */}
          {/* {options && (
            <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", color: "#374151", marginBottom: "0.5rem" }}>
                ⚙️ Generation Settings
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                {options.temperature !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Temperature:</span>
                    <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600", marginLeft: "0.25rem" }}>
                      {options.temperature}
                    </span>
                  </div>
                )}
                {options.topP !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Top P:</span>
                    <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600", marginLeft: "0.25rem" }}>
                      {options.topP}
                    </span>
                  </div>
                )}
                {options.topK !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Top K:</span>
                    <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600", marginLeft: "0.25rem" }}>
                      {options.topK}
                    </span>
                  </div>
                )}
                {options.maxOutputTokens !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>Max Tokens:</span>
                    <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600", marginLeft: "0.25rem" }}>
                      {options.maxOutputTokens}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Metadata */}
          <div style={{ fontSize: "0.8rem", color: "#6b7280", textAlign: "center" }}>
            Generated on {new Date(data.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Rejection Confirmation Modal */}
      {showRejectConfirmation && (
        <ConfirmationModal
          data={data}
          title="Confirm Rejection"
          message="Are you sure you want to reject this summary?"
          highlightText="This action will delete the summary and cannot be undone."
          handleConfirmation={handleConfirmRejection}
          handleCancellation={handleCancelRejection}
        />
      )}

      {/* Approval Confirmation Modal */}
      {showApprovalConfirmation && (
        <ConfirmationModal
          data={data}
          title="Confirm Approval"
          message="Are you sure you want to approve this summary?"
          highlightText="This action will put it into queue for newsletter sending."
          confirmColor="#22c55e"
          handleConfirmation={handleConfirmApproval}
          handleCancellation={handleCancelApproval}
        />
      )}

      {/* Original Email Modal */}
      {showOriginalEmailModal && data.email && data.email.originalEmail && (
        <EmailModal
          email={data.email.originalEmail.email}
          onClose={handleCloseOriginalEmailModal}
          type={"summary"}
          folderConfig={[]} // Empty folder config since we're just viewing
          onMoveEmail={() => {}} // No-op since we're just viewing
          displayedEmails={[]} // Empty since we're just viewing one email
          onSelectEmail={() => {}} // No-op since we're just viewing
          onMarkAsRead={() => {}} // No-op since we're just viewing
          onUpdateTags={() => {}} // No-op since we're just viewing
        />
      )}
    </div>
  );
}

export default SummaryModal;