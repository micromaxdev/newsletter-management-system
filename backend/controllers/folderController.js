const asyncHandler = require('express-async-handler');

// Define folder structure - This should ideally come from a database or configuration,
// but for now, we'll keep it here as it's a static structure.
const FOLDER_STRUCTURE = [
  {
    _id: 'inbox',
    name: 'Inbox',
    children: [
      { _id: 'supplier', name: 'Supplier', children: [] },
      { _id: 'competitor', name: 'Competitor', children: [] },
      { _id: 'information', name: 'Information', children: [] },
      { _id: 'customers', name: 'Customers', children: [] },
      { _id: 'marketing', name: 'Marketing', children: [] }
    ]
  },
  {
    _id: 'archive',
    name: 'Archive',
    children: []
  }
];

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
  // In a real application, this might fetch from a database
  // For now, it returns the static FOLDER_STRUCTURE
  res.json(FOLDER_STRUCTURE);
});

/**
 * @desc Get folder by ID
 * @route GET /api/folders/:folderId
 * @access Public
 */
const getFolderById = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  const folder = findFolderInStructure(FOLDER_STRUCTURE, folderId);

  if (folder) {
    res.json(folder);
  } else {
    res.status(404).json({ error: 'Folder not found' });
  }
});

module.exports = {
  getAllFolders,
  getFolderById,
};
