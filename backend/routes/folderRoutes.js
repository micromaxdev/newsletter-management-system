// const express = require("express");
// const Folder = require('../models/folderModel');
// const router = express.Router();

// router.post("/create", async (req, res) => {
//   const { name } = req.body;
//   try {
//     const folder = await Folder.create({ name });
//     res.status(201).json(folder);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.get("/", async (req, res) => {
//   const folders = await Folder.find({});
//   res.json(folders);
// });

// module.exports = router;
const express = require('express');
const router = express.Router();

// Define folder structure
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

// Get all folders
router.get('/', async (req, res) => {
  try {
    res.json(FOLDER_STRUCTURE);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Get folder by ID
router.get('/:folderId', async (req, res) => {
  try {
    const { folderId } = req.params;
    
    // Find folder in structure
    const findFolder = (folders, id) => {
      for (const folder of folders) {
        if (folder._id === id) return folder;
        if (folder.children) {
          const found = findFolder(folder.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const folder = findFolder(FOLDER_STRUCTURE, folderId);
    
    if (folder) {
      res.json(folder);
    } else {
      res.status(404).json({ error: 'Folder not found' });
    }
  } catch (error) {
    console.error('Error fetching folder:', error);
    res.status(500).json({ error: 'Failed to fetch folder' });
  }
});

module.exports = router;