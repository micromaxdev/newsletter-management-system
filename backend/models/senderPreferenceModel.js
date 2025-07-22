
// const mongoose = require('mongoose');

// const senderPreferenceSchema = mongoose.Schema(
//   {
//     senderAddress: {
//       type: String,
//       required: true,
//       unique: true, // A sender should only have one preferred folder
//       lowercase: true,
//       trim: true,
//     },
//     folderId: {
//       type: String,
//       required: true,
     
//     },
//   },
//   {
//     timestamps: true, // To track when the preference was set/updated
//   }
// );

// module.exports = mongoose.model('SenderPreference', senderPreferenceSchema);

// models/senderPreferenceModel.js

const mongoose = require('mongoose');

const senderPreferenceSchema = mongoose.Schema(
  {
    senderAddress: {
      type: String,
      required: true,
      unique: true,
      sparse: true, // <--- This is the key addition to fix the duplicate key error
      lowercase: true,
      trim: true,
    },
    folderId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SenderPreference', senderPreferenceSchema);
