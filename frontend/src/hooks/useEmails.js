import { useState, useCallback } from 'react';
import emailService from '../services/emailService';

const useEmails = () => {
  // Remove allEmails - we'll use smart caching instead
  const [folderCache, setFolderCache] = useState({}); // Cache emails by folder
  const [displayedEmails, setDisplayedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailCounts, setEmailCounts] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [pagination, setPagination] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("all");
  const [currentSearch, setCurrentSearch] = useState("");

  // Fetch emails from the server with intelligent caching
  const fetchEmails = useCallback(async (params = {}) => {
    const { searchQuery = "", folderId = "all", page = 1, limit = 50, forceRefresh = false } = params;
    
    // Create cache key
    const cacheKey = `${folderId}-${searchQuery}-${page}`;
    
    // If we have cached data and not forcing refresh, use it
    if (!forceRefresh && folderCache[cacheKey]) {
      setDisplayedEmails(folderCache[cacheKey].emails);
      setPagination(folderCache[cacheKey].pagination);
      setCurrentFolder(folderId);
      setCurrentSearch(searchQuery);
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const data = await emailService.fetchEmails({
        searchQuery: searchQuery.trim() || undefined,
        folderId: folderId !== "all" ? folderId : undefined,
        page,
        limit
      });

      console.log("Fetch emails response:", data); // Debug log

      if (data.emails && data.pagination) {
        // Cache the result
        setFolderCache(prev => ({
          ...prev,
          [cacheKey]: {
            emails: data.emails,
            pagination: data.pagination,
            timestamp: Date.now()
          }
        }));
        
        setDisplayedEmails(data.emails);
        setPagination(data.pagination);
        setCurrentFolder(folderId);
        setCurrentSearch(searchQuery);
        
        console.log("Set pagination:", data.pagination); // Debug log
      } else {
        setDisplayedEmails([]);
        setPagination(null);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setError("Failed to fetch emails.");
      setDisplayedEmails([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [folderCache]);

  // Clear cache for specific folder or all
  const clearCache = useCallback((folderId = null) => {
    if (folderId) {
      setFolderCache(prev => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach(key => {
          if (key.startsWith(`${folderId}-`)) {
            delete newCache[key];
          }
        });
        return newCache;
      });
    } else {
      setFolderCache({});
    }
  }, []);

  // Load more emails (pagination)
  const loadMoreEmails = useCallback(async () => {
    if (!pagination || !pagination.hasNextPage || loading) {
      console.log("Cannot load more:", { pagination, loading }); // Debug log
      return;
    }
    
    console.log("Loading more emails. Current pagination:", pagination); // Debug log
    console.log("Current displayed emails count:", displayedEmails.length); // Debug log
    
    setLoading(true);
    try {
      const data = await emailService.fetchEmails({
        searchQuery: currentSearch.trim() || undefined,
        folderId: currentFolder !== "all" ? currentFolder : undefined,
        page: pagination.currentPage + 1,
        limit: 50
      });

      console.log("Load more response:", data); // Debug log

      if (data.emails && data.pagination) {
        // Append new emails to existing ones
        setDisplayedEmails(prevEmails => {
          const updatedEmails = [...prevEmails, ...data.emails];
          console.log("Updated emails count:", updatedEmails.length); // Debug log
          return updatedEmails;
        });
        
        setPagination(data.pagination);
        console.log("New pagination:", data.pagination); // Debug log
        
        // Don't update cache for load more - keep it simple
      }
    } catch (error) {
      console.error("Error loading more emails:", error);
      setError("Failed to load more emails.");
    } finally {
      setLoading(false);
    }
  }, [pagination, currentSearch, currentFolder, loading, displayedEmails]);

  // Fetch email counts
  const fetchCounts = useCallback(async () => {
    try {
      const data = await emailService.fetchCounts();

      if (data.counts && data.unreadCounts) {
        setEmailCounts(data.counts);
        setUnreadCounts(data.unreadCounts);
      } else if (data.error) {
        console.error("Error from counts API:", data.error);
        setError(`Failed to load counts: ${data.error}`);
      }
    } catch (error) {
      console.error("Error fetching email counts:", error);
      setError("Failed to fetch email counts.");
    }
  }, []);

  // Sync emails from POP3
  const syncEmails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Starting email sync...");
      const data = await emailService.syncEmails();

      console.log(
        "Sync complete:",
        data.categorization || "No categorization data"
      );
      // Clear all cache and refresh
      clearCache();
      window.location.reload();
    } catch (error) {
      console.error("Error syncing emails:", error);
      setError(`Sync failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [clearCache]);

  // Mark email as read
  const markEmailAsRead = useCallback(async (emailId) => {
    try {
      await emailService.markEmailAsRead(emailId);
      
      // Update displayed emails
      setDisplayedEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, isRead: true } : email
        )
      );
      
      // Clear cache to ensure fresh data on next load
      clearCache();
      
      // Refresh counts
      fetchCounts();
    } catch (error) {
      console.error("Error marking email as read:", error);
      setError("Failed to mark email as read.");
    }
  }, [fetchCounts, clearCache]);

  // Move email to folder
  const moveEmail = useCallback(async (emailId, newFolderId) => {
    try {
      await emailService.moveEmail(emailId, newFolderId);
      
      // Remove email from current display (it moved to different folder)
      setDisplayedEmails((prevEmails) =>
        prevEmails.filter((email) => email._id !== emailId)
      );
      
      // Clear cache to ensure fresh data
      clearCache();
      
      // Refresh counts
      await fetchCounts();
    } catch (error) {
      console.error("Error moving email:", error);
      setError(`Failed to move email: ${error.message}`);
    }
  }, [fetchCounts, clearCache]);

  // Generate tags for email
  const generateTags = useCallback(async (emailId) => {
    try {
      const data = await emailService.generateTags(emailId);
      
      // Update the email in displayed emails
      setDisplayedEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, tags: data.tags } : email
        )
      );
      
      // Clear cache to ensure consistency
      clearCache();
    } catch (error) {
      console.error("Error generating tags:", error);
      setError(`Failed to generate tags: ${error.message}`);
    }
  }, [clearCache]);

  // Update email tags
  const updateTags = useCallback(async (emailId, tags) => {
    try {
      const data = await emailService.updateTags(emailId, tags);
      
      // Update the email in displayed emails
      setDisplayedEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, tags: data.email.tags } : email
        )
      );
      
      // Clear cache to ensure consistency
      clearCache();
    } catch (error) {
      console.error("Error updating tags:", error);
      setError(`Failed to update tags: ${error.message}`);
    }
  }, [clearCache]);

  return {
    // State
    displayedEmails,
    loading,
    error,
    emailCounts,
    unreadCounts,
    pagination,
    currentFolder,
    currentSearch,
    
    // Actions
    fetchEmails,
    fetchCounts,
    syncEmails,
    markEmailAsRead,
    moveEmail,
    generateTags,
    updateTags,
    loadMoreEmails,
    clearCache,
    setError
  };
};

export default useEmails;