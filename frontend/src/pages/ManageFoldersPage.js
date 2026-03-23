import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Folder,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import useFolders from "../hooks/useFolders";
import useFolderFilters from "../hooks/useFolderFilters";
import IconSelect from "../components/IconSelect";
import { FOLDER_ICON_MAP } from "../constants/folderIcons";

const defaultCreateForm = {
  name: "",
  icon: "folder",
};

const defaultEditForm = {
  name: "",
  icon: "folder",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 0.875rem",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#334155",
  marginBottom: "6px",
};

export default function ManageFoldersPage() {
  const {
    folders,
    loading,
    actionLoading,
    error,
    successMessage,
    clearMessages,
    createFolder,
    updateFolder,
    deleteFolder,
    totalFolders,
    totalSystemFolders,
    totalCustomFolders,
  } = useFolders();

  // ONLY PARENT FOLDERS HERE
  const parentFolders = useMemo(() => {
    return folders.filter((folder) => !folder.parentFolderId);
  }, [folders]);

  const {
    searchQuery,
    setSearchQuery,
    folderFilter,
    setFolderFilter,
    filteredFolders,
    clearFilters,
  } = useFolderFilters(parentFolders);

  const [createForm, setCreateForm] = useState(defaultCreateForm);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editForm, setEditForm] = useState(defaultEditForm);

  const parentStats = useMemo(() => {
    return {
      totalParentFolders: parentFolders.length,
      totalParentSystemFolders: parentFolders.filter((folder) => folder.system).length,
      totalParentCustomFolders: parentFolders.filter((folder) => !folder.system).length,
    };
  }, [parentFolders]);

  const resetCreateForm = () => {
    setCreateForm(defaultCreateForm);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    clearMessages();

    const payload = {
      name: createForm.name.trim(),
      icon: createForm.icon,
    };

    if (!payload.name) {
      return;
    }

    const result = await createFolder(payload);

    if (result.success) {
      resetCreateForm();
    }
  };

  const startEditing = (folder) => {
    clearMessages();
    setEditingFolderId(folder.folderId);
    setEditForm({
      name: folder.name || "",
      icon: folder.icon || "folder",
    });
  };

  const cancelEditing = () => {
    setEditingFolderId(null);
    setEditForm(defaultEditForm);
  };

  const handleUpdateFolder = async (folder) => {
    clearMessages();

    const payload = {
      name: editForm.name.trim(),
      icon: editForm.icon,
    };

    if (!payload.name) {
      return;
    }

    const result = await updateFolder(folder.folderId, payload);

    if (result.success) {
      setEditingFolderId(null);
      setEditForm(defaultEditForm);
    }
  };

  const handleDeleteFolder = async (folder) => {
    clearMessages();

    if (folder.system) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${folder.name}"?`
    );

    if (!confirmed) return;

    await deleteFolder(folder.folderId);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                color: "#64748b",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
              Back to Home
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Folder size={24} style={{ color: "#4f46e5" }} />
            <div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "600",
                  margin: 0,
                  color: "#1e293b",
                }}
              >
                Manage Folders
              </h1>
              <p
                style={{
                  color: "#64748b",
                  margin: "0.25rem 0 0 0",
                  fontSize: "14px",
                }}
              >
                Create, edit, and delete folders ({filteredFolders.length} shown)
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                minWidth: "250px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative", width: "100%" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.5rem 0.5rem 2rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                    backgroundColor: "#ffffff",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Filter size={16} style={{ color: "#6b7280" }} />
              <select
                value={folderFilter}
                onChange={(e) => setFolderFilter(e.target.value)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "13px",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  cursor: "pointer",
                  minWidth: "130px",
                }}
              >
                <option value="all">All Folders</option>
                <option value="system">System Only</option>
                <option value="custom">Custom Only</option>
              </select>
            </div>

            {(searchQuery || folderFilter !== "all") && (
              <button
                onClick={clearFilters}
                style={{
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {(error || successMessage) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            marginBottom: "1.5rem",
            display: "grid",
            gap: "0.75rem",
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #fecaca",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                backgroundColor: "#dcfce7",
                color: "#166534",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #bbf7d0",
              }}
            >
              {successMessage}
            </div>
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
              color: "#1e293b",
            }}
          >
            Create New Folder
          </h2>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                backgroundColor: "#eef2ff",
                color: "#4338ca",
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Total: {parentStats.totalParentFolders}
            </span>
            <span
              style={{
                backgroundColor: "#fff7ed",
                color: "#c2410c",
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              System: {parentStats.totalParentSystemFolders}
            </span>
            <span
              style={{
                backgroundColor: "#ecfdf5",
                color: "#047857",
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Custom: {parentStats.totalParentCustomFolders}
            </span>
          </div>
        </div>

        <form onSubmit={handleCreateFolder}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label style={labelStyle}>Folder Name</label>
              <input
                type="text"
                name="name"
                value={createForm.name}
                onChange={handleCreateChange}
                placeholder="e.g. Marketing"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Icon</label>
              <IconSelect
                value={createForm.icon}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    icon: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={actionLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                backgroundColor: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: actionLoading ? "not-allowed" : "pointer",
                opacity: actionLoading ? 0.7 : 1,
              }}
            >
              <Plus size={16} />
              {actionLoading ? "Creating..." : "Create Folder"}
            </button>

            <button
              type="button"
              onClick={resetCreateForm}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 1rem",
                backgroundColor: "#f8fafc",
                color: "#334155",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          minHeight: "400px",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.1rem",
              color: "#1e293b",
            }}
          >
            Folder List
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: "1rem 0", color: "#64748b" }}>
            Loading folders...
          </div>
        ) : filteredFolders.length === 0 ? (
          <div
            style={{
              padding: "1rem",
              border: "1px dashed #cbd5e1",
              borderRadius: "12px",
              color: "#64748b",
              textAlign: "center",
            }}
          >
            No folders found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {filteredFolders.map((folder) => {
              const isEditing = editingFolderId === folder.folderId;
              const IconComponent = FOLDER_ICON_MAP[folder.icon] || Folder;

              return (
                <div
                  key={folder._id || folder.folderId}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1rem",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {isEditing ? (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <label style={labelStyle}>Folder ID</label>
                          <input
                            type="text"
                            value={folder.folderId}
                            readOnly
                            style={{
                              ...inputStyle,
                              backgroundColor: "#f8fafc",
                              color: "#64748b",
                              cursor: "not-allowed",
                            }}
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Folder Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Icon</label>
                          <IconSelect
                            value={editForm.icon}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                icon: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "1rem",
                          display: "flex",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleUpdateFolder(folder)}
                          disabled={actionLoading}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.6rem 0.9rem",
                            backgroundColor: "#4f46e5",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "13px",
                            cursor: actionLoading ? "not-allowed" : "pointer",
                            opacity: actionLoading ? 0.7 : 1,
                          }}
                        >
                          <Save size={15} />
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.6rem 0.9rem",
                            backgroundColor: "#f8fafc",
                            color: "#334155",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          <X size={15} />
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.9rem",
                          }}
                        >
                          <div
                            style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "10px",
                              backgroundColor: "#eef2ff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <IconComponent size={20} color="#4f46e5" />
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: "#0f172a",
                                marginBottom: "6px",
                              }}
                            >
                              {folder.name}
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gap: "4px",
                                fontSize: "14px",
                                color: "#475569",
                              }}
                            >
                              <span>
                                <strong>Folder ID:</strong> {folder.folderId}
                              </span>
                              <span>
                                <strong>Icon:</strong> {folder.icon || "folder"}
                              </span>
                              <span>
                                <strong>Type:</strong>{" "}
                                {folder.system ? "System Folder" : "Custom Folder"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => startEditing(folder)}
                            disabled={folder.system}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.55rem 0.85rem",
                              backgroundColor: folder.system
                                ? "#f1f5f9"
                                : "#eff6ff",
                              color: folder.system ? "#94a3b8" : "#1d4ed8",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "13px",
                              cursor: folder.system ? "not-allowed" : "pointer",
                              opacity: folder.system ? 0.7 : 1,
                            }}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteFolder(folder)}
                            disabled={folder.system}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.55rem 0.85rem",
                              backgroundColor: folder.system
                                ? "#f1f5f9"
                                : "#fef2f2",
                              color: folder.system ? "#94a3b8" : "#dc2626",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "13px",
                              cursor: folder.system ? "not-allowed" : "pointer",
                              opacity: folder.system ? 0.7 : 1,
                            }}
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </div>

                      {folder.system && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            fontSize: "12px",
                            color: "#b45309",
                            backgroundColor: "#fffbeb",
                            border: "1px solid #fde68a",
                            padding: "8px 10px",
                            borderRadius: "8px",
                          }}
                        >
                          System folders cannot be edited or deleted.
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}