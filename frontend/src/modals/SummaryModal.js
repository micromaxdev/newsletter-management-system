import React from "react";
import { X } from "lucide-react";

// Summary Modal Component
function SummaryModal({ summaryData, onClose }) {
  const { data } = summaryData;

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
    </div>
  );
}

export default SummaryModal;