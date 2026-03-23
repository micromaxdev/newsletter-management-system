const Folder = require('../models/folderModel');

const DEFAULT_FOLDERS = [
  {
    folderId: 'uncategorised',
    name: 'Uncategorised Email',
    icon: 'inbox',
    system: true,
    parentFolderId: null,
  },
  {
    folderId: 'suppliers',
    name: 'Suppliers',
    icon: 'truck',
    system: true,
    parentFolderId: null,
  },
  {
    folderId: 'competitors',
    name: 'Competitors',
    icon: 'briefcase',
    system: true,
    parentFolderId: null,
  },
  {
    folderId: 'customers',
    name: 'Customers',
    icon: 'users',
    system: true,
    parentFolderId: null,
  },
  {
    folderId: 'archive',
    name: 'Archive',
    icon: 'archive',
    system: true,
    parentFolderId: null,
  },
];

const initializeDefaultFolders = async () => {
  try {
    for (const folder of DEFAULT_FOLDERS) {
      await Folder.updateOne(
        { folderId: folder.folderId },
        { $setOnInsert: folder },
        { upsert: true }
      );
    }

    console.log('[SYSTEM] Default folders checked/created successfully');
  } catch (error) {
    console.error('[SYSTEM] Error initializing default folders:', error.message);
  }
};

module.exports = {
  DEFAULT_FOLDERS,
  initializeDefaultFolders,
};