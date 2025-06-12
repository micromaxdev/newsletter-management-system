// const mongoose = require('mongoose');

// const AttachmentSchema = new mongoose.Schema({
//   filename: String,
//   contentType: String,
//   size: Number,
//   path: String,
// });

// const emailSchema = new mongoose.Schema({
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

// module.exports = mongoose.model('Email', emailSchema);

// const mongoose = require('mongoose');

// const AttachmentSchema = new mongoose.Schema({
//   filename: String,
//   contentType: String,
//   size: Number,
//   content: Buffer, // Store attachment content
//   contentId: String,
//   disposition: String,
// });

// const AddressSchema = new mongoose.Schema({
//   name: String,
//   address: String,
// }, { _id: false });

// const emailSchema = new mongoose.Schema({
//   messageId: { 
//     type: String, 
//     unique: true, 
//     sparse: true,
//     required: true,
//     index: true 
//   },
//   from: {
//     name: String,
//     address: { type: String, required: true }
//   },
//   to: [AddressSchema],
//   cc: [AddressSchema],
//   bcc: [AddressSchema],
//   replyTo: [AddressSchema],
//   subject: { type: String, default: '' },
//   date: { type: Date, required: true, index: true },
//   text: String, // Plain text content
//   html: String, // HTML content
  
//   // Email headers
//   headers: {
//     type: Map,
//     of: String
//   },
  
//   // Email status
//   folder: { type: String, default: 'INBOX' },
//   isRead: { type: Boolean, default: false },
//   isStarred: { type: Boolean, default: false },
//   isImportant: { type: Boolean, default: false },
//   isDeleted: { type: Boolean, default: false },
  
//   // Attachments
//   attachments: [AttachmentSchema],
//   hasAttachments: { type: Boolean, default: false },
  
//   // Threading
//   threadId: String,
//   inReplyTo: String,
//   references: [String],
  
//   // Content analysis
//   priority: { type: String, enum: ['high', 'normal', 'low'], default: 'normal' },
//   size: Number, // Email size in bytes
  
//   // Raw email data (optional - can be large)
//   raw: Buffer,
  
//   // Metadata
//   fetchedAt: { type: Date, default: Date.now },
//   source: { type: String, default: 'POP3' }, // POP3, IMAP, etc.
  
//   // Custom tags/labels
//   tags: [String],
//   labels: [String],
  
// }, {
//   timestamps: true, // Adds createdAt and updatedAt
//   collection: 'emails'
// });

// // Indexes for better query performance
// emailSchema.index({ date: -1 });
// emailSchema.index({ 'from.address': 1 });
// emailSchema.index({ subject: 'text', text: 'text' }); // Text search
// emailSchema.index({ folder: 1, isDeleted: 1 });
// emailSchema.index({ isRead: 1 });

// // Virtual for email age
// emailSchema.virtual('ageInDays').get(function() {
//   return Math.floor((Date.now() - this.date) / (1000 * 60 * 60 * 24));
// });

// // Pre-save middleware to set hasAttachments flag
// emailSchema.pre('save', function(next) {
//   this.hasAttachments = this.attachments && this.attachments.length > 0;
//   next();
// });

// // Static method to find recent emails
// emailSchema.statics.findRecent = function(limit = 50) {
//   return this.find({ isDeleted: false })
//     .sort({ date: -1 })
//     .limit(limit)
//     .select('-raw -attachments.content'); // Exclude large fields
// };

// // Static method to find by sender
// emailSchema.statics.findBySender = function(senderEmail) {
//   return this.find({ 
//     'from.address': new RegExp(senderEmail, 'i'),
//     isDeleted: false 
//   }).sort({ date: -1 });
// };

// // Instance method to mark as read
// emailSchema.methods.markAsRead = function() {
//   this.isRead = true;
//   return this.save();
// };

// // Instance method to toggle star
// emailSchema.methods.toggleStar = function() {
//   this.isStarred = !this.isStarred;
//   return this.save();
// };

// module.exports = mongoose.model('Email', emailSchema);

const mongoose = require('mongoose');

// Schema for email attachments
const AttachmentSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  contentId: String,
});

// Main email schema
const emailSchema = new mongoose.Schema({
  messageId: { 
    type: String, 
    unique: true, 
    sparse: true,
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  from: {
    name: { type: String, default: '' },
    address: { type: String, required: true }
  },
  to: [{
    name: String,
    address: String
  }],
  cc: [{
    name: String,
    address: String
  }],
  bcc: [{
    name: String,
    address: String
  }],
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  text: String,
  html: String,
  attachments: [AttachmentSchema],
  isRead: { 
    type: Boolean, 
    default: false 
  },
  isStarred: { 
    type: Boolean, 
    default: false 
  },
  folder: { 
    type: String, 
    default: 'INBOX' 
  },
  labels: [String],
  priority: { 
    type: String, 
    enum: ['low', 'normal', 'high'], 
    default: 'normal' 
  }
}, {
  timestamps: true
});

// Index for better query performance
emailSchema.index({ date: -1 });
emailSchema.index({ 'from.address': 1 });
emailSchema.index({ subject: 'text', 'text': 'text' });

module.exports = mongoose.model('Email', emailSchema);