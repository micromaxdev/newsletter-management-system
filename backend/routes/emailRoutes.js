// const express = require('express');
// const router = express.Router();
// const asyncHandler = require('express-async-handler'); // Keep asyncHandler for consistency

// // Import all functions from the new emailController
// const {
//   getEmails,
//   getSavedEmails,
//   getUnreadCount,
//   getUnreadCounts,
//   getEmailCounts,
//   markEmailAsRead,
//   markEmailAsUnread,
//   bulkMarkEmailsAsRead,
//   moveEmailToFolder,
//   recategorizeEmails,
//   getEmailsByFolder,
//   manualCategorization,
//   getEmailStatistics,
//   validateCategorization,
// } = require('../controllers/emailController');

// // --- Email API Routes ---

// // Fetch emails from POP3 server (and save/categorize)
// router.get('/', asyncHandler(getEmails));

// // Get saved emails from DB (with optional folder, search, pagination, and unread filter)
// router.get('/saved', asyncHandler(getSavedEmails));

// // Get unread count for a specific folder or all emails (can be deprecated by /unread-counts)
// router.get('/unread-count', asyncHandler(getUnreadCount));

// // Get unread counts for all folders (more comprehensive)
// router.get('/unread-counts', asyncHandler(getUnreadCounts));

// // Get email counts per folder (includes unread counts for each)
// router.get('/counts', asyncHandler(getEmailCounts));

// // Mark email as read
// router.put('/:emailId/read', asyncHandler(markEmailAsRead));

// // Mark email as unread
// router.patch('/:emailId/unread', asyncHandler(markEmailAsUnread));

// // Bulk mark emails as read
// router.patch('/bulk-read', asyncHandler(bulkMarkEmailsAsRead));

// // Move email to different folder, save sender preference, and re-categorize past emails
// router.put('/:emailId/folder', asyncHandler(moveEmailToFolder));

// // Enhanced recategorization with detailed reporting
// router.post('/recategorize', asyncHandler(recategorizeEmails));

// // Get emails by folder with pagination and filtering
// router.get('/folders/:folderId', asyncHandler(getEmailsByFolder));

// // Manual categorization with learning
// router.put('/:id/category', asyncHandler(manualCategorization));

// // Get detailed email statistics
// router.get('/statistics', asyncHandler(getEmailStatistics));

// // Validate categorization accuracy
// router.post('/validate', asyncHandler(validateCategorization));

// // Error handling middleware (still useful here for route-specific errors)
// router.use((error, req, res, next) => {
//   console.error(' Router Error:', error);

//   if (res.headersSent) {
//     return next(error);
//   }

//   res.status(500).json({
//     error: 'Internal server error',
//     message: error.message,
//     ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const axios = require('axios');

// Configure axios instance for email service communication
const emailServiceClient = axios.create({
  baseURL: process.env.EMAIL_SERVICE_URL || 'http://localhost:3002/api/emails',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
emailServiceClient.interceptors.request.use(
  (config) => {
    const token = process.env.EMAIL_SERVICE_TOKEN || process.env.API_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add request ID for tracing
    config.headers['X-Request-ID'] = req?.headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
emailServiceClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Email Service API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Helper function to handle axios errors and send appropriate responses
const handleAxiosError = (error, res, defaultMessage = 'Service error') => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    res.status(status).json({
      error: data.error || defaultMessage,
      message: data.message || error.message,
      ...(process.env.NODE_ENV === 'development' && { details: data.details })
    });
  } else if (error.request) {
    // Network error or service unavailable
    res.status(503).json({
      error: 'Service unavailable',
      message: 'Email service is currently unavailable. Please try again later.'
    });
  } else {
    // Other errors
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

// --- Email API Routes ---

// Fetch emails from external service (Gmail, Outlook, etc.)
router.get('/', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.get('/fetch', {
      params: req.query
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to fetch emails');
  }
}));

// Get saved emails from email service with filtering options
router.get('/saved', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.get('/saved', {
      params: {
        folderId: req.query.folderId,
        q: req.query.q,
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        unread: req.query.unread,
        starred: req.query.starred,
        sortBy: req.query.sortBy || 'date',
        sortOrder: req.query.sortOrder || 'desc'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to get saved emails');
  }
}));

// Get unread count for a specific folder or all emails
router.get('/unread-count', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.get('/unread-count', {
      params: {
        folderId: req.query.folderId
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to get unread count');
  }
}));

// Get comprehensive unread counts for all folders
router.get('/unread-counts', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.get('/unread-counts');
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to get unread counts');
  }
}));

// Get detailed email counts per folder
router.get('/counts', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.get('/counts');
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to get email counts');
  }
}));

// Mark email as read
router.put('/:emailId/read', asyncHandler(async (req, res) => {
  try {
    const { emailId } = req.params;
    
    if (!emailId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email ID is required' 
      });
    }
    
    const response = await emailServiceClient.put(`/${emailId}/read`);
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to mark email as read');
  }
}));

// Mark email as unread
router.patch('/:emailId/unread', asyncHandler(async (req, res) => {
  try {
    const { emailId } = req.params;
    
    if (!emailId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email ID is required' 
      });
    }
    
    const response = await emailServiceClient.patch(`/${emailId}/unread`);
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to mark email as unread');
  }
}));

// Bulk mark emails as read
router.patch('/bulk-read', asyncHandler(async (req, res) => {
  try {
    const { emailIds } = req.body;
    
    if (!emailIds || !Array.isArray(emailIds) || emailIds.length === 0) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Array of email IDs is required' 
      });
    }
    
    const response = await emailServiceClient.patch('/bulk-read', {
      emailIds
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to bulk mark emails as read');
  }
}));

// Move email to different folder and update preferences
router.put('/:emailId/folder', asyncHandler(async (req, res) => {
  try {
    const { emailId } = req.params;
    const { folderId } = req.body;
    
    if (!emailId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email ID is required' 
      });
    }
    
    if (!folderId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Folder ID is required' 
      });
    }
    
    const response = await emailServiceClient.put(`/${emailId}/folder`, {
      folderId
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to move email to folder');
  }
}));

// Trigger email recategorization
router.post('/recategorize', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.post('/recategorize', req.body);
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to recategorize emails');
  }
}));

// Get emails by folder with advanced filtering
router.get('/folders/:folderId', asyncHandler(async (req, res) => {
  try {
    const { folderId } = req.params;
    
    if (!folderId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Folder ID is required' 
      });
    }
    
    const response = await emailServiceClient.get(`/folders/${encodeURIComponent(folderId)}`, {
      params: {
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        q: req.query.q,
        sortBy: req.query.sortBy || 'date',
        sortOrder: req.query.sortOrder || 'desc',
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        hasAttachments: req.query.hasAttachments
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to get emails by folder');
  }
}));

// Manual email categorization with machine learning
router.put('/:id/category', asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email ID is required' 
      });
    }
    
    if (!categoryId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Category ID is required' 
      });
    }
    
    const response = await emailServiceClient.put(`/${id}/category`, {
      categoryId
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to categorize email');
  }
}));

// Get comprehensive email statistics
router.get('/statistics', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.get('/statistics', {
      params: {
        timeRange: req.query.timeRange || '30d',
        includeCharts: req.query.includeCharts || 'true'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to get email statistics');
  }
}));

// Validate categorization accuracy
router.post('/validate', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.post('/validate', {
      sampleSize: req.body.sampleSize || 100,
      categories: req.body.categories || []
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to validate categorization');
  }
}));

// New route: Search emails across all folders
router.get('/search', asyncHandler(async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Search query is required' 
      });
    }
    
    const response = await emailServiceClient.get('/search', {
      params: {
        q,
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        folderId: req.query.folderId,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
      }
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to search emails');
  }
}));

// New route: Get email attachments
router.get('/:emailId/attachments', asyncHandler(async (req, res) => {
  try {
    const { emailId } = req.params;
    
    if (!emailId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email ID is required' 
      });
    }
    
    const response = await emailServiceClient.get(`/${emailId}/attachments`);
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to get email attachments');
  }
}));

// New route: Star/unstar email
router.patch('/:emailId/star', asyncHandler(async (req, res) => {
  try {
    const { emailId } = req.params;
    const { starred } = req.body;
    
    if (!emailId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email ID is required' 
      });
    }
    
    const response = await emailServiceClient.patch(`/${emailId}/star`, {
      starred: starred !== undefined ? starred : true
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to update email star status');
  }
}));

// New route: Delete emails
router.delete('/:emailId', asyncHandler(async (req, res) => {
  try {
    const { emailId } = req.params;
    
    if (!emailId) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Email ID is required' 
      });
    }
    
    const response = await emailServiceClient.delete(`/${emailId}`);
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to delete email');
  }
}));

// New route: Bulk operations on emails
router.post('/bulk', asyncHandler(async (req, res) => {
  try {
    const { operation, emailIds, data } = req.body;
    
    if (!operation || !emailIds || !Array.isArray(emailIds)) {
      return res.status(400).json({ 
        error: 'Bad Request', 
        message: 'Operation and email IDs array are required' 
      });
    }
    
    const response = await emailServiceClient.post('/bulk', {
      operation,
      emailIds,
      data
    });
    
    res.json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to perform bulk operation');
  }
}));

// New route: Export emails
router.post('/export', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.post('/export', req.body, {
      responseType: 'stream'
    });
    
    // Forward headers for file download
    res.set({
      'Content-Type': response.headers['content-type'],
      'Content-Disposition': response.headers['content-disposition']
    });
    
    response.data.pipe(res);
  } catch (error) {
    handleAxiosError(error, res, 'Failed to export emails');
  }
}));

// Health check endpoint for email service
router.get('/health', asyncHandler(async (req, res) => {
  try {
    const response = await emailServiceClient.get('/health');
    res.json({
      status: 'healthy',
      emailService: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Email service unavailable',
      timestamp: new Date().toISOString()
    });
  }
}));

// Error handling middleware for routes
router.use((error, req, res, next) => {
  console.error('Email Router Error:', {
    url: req.url,
    method: req.method,
    error: error.message,
    stack: error.stack
  });

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    requestId: req.headers['x-request-id'],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = router;
