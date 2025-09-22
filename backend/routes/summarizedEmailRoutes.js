const summarizedEmailController = require('../controllers/summarizedEmailController');
const express = require('express');
const router = express.Router();

// Routes for summarized emails
router.post('/', summarizedEmailController.createSummarizedEmail);
router.get('/', summarizedEmailController.getAllSummarizedEmails);
router.get('/:id', summarizedEmailController.getSummarizedEmailById);
router.put('/:id', summarizedEmailController.updateSummarizedEmail);
router.delete('/:id', summarizedEmailController.deleteSummarizedEmail);

router.post('/summarize/:emailId', summarizedEmailController.summarizeEmail);
module.exports = router;