// const express = require('express');
// const router = express.Router();
// const asyncHandler = require('express-async-handler'); // For consistent error handling

// const { protect } = require('../middleware/authMiddleware');

// // Import controller functions
// const {
//   getAllFolders,
//   getFolderById,
// } = require('../controllers/folderController');

// // Protect all routes in this file
// router.use(protect);

// // Get all folders
// router.get('/', asyncHandler(getAllFolders));

// // Get folder by ID
// router.get('/:folderId', asyncHandler(getFolderById));

// module.exports = router;
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const folderController = require('../controllers/folderController');

router.use(protect);

router.get('/', folderController.getAllFolders);
router.get('/search', folderController.searchFolders);
router.get('/stats', folderController.getFolderStats);
router.get('/domains', folderController.getFoldersByDomain);
router.get('/all-emails', folderController.getAllEmails);
router.post('/organize', folderController.organizeExistingEmails);

router.post('/', folderController.createFolder);

router.get('/:folderId/subfolders', folderController.getSubfolders);
router.post('/:folderId/subfolders', folderController.createSubfolder);

router.put('/:folderId', folderController.updateFolder);
router.delete('/:folderId', folderController.deleteFolder);

router.get('/:folderId/emails', folderController.getEmailsByFolder);
router.get('/:folderId', folderController.getFolderById);

module.exports = router;