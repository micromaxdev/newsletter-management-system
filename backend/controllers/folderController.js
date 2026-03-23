// const asyncHandler = require('express-async-handler');
// const FolderService = require('../services/folderService');

// const getAllFolders = asyncHandler(async (req, res) => {
//   const folders = await FolderService.getAllFolders();
//   res.json(folders);
// });

// const getFolderById = asyncHandler(async (req, res) => {
//   const { folderId } = req.params;
//   const folder = await FolderService.getFolderById(folderId);

//   if (!folder) {
//     res.status(404);
//     throw new Error('Folder not found');
//   }

//   res.json(folder);
// });

// const getSubfolders = asyncHandler(async (req, res) => {
//   const { folderId } = req.params;
//   const subfolders = await FolderService.getSubfolders(folderId);
//   res.json(subfolders);
// });

// const getFoldersByDomain = asyncHandler(async (req, res) => {
//   const foldersByDomain = await FolderService.getFoldersByDomain();
//   res.json(foldersByDomain);
// });

// const getEmailsByFolder = asyncHandler(async (req, res) => {
//   const { folderId } = req.params;
//   const limit = parseInt(req.query.limit, 10) || 20;
//   const skip = parseInt(req.query.skip, 10) || 0;

//   const result = await FolderService.getEmailsByFolder(folderId, limit, skip);
//   res.json(result);
// });

// const getAllEmails = asyncHandler(async (req, res) => {
//   const limit = parseInt(req.query.limit, 10) || 20;
//   const skip = parseInt(req.query.skip, 10) || 0;

//   const result = await FolderService.getAllEmails(limit, skip);
//   res.json(result);
// });

// const searchFolders = asyncHandler(async (req, res) => {
//   const { q } = req.query;

//   if (!q || !q.trim()) {
//     res.status(400);
//     throw new Error('Search query is required');
//   }

//   const folders = await FolderService.searchFolders(q.trim());
//   res.json(folders);
// });

// const getFolderStats = asyncHandler(async (req, res) => {
//   const stats = await FolderService.getFolderStats();
//   res.json(stats);
// });

// const organizeExistingEmails = asyncHandler(async (req, res) => {
//   const result = await FolderService.organizeExistingEmails();

//   res.json({
//     message: 'Emails organized successfully',
//     ...result,
//   });
// });

// const createFolder = asyncHandler(async (req, res) => {
//   const folder = await FolderService.createFolder(req.body);
//   res.status(201).json(folder);
// });

// const createSubfolder = asyncHandler(async (req, res) => {
//   const { folderId } = req.params;
//   const subfolder = await FolderService.createSubfolder(folderId, req.body);
//   res.status(201).json(subfolder);
// });

// const updateFolder = asyncHandler(async (req, res) => {
//   const { folderId } = req.params;
//   const folder = await FolderService.updateFolder(folderId, req.body);
//   res.json(folder);
// });

// const deleteFolder = asyncHandler(async (req, res) => {
//   const { folderId } = req.params;
//   const result = await FolderService.deleteFolder(folderId);
//   res.json(result);
// });

// module.exports = {
//   getAllFolders,
//   getFolderById,
//   getSubfolders,
//   getFoldersByDomain,
//   getEmailsByFolder,
//   getAllEmails,
//   searchFolders,
//   getFolderStats,
//   organizeExistingEmails,
//   createFolder,
//   createSubfolder,
//   updateFolder,
//   deleteFolder,
// };

const asyncHandler = require('express-async-handler');
const FolderService = require('../services/folderService');

const getAllFolders = asyncHandler(async (req, res) => {
  const folders = await FolderService.getAllFolders();
  res.json(folders);
});

const getFolderById = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const folder = await FolderService.getFolderById(folderId);

  if (!folder) {
    res.status(404);
    throw new Error('Folder not found');
  }

  res.json(folder);
});

const getSubfolders = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const subfolders = await FolderService.getSubfolders(folderId);
  res.json(subfolders);
});

const getFoldersByDomain = asyncHandler(async (req, res) => {
  const foldersByDomain = await FolderService.getFoldersByDomain();
  res.json(foldersByDomain);
});

const getEmailsByFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = parseInt(req.query.skip, 10) || 0;

  const result = await FolderService.getEmailsByFolder(folderId, limit, skip);
  res.json(result);
});

const getAllEmails = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = parseInt(req.query.skip, 10) || 0;

  const result = await FolderService.getAllEmails(limit, skip);
  res.json(result);
});

const searchFolders = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || !q.trim()) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const folders = await FolderService.searchFolders(q.trim());
  res.json(folders);
});

const getFolderStats = asyncHandler(async (req, res) => {
  const stats = await FolderService.getFolderStats();
  res.json(stats);
});

const organizeExistingEmails = asyncHandler(async (req, res) => {
  const result = await FolderService.organizeExistingEmails();

  res.json({
    message: 'Emails organized successfully',
    ...result,
  });
});

const createFolder = asyncHandler(async (req, res) => {
  const folder = await FolderService.createFolder(req.body);
  res.status(201).json(folder);
});

const createSubfolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const subfolder = await FolderService.createSubfolder(folderId, req.body);
  res.status(201).json(subfolder);
});

const updateFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const folder = await FolderService.updateFolder(folderId, req.body);
  res.json(folder);
});

const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const result = await FolderService.deleteFolder(folderId);
  res.json(result);
});

module.exports = {
  getAllFolders,
  getFolderById,
  getSubfolders,
  getFoldersByDomain,
  getEmailsByFolder,
  getAllEmails,
  searchFolders,
  getFolderStats,
  organizeExistingEmails,
  createFolder,
  createSubfolder,
  updateFolder,
  deleteFolder,
};