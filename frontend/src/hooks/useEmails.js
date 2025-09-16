import { useState, useCallback } from 'react';
import emailService from '../services/emailService';

const useEmails = () => {
  const [allEmails, setAllEmails] = useState([]);
  const [displayedEmails, setDisplayedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailCounts, setEmailCounts] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch emails from the server
  const fetchEmails = useCallback(async (params = {}) => {
    // Only show loading spinner on initial load or when there are no emails
    if (isInitialLoad || displayedEmails.length === 0) {
      setLoading(true);
    }
    
    setError("");
    try {
      const data = await emailService.fetchEmails(params);

      if (data.emails) {
        setAllEmails(data.emails);
        // Don't set displayedEmails here - let useFilters handle it
      } else {
        setAllEmails([]);
        // Only clear displayedEmails if we have no data at all
        setDisplayedEmails([]);
      }
      
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      setError("Failed to fetch emails.");
      setAllEmails([]);
      setDisplayedEmails([]);
    } finally {
      setLoading(false);
    }
  }, [isInitialLoad, displayedEmails.length]);

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
      // Refresh the entire page to ensure all data is reloaded
      window.location.reload();
    } catch (error) {
      console.error("Error syncing emails:", error);
      setError(`Sync failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark email as read
  const markEmailAsRead = useCallback(async (emailId) => {
    try {
      await emailService.markEmailAsRead(emailId);
      
      // Update local state
      setAllEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, isRead: true } : email
        )
      );
      // Let useFilters handle displayedEmails update
      
      // Refresh counts
      fetchCounts();
    } catch (error) {
      console.error("Error marking email as read:", error);
      setError("Failed to mark email as read.");
    }
  }, [fetchCounts]);

  // Move email to folder
  const moveEmail = useCallback(async (emailId, newFolderId) => {
    try {
      await emailService.moveEmail(emailId, newFolderId);
      
      // Update local state
      setAllEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, folderId: newFolderId } : email
        )
      );
      
      // Only refresh counts, let filters handle the display
      await fetchCounts();
    } catch (error) {
      console.error("Error moving email:", error);
      setError(`Failed to move email: ${error.message}`);
    }
  }, [fetchCounts]);

  // Generate tags for email
  const generateTags = useCallback(async (emailId) => {
    try {
      const data = await emailService.generateTags(emailId);
      
      // Update the email in allEmails only
      setAllEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, tags: data.tags } : email
        )
      );
      // Let useFilters handle displayedEmails update
    } catch (error) {
      console.error("Error generating tags:", error);
      setError(`Failed to generate tags: ${error.message}`);
    }
  }, []);

  // Update email tags
  const updateTags = useCallback(async (emailId, tags) => {
    try {
      const data = await emailService.updateTags(emailId, tags);
      
      // Update the email in allEmails only
      setAllEmails((prevEmails) =>
        prevEmails.map((email) =>
          email._id === emailId ? { ...email, tags: data.email.tags } : email
        )
      );
      // Let useFilters handle displayedEmails update
    } catch (error) {
      console.error("Error updating tags:", error);
      setError(`Failed to update tags: ${error.message}`);
    }
  }, []);

  // Update displayed emails (for filtering)
  const updateDisplayedEmails = useCallback((emails) => {
    setDisplayedEmails(emails);
  }, []);

  return {
    // State
    allEmails,
    displayedEmails,
    loading,
    error,
    emailCounts,
    unreadCounts,
    isInitialLoad,
    
    // Actions
    fetchEmails,
    fetchCounts,
    syncEmails,
    markEmailAsRead,
    moveEmail,
    generateTags,
    updateTags,
    updateDisplayedEmails,
    setError
  };
};

export default useEmails;