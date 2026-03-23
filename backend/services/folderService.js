// const Folder = require('../models/folderModel');
// const Email = require('../models/emailModel');
// const SenderPreference = require('../models/senderPreferenceModel');
// const EmailCategorizationService = require('./emailCategorizationService');

// class FolderService {
//   static getFolderOrder() {
//     return [
//       'uncategorised',
//       'suppliers',
//       'competitors',
//       'customers',
//       'archive',
//     ];
//   }

//   static escapeRegex(text) {
//     return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   }

//   static generateFolderId(name) {
//     return String(name)
//       .toLowerCase()
//       .trim()
//       .replace(/&/g, ' and ')
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-')
//       .replace(/^-|-$/g, '');
//   }

//   static buildFolderTree(folders) {
//     const folderMap = new Map();
//     const roots = [];
//     const folderOrder = this.getFolderOrder();

//     for (const folder of folders) {
//       folderMap.set(folder.folderId, {
//         ...folder,
//         children: [],
//       });
//     }

//     for (const folder of folders) {
//       const currentFolder = folderMap.get(folder.folderId);

//       if (folder.parentFolderId && folderMap.has(folder.parentFolderId)) {
//         folderMap.get(folder.parentFolderId).children.push(currentFolder);
//       } else {
//         roots.push(currentFolder);
//       }
//     }

//     const sortTree = (items) => {
//       items.sort((a, b) => {
//         const aIndex = folderOrder.indexOf(a.folderId);
//         const bIndex = folderOrder.indexOf(b.folderId);

//         const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
//         const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

//         if (safeA !== safeB) return safeA - safeB;

//         return a.name.localeCompare(b.name);
//       });

//       items.forEach((item) => sortTree(item.children));
//     };

//     sortTree(roots);

//     return roots;
//   }

//   static async getAllFolders() {
//     const folders = await Folder.find().sort({ createdAt: 1 }).lean();
//     return this.buildFolderTree(folders);
//   }

//   static async getFolderById(folderId) {
//     const normalizedFolderId = String(folderId).toLowerCase().trim();

//     const folder = await Folder.findOne({ folderId: normalizedFolderId }).lean();

//     if (!folder) return null;

//     const subfolders = await Folder.find({
//       parentFolderId: normalizedFolderId,
//     })
//       .sort({ name: 1 })
//       .lean();

//     return {
//       ...folder,
//       children: subfolders,
//     };
//   }

//   static async getSubfolders(parentFolderId) {
//     const normalizedParentFolderId = String(parentFolderId).toLowerCase().trim();

//     return Folder.find({ parentFolderId: normalizedParentFolderId })
//       .sort({ name: 1 })
//       .lean();
//   }

//   static async getFoldersByDomain() {
//     const emails = await Email.find(
//       { 'from.address': { $exists: true, $ne: '' } },
//       { 'from.address': 1, folderId: 1 }
//     ).lean();

//     const foldersByDomain = {};

//     for (const email of emails) {
//       const address = email?.from?.address || '';
//       const domain = address.includes('@')
//         ? address.split('@')[1].toLowerCase()
//         : 'unknown';

//       if (!foldersByDomain[domain]) {
//         foldersByDomain[domain] = [];
//       }

//       foldersByDomain[domain].push({
//         address,
//         folderId: email.folderId || 'uncategorised',
//       });
//     }

//     return foldersByDomain;
//   }

//   static async getEmailsByFolder(folderId, limit = 20, skip = 0) {
//     const normalizedFolderId = String(folderId).toLowerCase().trim();

//     const [emails, total] = await Promise.all([
//       Email.find({ folderId: normalizedFolderId })
//         .sort({ date: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Email.countDocuments({ folderId: normalizedFolderId }),
//     ]);

//     return {
//       folderId: normalizedFolderId,
//       total,
//       limit,
//       skip,
//       emails,
//     };
//   }

//   static async getAllEmails(limit = 20, skip = 0) {
//     const [emails, total] = await Promise.all([
//       Email.find()
//         .sort({ date: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Email.countDocuments(),
//     ]);

//     return {
//       total,
//       limit,
//       skip,
//       emails,
//     };
//   }

//   static async searchFolders(query) {
//     const safeQuery = this.escapeRegex(query);

//     return Folder.find({
//       $or: [
//         { name: { $regex: safeQuery, $options: 'i' } },
//         { folderId: { $regex: safeQuery, $options: 'i' } },
//       ],
//     })
//       .sort({ name: 1 })
//       .lean();
//   }

//   static async getFolderStats() {
//     const folders = await Folder.find().lean();

//     const folderStats = await Promise.all(
//       folders.map(async (folder) => {
//         const totalEmails = await Email.countDocuments({
//           folderId: folder.folderId,
//         });

//         const unreadEmails = await Email.countDocuments({
//           folderId: folder.folderId,
//           isRead: false,
//         });

//         return {
//           folderId: folder.folderId,
//           name: folder.name,
//           icon: folder.icon,
//           system: folder.system,
//           parentFolderId: folder.parentFolderId,
//           totalEmails,
//           unreadEmails,
//         };
//       })
//     );

//     const allEmails = await Email.countDocuments();
//     const unreadEmails = await Email.countDocuments({ isRead: false });

//     return {
//       allEmails,
//       unreadEmails,
//       folders: folderStats,
//     };
//   }

//   static async organizeExistingEmails() {
//     const emailCategorizationService = new EmailCategorizationService();

//     const preferences = await SenderPreference.find({
//       senderAddress: { $ne: null },
//       folderId: { $ne: null },
//     }).lean();

//     const senderPreferences = {};
//     for (const pref of preferences) {
//       senderPreferences[pref.senderAddress] = pref.folderId;
//     }

//     const emails = await Email.find();
//     let updated = 0;

//     for (const email of emails) {
//       const newFolderId = emailCategorizationService.categorizeEmail(
//         email,
//         senderPreferences
//       );

//       if (email.folderId !== newFolderId) {
//         email.folderId = newFolderId;
//         await email.save();
//         updated++;
//       }
//     }

//     return {
//       total: emails.length,
//       updated,
//     };
//   }

//   static async createFolder(data) {
//     const name = data?.name?.trim();
//     const icon = data?.icon?.trim() || 'folder';
//     const parentFolderId = data?.parentFolderId
//       ? String(data.parentFolderId).toLowerCase().trim()
//       : null;

//     if (!name) {
//       throw new Error('Folder name is required');
//     }

//     if (parentFolderId) {
//       const parentFolder = await Folder.findOne({ folderId: parentFolderId });
//       if (!parentFolder) {
//         throw new Error('Parent folder not found');
//       }
//     }

//     const baseFolderId = this.generateFolderId(name);

//     if (!baseFolderId) {
//       throw new Error('Invalid folder name');
//     }

//     const folderId = parentFolderId
//       ? `${parentFolderId}-${baseFolderId}`
//       : baseFolderId;

//     const existingFolder = await Folder.findOne({ folderId });
//     if (existingFolder) {
//       throw new Error('Folder already exists');
//     }

//     const folder = await Folder.create({
//       folderId,
//       name,
//       icon,
//       system: false,
//       parentFolderId,
//     });

//     return folder;
//   }

//   static async createSubfolder(parentFolderId, data) {
//     return this.createFolder({
//       ...data,
//       parentFolderId,
//     });
//   }

//   static async updateFolder(folderId, data) {
//     const normalizedFolderId = String(folderId).toLowerCase().trim();

//     const folder = await Folder.findOne({ folderId: normalizedFolderId });

//     if (!folder) {
//       throw new Error('Folder not found');
//     }

//     if (folder.system) {
//       throw new Error('Default folders cannot be edited');
//     }

//     const newName = data?.name?.trim();
//     const newIcon = data?.icon?.trim();
//     const oldFolderId = folder.folderId;

//     if (!newName && !newIcon) {
//       throw new Error('Nothing to update');
//     }

//     if (newName) {
//       const newBaseFolderId = this.generateFolderId(newName);

//       if (!newBaseFolderId) {
//         throw new Error('Invalid folder name');
//       }

//       const newFolderId = folder.parentFolderId
//         ? `${folder.parentFolderId}-${newBaseFolderId}`
//         : newBaseFolderId;

//       const existingFolder = await Folder.findOne({
//         _id: { $ne: folder._id },
//         folderId: newFolderId,
//       });

//       if (existingFolder) {
//         throw new Error('Another folder with this name already exists');
//       }

//       folder.name = newName;
//       folder.folderId = newFolderId;
//     }

//     if (newIcon) {
//       folder.icon = newIcon;
//     }

//     await folder.save();

//     if (oldFolderId !== folder.folderId) {
//       await Promise.all([
//         Email.updateMany(
//           { folderId: oldFolderId },
//           { $set: { folderId: folder.folderId } }
//         ),
//         SenderPreference.updateMany(
//           { folderId: oldFolderId },
//           { $set: { folderId: folder.folderId } }
//         ),
//         Folder.updateMany(
//           { parentFolderId: oldFolderId },
//           { $set: { parentFolderId: folder.folderId } }
//         ),
//       ]);
//     }

//     return folder;
//   }

//   static async deleteFolder(folderId) {
//     const normalizedFolderId = String(folderId).toLowerCase().trim();

//     const folder = await Folder.findOne({ folderId: normalizedFolderId });

//     if (!folder) {
//       throw new Error('Folder not found');
//     }

//     if (folder.system) {
//       throw new Error('Default folders cannot be deleted');
//     }

//     const subfolders = await Folder.find({
//       parentFolderId: normalizedFolderId,
//     });

//     if (subfolders.length > 0) {
//       throw new Error(
//         'Cannot delete folder with subfolders. Delete subfolders first.'
//       );
//     }

//     const fallbackFolderId = folder.parentFolderId || 'uncategorised';

//     await Promise.all([
//       Email.updateMany(
//         { folderId: normalizedFolderId },
//         { $set: { folderId: fallbackFolderId } }
//       ),
//       SenderPreference.updateMany(
//         { folderId: normalizedFolderId },
//         { $set: { folderId: fallbackFolderId } }
//       ),
//     ]);

//     await Folder.deleteOne({ _id: folder._id });

//     return {
//       message: 'Folder deleted successfully',
//       movedTo: fallbackFolderId,
//     };
//   }
// }

// module.exports = FolderService;

const Folder = require('../models/folderModel');
const Email = require('../models/emailModel');
const SenderPreference = require('../models/senderPreferenceModel');
const EmailCategorizationService = require('./emailCategorizationService');

class FolderService {
  static getFolderOrder() {
    return [
      'uncategorised',
      'suppliers',
      'competitors',
      'customers',
      'archive',
    ];
  }

  static escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  static generateFolderId(name) {
    return String(name)
      .toLowerCase()
      .trim()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static buildFolderTree(folders) {
    const folderMap = new Map();
    const roots = [];
    const folderOrder = this.getFolderOrder();

    for (const folder of folders) {
      folderMap.set(folder.folderId, {
        ...folder,
        children: [],
      });
    }

    for (const folder of folders) {
      const currentFolder = folderMap.get(folder.folderId);

      if (folder.parentFolderId && folderMap.has(folder.parentFolderId)) {
        folderMap.get(folder.parentFolderId).children.push(currentFolder);
      } else {
        roots.push(currentFolder);
      }
    }

    const sortTree = (items) => {
      items.sort((a, b) => {
        const aIndex = folderOrder.indexOf(a.folderId);
        const bIndex = folderOrder.indexOf(b.folderId);

        const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
        const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

        if (safeA !== safeB) return safeA - safeB;
        return (a.name || '').localeCompare(b.name || '');
      });

      items.forEach((item) => sortTree(item.children));
    };

    sortTree(roots);

    return roots;
  }

  static async getAllFolders() {
    const folders = await Folder.find().sort({ createdAt: 1 }).lean();
    return this.buildFolderTree(folders);
  }

  static async getFolderById(folderId) {
    const normalizedFolderId = String(folderId).toLowerCase().trim();

    const folder = await Folder.findOne({ folderId: normalizedFolderId }).lean();
    if (!folder) return null;

    const subfolders = await Folder.find({
      parentFolderId: normalizedFolderId,
    })
      .sort({ name: 1 })
      .lean();

    return {
      ...folder,
      children: subfolders,
    };
  }

  static async getSubfolders(parentFolderId) {
    const normalizedParentFolderId = String(parentFolderId).toLowerCase().trim();

    return Folder.find({ parentFolderId: normalizedParentFolderId })
      .sort({ name: 1 })
      .lean();
  }

  static async getEmailsByFolder(folderId, limit = 20, skip = 0) {
    const normalizedFolderId = String(folderId).toLowerCase().trim();

    const folder = await Folder.findOne({ folderId: normalizedFolderId }).lean();

    if (!folder) {
      throw new Error('Folder not found');
    }

    const subfolders = await Folder.find({
      parentFolderId: normalizedFolderId,
    }).lean();

    const folderIds = [
      normalizedFolderId,
      ...subfolders.map((subfolder) => subfolder.folderId),
    ];

    const [emails, total] = await Promise.all([
      Email.find({ folderId: { $in: folderIds } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Email.countDocuments({ folderId: { $in: folderIds } }),
    ]);

    return {
      folderId: normalizedFolderId,
      total,
      limit,
      skip,
      folderIds,
      subfolders,
      emails,
    };
  }

  static async getAllEmails(limit = 20, skip = 0) {
    const [emails, total] = await Promise.all([
      Email.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Email.countDocuments(),
    ]);

    return {
      total,
      limit,
      skip,
      emails,
    };
  }

  static async searchFolders(query) {
    const safeQuery = this.escapeRegex(query);

    return Folder.find({
      $or: [
        { name: { $regex: safeQuery, $options: 'i' } },
        { folderId: { $regex: safeQuery, $options: 'i' } },
      ],
    })
      .sort({ name: 1 })
      .lean();
  }

  static async getFolderStats() {
    const folders = await Folder.find().lean();

    const folderStats = await Promise.all(
      folders.map(async (folder) => {
        const totalEmails = await Email.countDocuments({
          folderId: folder.folderId,
        });

        const unreadEmails = await Email.countDocuments({
          folderId: folder.folderId,
          isRead: false,
        });

        return {
          folderId: folder.folderId,
          name: folder.name,
          icon: folder.icon,
          system: folder.system,
          parentFolderId: folder.parentFolderId,
          totalEmails,
          unreadEmails,
        };
      })
    );

    const allEmails = await Email.countDocuments();
    const unreadEmails = await Email.countDocuments({ isRead: false });

    return {
      allEmails,
      unreadEmails,
      folders: folderStats,
    };
  }

  static async organizeExistingEmails() {
    const emailCategorizationService = new EmailCategorizationService();

    const preferences = await SenderPreference.find({
      senderAddress: { $ne: null },
      folderId: { $ne: null },
    }).lean();

    const senderPreferences = {};
    for (const pref of preferences) {
      senderPreferences[pref.senderAddress] = pref.folderId;
    }

    const emails = await Email.find();
    let updated = 0;

    for (const email of emails) {
      const newFolderId = await emailCategorizationService.categorizeEmail(
        email,
        senderPreferences
      );

      if (email.folderId !== newFolderId) {
        email.folderId = newFolderId;
        await email.save();
        updated++;
      }
    }

    return {
      total: emails.length,
      updated,
    };
  }

  static async createFolder(data) {
    const name = data?.name?.trim();
    const icon = data?.icon?.trim() || 'folder';
    const parentFolderId = data?.parentFolderId
      ? String(data.parentFolderId).toLowerCase().trim()
      : null;

    if (!name) {
      throw new Error('Folder name is required');
    }

    if (parentFolderId) {
      const parentFolder = await Folder.findOne({ folderId: parentFolderId });
      if (!parentFolder) {
        throw new Error('Parent folder not found');
      }
    }

    const baseFolderId = this.generateFolderId(name);

    if (!baseFolderId) {
      throw new Error('Invalid folder name');
    }

    const folderId = parentFolderId
      ? `${parentFolderId}-${baseFolderId}`
      : baseFolderId;

    const existingFolder = await Folder.findOne({ folderId });
    if (existingFolder) {
      throw new Error('Folder already exists');
    }

    return Folder.create({
      folderId,
      name,
      icon,
      system: false,
      parentFolderId,
    });
  }

  static async createSubfolder(parentFolderId, data) {
    return this.createFolder({
      ...data,
      parentFolderId,
    });
  }

  static async updateFolder(folderId, data) {
    const normalizedFolderId = String(folderId).toLowerCase().trim();
    const folder = await Folder.findOne({ folderId: normalizedFolderId });

    if (!folder) {
      throw new Error('Folder not found');
    }

    if (folder.system) {
      throw new Error('Default folders cannot be edited');
    }

    const newName = data?.name?.trim();
    const newIcon = data?.icon?.trim();
    const oldFolderId = folder.folderId;

    if (!newName && !newIcon) {
      throw new Error('Nothing to update');
    }

    if (newName) {
      const newBaseFolderId = this.generateFolderId(newName);

      if (!newBaseFolderId) {
        throw new Error('Invalid folder name');
      }

      const newFolderId = folder.parentFolderId
        ? `${folder.parentFolderId}-${newBaseFolderId}`
        : newBaseFolderId;

      const existingFolder = await Folder.findOne({
        _id: { $ne: folder._id },
        folderId: newFolderId,
      });

      if (existingFolder) {
        throw new Error('Another folder with this name already exists');
      }

      folder.name = newName;
      folder.folderId = newFolderId;
    }

    if (newIcon) {
      folder.icon = newIcon;
    }

    await folder.save();

    if (oldFolderId !== folder.folderId) {
      await Promise.all([
        Email.updateMany(
          { folderId: oldFolderId },
          { $set: { folderId: folder.folderId } }
        ),
        SenderPreference.updateMany(
          { folderId: oldFolderId },
          { $set: { folderId: folder.folderId } }
        ),
        Folder.updateMany(
          { parentFolderId: oldFolderId },
          { $set: { parentFolderId: folder.folderId } }
        ),
      ]);
    }

    return folder;
  }

  static async deleteFolder(folderId) {
    const normalizedFolderId = String(folderId).toLowerCase().trim();

    const folder = await Folder.findOne({ folderId: normalizedFolderId });

    if (!folder) {
      throw new Error('Folder not found');
    }

    if (folder.system) {
      throw new Error('Default folders cannot be deleted');
    }

    const subfolders = await Folder.find({
      parentFolderId: normalizedFolderId,
    }).lean();

    const subfolderIds = subfolders.map((subfolder) => subfolder.folderId);

    const folderIdsToDelete = [normalizedFolderId, ...subfolderIds];

    await Promise.all([
      Email.updateMany(
        {
          folderId: { $in: folderIdsToDelete },
        },
        {
          $set: { folderId: 'uncategorised' },
        }
      ),
      SenderPreference.updateMany(
        {
          folderId: { $in: folderIdsToDelete },
        },
        {
          $set: { folderId: 'uncategorised' },
        }
      ),
    ]);

    if (subfolderIds.length > 0) {
      await Folder.deleteMany({
        folderId: { $in: subfolderIds },
      });
    }

    await Folder.deleteOne({ _id: folder._id });

    return {
      message: 'Folder and subfolders deleted successfully',
      deletedFolderId: normalizedFolderId,
      deletedSubfolders: subfolderIds,
      movedTo: 'uncategorised',
    };
  }
}

module.exports = FolderService;