const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler'); // For consistent error handling

// Import controller functions
const {
  getAllFolders,
  getFolderById,
} = require('../controllers/folderController');

// Get all folders
router.get('/', asyncHandler(getAllFolders));

// Get folder by ID
router.get('/:folderId', asyncHandler(getFolderById));

module.exports = router;
