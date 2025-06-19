// //working code
// const mongoose = require('mongoose');

// // Schema for email attachments
// const AttachmentSchema = new mongoose.Schema({
//   filename: String,
//   contentType: String,
//   size: Number,
//   contentId: String,
// });

// // Main email schema
// const emailSchema = new mongoose.Schema({
//   messageId: { 
//     type: String, 
//     unique: true, 
//     sparse: true,
//     required: true 
//   },
//   subject: { 
//     type: String, 
//     required: true 
//   },
//   from: {
//     name: { type: String, default: '' },
//     address: { type: String, required: true }
//   },
//   to: [{
//     name: String,
//     address: String
//   }],
//   cc: [{
//     name: String,
//     address: String
//   }],
//   bcc: [{
//     name: String,
//     address: String
//   }],
//   date: { 
//     type: Date, 
//     required: true,
//     default: Date.now 
//   },
//   text: String,
//   html: String,
//   attachments: [AttachmentSchema],
//   isRead: { 
//     type: Boolean, 
//     default: false 
//   },
//   isStarred: { 
//     type: Boolean, 
//     default: false 
//   },
//   folder: { 
//     type: String, 
//     default: 'INBOX' 
//   },
//   labels: [String],
//   priority: { 
//     type: String, 
//     enum: ['low', 'normal', 'high'], 
//     default: 'normal' 
//   }
// }, {
//   timestamps: true
// });

// // Index for better query performance
// emailSchema.index({ date: -1 });
// emailSchema.index({ 'from.address': 1 });
// emailSchema.index({ subject: 'text', 'text': 'text' });

// module.exports = mongoose.model('Email', emailSchema);
const mongoose = require('mongoose');

const emailSchema = mongoose.Schema({
  subject: {
    type: String,
    required: false,
    default: ''
  },
  from: {
    name: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    }
  },
  date: {
    type: Date,
    default: Date.now
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
    unique: true,
    sparse: true
  },
  folderId: {
    type: String,
    default: 'inbox',
    enum: ['inbox', 'supplier', 'competitor', 'information', 'customers', 'marketing', 'archive']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
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

// Update the updatedAt field before saving
emailSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better performance
emailSchema.index({ folderId: 1, date: -1 });
emailSchema.index({ messageId: 1 });
emailSchema.index({ 'from.address': 1 });

module.exports = mongoose.model('Email', emailSchema);