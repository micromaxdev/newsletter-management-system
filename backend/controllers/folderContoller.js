// // controllers/folderController.js
// const asyncHandler = require("express-async-handler");
// const FolderService = require("../services/folderService");

// const getAllFolders = asyncHandler(async (req, res) => {
//   const folders = await FolderService.getAllFolders();
//   res.json(folders);
// });

// const getFoldersByDomain = asyncHandler(async (req, res) => {
//   const foldersByDomain = await FolderService.getFoldersByDomain();
//   res.json(foldersByDomain);
// });

// const getEmailsByFolder = asyncHandler(async (req, res) => {
//   const { folderName } = req.params;
//   const limit = parseInt(req.query.limit) || 20;
//   const skip = parseInt(req.query.skip) || 0;
  
//   const result = await FolderService.getEmailsByFolder(folderName, limit, skip);
//   res.json(result);
// });

// const searchFolders = asyncHandler(async (req, res) => {
//   const { q } = req.query;
  
//   if (!q) {
//     res.status(400);
//     throw new Error('Search query is required');
//   }
  
//   const folders = await FolderService.searchFolders(q);
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
//     ...result
//   });
// });

// module.exports = {
//   getAllFolders,
//   getFoldersByDomain,
//   getEmailsByFolder,
//   searchFolders,
//   getFolderStats,
//   organizeExistingEmails,
// };

// controllers/folderController.js
const asyncHandler = require("express-async-handler");
const axios = require('axios');

// Configure axios instance for external API calls
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = process.env.API_TOKEN || process.env.FOLDER_API_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Folder API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Alternative: Direct database service calls with axios for microservices
const folderServiceClient = axios.create({
  baseURL: process.env.FOLDER_SERVICE_URL || 'http://localhost:3001/api/folders',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const getAllFolders = asyncHandler(async (req, res) => {
  try {
    // Option 1: Call external folder service via axios
    const response = await folderServiceClient.get('/');
    const folders = response.data;
    
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'Folders not found' });
    } else if (error.response?.status === 500) {
      res.status(500).json({ message: 'Folder service error' });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({ message: 'Folder service unavailable' });
    } else {
      res.status(500).json({ message: 'Failed to fetch folders', error: error.message });
    }
  }
});

const getFoldersByDomain = asyncHandler(async (req, res) => {
  try {
    // Call folder service to get folders grouped by domain
    const response = await folderServiceClient.get('/by-domain');
    const foldersByDomain = response.data;
    
    res.json(foldersByDomain);
  } catch (error) {
    console.error('Error fetching folders by domain:', error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'No folders found for domains' });
    } else {
      res.status(500).json({ message: 'Failed to fetch folders by domain', error: error.message });
    }
  }
});

const getEmailsByFolder = asyncHandler(async (req, res) => {
  const { folderName } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  const skip = parseInt(req.query.skip) || 0;
  
  try {
    // Validate folderName
    if (!folderName || folderName.trim() === '') {
      return res.status(400).json({ message: 'Folder name is required' });
    }
    
    // Call folder service to get emails for specific folder
    const response = await folderServiceClient.get(`/${encodeURIComponent(folderName)}/emails`, {
      params: {
        limit,
        skip
      }
    });
    
    const result = response.data;
    res.json(result);
  } catch (error) {
    console.error(`Error fetching emails for folder ${folderName}:`, error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ message: `Folder '${folderName}' not found` });
    } else if (error.response?.status === 400) {
      res.status(400).json({ message: 'Invalid folder parameters' });
    } else {
      res.status(500).json({ message: 'Failed to fetch emails from folder', error: error.message });
    }
  }
});

const searchFolders = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  try {
    // Call folder service search endpoint
    const response = await folderServiceClient.get('/search', {
      params: {
        q: q.trim()
      }
    });
    
    const folders = response.data;
    res.json(folders);
  } catch (error) {
    console.error('Error searching folders:', error.message);
    
    if (error.response?.status === 400) {
      res.status(400).json({ message: 'Invalid search query' });
    } else if (error.response?.status === 404) {
      res.status(404).json({ message: 'No folders found matching search criteria' });
    } else {
      res.status(500).json({ message: 'Failed to search folders', error: error.message });
    }
  }
});

const getFolderStats = asyncHandler(async (req, res) => {
  try {
    // Call folder service stats endpoint
    const response = await folderServiceClient.get('/stats');
    const stats = response.data;
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching folder stats:', error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'No folder statistics available' });
    } else {
      res.status(500).json({ message: 'Failed to fetch folder statistics', error: error.message });
    }
  }
});

const organizeExistingEmails = asyncHandler(async (req, res) => {
  try {
    // Call folder service to organize existing emails
    const response = await folderServiceClient.post('/organize', {
      // Optional parameters can be passed in request body
      ...req.body
    });
    
    const result = response.data;
    
    res.json({
      message: 'Emails organized successfully',
      ...result
    });
  } catch (error) {
    console.error('Error organizing emails:', error.message);
    
    if (error.response?.status === 409) {
      res.status(409).json({ message: 'Organization already in progress' });
    } else if (error.response?.status === 422) {
      res.status(422).json({ message: 'Invalid organization parameters' });
    } else {
      res.status(500).json({ message: 'Failed to organize emails', error: error.message });
    }
  }
});

// New function: Create folder via API
const createFolder = asyncHandler(async (req, res) => {
  const { name, description, rules } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Folder name is required' });
  }
  
  try {
    const response = await folderServiceClient.post('/', {
      name: name.trim(),
      description: description?.trim(),
      rules: rules || []
    });
    
    const newFolder = response.data;
    res.status(201).json({
      message: 'Folder created successfully',
      folder: newFolder
    });
  } catch (error) {
    console.error('Error creating folder:', error.message);
    
    if (error.response?.status === 409) {
      res.status(409).json({ message: 'Folder already exists' });
    } else if (error.response?.status === 400) {
      res.status(400).json({ message: 'Invalid folder data' });
    } else {
      res.status(500).json({ message: 'Failed to create folder', error: error.message });
    }
  }
});

// New function: Update folder via API
const updateFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const updateData = req.body;
  
  if (!folderId) {
    return res.status(400).json({ message: 'Folder ID is required' });
  }
  
  try {
    const response = await folderServiceClient.put(`/${folderId}`, updateData);
    const updatedFolder = response.data;
    
    res.json({
      message: 'Folder updated successfully',
      folder: updatedFolder
    });
  } catch (error) {
    console.error(`Error updating folder ${folderId}:`, error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'Folder not found' });
    } else if (error.response?.status === 400) {
      res.status(400).json({ message: 'Invalid update data' });
    } else {
      res.status(500).json({ message: 'Failed to update folder', error: error.message });
    }
  }
});

// New function: Delete folder via API
const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  
  if (!folderId) {
    return res.status(400).json({ message: 'Folder ID is required' });
  }
  
  try {
    await folderServiceClient.delete(`/${folderId}`);
    
    res.json({
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting folder ${folderId}:`, error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'Folder not found' });
    } else if (error.response?.status === 409) {
      res.status(409).json({ message: 'Cannot delete folder with existing emails' });
    } else {
      res.status(500).json({ message: 'Failed to delete folder', error: error.message });
    }
  }
});

// New function: Sync folders with external service
const syncFolders = asyncHandler(async (req, res) => {
  try {
    // Call external email service to sync folder structure
    const emailServiceResponse = await apiClient.get('/folders/sync', {
      baseURL: process.env.EMAIL_SERVICE_URL || 'https://api.gmail.com/gmail/v1',
      headers: {
        'Authorization': `Bearer ${process.env.GMAIL_ACCESS_TOKEN}`
      }
    });
    
    const externalFolders = emailServiceResponse.data.labels || [];
    
    // Send synced folders to folder service
    const syncResponse = await folderServiceClient.post('/sync', {
      externalFolders
    });
    
    res.json({
      message: 'Folders synced successfully',
      syncedCount: syncResponse.data.syncedCount,
      newFolders: syncResponse.data.newFolders
    });
  } catch (error) {
    console.error('Error syncing folders:', error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({ message: 'Authentication failed with email service' });
    } else {
      res.status(500).json({ message: 'Failed to sync folders', error: error.message });
    }
  }
});

// New function: Get folder analytics via API
const getFolderAnalytics = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const { timeRange = '30d' } = req.query;
  
  try {
    const response = await folderServiceClient.get(`/${folderId}/analytics`, {
      params: {
        timeRange
      }
    });
    
    const analytics = response.data;
    res.json(analytics);
  } catch (error) {
    console.error(`Error fetching analytics for folder ${folderId}:`, error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'Folder not found' });
    } else {
      res.status(500).json({ message: 'Failed to fetch folder analytics', error: error.message });
    }
  }
});

// New function: Bulk folder operations
const bulkFolderOperations = asyncHandler(async (req, res) => {
  const { operation, folderIds, data } = req.body;
  
  if (!operation || !folderIds || !Array.isArray(folderIds)) {
    return res.status(400).json({ message: 'Operation and folder IDs are required' });
  }
  
  try {
    const response = await folderServiceClient.post('/bulk', {
      operation,
      folderIds,
      data
    });
    
    const result = response.data;
    res.json({
      message: `Bulk ${operation} completed successfully`,
      ...result
    });
  } catch (error) {
    console.error('Error performing bulk folder operation:', error.message);
    
    if (error.response?.status === 400) {
      res.status(400).json({ message: 'Invalid bulk operation parameters' });
    } else {
      res.status(500).json({ message: 'Failed to perform bulk operation', error: error.message });
    }
  }
});

module.exports = {
  getAllFolders,
  getFoldersByDomain,
  getEmailsByFolder,
  searchFolders,
  getFolderStats,
  organizeExistingEmails,
  createFolder,
  updateFolder,
  deleteFolder,
  syncFolders,
  getFolderAnalytics,
  bulkFolderOperations,
};