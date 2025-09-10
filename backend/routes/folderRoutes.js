const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler'); // For consistent error handling

const { protect } = require('../middleware/authMiddleware');

// Import controller functions
const {
  getAllFolders,
  getFolderById,
} = require('../controllers/folderController');

// Protect all routes in this file
router.use(protect);

// Get all folders
router.get('/', asyncHandler(getAllFolders));

// Get folder by ID
router.get('/:folderId', asyncHandler(getFolderById));

module.exports = router;
