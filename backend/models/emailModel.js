// const mongoose = require('mongoose');

// const emailSchema = mongoose.Schema(
//   {
//     subject: {
//       type: String,
//       default: '(No Subject)' // Added default for consistency
//     },
//     from: {
//       name: {
//         type: String,
//         default: ''
//       },
//       address: {
//         type: String,
//         default: ''
//       },
//     },
//     date: {
//       type: Date,
//       default: Date.now // Default to current time if no date is provided
//     },
//     text: {
//       type: String,
//       default: ''
//     },
//     html: {
//       type: String,
//       default: ''
//     },
//     messageId: {
//       type: String,
//       unique: true, // Ensures no duplicate emails based on messageId
//       required: true,
//       index: true // Add index for faster lookups
//     },
//     folderId: {
//       type: String,
//       enum: ['inbox', 'supplier', 'competitor', 'information', 'customers', 'marketing', 'archive'], // Enforce valid folder IDs
//       default: 'inbox',
//       index: true // Add index for faster filtering by folder
//     },
//     tags: {
//       type: [String],
//       default: [], // Default to an empty array
//       index: true // Add index for faster filtering by tags
//     },
//     isRead: {
//       type: Boolean,
//       default: false, // Default to unread when a new email is saved
//       index: true // Add index for faster unread counts
//     },
//     isStarred: {
//       type: Boolean,
//       default: false,
//     },
//     isSummarized: {
//       type: Boolean,
//       default: false,
//       index: true // Add index for faster filtering by summarized status
//     },
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// module.exports = mongoose.model('Email', emailSchema);

const mongoose = require('mongoose');

const emailSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      default: '(No Subject)',
      trim: true,
    },

    from: {
      name: {
        type: String,
        default: '',
        trim: true,
      },
      address: {
        type: String,
        default: '',
        trim: true,
        lowercase: true,
      },
    },

    date: {
      type: Date,
      default: Date.now,
      index: true,
    },

    text: {
      type: String,
      default: '',
    },

    html: {
      type: String,
      default: '',
    },

    messageId: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim: true,
    },

    // ✅ FIXED: removed enum to support custom folders
    folderId: {
      type: String,
      default: 'uncategorised',
      index: true,
      trim: true,
      lowercase: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    isStarred: {
      type: Boolean,
      default: false,
      index: true,
    },

    isSummarized: {
      type: Boolean,
      default: false,
      index: true,
    },

    isNewsletter: {
      type: Boolean,
      default: true,
      index: true,
    },

    visible: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Email', emailSchema);