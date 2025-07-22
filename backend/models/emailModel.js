
const mongoose = require('mongoose');

const emailSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      default: '(No Subject)' // Added default for consistency
    },
    from: {
      name: {
        type: String,
        default: ''
      },
      address: {
        type: String,
        default: ''
      },
    },
    date: {
      type: Date,
      default: Date.now // Default to current time if no date is provided
    },
    text: {
      type: String,
      default: ''
    },
    html: {
      type: String,
      default: ''
    },
    messageId: {
      type: String,
      unique: true, // Ensures no duplicate emails based on messageId
      required: true,
      index: true // Add index for faster lookups
    },
    folderId: {
      type: String,
      enum: ['inbox', 'supplier', 'competitor', 'information', 'customers', 'marketing', 'archive'], // Enforce valid folder IDs
      default: 'inbox',
      index: true // Add index for faster filtering by folder
    },
    isRead: {
      type: Boolean,
      default: false, // Default to unread when a new email is saved
      index: true // Add index for faster unread counts
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Email', emailSchema);
