// models/autoMoveRuleModel.js
const mongoose = require('mongoose');

const autoMoveRuleSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true, unique: true },
  folderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AutoMoveRule', autoMoveRuleSchema);