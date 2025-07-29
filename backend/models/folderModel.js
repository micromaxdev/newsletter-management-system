const mongoose = require("mongoose");

// Define the schema recursively to support nested folders
const folderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    children: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
  },
  {
    _id: false, // This allows us to set our own _id
  }
);

// Add an index on _id for faster lookups
folderSchema.index({ _id: 1 });

module.exports = mongoose.model("Folder", folderSchema);
