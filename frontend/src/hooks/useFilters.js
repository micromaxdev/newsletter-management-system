import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const useFilters = (allEmails, onDisplayedEmailsChange) => {
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [daysFilter, setDaysFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const lastFilteredEmailsRef = useRef([]);

  // Extract available tags from emails (memoized)
  const availableTags = useMemo(() => {
    const tags = new Set();
    allEmails.forEach(email => {
      if (email.tags && Array.isArray(email.tags)) {
        email.tags.forEach(tag => {
          // Normalize tags to avoid duplicates
          const normalizedTag = tag.toLowerCase();
          tags.add(normalizedTag);
        });
      }
    });
    return Array.from(tags).sort();
  }, [allEmails]);

  // Apply all filters (memoized)
  const filteredEmails = useMemo(() => {
    let filtered = allEmails;

    // Apply folder filter
    if (selectedFolder !== "all") {
      filtered = filtered.filter((email) => email.folderId === selectedFolder);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (email) =>
          email.subject?.toLowerCase().includes(query) ||
          email.from?.address?.toLowerCase().includes(query) ||
          email.from?.name?.toLowerCase().includes(query) ||
          email.text?.toLowerCase().includes(query)
      );
    }

    // Apply days filter
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

    // Apply tag filter
    if (tagFilter && tagFilter !== "") {
      filtered = filtered.filter(email => 
        email.tags && email.tags.some(emailTag => 
          emailTag.toLowerCase() === tagFilter.toLowerCase()
        )
      );
    }

    return filtered;
  }, [allEmails, selectedFolder, searchQuery, daysFilter, tagFilter]);

  // Update displayed emails when filtered emails change
  useEffect(() => {
    // Only call if the filtered emails actually changed
    const currentEmailIds = filteredEmails.map(e => e._id).join(',');
    const lastEmailIds = lastFilteredEmailsRef.current.map(e => e._id).join(',');
    
    if (currentEmailIds !== lastEmailIds) {
      lastFilteredEmailsRef.current = filteredEmails;
      onDisplayedEmailsChange(filteredEmails);
    }
  }, [filteredEmails, onDisplayedEmailsChange]);

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
  }, []);

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

    // Filter setters
    setSelectedFolder,
    setSearchQuery,
    setDaysFilter,
    setTagFilter,

    // Utility functions
    getCurrentFolderName,
    resetFilters,
    formatTagDisplayName
  };
};

export default useFilters;