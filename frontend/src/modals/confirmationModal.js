
export default function ConfirmationModal({
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  highlightText = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "#ef4444",
  handleConfirmation,
  handleCancellation,
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2100,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "90%",
          padding: "2rem",
          boxShadow: "0 20px 60px rgba(131, 125, 125, 0.3)",
          border: `2px solid`,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.5rem",
              margin: 0,
              color: confirmColor,
              fontWeight: "600",
            }}
          >
            {title}
          </h3>
        </div>

        {/* Content */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <p
            style={{
              fontSize: "1rem",
              color: "#374151",
              lineHeight: "1.6",
              margin: "0 0 1rem 0",
            }}
          >
            {message}
          </p>
          {highlightText && (
            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              <strong>{highlightText}</strong>
            </p>
          )}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleCancellation}
            style={{
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#e5e7eb")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#f3f4f6")
            }
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirmation}
            style={{
              backgroundColor: confirmColor,
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#dc2626")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = confirmColor)
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
