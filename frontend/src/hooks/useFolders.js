import { useCallback, useEffect, useMemo, useState } from "react";
import folderService from "../services/folderService";

const flattenFolders = (folders = []) => {
  const result = [];

  const walk = (items) => {
    items.forEach((item) => {
      const { children = [], ...rest } = item;
      result.push(rest);

      if (Array.isArray(children) && children.length > 0) {
        walk(children);
      }
    });
  };

  walk(folders);
  return result;
};

const sortFolders = (folders) => {
  const firstFolder = "uncategorised";
  const lastFolder = "archive";
  const middleSystemOrder = ["suppliers", "competitors", "customers"];

  return [...folders].sort((a, b) => {
    const aId = a.folderId?.toLowerCase() || "";
    const bId = b.folderId?.toLowerCase() || "";

    const aIsSubfolder = !!a.parentFolderId;
    const bIsSubfolder = !!b.parentFolderId;

    // keep parent folders before subfolders
    if (!aIsSubfolder && bIsSubfolder) return -1;
    if (aIsSubfolder && !bIsSubfolder) return 1;

    // subfolders grouped alphabetically by parent, then name
    if (aIsSubfolder && bIsSubfolder) {
      const parentCompare = (a.parentFolderId || "").localeCompare(
        b.parentFolderId || ""
      );

      if (parentCompare !== 0) return parentCompare;

      return (a.name || "").localeCompare(b.name || "");
    }

    // top-level folder sort
    if (aId === firstFolder) return -1;
    if (bId === firstFolder) return 1;

    if (aId === lastFolder) return 1;
    if (bId === lastFolder) return -1;

    const aSystemIndex = middleSystemOrder.indexOf(aId);
    const bSystemIndex = middleSystemOrder.indexOf(bId);

    const aIsMiddleSystem = aSystemIndex !== -1;
    const bIsMiddleSystem = bSystemIndex !== -1;

    if (aIsMiddleSystem && bIsMiddleSystem) {
      return aSystemIndex - bSystemIndex;
    }

    if (aIsMiddleSystem) return -1;
    if (bIsMiddleSystem) return 1;

    return (a.name || "").localeCompare(b.name || "");
  });
};

export default function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  const fetchFolders = useCallback(async () => {
    try {
      setLoading(true);
      clearMessages();

      const data = await folderService.getAllFolders();

      // supports backend returning nested tree
      const normalizedFolders = Array.isArray(data) ? flattenFolders(data) : [];

      setFolders(sortFolders(normalizedFolders));
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load folders"
      );
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const createFolder = async (payload) => {
    try {
      setActionLoading(true);
      clearMessages();

      const created = await folderService.createFolder(payload);

      setFolders((prev) => sortFolders([...prev, created]));
      setSuccessMessage("Folder created successfully");

      return { success: true, data: created };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to create folder";
      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  };

  const createSubfolder = async (parentFolderId, payload) => {
    try {
      setActionLoading(true);
      clearMessages();

      const created = await folderService.createSubfolder(parentFolderId, payload);

      setFolders((prev) => sortFolders([...prev, created]));
      setSuccessMessage("Subfolder created successfully");

      return { success: true, data: created };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create subfolder";
      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  };

  const updateFolder = async (folderId, payload) => {
    try {
      setActionLoading(true);
      clearMessages();

      const updated = await folderService.updateFolder(folderId, payload);

      setFolders((prev) =>
        sortFolders(
          prev.map((folder) => {
            if (folder.folderId === folderId) {
              return updated;
            }

            // if a parent folder id changed, its children must also follow
            if (folder.parentFolderId === folderId) {
              return {
                ...folder,
                parentFolderId: updated.folderId,
              };
            }

            return folder;
          })
        )
      );

      setSuccessMessage(
        updated.parentFolderId ? "Subfolder updated successfully" : "Folder updated successfully"
      );

      return { success: true, data: updated };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to update folder";
      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      setActionLoading(true);
      clearMessages();

      await folderService.deleteFolder(folderId);

      setFolders((prev) => prev.filter((folder) => folder.folderId !== folderId));
      setSuccessMessage("Folder deleted successfully");

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to delete folder";
      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  };

  const stats = useMemo(() => {
    const parentFolders = folders.filter((folder) => !folder.parentFolderId);
    const subfolders = folders.filter((folder) => !!folder.parentFolderId);

    return {
      totalFolders: folders.length,
      totalParentFolders: parentFolders.length,
      totalSubfolders: subfolders.length,
      totalSystemFolders: folders.filter((folder) => folder.system).length,
      totalCustomFolders: folders.filter((folder) => !folder.system).length,
    };
  }, [folders]);

  return {
    folders,
    loading,
    actionLoading,
    error,
    successMessage,
    clearMessages,
    fetchFolders,
    createFolder,
    createSubfolder,
    updateFolder,
    deleteFolder,
    ...stats,
  };
}