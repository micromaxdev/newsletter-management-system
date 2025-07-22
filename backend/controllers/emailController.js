// const asyncHandler = require('express-async-handler');
// const POP3Client = require('poplib');
// const { simpleParser } = require('mailparser');
// const Email = require('../models/emailModel');
// const SenderPreference = require('../models/senderPreferenceModel');

// // Define valid folder IDs (ensure this matches what you had in the past code if different)
// const VALID_FOLDER_IDS = [
//   'inbox', 'supplier', 'competitor', 'information',
//   'customers', 'marketing', 'archive'
//   // Make sure to remove 'spam', 'important' if they weren't in your preferred old list
// ];

// const getEmails = asyncHandler(async (req, res) => {
//   const host = process.env.POP3_HOST || 'pop.gmail.com';
//   const pop3Port = 995;
//   const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
//   const password = process.env.POP3_PASS || 'your_app_password'; // Use an App Password for Gmail

//   const client = new POP3Client(pop3Port, host, {
//     tlserrs: false,
//     enabletls: true,
//     debug: false,
//     ignoretlserrs: true,
//   });

//   let emailsProcessed = 0;
//   let categorization = {
//     totalFetched: 0,
//     newEmails: 0,
//     categorized: {
//       inbox: 0,
//       supplier: 0,
//       competitor: 0,
//       information: 0,
//       customers: 0,
//       marketing: 0,
//       archive: 0
//     }
//   };

//   let senderPreferencesCache = {};
//   let responded = false; // Flag to prevent multiple responses

//   const requestTimeout = setTimeout(() => {
//     if (!responded) {
//       responded = true;
//       console.warn("POP3 email sync timed out.");
//       client.quit();
//       res.status(504).json({ message: "Email sync timed out." });
//     }
//   }, 30000); // 30-second timeout

//   client.on("connect", () => {
//     console.log("POP3 connected");
//     client.login(username, password);
//   });

//   client.on("login", async (status) => {
//     console.log("POP3 login status:", status);
//     if (status) {
//       try {
//         const preferences = await SenderPreference.find({});
//         preferences.forEach(pref => {
//           senderPreferencesCache[pref.senderAddress] = pref.folderId;
//         });
//         console.log(`Loaded ${preferences.length} sender preferences for categorization.`);
//         client.list();
//       } catch (dbError) {
//         console.error("Error loading sender preferences:", dbError);
//         if (!responded) {
//           responded = true;
//           res.status(500).json({ message: "Failed to load sender preferences for categorization." });
//         }
//         client.quit();
//         clearTimeout(requestTimeout); // Clear timeout on early response
//       }
//     } else {
//       console.error("POP3 Login failed for user:", username);
//       if (!responded) {
//         responded = true;
//         res.status(401).json({ message: "POP3 Login failed" });
//       }
//       client.quit();
//       clearTimeout(requestTimeout); // Clear timeout on early response
//     }
//   });

//   client.on("list", (status, msgcount) => {
//     console.log("POP3 list status:", status, "msgcount:", msgcount);
//     if (!status) {
//       console.error("Failed to list emails from POP3 server");
//       if (!responded) {
//         responded = true;
//         res.status(500).json({ message: "Failed to list emails" });
//       }
//       client.quit();
//       clearTimeout(requestTimeout); // Clear timeout on early response
//       return;
//     }
//     categorization.totalFetched = msgcount;
//     if (msgcount === 0) {
//       console.log("No new emails on POP3 server.");
//       if (!responded) {
//         responded = true;
//         res.json({ message: "No new emails.", categorization });
//       }
//       client.quit();
//       clearTimeout(requestTimeout);
//       return;
//     }
//     for (let i = 1; i <= msgcount; i++) {
//       client.retr(i);
//     }
//   });

//   client.on("retr", async (status, msgnumber, data) => {
//     console.log(`POP3 retr status for msg ${msgnumber}:`, status);
//     if (!status) {
//       console.warn(`Failed to retrieve email ${msgnumber}`);
//       emailsProcessed++;
//       if (emailsProcessed === categorization.totalFetched && !responded) {
//         responded = true;
//         res.json({ message: "Email sync complete.", categorization });
//         clearTimeout(requestTimeout);
//         client.quit();
//       }
//       return;
//     }
//     try {
//       const parsed = await simpleParser(data);
//       let folderId = 'inbox'; // Default folder

//       const lowerSubject = parsed.subject ? parsed.subject.toLowerCase() : '';
//       const lowerFrom = parsed.from && parsed.from.text ? parsed.from.text.toLowerCase() : '';
//       const senderAddress = parsed.from?.value?.[0]?.address?.toLowerCase() || ''; // Get clean sender address

//       // Prioritize categorization based on existing user preferences for the sender.
//       if (senderAddress && senderPreferencesCache[senderAddress]) {
//         folderId = senderPreferencesCache[senderAddress];
//         console.log(`Email from ${senderAddress} auto-categorized to ${folderId} based on user preference.`);
//       } else {
//         // Existing categorization logic (only if no sender preference found)
//         // Categorize emails based on keywords in subject or sender information.
//         if (lowerSubject.includes('invoice') || lowerFrom.includes('supplier')) {
//           folderId = 'supplier';
//         } else if (lowerSubject.includes('competitor') || lowerFrom.includes('rival') || lowerSubject.includes('vs')) {
//           folderId = 'competitor';
//         } else if (lowerSubject.includes('info') || lowerSubject.includes('update') || lowerSubject.includes('newsletter')) {
//           folderId = 'information';
//         } else if (lowerSubject.includes('customer') || lowerFrom.includes('client')) {
//           folderId = 'customers';
//         } else if (lowerSubject.includes('marketing') || lowerSubject.includes('promo') || lowerSubject.includes('discount')) {
//           folderId = 'marketing';
//         }
//       }

//       // Check if the email already exists in the database to prevent duplicates.
//       const existingEmail = await Email.findOne({ messageId: parsed.messageId });
//       if (!existingEmail) {
//         // Create a new email document and save it to the database.
//         const newEmail = new Email({
//           subject: parsed.subject,
//           from: {
//             name: parsed.from?.value?.[0]?.name || '',
//             address: parsed.from?.value?.[0]?.address || '',
//           },
//           date: parsed.date,
//           text: parsed.text,
//           html: parsed.html,
//           messageId: parsed.messageId,
//           folderId: folderId,
//           isRead: false, // Newly fetched emails are unread
//           isStarred: false,
//         });
//         await newEmail.save();
//         categorization.newEmails++;
//         categorization.categorized[folderId]++;
//       }
//     } catch (parseError) {
//       console.error(`Error parsing or saving email ${msgnumber}:`, parseError);
//     } finally {
//       emailsProcessed++;
//       // If all fetched emails have been processed, send the response and quit the client.
//       if (emailsProcessed === categorization.totalFetched && !responded) {
//         console.log("All POP3 emails processed.");
//         responded = true;
//         res.json({ message: "Email sync complete.", categorization });
//         clearTimeout(requestTimeout);
//         client.quit();
//       }
//     }
//   });

//   client.on("error", (err) => {
//     console.error("POP3 client experienced an error:", err);
//     if (!responded) { // Prevent setting headers twice
//       responded = true;
//       res.status(500).json({ message: "POP3 client error", error: err.message });
//     }
//     client.quit();
//     clearTimeout(requestTimeout);
//   });

//   client.on("quit", () => {
//     console.log("POP3 client disconnected.");
//     clearTimeout(requestTimeout);
//   });
// });

const asyncHandler = require('express-async-handler');
const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');
const Email = require('../models/emailModel');
const SenderPreference = require('../models/senderPreferenceModel');

// Define valid folder IDs (ensure this matches what you had in the past code if different)
const VALID_FOLDER_IDS = [
  'inbox', 'supplier', 'competitor', 'information',
  'customers', 'marketing', 'archive'
];

const getEmails = asyncHandler(async (req, res) => {
  const host = process.env.POP3_HOST || 'pop.gmail.com';
  const pop3Port = 995;
  const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
  const password = process.env.POP3_PASS || 'your_app_password'; // Use an App Password for Gmail

  const client = new POP3Client(pop3Port, host, {
    tlserrs: false,
    enabletls: true,
    debug: false,
    ignoretlserrs: true,
  });

  let emailsProcessed = 0;
  let categorization = {
    totalFetched: 0,
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

  let senderPreferencesCache = {};
  let responded = false; // Flag to prevent multiple responses

  const requestTimeout = setTimeout(() => {
    if (!responded) {
      responded = true;
      console.warn("POP3 email sync timed out.");
      client.quit();
      res.status(504).json({ message: "Email sync timed out." });
    }
  }, 30000); // 30-second timeout

  client.on("connect", () => {
    console.log("POP3 connected");
    client.login(username, password);
  });

  client.on("login", async (status) => {
    console.log("POP3 login status:", status);
    if (status) {
      try {
        const preferences = await SenderPreference.find({});
        preferences.forEach(pref => {
          senderPreferencesCache[pref.senderAddress] = pref.folderId;
        });
        console.log(`Loaded ${preferences.length} sender preferences for categorization.`);
        client.list();
      } catch (dbError) {
        console.error("Error loading sender preferences:", dbError);
        if (!responded) {
          responded = true;
          res.status(500).json({ message: "Failed to load sender preferences for categorization." });
        }
        client.quit();
        clearTimeout(requestTimeout); // Clear timeout on early response
      }
    } else {
      console.error("POP3 Login failed for user:", username);
      if (!responded) {
        responded = true;
        res.status(401).json({ message: "POP3 Login failed" });
      }
      client.quit();
      clearTimeout(requestTimeout); // Clear timeout on early response
    }
  });

  client.on("list", (status, msgcount) => {
    console.log("POP3 list status:", status, "msgcount:", msgcount);
    if (!status) {
      console.error("Failed to list emails from POP3 server");
      if (!responded) {
        responded = true;
        res.status(500).json({ message: "Failed to list emails" });
      }
      client.quit();
      clearTimeout(requestTimeout); // Clear timeout on early response
      return;
    }
    categorization.totalFetched = msgcount;
    if (msgcount === 0) {
      console.log("No new emails on POP3 server.");
      if (!responded) {
        responded = true;
        res.json({ message: "No new emails.", categorization });
      }
      client.quit();
      clearTimeout(requestTimeout);
      return;
    }
    for (let i = 1; i <= msgcount; i++) {
      client.retr(i);
    }
  });

  client.on("retr", async (status, msgnumber, data) => {
    console.log(`POP3 retr status for msg ${msgnumber}:`, status);
    if (!status) {
      console.warn(`Failed to retrieve email ${msgnumber}`);
      emailsProcessed++;
      if (emailsProcessed === categorization.totalFetched && !responded) {
        responded = true;
        res.json({ message: "Email sync complete.", categorization });
        clearTimeout(requestTimeout);
        client.quit();
      }
      return;
    }
    try {
      const parsed = await simpleParser(data);
      let folderId = 'inbox'; // Default folder

      const lowerSubject = parsed.subject ? parsed.subject.toLowerCase() : '';
      const lowerFrom = parsed.from && parsed.from.text ? parsed.from.text.toLowerCase() : '';
      const senderAddress = parsed.from?.value?.[0]?.address?.toLowerCase() || ''; // Get clean sender address

      // Prioritize categorization based on existing user preferences for the sender.
      if (senderAddress && senderPreferencesCache[senderAddress]) {
        folderId = senderPreferencesCache[senderAddress];
        console.log(`Email from ${senderAddress} auto-categorized to ${folderId} based on user preference.`);
      } else {
        // Existing categorization logic (only if no sender preference found)
        // Categorize emails based on keywords in subject or sender information.
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

      // Check if the email already exists in the database to prevent duplicates.
      const existingEmail = await Email.findOne({ messageId: parsed.messageId });
      if (!existingEmail) {
        // Create a new email document and save it to the database.
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
          isRead: false, // Newly fetched emails are unread
          isStarred: false,
        });
        await newEmail.save();
        categorization.newEmails++;
        categorization.categorized[folderId]++;
      }
    } catch (parseError) {
      console.error(`Error parsing or saving email ${msgnumber}:`, parseError);
    } finally {
      emailsProcessed++;
      // If all fetched emails have been processed, send the response and quit the client.
      if (emailsProcessed === categorization.totalFetched && !responded) {
        console.log("All POP3 emails processed.");
        responded = true;
        res.json({ message: "Email sync complete.", categorization });
        clearTimeout(requestTimeout);
        client.quit();
      }
    }
  });

  client.on("error", (err) => {
    console.error("POP3 client experienced an error:", err);
    if (!responded) { // Prevent setting headers twice
      responded = true;
      res.status(500).json({ message: "POP3 client error", error: err.message });
    }
    client.quit();
    clearTimeout(requestTimeout);
  });

  client.on("quit", () => {
    console.log("POP3 client disconnected.");
    clearTimeout(requestTimeout);
  });
});

// --- Placeholder functions for emailController.js ---
// YOU NEED TO REPLACE THESE WITH YOUR ACTUAL LOGIC
// If you already have these defined in another file, you should consolidate them here.

const getSavedEmails = asyncHandler(async (req, res) => {
  // Your logic for fetching saved emails from DB based on folderId, search, pagination etc.
  // Example:
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
    // Log a warning for debugging. This means a SenderPreference won't be saved for this email.
    console.warn(`Skipping SenderPreference for email ID: ${emailId} due to missing or invalid sender address: "${senderAddress}"`);
    // The email move will still proceed.
  }

  res.status(200).json({ message: `Email moved to ${folderId} and preference saved.`, email });
});


const recategorizeEmails = asyncHandler(async (req, res) => {
  // This function would typically re-run categorization logic for existing emails
  // based on updated rules or preferences.
  // For now, it's a placeholder. A full implementation would iterate through emails
  // and apply your categorization logic, potentially updating their folderId.

  // Example: Reapply sender preferences to all emails from known senders
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
    // For large datasets, this might be a separate background task.
    await Email.updateMany(
      { 'from.address': senderAddress, _id: { $ne: id }, folderId: oldFolderId },
      { $set: { folderId: categoryId } }
    );
  } else {
    // Log a warning for debugging. This means a SenderPreference won't be saved for this email.
    console.warn(`Skipping SenderPreference for email ID: ${id} due to missing or invalid sender address: "${senderAddress}"`);
    // The manual categorization will still proceed.
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
    // Add more stats as needed (e.g., emails by date, etc.)
  });
});

const validateCategorization = asyncHandler(async (req, res) => {
  // This is a more complex function that would involve:
  // 1. Fetching a subset of emails.
  // 2. Potentially manually reviewing them or comparing current folderId with a "ground truth".
  // 3. Reporting on accuracy.
  // For a full implementation, you'd need a mechanism to define "correct" categorization.
  // For now, it's a placeholder.

  const totalEmails = await Email.countDocuments();
  const sampleSize = Math.min(totalEmails, 100); // Take a sample up to 100 emails

  const sampleEmails = await Email.aggregate([{ $sample: { size: sampleSize } }]);

  // In a real scenario, you'd have a 'trueCategory' field or a manual review system
  // to compare against. For this example, let's just simulate some validation logic.
  let correctPredictions = 0;
  sampleEmails.forEach(email => {
    // This is simplified. Actual validation would compare the 'folderId'
    // with a known correct category for that email/sender.
    // For demonstration, let's say 'information' folder emails are "correct" if their subject has 'newsletter'
    if (email.folderId === 'information' && email.subject && email.subject.toLowerCase().includes('newsletter')) {
      correctPredictions++;
    }
    // Add more complex validation rules here
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
