const asyncHandler = require('express-async-handler');
const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');
const Email = require('../models/emailModel');
const SenderPreference = require('../models/senderPreferenceModel');

// Define valid folder IDs
const VALID_FOLDER_IDS = [
  'inbox', 'supplier', 'competitor', 'information',
  'customers', 'marketing', 'archive'
];

const getEmails = asyncHandler(async (req, res) => {
  const host = process.env.POP3_HOST || 'pop.gmail.com';
  const pop3Port = 995;
  const username = process.env.POP3_USER
  const password = process.env.POP3_PASS 

  const client = new POP3Client(pop3Port, host, {
    tlserrs: false,
    enabletls: true,
    debug: false,
    ignoretlserrs: true,
  });

  let hasResponded = false; // Flag to ensure a response is sent only once

  client.on("connect", () => {
    client.login(username, password);
  });

  client.on("login", async (status) => {
    if (status) {
      try {
        const preferences = await SenderPreference.find({});
        const senderPreferencesCache = {};
        preferences.forEach(pref => {
          senderPreferencesCache[pref.senderAddress] = pref.folderId;
        });
        client.emit('preferences_loaded', senderPreferencesCache);
      } catch (dbError) {
        console.error("Error loading sender preferences:", dbError);
        if (!hasResponded) {
          hasResponded = true;
          res.status(500).json({ message: "Failed to load sender preferences for categorization." });
        }
        client.quit();
      }
    } else {
      console.error("POP3 Login failed for user:", username);
      if (!hasResponded) {
        hasResponded = true;
        res.status(401).json({ message: "POP3 Login failed" });
      }
      client.quit();
    }
  });

  client.on("preferences_loaded", (senderPreferencesCache) => {
    client.list();
    client.senderPreferencesCache = senderPreferencesCache;
  });

  client.on("list", (status, msgcount, msgs) => {
    if (!status) {
      console.error("Failed to list emails from POP3 server");
      if (!hasResponded) {
        hasResponded = true;
        res.status(500).json({ message: "Failed to list emails" });
      }
      client.quit();
      return;
    }
    
    // Immediately send a response to the client.
    if (!hasResponded) {
      hasResponded = true;
      res.status(200).json({ 
        message: "Email sync started. New emails will appear shortly.",
        details: `Found ${msgcount} emails to process.`
      });
    }
    
    if (msgcount === 0) {
      client.quit();
      return;
    }

    // Enhanced error handling for msgs parameter
    let emailsToFetch = [];
    
    try {
      if (msgs === null || msgs === undefined) {
        // If msgs is null/undefined, create array from 1 to msgcount
        emailsToFetch = Array.from({ length: msgcount }, (_, i) => (i + 1).toString());
      } else if (Array.isArray(msgs)) {
        emailsToFetch = msgs.map((_, index) => (index + 1).toString());
      } else if (typeof msgs === 'object') {
        emailsToFetch = Object.keys(msgs);
      } else {
        // Fallback: create array from 1 to msgcount
        emailsToFetch = Array.from({ length: msgcount }, (_, i) => (i + 1).toString());
      }
      
    } catch (error) {
      console.error("Error processing msgs parameter:", error);
      if (!hasResponded) {
        hasResponded = true;
        res.status(500).json({ message: "Error processing email list", error: error.message });
      }
      client.quit();
      return;
    }

    let emailsProcessed = 0;
    const categorization = {
      totalFetched: emailsToFetch.length,
      newEmails: 0,
      categorized: {
        inbox: 0,
        supplier: 0,
        competitor: 0,
        information: 0,
        customers: 0,
        marketing: 0,
        archive: 0
      }
    };
    
    const fetchNextEmail = async () => {
      if (emailsToFetch.length === 0) {
        client.quit();
        return;
      }
      
      const msgNumber = emailsToFetch.shift();
      client.retr(msgNumber);
    };

    client.on("retr", async (status, msgnumber, data) => {
      if (!status) {
        console.warn(`Failed to retrieve email ${msgnumber}`);
      } else {
        try {
          const parsed = await simpleParser(data);
          let folderId = 'inbox';
          const lowerSubject = parsed.subject ? parsed.subject.toLowerCase() : '';
          const lowerFrom = parsed.from && parsed.from.text ? parsed.from.text.toLowerCase() : '';
          const senderAddress = parsed.from?.value?.[0]?.address?.toLowerCase() || '';

          // Check sender preferences first
          if (senderAddress && client.senderPreferencesCache && client.senderPreferencesCache[senderAddress]) {
            folderId = client.senderPreferencesCache[senderAddress];
          } else {
            // Content-based categorization
            if (lowerSubject.includes('invoice') || lowerFrom.includes('supplier')) {
              folderId = 'supplier';
            } else if (lowerSubject.includes('competitor') || lowerFrom.includes('rival') || lowerSubject.includes('vs')) {
              folderId = 'competitor';
            } else if (lowerSubject.includes('info') || lowerSubject.includes('update') || lowerSubject.includes('newsletter')) {
              folderId = 'information';
            } else if (lowerSubject.includes('customer') || lowerFrom.includes('client')) {
              folderId = 'customers';
            } else if (lowerSubject.includes('marketing') || lowerSubject.includes('promo') || lowerSubject.includes('discount')) {
              folderId = 'marketing';
            }
          }

          // Check for duplicates
          const existingEmail = await Email.findOne({ messageId: parsed.messageId });
          if (!existingEmail) {
            const newEmail = new Email({
              subject: parsed.subject,
              from: {
                name: parsed.from?.value?.[0]?.name || '',
                address: parsed.from?.value?.[0]?.address || '',
              },
              date: parsed.date,
              text: parsed.text,
              html: parsed.html,
              messageId: parsed.messageId,
              folderId: folderId,
              isRead: false,
              isStarred: false,
            });
            await newEmail.save();
            categorization.newEmails++;
            categorization.categorized[folderId]++;
          }
        } catch (parseError) {
          console.error(`Error parsing or saving email ${msgnumber}:`, parseError);
        }
      }
      
      emailsProcessed++;
      
      if (emailsProcessed === categorization.totalFetched) {
        client.quit();
      } else {
        // Add small delay to prevent overwhelming the server
        setTimeout(() => {
          fetchNextEmail();
        }, 100);
      }
    });

    // Start fetching emails
    fetchNextEmail();
  });

  client.on("error", (err) => {
    console.error("POP3 client experienced an error:", err);
    if (!hasResponded) {
      hasResponded = true;
      res.status(500).json({ message: "POP3 client error", error: err.message });
    }
    client.quit();
  });

  client.on("quit", () => {
    // Keep this for monitoring connection lifecycle
  });

  // Add timeout protection
  setTimeout(() => {
    if (!hasResponded) {
      console.error("POP3 operation timed out");
      hasResponded = true;
      res.status(408).json({ message: "POP3 operation timed out" });
      client.quit();
    }
  }, 30000); // 30 second timeout
});

const getSavedEmails = asyncHandler(async (req, res) => {
  const { folderId, q } = req.query; // q for search query
  const filter = {};

  if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
    filter.folderId = folderId;
  }

  if (q) {
    filter.$or = [
      { subject: { $regex: q, $options: 'i' } },
      { 'from.name': { $regex: q, $options: 'i' } },
      { 'from.address': { $regex: q, $options: 'i' } },
      { text: { $regex: q, $options: 'i' } },
    ];
  }

  const emails = await Email.find(filter).sort({ date: -1 });
  res.status(200).json({ emails });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const { folderId } = req.query;
  let filter = { isRead: false };
  if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
    filter.folderId = folderId;
  }
  const count = await Email.countDocuments(filter);
  res.status(200).json({ unreadCount: count });
});

const getUnreadCounts = asyncHandler(async (req, res) => {
  const unreadCounts = { all: 0 };
  for (const folderId of VALID_FOLDER_IDS) {
    const count = await Email.countDocuments({ folderId, isRead: false });
    unreadCounts[folderId] = count;
  }
  unreadCounts.all = await Email.countDocuments({ isRead: false }); // Total unread count
  res.status(200).json({ unreadCounts });
});

const getEmailCounts = asyncHandler(async (req, res) => {
  const counts = { all: 0 };
  const unreadCounts = { all: 0 };

  for (const folderId of VALID_FOLDER_IDS) {
    const total = await Email.countDocuments({ folderId });
    const unread = await Email.countDocuments({ folderId, isRead: false });
    counts[folderId] = total;
    unreadCounts[folderId] = unread;
  }

  counts.all = await Email.countDocuments(); // Total emails
  unreadCounts.all = await Email.countDocuments({ isRead: false }); // Total unread emails

  res.status(200).json({ counts, unreadCounts });
});


const markEmailAsRead = asyncHandler(async (req, res) => {
  const { emailId } = req.params;
  const email = await Email.findByIdAndUpdate(emailId, { isRead: true }, { new: true });
  if (!email) {
    return res.status(404).json({ message: 'Email not found' });
  }
  res.status(200).json({ message: 'Email marked as read', email });
});

const markEmailAsUnread = asyncHandler(async (req, res) => {
  const { emailId } = req.params;
  const email = await Email.findByIdAndUpdate(emailId, { isRead: false }, { new: true });
  if (!email) {
    return res.status(404).json({ message: 'Email not found' });
  }
  res.status(200).json({ message: 'Email marked as unread', email });
});

const bulkMarkEmailsAsRead = asyncHandler(async (req, res) => {
  const { emailIds } = req.body;
  if (!Array.isArray(emailIds) || emailIds.length === 0) {
    return res.status(400).json({ message: 'Please provide an array of email IDs.' });
  }
  const result = await Email.updateMany({ _id: { $in: emailIds } }, { isRead: true });
  res.status(200).json({ message: `${result.modifiedCount} emails marked as read.` });
});

const moveEmailToFolder = asyncHandler(async (req, res) => {
  const { emailId } = req.params;
  const { folderId } = req.body;

  if (!folderId || !VALID_FOLDER_IDS.includes(folderId)) {
    return res.status(400).json({ message: 'Invalid or missing folderId.' });
  }

  const email = await Email.findById(emailId);
  if (!email) {
    return res.status(404).json({ message: 'Email not found.' });
  }

  const oldFolderId = email.folderId;
  const senderAddress = email.from?.address?.toLowerCase();

  // Update email's folder
  email.folderId = folderId;
  // Mark as read when moved, common behavior
  email.isRead = true;
  await email.save();

  // Save sender preference for future categorization
  if (senderAddress && typeof senderAddress === 'string' && senderAddress.trim() !== '') {
    await SenderPreference.findOneAndUpdate(
      { senderAddress: senderAddress },
      { $set: { folderId: folderId } },
      { upsert: true, new: true }
    );
    // Optionally, re-categorize past emails from this sender
    // This could be done in a background task for large datasets
    await Email.updateMany(
      { 'from.address': senderAddress, _id: { $ne: emailId }, folderId: oldFolderId },
      { $set: { folderId: folderId } }
    );
  } else {
    // The email move will still proceed even without saving sender preference
  }

  res.status(200).json({ message: `Email moved to ${folderId} and preference saved.`, email });
});


const recategorizeEmails = asyncHandler(async (req, res) => {
  const preferences = await SenderPreference.find({});
  let reCategorizedCount = 0;

  for (const pref of preferences) {
    const result = await Email.updateMany(
      { 'from.address': pref.senderAddress, folderId: { $ne: pref.folderId } },
      { $set: { folderId: pref.folderId } }
    );
    reCategorizedCount += result.modifiedCount;
  }

  res.status(200).json({
    message: `Recategorization complete. ${reCategorizedCount} emails updated based on sender preferences.`,
    details: 'More advanced recategorization logic can be added here.'
  });
});

const getEmailsByFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const { page = 1, limit = 20, q } = req.query; // Add pagination and search
  const skip = (parseInt(page) - 1) * parseInt(limit);

  if (!folderId || (!VALID_FOLDER_IDS.includes(folderId) && folderId !== 'all')) {
    return res.status(400).json({ message: 'Invalid folder ID.' });
  }

  let filter = {};
  if (folderId !== 'all') {
    filter.folderId = folderId;
  }

  if (q) {
    filter.$or = [
      { subject: { $regex: q, $options: 'i' } },
      { 'from.name': { $regex: q, $options: 'i' } },
      { 'from.address': { $regex: q, $options: 'i' } },
      { text: { $regex: q, $options: 'i' } },
    ];
  }

  const emails = await Email.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Email.countDocuments(filter);

  res.status(200).json({
    emails,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit))
  });
});

const manualCategorization = asyncHandler(async (req, res) => {
  const { id } = req.params; // email ID
  const { categoryId } = req.body; // new folder ID

  if (!categoryId || !VALID_FOLDER_IDS.includes(categoryId)) {
    return res.status(400).json({ message: 'Invalid categoryId provided.' });
  }

  const email = await Email.findById(id);
  if (!email) {
    return res.status(404).json({ message: 'Email not found.' });
  }

  const oldFolderId = email.folderId;
  email.folderId = categoryId;
  email.isRead = true; // Mark as read when manually categorized
  await email.save();

  // Implement 'learning': Store sender preference for future categorization
  const senderAddress = email.from?.address?.toLowerCase();
  if (senderAddress && typeof senderAddress === 'string' && senderAddress.trim() !== '') {
    await SenderPreference.findOneAndUpdate(
      { senderAddress: senderAddress },
      { $set: { folderId: categoryId } },
      { upsert: true, new: true }
    );

    // Optionally re-categorize past emails from this sender
    await Email.updateMany(
      { 'from.address': senderAddress, _id: { $ne: id }, folderId: oldFolderId },
      { $set: { folderId: categoryId } }
    );
  } else {
    // Continue without saving sender preference
  }

  res.status(200).json({ message: 'Email manually categorized successfully.', email });
});

const getEmailStatistics = asyncHandler(async (req, res) => {
  const totalEmails = await Email.countDocuments();
  const totalUnread = await Email.countDocuments({ isRead: false });

  const emailsPerFolder = await Email.aggregate([
    { $group: { _id: '$folderId', count: { $sum: 1 } } }
  ]);

  const unreadPerFolder = await Email.aggregate([
    { $match: { isRead: false } },
    { $group: { _id: '$folderId', count: { $sum: 1 } } }
  ]);

  const topSenders = await Email.aggregate([
    { $group: { _id: '$from.address', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    totalEmails,
    totalUnread,
    emailsPerFolder: emailsPerFolder.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
    unreadPerFolder: unreadPerFolder.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
    topSenders,
  });
});

const validateCategorization = asyncHandler(async (req, res) => {
  const totalEmails = await Email.countDocuments();
  const sampleSize = Math.min(totalEmails, 100);

  const sampleEmails = await Email.aggregate([{ $sample: { size: sampleSize } }]);

  let correctPredictions = 0;
  sampleEmails.forEach(email => {
    if (email.folderId === 'information' && email.subject && email.subject.toLowerCase().includes('newsletter')) {
      correctPredictions++;
    }
  });

  const accuracy = sampleSize > 0 ? (correctPredictions / sampleSize) * 100 : 0;

  res.status(200).json({
    message: 'Categorization validation simulated.',
    totalEmailsChecked: sampleSize,
    simulatedCorrectPredictions: correctPredictions,
    simulatedAccuracy: accuracy.toFixed(2) + '%'
  });
});

// Export all functions
module.exports = {
  getEmails,
  getSavedEmails,
  getUnreadCount,
  getUnreadCounts,
  getEmailCounts,
  markEmailAsRead,
  markEmailAsUnread,
  bulkMarkEmailsAsRead,
  moveEmailToFolder,
  recategorizeEmails,
  getEmailsByFolder,
  manualCategorization,
  getEmailStatistics,
  validateCategorization,
};