const mongoose = require('mongoose');

const summarizedEmailSchema = new mongoose.Schema({
  originalEmailId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email', required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  seo: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    canonical: { type: String, default: '' }
  },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const SummarizedEmail = mongoose.model('SummarizedEmail', summarizedEmailSchema);

module.exports = SummarizedEmail;
