import { useMemo, useState } from "react";

export default function useFolderFilters(folders = []) {
  const [searchQuery, setSearchQuery] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");

  const filteredFolders = useMemo(() => {
    let result = [...folders];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      result = result.filter(
        (folder) =>
          folder.name?.toLowerCase().includes(query) ||
          folder.folderId?.toLowerCase().includes(query) ||
          folder.icon?.toLowerCase().includes(query)
      );
    }

    if (folderFilter !== "all") {
      result = result.filter((folder) =>
        folderFilter === "system" ? folder.system : !folder.system
      );
    }

    return result;
  }, [folders, searchQuery, folderFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setFolderFilter("all");
  };

  return {
    searchQuery,
    setSearchQuery,
    folderFilter,
    setFolderFilter,
    filteredFolders,
    clearFilters,
  };
}