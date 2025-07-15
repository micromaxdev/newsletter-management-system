const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler'); // Keep asyncHandler for consistency

// Import all functions from the new emailController
const {
  getEmails,
  getSavedEmails,
  getUnreadCount,
  getUnreadCounts,
  getEmailCounts,
  markEmailAsRead,
  markEmailAsUnread,
  bulkMarkEmailsAsRead,
  moveEmailToFolder,
  recategorizeEmails,
  getEmailsByFolder,
  manualCategorization,
  getEmailStatistics,
  validateCategorization,
} = require('../controllers/emailController');

// --- Email API Routes ---

// Fetch emails from POP3 server (and save/categorize)
router.get('/', asyncHandler(getEmails));

// Get saved emails from DB (with optional folder, search, pagination, and unread filter)
router.get('/saved', asyncHandler(getSavedEmails));

// Get unread count for a specific folder or all emails (can be deprecated by /unread-counts)
router.get('/unread-count', asyncHandler(getUnreadCount));

// Get unread counts for all folders (more comprehensive)
router.get('/unread-counts', asyncHandler(getUnreadCounts));

// Get email counts per folder (includes unread counts for each)
router.get('/counts', asyncHandler(getEmailCounts));

// Mark email as read
router.put('/:emailId/read', asyncHandler(markEmailAsRead));

// Mark email as unread
router.patch('/:emailId/unread', asyncHandler(markEmailAsUnread));

// Bulk mark emails as read
router.patch('/bulk-read', asyncHandler(bulkMarkEmailsAsRead));

// Move email to different folder, save sender preference, and re-categorize past emails
router.put('/:emailId/folder', asyncHandler(moveEmailToFolder));

// Enhanced recategorization with detailed reporting
router.post('/recategorize', asyncHandler(recategorizeEmails));

// Get emails by folder with pagination and filtering
router.get('/folders/:folderId', asyncHandler(getEmailsByFolder));

// Manual categorization with learning
router.put('/:id/category', asyncHandler(manualCategorization));

// Get detailed email statistics
router.get('/statistics', asyncHandler(getEmailStatistics));

// Validate categorization accuracy
router.post('/validate', asyncHandler(validateCategorization));

// Error handling middleware (still useful here for route-specific errors)
router.use((error, req, res, next) => {
  console.error(' Router Error:', error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = router;
