const mongoose = require('mongoose');

const senderPreferenceSchema = mongoose.Schema(
  {
    senderEmail: {
      type: String,
      required: [true, 'Please add a sender email'],
      unique: true, // Ensure one preference per sender email
      lowercase: true, // Store emails in lowercase for consistency
      trim: true,
    },
    preferredFolderId: {
      type: String,
      required: [true, 'Please add a preferred folder ID'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model('SenderPreference', senderPreferenceSchema);

