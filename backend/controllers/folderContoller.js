// controllers/folderController.js
const asyncHandler = require("express-async-handler");
const FolderService = require("../services/folderService");

// @desc    Get all sender folders
// @route   GET /api/folders
// @access  Public
const getAllFolders = asyncHandler(async (req, res) => {
  const folders = await FolderService.getAllFolders();
  res.json(folders);
});

// @desc    Get folders grouped by domain
// @route   GET /api/folders/by-domain
// @access  Public
const getFoldersByDomain = asyncHandler(async (req, res) => {
  const foldersByDomain = await FolderService.getFoldersByDomain();
  res.json(foldersByDomain);
});

// @desc    Get emails from a specific folder
// @route   GET /api/folders/:folderName/emails
// @access  Public
const getEmailsByFolder = asyncHandler(async (req, res) => {
  const { folderName } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  const skip = parseInt(req.query.skip) || 0;
  
  const result = await FolderService.getEmailsByFolder(folderName, limit, skip);
  res.json(result);
});

// @desc    Search folders
// @route   GET /api/folders/search
// @access  Public
const searchFolders = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  const folders = await FolderService.searchFolders(q);
  res.json(folders);
});

// @desc    Get folder statistics
// @route   GET /api/folders/stats
// @access  Public
const getFolderStats = asyncHandler(async (req, res) => {
  const stats = await FolderService.getFolderStats();
  res.json(stats);
});

// @desc    Organize existing emails into folders
// @route   POST /api/folders/organize
// @access  Public
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