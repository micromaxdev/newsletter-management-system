const asyncHandler = require("express-async-handler");
const Folder = require("../models/folderModel");

// Define default folder structure
const DEFAULT_FOLDER_STRUCTURE = [
  {
    _id: "inbox",
    name: "Inbox",
    children: [
      { _id: "supplier", name: "Supplier", children: [] },
      { _id: "competitor", name: "Competitor", children: [] },
      { _id: "information", name: "Information", children: [] },
      { _id: "customers", name: "Customers", children: [] },
      { _id: "marketing", name: "Marketing", children: [] },
    ],
  },
  {
    _id: "archive",
    name: "Archive",
    children: [],
  },
];

// Initialize folders in database if they don't exist
const initializeFolders = async () => {
  try {
    // Check if we already have folders in the database
    const existingFolders = await Folder.find({});

    if (existingFolders.length === 0) {
      // If no folders exist, create the default structure
      await Folder.insertMany(DEFAULT_FOLDER_STRUCTURE);
    }
  } catch (error) {
    console.error("Error initializing folders:", error);
    throw error;
  }
};

// Utility function to find a folder by ID recursively
const findFolderInStructure = (folders, id) => {
  for (const folder of folders) {
    if (folder._id === id) return folder;
    if (folder.children) {
      const found = findFolderInStructure(folder.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * @desc Get all folders
 * @route GET /api/folders
 * @access Public
 */
const getAllFolders = asyncHandler(async (req, res) => {
  // Initialize folders if needed
  await initializeFolders();
  console.log("Fetching all folders..."); // Debug log

  // Fetch all folders from database
  const folders = await Folder.find({});
  res.json(folders);
});

/**
 * @desc Get folder by ID
 * @route GET /api/folders/:folderId
 * @access Public
 */
const getFolderById = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  const folder = await Folder.findOne({ _id: folderId });

  if (folder) {
    res.json(folder);
  } else {
    res.status(404).json({ error: "Folder not found" });
  }
});

module.exports = {
  getAllFolders,
  getFolderById,
};
