// import React, { useEffect, useState } from "react";

// function FolderList() {
//   const [folders, setFolders] = useState([]);

//   useEffect(() => {
//     fetch("/api/folders")
//       .then(res => res.json())
//       .then(data => setFolders(data));
//   }, []);

//   return (
//     <div>
//       <h2>Email Folders</h2>
//       <ul>
//         {folders.map(folder => (
//           <li key={folder._id}>{folder.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FolderList;

import React, { useEffect, useState } from "react";
import axios from 'axios';

function FolderList() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await axios.get("/api/folders");
        setFolders(response.data);
      } catch (error) {
        // Handle different types of errors
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error ||
                            error.message || 
                            "Failed to fetch folders";
        setError(errorMessage);
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  // Function to handle folder refresh
  const handleRefresh = () => {
    const fetchFolders = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await axios.get("/api/folders");
        setFolders(response.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error ||
                            error.message || 
                            "Failed to fetch folders";
        setError(errorMessage);
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  };

  return (
    <div style={{ 
      padding: "1.5rem", 
      fontFamily: "Arial, sans-serif",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      margin: "1rem 0"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "1rem"
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: "1.3rem", 
          color: "#1e293b",
          fontWeight: "600"
        }}>
          Email Folders
        </h2>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "6px 12px",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
            opacity: loading ? 0.6 : 1,
            display: "flex",
            alignItems: "center"
          }}
        >
          {loading ? (
            <div style={{
              width: "16px",
              height: "16px",
              border: "2px solid white",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginRight: "6px"
            }}></div>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}>
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          )}
          Refresh
        </button>
      </div>

      {loading && (
        <div style={{ 
          textAlign: "center", 
          padding: "2rem",
          color: "#64748b"
        }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "3px solid #f3f4f6",
            borderTop: "3px solid #4f46e5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p style={{ margin: "0" }}>Loading folders...</p>
        </div>
      )}
      
      {error && (
        <div style={{
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "1rem",
          border: "1px solid #fecaca",
          display: "flex",
          alignItems: "center"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px", flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}
      
      {folders.length === 0 && !loading && !error && (
        <div style={{ 
          textAlign: "center", 
          padding: "2rem", 
          color: "#64748b",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: "0 auto 1rem", opacity: 0.3 }}>
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
          </svg>
          <p style={{ margin: "0", fontSize: "16px" }}>No folders found.</p>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
            Folders will appear here when they are created.
          </p>
        </div>
      )}

      {folders.length > 0 && !loading && (
        <ul style={{ 
          listStyle: "none", 
          padding: 0, 
          margin: 0 
        }}>
          {folders.map((folder, index) => (
            <li
              key={folder._id || folder.id || index}
              style={{
                padding: "12px 16px",
                marginBottom: "6px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                transition: "all 0.2s ease",
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e0e7ff";
                e.currentTarget.style.borderColor = "#c7d2fe";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "12px", color: "#f59e0b" }}>
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
              </svg>
              
              <div style={{ flex: 1 }}>
                <span style={{ 
                  fontSize: "15px", 
                  fontWeight: "500",
                  color: "#374151"
                }}>
                  {folder.name || folder.title || "Unnamed Folder"}
                </span>
                
                {folder.description && (
                  <p style={{ 
                    margin: "4px 0 0 0", 
                    fontSize: "13px", 
                    color: "#64748b" 
                  }}>
                    {folder.description}
                  </p>
                )}
                
                {folder.emailCount !== undefined && (
                  <p style={{ 
                    margin: "4px 0 0 0", 
                    fontSize: "12px", 
                    color: "#9ca3af" 
                  }}>
                    {folder.emailCount} email{folder.emailCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#9ca3af" }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </li>
          ))}
        </ul>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default FolderList;