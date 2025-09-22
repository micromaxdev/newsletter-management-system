// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5007";

/**
 * Service for handling email summarization API calls
 */
class SummarizationService {
  /**
   * Generate a summary for an email
   * @param {string} emailId - The ID of the email to summarize
   * @param {Object} options - Optional configuration for the AI model (backend handles defaults)
   * @returns {Promise<Object>} - The summarization result
   */
  static async generateSummary(emailId, options = null) {
    if (!emailId) {
      throw new Error('Email ID is required');
    }

    try {
      const requestBody = options ? JSON.stringify(options) : JSON.stringify({});
      
      const response = await fetch(`${API_BASE_URL}/api/summarized-emails/summarize/${emailId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // Re-throw with more context
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }

  /**
   * Get all summarized emails
   * @returns {Promise<Array>} - Array of summarized emails
   */
  static async getAllSummarizedEmails() {
    try {
      const response = await fetch(`${API_BASE_URL}/summarized-emails`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch summarized emails: ${error.message}`);
    }
  }

  /**
   * Get a specific summarized email by ID
   * @param {string} summaryId - The ID of the summarized email
   * @returns {Promise<Object>} - The summarized email data
   */
  static async getSummarizedEmailById(summaryId) {
    if (!summaryId) {
      throw new Error('Summary ID is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/summarized-emails/${summaryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch summarized email: ${error.message}`);
    }
  }

  /**
   * Update a summarized email
   * @param {string} summaryId - The ID of the summarized email
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} - The updated summarized email
   */
  static async updateSummarizedEmail(summaryId, updateData) {
    if (!summaryId) {
      throw new Error('Summary ID is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/summarized-emails/${summaryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Failed to update summarized email: ${error.message}`);
    }
  }

  /**
   * Delete a summarized email
   * @param {string} summaryId - The ID of the summarized email
   * @returns {Promise<Object>} - Success message
   */
  static async deleteSummarizedEmail(summaryId) {
    if (!summaryId) {
      throw new Error('Summary ID is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/summarized-emails/${summaryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Failed to delete summarized email: ${error.message}`);
    }
  }
}

export default SummarizationService;