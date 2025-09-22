import { useState, useCallback } from 'react';
import SummarizationService from '../services/summarizationService';

/**
 * Custom hook for managing email summarization
 * Handles loading states, error handling, and API calls
 */
const useSummarization = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate summary for an email
   * @param {string} emailId - The email ID to summarize
   * @param {Object} options - Optional AI configuration
   */
  const generateSummary = useCallback(async (emailId, options = {}) => {
    if (!emailId) {
      setError('Email ID is required');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await SummarizationService.generateSummary(emailId, options);
      setSummaryResult(result);
      setShowSummaryModal(true);
      return result;
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err.message);
      // You can also show a toast notification here if you have a toast system
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Close the summary modal
   */
  const closeSummaryModal = useCallback(() => {
    setShowSummaryModal(false);
    setSummaryResult(null);
  }, []);

  /**
   * Clear any error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setIsGenerating(false);
    setSummaryResult(null);
    setShowSummaryModal(false);
    setError(null);
  }, []);

  return {
    // State
    isGenerating,
    summaryResult,
    showSummaryModal,
    error,
    
    // Actions
    generateSummary,
    closeSummaryModal,
    clearError,
    reset
  };
};

/**
 * Custom hook for managing multiple summarized emails
 * Useful for listing and managing summarized emails
 */
const useSummarizedEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all summarized emails
   */
  const fetchSummarizedEmails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await SummarizationService.getAllSummarizedEmails();
      setEmails(result);
      return result;
    } catch (err) {
      console.error('Error fetching summarized emails:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a summarized email
   * @param {string} summaryId - The summary ID to delete
   */
  const deleteSummarizedEmail = useCallback(async (summaryId) => {
    try {
      await SummarizationService.deleteSummarizedEmail(summaryId);
      // Remove from local state
      setEmails(prev => prev.filter(email => email._id !== summaryId));
      return true;
    } catch (err) {
      console.error('Error deleting summarized email:', err);
      setError(err.message);
      return false;
    }
  }, []);

  /**
   * Update a summarized email
   * @param {string} summaryId - The summary ID to update
   * @param {Object} updateData - The update data
   */
  const updateSummarizedEmail = useCallback(async (summaryId, updateData) => {
    try {
      const updatedEmail = await SummarizationService.updateSummarizedEmail(summaryId, updateData);
      // Update local state
      setEmails(prev => prev.map(email => 
        email._id === summaryId ? updatedEmail : email
      ));
      return updatedEmail;
    } catch (err) {
      console.error('Error updating summarized email:', err);
      setError(err.message);
      return null;
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    emails,
    loading,
    error,
    
    // Actions
    fetchSummarizedEmails,
    deleteSummarizedEmail,
    updateSummarizedEmail,
    clearError
  };
};

export { useSummarization, useSummarizedEmails };