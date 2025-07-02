// controllers/folderController.js
const asyncHandler = require("express-async-handler");
const FolderService = require("../services/folderService");

const getAllFolders = asyncHandler(async (req, res) => {
  const folders = await FolderService.getAllFolders();
  res.json(folders);
});

const getFoldersByDomain = asyncHandler(async (req, res) => {
  const foldersByDomain = await FolderService.getFoldersByDomain();
  res.json(foldersByDomain);
});

const getEmailsByFolder = asyncHandler(async (req, res) => {
  const { folderName } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  const skip = parseInt(req.query.skip) || 0;
  
  const result = await FolderService.getEmailsByFolder(folderName, limit, skip);
  res.json(result);
});

const searchFolders = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  const folders = await FolderService.searchFolders(q);
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
    ...result
  });
});

module.exports = {
  getAllFolders,
  getFoldersByDomain,
  getEmailsByFolder,
  searchFolders,
  getFolderStats,
  organizeExistingEmails,
};
