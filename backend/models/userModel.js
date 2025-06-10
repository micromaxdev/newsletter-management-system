// working code
// const mongoose = require("mongoose");

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please add a name"],
//     },
//     email: {
//       type: String,
//       required: [true, "Please add an email"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Please add a password"],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", userSchema);



//working code
// const mongoose = require("mongoose");

// // User Schema for authentication
// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please add a name"],
//     },
//     email: {
//       type: String,
//       required: [true, "Please add an email"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Please add a password"],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("User", userSchema);

// models/emailModel.js
const mongoose = require('mongoose');

// Enhanced email schema with folder support
const emailSchema = new mongoose.Schema({
  messageId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  subject: {
    type: String,
    required: true
  },
  from: {
    name: String,
    address: {
      type: String,
      required: true
    }
  },
  to: [{
    name: String,
    address: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  text: String,
  html: String,
  
  // Folder organization fields
  senderFolder: {
    type: String,
    required: true,
    index: true // Add index for faster queries
  },
  senderDomain: {
    type: String,
    index: true
  },
  
  // Additional organization fields
  isRead: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  tags: [String],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient folder queries
emailSchema.index({ senderFolder: 1, date: -1 });
emailSchema.index({ senderDomain: 1, date: -1 });

// Helper method to generate folder name from email address
emailSchema.statics.generateFolderName = function(emailAddress) {
  if (!emailAddress) return 'unknown';
  
  // Clean the email address
  const cleanEmail = emailAddress.toLowerCase().trim();
  
  // Extract domain for additional organization
  const domain = cleanEmail.split('@')[1] || 'unknown';
  
  // Create a clean folder name
  const folderName = cleanEmail.replace(/[^a-zA-Z0-9@.-]/g, '_');
  
  return {
    folderName,
    domain
  };
};

// Pre-save middleware to automatically set folder information
emailSchema.pre('save', function(next) {
  if (this.from && this.from.address) {
    const { folderName, domain } = this.constructor.generateFolderName(this.from.address);
    this.senderFolder = folderName;
    this.senderDomain = domain;
  }
  next();
});

module.exports = mongoose.model('Email', emailSchema);

// second code

// const mongoose = require('mongoose');

// const AttachmentSchema = new mongoose.Schema({
//   filename: String,
//   contentType: String,
//   size: Number,
//   path: String,
// });

// const userSchema = new mongoose.Schema({
//   messageId: { type: String, unique: true, sparse: true },
//   from: {
//     name: String,
//     address: String,
//   },
//   to: [{ name: String, address: String }],
//   subject: String,
//   date: Date,
//   text: String,
//   html: String,
//   folder: { type: String, default: 'INBOX' },
//   isRead: { type: Boolean, default: false },
//   attachments: [AttachmentSchema],
//   raw: Buffer,
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('User', userSchema);


// diff code
// const mongoose = require('mongoose');

// const emailSchema = new mongoose.Schema({
//   subject: { type: String, required: true },
//   from: { type: String, required: true },
//   to: { type: String, required: true },
//   body: { type: String },
//   date: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Email', emailSchema);


// models/Email.js
// const mongoose = require("mongoose");

// const emailSchema = new mongoose.Schema({
//   subject: String,
//   from: String,
//   date: Date,
//   text: String,
// });

// module.exports = mongoose.model("Email", emailSchema);
