const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

class EmailService {
  // Fetch all saved emails with optional filters and pagination
  async fetchEmails(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.searchQuery) {
        queryParams.append("q", params.searchQuery);
      }
      if (params.folderId && params.folderId !== "all") {
        queryParams.append("folderId", params.folderId);
      }
      if (params.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params.limit) {
        queryParams.append("limit", params.limit.toString());
      }
      // Add server-side filtering for tags and days
      if (params.tag) {
        queryParams.append("tag", params.tag);
      }
      if (params.days) {
        queryParams.append("days", params.days.toString());
      }

      const response = await fetch(
        `${API_URL}/api/emails/saved?${queryParams.toString()}`,
        { credentials: "include" }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching emails:", error);
      throw error;
    }
  }

  // Fetch email counts and unread counts
  async fetchCounts() {
    try {
      const response = await fetch(`${API_URL}/api/emails/counts`, { 
        credentials: "include" 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching email counts:", error);
      throw error;
    }
  }

  // Sync emails from POP3
  async syncEmails() {
    try {
      const response = await fetch(`${API_URL}/api/emails`, { 
        credentials: "include" 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || response.statusText);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error syncing emails:", error);
      throw error;
    }
  }

  // Mark email as read
  async markEmailAsRead(emailId) {
    try {
      const response = await fetch(`${API_URL}/api/emails/${emailId}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error marking email as read:", error);
      throw error;
    }
  }

  // Move email to folder
  async moveEmail(emailId, newFolderId) {
    try {
      const response = await fetch(`${API_URL}/api/emails/${emailId}/folder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId: newFolderId }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || response.statusText);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error moving email:", error);
      throw error;
    }
  }

  // Generate tags for an email
  async generateTags(emailId) {
    try {
      const response = await fetch(`${API_URL}/api/emails/tag/${emailId}`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error generating tags:", error);
      throw error;
    }
  }

  // Update email tags
  async updateTags(emailId, tags) {
    try {
      const response = await fetch(`${API_URL}/api/emails/tag/${emailId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating tags:", error);
      throw error;
    }
  }

  // Fetch all available tags
  async fetchAllTags() {
    try {
      const response = await fetch(`${API_URL}/api/emails/tags`, { 
        credentials: "include" 
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.tags || [];
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  }
}

// Export a singleton instance
const emailService = new EmailService();
export default emailService;