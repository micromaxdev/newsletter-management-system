const summarizedEmailController = require('../controllers/summarizedEmailController');
const express = require('express');
const router = express.Router();

// Routes for summarized emails

router.get('/', summarizedEmailController.getAllSummarizedEmails);
router.get('/query', summarizedEmailController.getEmailByQuery);
router.get('/:id', summarizedEmailController.getSummarizedEmailById);
router.put('/:id', summarizedEmailController.updateSummarizedEmail);
router.put('/approval/:id', summarizedEmailController.updateSummarizedEmailStatus);
router.post('/', summarizedEmailController.createSummarizedEmail);
router.delete('/:id', summarizedEmailController.deleteSummarizedEmail);

router.post('/bulk-summarize', summarizedEmailController.bulkSummarize);
router.post('/summarize/:emailId', summarizedEmailController.summarizeEmail);
module.exports = router;