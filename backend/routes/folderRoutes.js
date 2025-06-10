// routes/folderRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllFolders,
  getFoldersByDomain,
  getEmailsByFolder,
  searchFolders,
  getFolderStats,
  organizeExistingEmails,
} = require("../controllers/folderController");

// Get all sender folders
router.get("/", getAllFolders);

// Get folders grouped by domain
router.get("/by-domain", getFoldersByDomain);

// Search folders
router.get("/search", searchFolders);

// Get folder statistics
router.get("/stats", getFolderStats);

// Get emails from a specific folder
router.get("/:folderName/emails", getEmailsByFolder);

// Organize existing emails into folders (migration utility)
router.post("/organize", organizeExistingEmails);

module.exports = router;