import { useState, useCallback, useMemo } from 'react';

const useFilters = (displayedEmails, fetchEmails) => {
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [daysFilter, setDaysFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  // Extract available tags from currently displayed emails (memoized)
  const availableTags = useMemo(() => {
    const tags = new Set();
    displayedEmails.forEach(email => {
      if (email.tags && Array.isArray(email.tags)) {
        email.tags.forEach(tag => {
          // Normalize tags to avoid duplicates
          const normalizedTag = tag.toLowerCase();
          tags.add(normalizedTag);
        });
      }
    });
    return Array.from(tags).sort();
  }, [displayedEmails]);

  // Apply local filters (days and tag filters only - folder and search are handled server-side)
  const filteredEmails = useMemo(() => {
    let filtered = displayedEmails;

    // Apply days filter (local filtering)
    if (daysFilter && daysFilter !== "") {
      const daysAgo = parseInt(daysFilter);
      if (!isNaN(daysAgo) && daysAgo >= 0) {
        const cutoffDate = new Date();
        if (daysAgo > 0) {
          cutoffDate.setDate(cutoffDate.getDate() - (daysAgo - 1));
        }
        cutoffDate.setHours(0, 0, 0, 0);

        filtered = filtered.filter((email) => {
          const emailDate = new Date(email.date);
          return emailDate >= cutoffDate;
        });
      }
    }

    // Apply tag filter (local filtering)
    if (tagFilter && tagFilter !== "") {
      filtered = filtered.filter(email => 
        email.tags && email.tags.some(emailTag => 
          emailTag.toLowerCase() === tagFilter.toLowerCase()
        )
      );
    }

    return filtered;
  }, [displayedEmails, daysFilter, tagFilter]);

  // Handle folder changes (triggers server-side fetch)
  const handleFolderChange = useCallback((newFolderId) => {
    setSelectedFolder(newFolderId);
    // Clear local filters when changing folders
    setDaysFilter("");
    setTagFilter("");
    // Trigger server-side fetch
    fetchEmails({ 
      folderId: newFolderId,
      searchQuery: searchQuery.trim() || undefined,
      page: 1 
    });
  }, [searchQuery, fetchEmails]);

  // Handle search changes (triggers server-side fetch)
  const handleSearchChange = useCallback((newSearchQuery) => {
    setSearchQuery(newSearchQuery);
    // Clear local filters when searching
    setDaysFilter("");
    setTagFilter("");
  }, []);

  // Get current folder name
  const getCurrentFolderName = useCallback((folderConfig) => {
    if (selectedFolder === "all") return "All Emails";
    return (
      folderConfig.find((f) => f.id === selectedFolder)?.name ||
      "Unknown Folder"
    );
  }, [selectedFolder]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSelectedFolder("all");
    setSearchQuery("");
    setDaysFilter("");
    setTagFilter("");
    // Trigger fresh fetch
    fetchEmails({ folderId: "all", page: 1 });
  }, [fetchEmails]);

  // Format tag display name
  const formatTagDisplayName = useCallback((tag) => {
    if (tag === 'ai') return 'AI';
    if (tag === 'technology') return 'Technology';
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  }, []);

  return {
    // Filter state
    selectedFolder,
    searchQuery,
    daysFilter,
    tagFilter,
    availableTags,
    filteredEmails, // Now returns locally filtered emails

    // Filter setters
    setSelectedFolder: handleFolderChange, // Now triggers server fetch
    setSearchQuery: handleSearchChange,    // Used for display, actual fetch triggered by HomePage
    setDaysFilter,                         // Local filtering only
    setTagFilter,                          // Local filtering only

    // Utility functions
    getCurrentFolderName,
    resetFilters,
    formatTagDisplayName
  };
};

export default useFilters;