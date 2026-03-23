// // folder model
// const mongoose = require("mongoose");

// const folderSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
// });

// module.exports = mongoose.model("Folder", folderSchema);

const mongoose = require('mongoose');

const folderSchema = mongoose.Schema(
  {
    folderId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'folder',
      trim: true,
    },
    system: {
      type: Boolean,
      default: false,
    },
    parentFolderId: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Folder', folderSchema);