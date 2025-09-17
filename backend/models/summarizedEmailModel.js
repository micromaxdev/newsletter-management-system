const mongoose = require('mongoose');

const summarizedEmailSchema = new mongoose.Schema({
  emailId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email', required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  seoTags: { type: [String], default: [] },
}, { timestamps: true });

const SummarizedEmail = mongoose.model('SummarizedEmail', summarizedEmailSchema);

module.exports = SummarizedEmail;
