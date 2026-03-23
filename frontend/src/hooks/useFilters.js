// import { useState, useCallback, useMemo, useEffect } from 'react';
// import emailService from '../services/emailService';

// const useFilters = (displayedEmails, fetchEmails) => {
//   const [selectedFolder, setSelectedFolder] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [daysFilter, setDaysFilter] = useState("");
//   const [tagFilter, setTagFilter] = useState("");
//   const [availableTags, setAvailableTags] = useState([]);

//   // Fetch all available tags from the database
//   useEffect(() => {
//     const loadAvailableTags = async () => {
//       try {
//         const tags = await emailService.fetchAllTags();
//         setAvailableTags(tags.sort());
//       } catch (error) {
//         console.error('Error loading available tags:', error);
//         setAvailableTags([]);
//       }
//     };

//     loadAvailableTags();
//   }, []);

//   // Check if any filters are active (now all server-side)
//   const hasActiveFilters = useMemo(() => {
//     return (daysFilter && daysFilter !== "") || 
//            (tagFilter && tagFilter !== "") ||
//            (searchQuery && searchQuery.trim() !== "");
//   }, [daysFilter, tagFilter, searchQuery]);

//   // Handle days filter changes (triggers server-side fetch with current folder)
//   const handleDaysFilterChange = useCallback((newDaysFilter) => {
//     setDaysFilter(newDaysFilter);
//     // Always include current folder when filtering
//     const params = {
//       folderId: selectedFolder !== "all" ? selectedFolder : undefined,
//       searchQuery: searchQuery.trim() || undefined,
//       tag: tagFilter || undefined,
//       days: newDaysFilter ? parseInt(newDaysFilter) : undefined,
//       page: 1,
//       forceRefresh: true // Force refresh to bypass cache
//     };
//     fetchEmails(params);
//   }, [fetchEmails, selectedFolder, searchQuery, tagFilter]);

//   // Handle tag filter changes (triggers server-side fetch with current folder)
//   const handleTagFilterChange = useCallback((newTagFilter) => {
//     console.log('Tag filter changing:', { newTagFilter, selectedFolder, searchQuery, daysFilter });
//     setTagFilter(newTagFilter);
//     // Always include current folder when filtering
//     const params = {
//       folderId: selectedFolder !== "all" ? selectedFolder : undefined,
//       searchQuery: searchQuery.trim() || undefined,
//       tag: newTagFilter || undefined,
//       days: daysFilter ? parseInt(daysFilter) : undefined,
//       page: 1,
//       forceRefresh: true // Force refresh to bypass cache
//     };
//     fetchEmails(params);
//   }, [fetchEmails, selectedFolder, searchQuery, daysFilter]);

//   // Now return displayedEmails directly since filtering is done server-side
//   const filteredEmails = displayedEmails;
//   // Handle folder changes (triggers server-side fetch)
//   const handleFolderChange = useCallback((newFolderId) => {
//     setSelectedFolder(newFolderId);
//     // Reset filters when changing folders but keep current search
//     setDaysFilter("");
//     setTagFilter("");
//     // Trigger server-side fetch for new folder
//     fetchEmails({ 
//       folderId: newFolderId !== "all" ? newFolderId : undefined,
//       searchQuery: searchQuery.trim() || undefined,
//       page: 1 
//     });
//   }, [searchQuery, fetchEmails]);

//   // Handle search changes (triggers server-side fetch with current folder)
//   const handleSearchChange = useCallback((newSearchQuery) => {
//     setSearchQuery(newSearchQuery);
//     // Keep current filters when searching
//     fetchEmails({
//       folderId: selectedFolder !== "all" ? selectedFolder : undefined,
//       searchQuery: newSearchQuery.trim() || undefined,
//       tag: tagFilter || undefined,
//       days: daysFilter ? parseInt(daysFilter) : undefined,
//       page: 1
//     });
//   }, [selectedFolder, tagFilter, daysFilter, fetchEmails]);

//   // Get current folder name
//   const getCurrentFolderName = useCallback((folderConfig) => {
//     if (selectedFolder === "all") return "All Emails";
//     return (
//       folderConfig.find((f) => f.id === selectedFolder)?.name ||
//       "Unknown Folder"
//     );
//   }, [selectedFolder]);

//   // Reset all filters
//   const resetFilters = useCallback(() => {
//     setSelectedFolder("all");
//     setSearchQuery("");
//     setDaysFilter("");
//     setTagFilter("");
//     // Trigger fresh fetch with no filters
//     fetchEmails({ page: 1 });
//   }, [fetchEmails]);

//   // Format tag display name
//   const formatTagDisplayName = useCallback((tag) => {
//     if (tag === 'ai') return 'AI';
//     if (tag === 'technology') return 'Technology';
//     return tag.charAt(0).toUpperCase() + tag.slice(1);
//   }, []);

//   return {
//     // Filter state
//     selectedFolder,
//     searchQuery,
//     daysFilter,
//     tagFilter,
//     availableTags,
//     filteredEmails, // Now emails are filtered server-side
//     hasActiveFilters,

//     // Filter setters (all now trigger server-side fetches)
//     setSelectedFolder: handleFolderChange,
//     setSearchQuery: handleSearchChange,    
//     setDaysFilter: handleDaysFilterChange,
//     setTagFilter: handleTagFilterChange,

//     // Utility functions
//     getCurrentFolderName,
//     resetFilters,
//     formatTagDisplayName
//   };
// };

// export default useFilters;

import { useState, useCallback, useMemo, useEffect } from 'react';
import emailService from '../services/emailService';

const useFilters = (displayedEmails, fetchEmails) => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [daysFilter, setDaysFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const loadAvailableTags = async () => {
      try {
        const tags = await emailService.fetchAllTags();
        setAvailableTags(tags.sort());
      } catch (error) {
        console.error('Error loading available tags:', error);
        setAvailableTags([]);
      }
    };

    loadAvailableTags();
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      (daysFilter && daysFilter !== '') ||
      (tagFilter && tagFilter !== '') ||
      (searchQuery && searchQuery.trim() !== '')
    );
  }, [daysFilter, tagFilter, searchQuery]);

  const handleDaysFilterChange = useCallback(
    (newDaysFilter) => {
      setDaysFilter(newDaysFilter);

      fetchEmails({
        folderId: selectedFolder !== 'all' ? selectedFolder : undefined,
        searchQuery: searchQuery.trim() || undefined,
        tag: tagFilter || undefined,
        days: newDaysFilter ? parseInt(newDaysFilter, 10) : undefined,
        page: 1,
        forceRefresh: true,
      });
    },
    [fetchEmails, selectedFolder, searchQuery, tagFilter]
  );

  const handleTagFilterChange = useCallback(
    (newTagFilter) => {
      setTagFilter(newTagFilter);

      fetchEmails({
        folderId: selectedFolder !== 'all' ? selectedFolder : undefined,
        searchQuery: searchQuery.trim() || undefined,
        tag: newTagFilter || undefined,
        days: daysFilter ? parseInt(daysFilter, 10) : undefined,
        page: 1,
        forceRefresh: true,
      });
    },
    [fetchEmails, selectedFolder, searchQuery, daysFilter]
  );

  const filteredEmails = displayedEmails;

  const handleFolderChange = useCallback(
    (newFolderId) => {
      setSelectedFolder(newFolderId);
      setDaysFilter('');
      setTagFilter('');

      fetchEmails({
        folderId: newFolderId !== 'all' ? newFolderId : undefined,
        searchQuery: searchQuery.trim() || undefined,
        page: 1,
      });
    },
    [searchQuery, fetchEmails]
  );

  const handleSearchChange = useCallback(
    (newSearchQuery) => {
      setSearchQuery(newSearchQuery);

      fetchEmails({
        folderId: selectedFolder !== 'all' ? selectedFolder : undefined,
        searchQuery: newSearchQuery.trim() || undefined,
        tag: tagFilter || undefined,
        days: daysFilter ? parseInt(daysFilter, 10) : undefined,
        page: 1,
      });
    },
    [selectedFolder, tagFilter, daysFilter, fetchEmails]
  );

  const getCurrentFolderName = useCallback(
    (folders) => {
      if (selectedFolder === 'all') return 'All Emails';

      return (
        folders.find((folder) => folder.folderId === selectedFolder)?.name ||
        'Unknown Folder'
      );
    },
    [selectedFolder]
  );

  const resetFilters = useCallback(() => {
    setSelectedFolder('all');
    setSearchQuery('');
    setDaysFilter('');
    setTagFilter('');
    fetchEmails({ page: 1 });
  }, [fetchEmails]);

  const formatTagDisplayName = useCallback((tag) => {
    if (tag === 'ai') return 'AI';
    if (tag === 'technology') return 'Technology';
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  }, []);

  return {
    selectedFolder,
    searchQuery,
    daysFilter,
    tagFilter,
    availableTags,
    filteredEmails,
    hasActiveFilters,
    setSelectedFolder: handleFolderChange,
    setSearchQuery: handleSearchChange,
    setDaysFilter: handleDaysFilterChange,
    setTagFilter: handleTagFilterChange,
    getCurrentFolderName,
    resetFilters,
    formatTagDisplayName,
  };
};

export default useFilters;