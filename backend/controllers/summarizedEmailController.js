const summarizedEmail = require('../models/summarizedEmailModel');
const {summarizeEmailContent, setApprovalStatus} = require('../services/summarizeEmailService');
// Create a new summarized email
const createSummarizedEmail = async (req, res) => {
  try {
    const { emailId, title, summary, seo } = req.body;
    const newSummarizedEmail = new summarizedEmail({ emailId, title, summary, seo });
    const savedEmail = await newSummarizedEmail.save();
    res.status(201).json(savedEmail);
  } catch (error) {
    res.status(500).json({ message: 'Error creating summarized email', error });
  }
};
// Get a single summarized email by ID
const getSummarizedEmailById = async (req, res) => {
  try {
    const email = await summarizedEmail.findById(req.params.id).populate('emailId');
    if (!email) {
      return res.status(404).json({ message: 'Summarized email not found' });
    }
    res.status(200).json(email);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summarized email', error });
  }
};
// Get all summarized emails
const getAllSummarizedEmails = async (req, res) => {
  try {
    const emails = await summarizedEmail.find().sort({ isApproved: 1, createdAt: -1 });
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summarized emails', error });
  }
};

// Update a summarized email
const updateSummarizedEmail = async (req, res) => {
  try {
    const { title, summary, seoTags } = req.body;
    const updatedEmail = await summarizedEmail.findByIdAndUpdate(
      req.params.id,
      { title, summary, seoTags },
      { new: true, runValidators: true }
    );
    if (!updatedEmail) {
      return res.status(404).json({ message: 'Summarized email not found' });
    }
    res.status(200).json(updatedEmail);
  } catch (error) {
    res.status(500).json({ message: 'Error updating summarized email', error });
  }
};

// Delete a summarized email
const deleteSummarizedEmail = async (req, res) => {
  try {
    const deletedEmail = await summarizedEmail.findByIdAndDelete(req.params.id);
    if (!deletedEmail) {
      return res.status(404).json({ message: 'Summarized email not found' });
    }
    res.status(200).json({ message: 'Summarized email deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting summarized email', error });
  }
};

//summarizing email content using Gemini
const summarizeEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    
    // Extract options from query parameters or request body
    const options = {
      temperature: parseFloat(req.query.temperature) || parseFloat(req.body.temperature) || 0.3,
      topP: parseFloat(req.query.topP) || parseFloat(req.body.topP) || 0.8,
      topK: parseInt(req.query.topK) || parseInt(req.body.topK) || 40,
      maxOutputTokens: parseInt(req.query.maxOutputTokens) || parseInt(req.body.maxOutputTokens) || 1000,
      modelName: req.query.modelName || req.body.modelName || undefined, // Use default if not provided
    };
    
    console.log('Summarizing email with options:', options);
    
    const result = await summarizeEmailContent(emailId, options);
    res.status(200).json({
      message: 'Email summarized successfully',
      data: result,
      options: options
    });
  } catch (error) {
    console.error('Error in summarizeEmail route:', error);
    res.status(400).json({
      message: error.message,
      error: error.message
    });
  }
};
const updateSummarizedEmailStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {status} = req.body;
    if (status === undefined || typeof status !== "boolean") {
      return res.status(400).json({ message: 'Approval status invalid' });
    }
    const email = await summarizedEmail.findById(id);
    if (!email) {
      return res.status(404).json({ message: 'Summarized email not found' });
    }
    const approvedEmail = await setApprovalStatus(id, status);
    res.status(200).json({ message: 'Summarized email approved', email: approvedEmail });
  } catch (error) {
    res.status(500).json({ message: 'Error approving summarized email', error });
  }
};
module.exports = {
  createSummarizedEmail,
  getAllSummarizedEmails,
  getSummarizedEmailById,
  updateSummarizedEmail,
  deleteSummarizedEmail,
  summarizeEmail,
  updateSummarizedEmailStatus
};      