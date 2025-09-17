const summarizedEmail = require('../models/summarizedEmailModel');

// Create a new summarized email
const createSummarizedEmail = async (req, res) => {
  try {
    const { emailId, title, summary, seoTags } = req.body;
    const newSummarizedEmail = new summarizedEmail({ emailId, title, summary, seoTags });
    const savedEmail = await newSummarizedEmail.save();
    res.status(201).json(savedEmail);
  } catch (error) {
    res.status(500).json({ message: 'Error creating summarized email', error });
  }
};

// Get all summarized emails
const getAllSummarizedEmails = async (req, res) => {
  try {
    const emails = await summarizedEmail.find();
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summarized emails', error });
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

module.exports = {
  createSummarizedEmail,
  getAllSummarizedEmails,
  getSummarizedEmailById,
  updateSummarizedEmail,
  deleteSummarizedEmail,
};      