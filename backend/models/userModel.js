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


const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  path: String,
});

const userSchema = new mongoose.Schema({
  messageId: { type: String, unique: true, sparse: true },
  from: {
    name: String,
    address: String,
  },
  to: [{ name: String, address: String }],
  subject: String,
  date: Date,
  text: String,
  html: String,
  folder: { type: String, default: 'INBOX' },
  isRead: { type: Boolean, default: false },
  attachments: [AttachmentSchema],
  raw: Buffer,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);


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
