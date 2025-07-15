const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');
const Email = require('../models/emailModel');
const SenderPreference = require('../models/senderPreferenceModel');
const EmailCategorizationService = require('../services/emailCategorizationService');

// Initialize categorization service
const categorizer = new EmailCategorizationService();

// Define valid folder IDs (updated with new categories)
const VALID_FOLDER_IDS = [
  'inbox', 'supplier', 'competitor', 'information',
  'customers', 'marketing', 'archive', 'spam', 'important' // Added spam, important
];

// Configuration constants
const CONFIG = {
  POP3_TIMEOUT: 45000, // 45 seconds
  EMAIL_PREVIEW_LENGTH: 200,
  MAX_CONTENT_LENGTH: 2000,
  CONFIDENCE_THRESHOLDS: {
    HIGH: 30,
    MEDIUM: 15,
    LOW: 0
  },
  BATCH_SIZE: 50, // Process emails in batches
  MAX_RETRIES: 3
};

// Utility function to create timeout promise
const createTimeout = (ms, message = 'Operation timed out') => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
};

// --- POP3 Email Fetching Helper Functions ---
// These functions abstract the POP3 client interactions,
// making the main controller functions cleaner.

const connectToPOP3 = (client) => {
  return new Promise((resolve, reject) => {
    let connected = false;

    const timeoutId = setTimeout(() => {
      if (!connected) {
        reject(new Error('Connection timeout'));
        client.quit();
      }
    }, 10000);

    client.on('error', (err) => {
      clearTimeout(timeoutId);
      if (!connected) {
        connected = true;
        reject(err);
      }
    });

    client.on('connect', () => {
      clearTimeout(timeoutId);
      if (!connected) {
        connected = true;
        console.log(' Connected to POP3 server');
        resolve();
      }
    });
  });
};

const loginToPOP3 = (client, username, password) => {
  return new Promise((resolve, reject) => {
    client.on('login', (status) => {
      if (status) {
        console.log(' Login successful');
        resolve();
      } else {
        reject(new Error('Login failed'));
      }
    });

    client.login(username, password);
  });
};

const getEmailCount = (client) => {
  return new Promise((resolve, reject) => {
    client.on('stat', (status, data) => {
      if (status) {
        console.log(`📧 Found ${data.count} emails`);
        resolve(data.count);
      } else {
        reject(new Error('STAT command failed'));
      }
    });

    client.stat();
  });
};

const retrieveEmail = (client, messageNumber) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout retrieving message ${messageNumber}`));
    }, 5000);

    client.once('retr', async (status, msgnumber, data) => {
      clearTimeout(timeoutId);

      if (!status) {
        reject(new Error(`Failed to retrieve message ${messageNumber}`));
        return;
      }

      try {
        const parsed = await new Promise((parseResolve, parseReject) => {
          simpleParser(data, (err, result) => {
            if (err) parseReject(err);
            else parseResolve(result);
          });
        });

        resolve(parsed);
      } catch (parseError) {
        reject(parseError);
      }
    });

    client.retr(messageNumber);
  });
};

const processFetchedEmail = async (parsed, messageNumber, recategorize, senderPreferencesCache, categorizationStats) => {
  try {
    const emailData = {
      subject: parsed.subject || '(No Subject)',
      from: {
        name: parsed.from?.value?.[0]?.name || parsed.from?.name || '',
        address: parsed.from?.value?.[0]?.address || parsed.from?.address || parsed.from?.text || ''
      },
      date: parsed.date || new Date(),
      text: parsed.text || '',
      html: parsed.html || '',
      messageId: parsed.messageId || `${Date.now()}-${messageNumber}`,
      folderId: null,
      confidenceScore: 0
    };

    // Prioritize categorization based on existing user preferences for the sender.
    const senderAddress = emailData.from.address.toLowerCase();
    if (senderAddress && senderPreferencesCache[senderAddress]) {
        emailData.folderId = senderPreferencesCache[senderAddress];
    } else {
        // Enhanced categorization with the categorization service
        emailData.folderId = categorizer.categorizeEmail(emailData);
    }

    // Calculate confidence score using the service
    const sender = categorizer.extractSenderInfo(emailData);
    const subject = (emailData.subject || '').toLowerCase();
    const content = emailData.text ? emailData.text.toLowerCase().substring(0, CONFIG.MAX_CONTENT_LENGTH) : '';

    emailData.confidenceScore = categorizer.calculateCategoryScore(
      emailData.folderId,
      sender,
      subject,
      content
    );

    // Update categorization stats
    if (!categorizationStats.categorized[emailData.folderId]) {
      categorizationStats.categorized[emailData.folderId] = 0;
    }
    categorizationStats.categorized[emailData.folderId]++;
    categorizationStats.confidenceScores.push(emailData.confidenceScore);

    // Classify confidence levels
    if (emailData.confidenceScore >= CONFIG.CONFIDENCE_THRESHOLDS.HIGH) {
      categorizationStats.confidenceDistribution.high++;
    } else if (emailData.confidenceScore >= CONFIG.CONFIDENCE_THRESHOLDS.MEDIUM) {
      categorizationStats.confidenceDistribution.medium++;
    } else {
      categorizationStats.confidenceDistribution.low++;
    }

    // Save to database with duplicate checking
    try {
      const existingEmail = await Email.findOne({ messageId: emailData.messageId });
      if (!existingEmail) {
        await Email.create(emailData);
        console.log(` Saved: "${emailData.subject?.substring(0, 50)}..." → ${emailData.folderId} (${emailData.confidenceScore})`);
      } else {
        // Update if recategorization is requested or if category/confidence changed significantly
        const shouldUpdate = recategorize ||
          existingEmail.folderId !== emailData.folderId ||
          Math.abs((existingEmail.confidenceScore || 0) - emailData.confidenceScore) > 5;

        if (shouldUpdate) {
          await Email.findByIdAndUpdate(existingEmail._id, {
            folderId: emailData.folderId,
            confidenceScore: emailData.confidenceScore,
            updatedAt: new Date()
          });
          console.log(`Updated: "${emailData.subject?.substring(0, 50)}..." → ${emailData.folderId} (${emailData.confidenceScore})`);
        } else {
          console.log(` Skipped: "${emailData.subject?.substring(0, 50)}..." (no changes)`);
        }
      }
    } catch (dbError) {
      console.error(' Database error:', dbError.message);
      categorizationStats.errors++;
      throw dbError;
    }

    categorizationStats.processed++;

    // Return processed email data for response
    return {
      id: emailData.messageId,
      subject: emailData.subject,
      from: emailData.from,
      date: emailData.date,
      text: emailData.text.substring(0, CONFIG.EMAIL_PREVIEW_LENGTH) +
            (emailData.text.length > CONFIG.EMAIL_PREVIEW_LENGTH ? '...' : ''),
      folderId: emailData.folderId,
      confidenceScore: emailData.confidenceScore
    };

  } catch (error) {
    console.error(` Error processing email ${messageNumber}:`, error.message);
    categorizationStats.errors++;
    throw error;
  }
};

// --- Main Controller Functions (exported) ---

/**
 * @desc Fetch emails from POP3 server, categorize, and save them to DB.
 * @route GET /api/emails
 * @access Public (or authenticated if you add auth middleware)
 */
const getEmails = async (req, res) => {
  const { limit = 100, offset = 0, recategorize = false } = req.query;

  const host = process.env.POP3_HOST || 'pop.gmail.com';
  const pop3Port = 995;
  const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
  const password = process.env.POP3_PASS || 'bssr xsrf tjvs pxyu'; // Ensure this is an App Password for Gmail

  const client = new POP3Client(pop3Port, host, {
    tlserrs: false,
    enabletls: true,
    debug: false,
    ignoretlserrs: true,
  });

  let emails = [];
  let responded = false; // Flag to prevent multiple responses
  let categorizationStats = {
    total: 0,
    processed: 0,
    categorized: {},
    errors: 0,
    confidenceScores: [],
    confidenceDistribution: {
      high: 0,
      medium: 0,
      low: 0
    },
    averageConfidence: 0,
    processingTime: Date.now()
  };

  // Cache sender preferences for efficient categorization
  let senderPreferencesCache = {};

  try {
    // Load sender preferences before starting POP3 operations
    const preferences = await SenderPreference.find({});
    preferences.forEach(pref => {
        senderPreferencesCache[pref.senderAddress] = pref.folderId;
    });
    console.log(`Loaded ${preferences.length} sender preferences for categorization.`);

    // Connect and authenticate to POP3 server
    await Promise.race([
      connectToPOP3(client),
      createTimeout(10000, 'Connection timeout')
    ]);

    await Promise.race([
      loginToPOP3(client, username, password),
      createTimeout(10000, 'Login timeout')
    ]);

    // Get total email count from POP3 server
    const totalEmails = await Promise.race([
      getEmailCount(client),
      createTimeout(5000, 'STAT timeout')
    ]);

    categorizationStats.total = totalEmails;

    if (totalEmails === 0) {
      client.quit();
      return res.json({
        emails: [],
        categorization: categorizationStats,
        message: 'No emails found'
      });
    }

    // Determine the range of emails to process based on limit and offset
    const startIndex = Math.max(1, totalEmails - parseInt(offset) - parseInt(limit) + 1);
    const endIndex = Math.min(totalEmails, totalEmails - parseInt(offset));

    console.log(`📥 Processing emails ${startIndex} to ${endIndex} of ${totalEmails}`);

    // Process emails in batches to avoid overwhelming the server/memory
    const batchSize = Math.min(CONFIG.BATCH_SIZE, parseInt(limit));
    const emailPromises = [];

    for (let i = startIndex; i <= endIndex; i++) {
      emailPromises.push(
        retrieveEmail(client, i)
          .then(parsed => processFetchedEmail(parsed, i, recategorize, senderPreferencesCache, categorizationStats))
          .catch(error => {
            console.error(` Failed to process email ${i}:`, error.message);
            categorizationStats.errors++;
            return null; // Continue processing other emails even if one fails
          })
      );

      // Execute promises in batches
      if (emailPromises.length >= batchSize || i === endIndex) {
        const batchResults = await Promise.allSettled(emailPromises);

        for (const result of batchResults) {
          if (result.status === 'fulfilled' && result.value) {
            emails.push(result.value);
          }
        }

        emailPromises.length = 0; // Clear the array for the next batch

        // Brief pause between batches to prevent overwhelming the server
        if (i < endIndex) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    // Calculate final statistics after all emails are processed
    categorizationStats.processingTime = Date.now() - categorizationStats.processingTime;

    if (categorizationStats.confidenceScores.length > 0) {
      categorizationStats.averageConfidence = Math.round(
        (categorizationStats.confidenceScores.reduce((a, b) => a + b, 0) /
         categorizationStats.confidenceScores.length) * 100
      ) / 100;
    }

    console.log(' Categorization Complete:', {
      total: categorizationStats.total,
      processed: categorizationStats.processed,
      errors: categorizationStats.errors,
      avgConfidence: categorizationStats.averageConfidence,
      time: `${categorizationStats.processingTime}ms`
    });

    client.quit(); // Disconnect from POP3 server

    // Send final response with processed emails and statistics
    res.json({
      emails: emails,
      categorization: categorizationStats,
      message: `Successfully processed ${emails.length} emails`,
      summary: {
        total: emails.length,
        highConfidence: categorizationStats.confidenceDistribution.high,
        mediumConfidence: categorizationStats.confidenceDistribution.medium,
        lowConfidence: categorizationStats.confidenceDistribution.low,
        averageConfidence: categorizationStats.averageConfidence,
        processingTimeMs: categorizationStats.processingTime
      },
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        total: totalEmails,
        hasMore: parseInt(offset) + parseInt(limit) < totalEmails
      }
    });

  } catch (error) {
    console.error(' POP3 Operation Failed:', error.message);

    // Ensure response is sent only once in case of errors
    if (!responded) {
      responded = true;

      // Try to gracefully close connection even on error
      try {
        client.quit();
      } catch (quitError) {
        console.error('Error closing POP3 connection:', quitError.message);
      }

      // Send error response, including partial results if any were processed
      res.status(error.message.includes('timeout') ? 408 : 500).json({
        error: error.message,
        partialResults: emails.length > 0 ? {
          emails: emails,
          categorization: categorizationStats
        } : null
      });
    }
  }
};

/**
 * @desc Get saved emails from DB with optional folder, search, pagination, and unread filter.
 * @route GET /api/emails/saved
 * @access Public (or authenticated)
 */
const getSavedEmails = async (req, res) => {
  try {
    const { folderId, limit = 50, page = 1, unreadOnly, q } = req.query;
    let filter = {};

    // Apply folder filter if a specific folder is requested and valid.
    if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    } else if (folderId === 'all') {
      // 'all' means no folder filter, so we don't add folderId to the filter object.
    }

    // Apply unread filter if `unreadOnly` is explicitly 'true'.
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    // Apply search query across relevant fields if 'q' (query) parameter is provided.
    if (q) {
      filter.$or = [
        { subject: { $regex: q, $options: 'i' } }, // Case-insensitive search on subject
        { 'from.name': { $regex: q, $options: 'i' } }, // Case-insensitive search on sender name
        { 'from.address': { $regex: q, $options: 'i' } }, // Case-insensitive search on sender address
        { text: { $regex: q, $options: 'i' } } // Case-insensitive search on email body text
      ];
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch emails from the database based on filter, sorted by date, with pagination limits.
    const emails = await Email.find(filter)
      .sort({ date: -1 }) // Sort by date in descending order (most recent first)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count of emails matching the filter for pagination metadata.
    const total = await Email.countDocuments(filter);
    // Get total unread count of emails matching the current filter.
    const unreadCount = await Email.countDocuments({ ...filter, isRead: false });

    // Respond with the fetched emails and pagination metadata.
    res.json({
      emails,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)), // Calculate total pages
        unreadCount // Include unread count specific to the applied filters
      }
    });
  } catch (err) {
    console.error('Error fetching saved emails:', err);
    res.status(500).json({ error: 'Failed to fetch saved emails' });
  }
};

/**
 * @desc Get unread count for a specific folder or all emails.
 * This endpoint can be considered deprecated by `getUnreadCounts` for a more comprehensive view.
 * @route GET /api/emails/unread-count
 * @access Public (or authenticated)
 */
const getUnreadCount = async (req, res) => {
  try {
    const { folderId } = req.query;
    let filter = { isRead: false }; // Always filter for unread emails

    // If a specific folderId is provided and valid, add it to the filter.
    if (folderId && folderId !== 'all' && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    }

    // Count documents matching the constructed filter.
    const count = await Email.countDocuments(filter);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

/**
 * @desc Get unread counts for all defined folders.
 * @route GET /api/emails/unread-counts
 * @access Public (or authenticated)
 */
const getUnreadCounts = async (req, res) => {
  try {
    const counts = {}; // Object to store unread counts per folder
    let totalUnread = 0; // Accumulator for total unread emails across all folders

    // Iterate through all valid folder IDs to get unread count for each.
    for (const folderId of VALID_FOLDER_IDS) {
      const count = await Email.countDocuments({ folderId, isRead: false });
      counts[folderId] = count;
      totalUnread += count;
    }

    counts.all = totalUnread; // Add a total unread count for all folders

    res.json({ unreadCounts: counts });
  } catch (error) {
    console.error('Error getting unread counts:', error);
    res.status(500).json({ error: 'Failed to get unread counts' });
  }
};

/**
 * @desc Get total email counts per folder, including total unread counts for each.
 * @route GET /api/emails/counts
 * @access Public (or authenticated)
 */
const getEmailCounts = async (req, res) => {
  try {
    const counts = {}; // Object to store total email counts per folder
    const unreadCounts = {}; // Object to store unread email counts per folder
    let totalAllEmails = 0; // Total count of all emails in the database
    let totalUnreadAllEmails = 0; // Total unread emails in the database

    // Get overall total and total unread counts first
    totalAllEmails = await Email.countDocuments({});
    totalUnreadAllEmails = await Email.countDocuments({ isRead: false });

    // Populate counts and unread counts for each valid folder.
    for (const folderId of VALID_FOLDER_IDS) {
      const count = await Email.countDocuments({ folderId });
      const unreadCount = await Email.countDocuments({ folderId, isRead: false });

      counts[folderId] = count;
      unreadCounts[folderId] = unreadCount;
    }

    // Add 'all' category totals to the counts objects
    counts.all = totalAllEmails;
    unreadCounts.all = totalUnreadAllEmails;

    res.json({
      counts, // Total emails per folder
      unreadCounts, // Unread emails per folder
      total: totalAllEmails, // Grand total of all emails
      totalUnread: totalUnreadAllEmails, // Grand total of unread emails
      categories: VALID_FOLDER_IDS // List of all valid folder IDs
    });
  } catch (err) {
    console.error('Error getting counts:', err);
    res.status(500).json({ error: 'Failed to get counts' });
  }
};

/**
 * @desc Mark a specific email as read.
 * @route PUT /api/emails/:emailId/read
 * @access Public (or authenticated)
 */
const markEmailAsRead = async (req, res) => {
  try {
    const { emailId } = req.params; // Get email ID from URL parameters

    // Find the email by ID and update its `isRead` status to true.
    // `new: true` option returns the updated document.
    const email = await Email.findByIdAndUpdate(
      emailId,
      {
        isRead: true,
        updatedAt: new Date() // Update timestamp to reflect modification
      },
      { new: true }
    );

    // If email is not found, send a 404 response.
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Respond with success message and the updated email object.
    res.json({ success: true, email, message: `Email ${emailId} marked as read` });
  } catch (error) {
    console.error('Error marking email as read:', error);
    res.status(500).json({ error: 'Failed to mark email as read' });
  }
};

/**
 * @desc Mark a specific email as unread.
 * @route PATCH /api/emails/:emailId/unread
 * @access Public (or authenticated)
 */
const markEmailAsUnread = async (req, res) => {
  try {
    const { emailId } = req.params; // Get email ID from URL parameters

    // Find the email by ID and update its `isRead` status to false.
    const email = await Email.findByIdAndUpdate(
      emailId,
      {
        isRead: false,
        updatedAt: new Date() // Update timestamp
      },
      { new: true }
    );

    // If email is not found, send a 404 response.
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Respond with success message and the updated email object.
    res.json({ success: true, email });
  } catch (error) {
    console.error('Error marking email as unread:', error);
    res.status(500).json({ error: 'Failed to mark email as unread' });
  }
};

/**
 * @desc Bulk mark multiple emails as read, either by a list of IDs or all unread in a specific folder.
 * @route PATCH /api/emails/bulk-read
 * @access Public (or authenticated)
 */
const bulkMarkEmailsAsRead = async (req, res) => {
  try {
    const { emailIds, folderId } = req.body; // Get email IDs array or folder ID from request body

    let filter = {}; // Initialize filter object for the updateMany operation

    // Determine the filter based on whether specific email IDs or a folder ID is provided.
    if (emailIds && Array.isArray(emailIds) && emailIds.length > 0) {
      // If emailIds array is provided, mark those specific emails as read.
      filter._id = { $in: emailIds };
    } else if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      // If a valid folderId is provided, mark all unread emails within that folder as read.
      filter.folderId = folderId;
      filter.isRead = false; // Only target unread emails in this folder
    } else {
      // If neither valid emailIds nor a valid folderId is provided, send a 400 error.
      return res.status(400).json({ error: 'Either emailIds array with content or a valid folderId is required' });
    }

    // Update multiple emails matching the constructed filter to `isRead: true`.
    const result = await Email.updateMany(
      filter,
      {
        isRead: true,
        updatedAt: new Date() // Update timestamp for all modified emails
      }
    );

    // Respond with success, count of modified documents, and a message.
    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} emails marked as read`
    });
  } catch (error) {
    console.error('Error bulk marking emails as read:', error);
    res.status(500).json({ error: 'Failed to bulk mark emails as read' });
  }
};

/**
 * @desc Move an email to a different folder, save sender preference, and re-categorize past emails from that sender.
 * @route PUT /api/emails/:emailId/folder
 * @access Public (or authenticated)
 */
const moveEmailToFolder = async (req, res) => {
  try {
    const { emailId } = req.params; // Email ID to move
    const { folderId: newFolderId } = req.body; // New folder ID from request body

    // Validate the new folder ID against the list of valid folders.
    if (!newFolderId || !VALID_FOLDER_IDS.includes(newFolderId)) {
      return res.status(400).json({ error: 'Invalid folder ID' });
    }

    // Find the email to get its sender's address before moving.
    const emailToMove = await Email.findById(emailId);
    if (!emailToMove) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Extract sender's email address, converting to lowercase for consistency.
    const senderAddress = emailToMove.from.address.toLowerCase();

    // 1. Update the specific email's folderId.
    const updatedEmail = await Email.findByIdAndUpdate(
      emailId,
      {
        folderId: newFolderId,
        updatedAt: new Date() // Update timestamp
      },
      { new: true } // Return the updated document
    );

    // 2. Save or update the sender's preference for future categorization.
    // This ensures that future emails from this sender are automatically categorized into the chosen folder.
    await SenderPreference.findOneAndUpdate(
      { senderAddress: senderAddress }, // Query by sender address
      { folderId: newFolderId }, // Set the new preferred folderId
      { upsert: true, new: true } // `upsert: true` creates a new document if not found, `new: true` returns the updated/created doc
    );
    console.log(`Sender preference saved for ${senderAddress} -> ${newFolderId}`);

    // 3. Re-categorize all *other* existing emails from this sender to the new folder.
    // This ensures consistency across all past emails from the same sender.
    const bulkUpdateResult = await Email.updateMany(
      {
        'from.address': senderAddress, // Target emails from the same sender
        _id: { $ne: emailId }, // Exclude the specific email that was just moved manually
        folderId: { $ne: newFolderId } // Only update emails not already in the target folder
      },
      {
        folderId: newFolderId,
        updatedAt: new Date() // Update timestamp for bulk modified emails
      }
    );
    console.log(`Re-categorized ${bulkUpdateResult.modifiedCount} other emails from ${senderAddress}.`);

    // Respond with success message, the updated email, and details of bulk re-categorization.
    res.json({
      message: `Email ${emailId} moved to folder ${newFolderId}. Also updated preference and re-categorized ${bulkUpdateResult.modifiedCount} other emails.`,
      email: updatedEmail
    });

  } catch (error) {
    console.error('Error moving email and updating preference:', error);
    res.status(500).json({ error: 'Failed to move email and update preference' });
  }
};

/**
 * @desc Enhanced recategorization of emails with detailed reporting.
 * @route POST /api/emails/recategorize
 * @access Public (or authenticated)
 */
const recategorizeEmails = async (req, res) => {
  const { categoryId, batchSize = 100, dryRun = false } = req.body;

  console.log(' Starting enhanced email recategorization...', {
    categoryId: categoryId || 'all',
    batchSize,
    dryRun
  });

  try {
    // Build query: if categoryId is provided and valid, filter by it; otherwise, target all emails.
    const query = categoryId && VALID_FOLDER_IDS.includes(categoryId)
      ? { folderId: categoryId }
      : {};

    // Get the total count of emails to be processed.
    const totalEmails = await Email.countDocuments(query);

    if (totalEmails === 0) {
      return res.json({
        message: 'No emails found to recategorize',
        stats: { total: 0, updated: 0, errors: 0 }
      });
    }

    let processed = 0;
    let updated = 0;
    let errors = 0;
    const categoryChanges = {}; // Tracks changes from old category to new category
    const confidenceReport = { // Reports on confidence score changes
      improved: 0,
      degraded: 0,
      unchanged: 0,
      distribution: { high: 0, medium: 0, low: 0 } // Distribution of new confidence scores
    };
    const processingLog = []; // Logs details of processed emails

    // Process emails in batches to manage memory and performance.
    for (let skip = 0; skip < totalEmails; skip += batchSize) {
      const emailBatch = await Email.find(query)
        .skip(skip)
        .limit(batchSize)
        .lean(); // Use .lean() for faster retrieval of plain JavaScript objects

      console.log(`Processing batch ${Math.floor(skip/batchSize) + 1}/${Math.ceil(totalEmails/batchSize)} (${emailBatch.length} emails)`);

      for (const email of emailBatch) {
        try {
          const oldCategory = email.folderId;
          const oldConfidence = email.confidenceScore || 0;

          // Use the categorization service to determine the new category.
          const newCategory = categorizer.categorizeEmail(email);

          // Recalculate confidence score for the new category.
          const sender = categorizer.extractSenderInfo(email);
          const subject = (email.subject || '').toLowerCase();
          const content = email.text ? email.text.toLowerCase().substring(0, CONFIG.MAX_CONTENT_LENGTH) : '';

          const newConfidence = categorizer.calculateCategoryScore(
            newCategory,
            sender,
            subject,
            content
          );

          // Determine if an update is necessary (category change or significant confidence change).
          const needsUpdate = oldCategory !== newCategory ||
                             Math.abs(oldConfidence - newConfidence) > 5; // Threshold for significant change

          if (needsUpdate) {
            if (!dryRun) {
              // If not a dry run, update the email in the database.
              await Email.findByIdAndUpdate(email._id, {
                folderId: newCategory,
                confidenceScore: newConfidence,
                updatedAt: new Date()
              });
            }

            updated++; // Increment count of updated emails

            // Track category changes (e.g., "inbox → supplier")
            if (oldCategory !== newCategory) {
              const changeKey = `${oldCategory} → ${newCategory}`;
              categoryChanges[changeKey] = (categoryChanges[changeKey] || 0) + 1;
            }

            // Track confidence changes (improved, degraded, unchanged)
            if (newConfidence > oldConfidence) {
              confidenceReport.improved++;
            } else if (newConfidence < oldConfidence) {
              confidenceReport.degraded++;
            } else {
              confidenceReport.unchanged++;
            }

            // Update confidence distribution (high, medium, low)
            if (newConfidence >= CONFIG.CONFIDENCE_THRESHOLDS.HIGH) {
              confidenceReport.distribution.high++;
            } else if (newConfidence >= CONFIG.CONFIDENCE_THRESHOLDS.MEDIUM) {
              confidenceReport.distribution.medium++;
            } else {
              confidenceReport.distribution.low++;
            }

            // Log details of the processing for reporting.
            const logEntry = {
              subject: email.subject?.substring(0, 50) + '...',
              from: email.from?.address || 'unknown',
              categoryChange: `${oldCategory} → ${newCategory}`,
              confidenceChange: `${oldConfidence} → ${newConfidence}`,
              timestamp: new Date()
            };

            processingLog.push(logEntry);

            // Log the first few changes to console for immediate feedback.
            if (processingLog.length <= 10) {
              console.log(`📁 ${dryRun ? '[DRY RUN] ' : ''}Updated: "${email.subject?.substring(0, 30)}..." ${oldCategory} → ${newCategory} (${oldConfidence} → ${newConfidence})`);
            }
          }

          processed++; // Increment total processed emails

        } catch (emailError) {
          console.error(' Error processing email:', email._id, emailError.message);
          errors++; // Increment error count
        }
      }

      // Brief pause between batches to prevent overwhelming the database.
      if (skip + batchSize < totalEmails) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Compile final statistics for the response.
    const stats = {
      total: totalEmails,
      processed,
      updated,
      errors,
      updatePercentage: Math.round((updated / totalEmails) * 100 * 100) / 100 // Percentage of emails updated
    };

    console.log('✅ Recategorization complete:', stats);

    // Send the detailed report as a JSON response.
    res.json({
      message: `${dryRun ? 'Dry run completed' : 'Successfully recategorized emails'}`,
      stats,
      categoryChanges,
      confidenceReport,
      processingLog: processingLog.slice(0, 20), // Return only the first 20 log entries for brevity
      dryRun
    });

  } catch (error) {
    console.error(' Recategorization failed:', error);
    res.status(500).json({
      error: 'Recategorization failed',
      message: error.message
    });
  }
};

/**
 * @desc Get emails by folder with pagination, sorting, and filtering.
 * @route GET /api/emails/folders/:folderId
 * @access Public (or authenticated)
 */
const getEmailsByFolder = async (req, res) => {
  const { folderId } = req.params; // Folder ID from URL parameters
  const {
    page = 1,
    limit = 20,
    sortBy = 'date',
    sortOrder = 'desc', // 'asc' or 'desc'
    minConfidence = 0, // Minimum confidence score
    search = '' // Search query string
  } = req.query;

  // Validate the provided folder ID.
  if (!VALID_FOLDER_IDS.includes(folderId)) {
    return res.status(400).json({
      error: 'Invalid folder ID',
      validFolders: VALID_FOLDER_IDS
    });
  }

  try {
    const pageNum = Math.max(1, parseInt(page)); // Ensure page number is at least 1
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Limit between 1 and 100
    const skip = (pageNum - 1) * limitNum; // Calculate documents to skip for pagination

    // Build query object based on folderId, minimum confidence, and search term.
    const query = {
      folderId,
      confidenceScore: { $gte: parseFloat(minConfidence) }
    };

    // Add search functionality if a search term is provided.
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } }, // Case-insensitive regex search on subject
        { 'from.address': { $regex: search, $options: 'i' } }, // Case-insensitive regex search on sender address
        { 'from.name': { $regex: search, $options: 'i' } } // Case-insensitive regex search on sender name
      ];
    }

    // Build sort object dynamically based on sortBy and sortOrder.
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1; // -1 for descending, 1 for ascending

    // Execute both email fetching and total count in parallel for efficiency.
    const [emails, totalCount] = await Promise.all([
      Email.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(), // Use .lean() for faster retrieval of plain JavaScript objects
      Email.countDocuments(query) // Get total count of documents matching the query
    ]);

    // Calculate folder-specific statistics (total emails, average confidence, etc.).
    const stats = await Email.aggregate([
      { $match: { folderId } }, // Match documents for the specific folder
      {
        $group: {
          _id: null, // Group all matched documents into a single group
          totalEmails: { $sum: 1 }, // Count total emails in the folder
          avgConfidence: { $avg: '$confidenceScore' }, // Calculate average confidence
          maxConfidence: { $max: '$confidenceScore' }, // Find max confidence
          minConfidence: { $min: '$confidenceScore' } // Find min confidence
        }
      }
    ]);

    // Extract folder statistics, providing defaults if no emails are found in the folder.
    const folderStats = stats[0] || {
      totalEmails: 0,
      avgConfidence: 0,
      maxConfidence: 0,
      minConfidence: 0
    };

    // Respond with emails, pagination info, folder statistics, and applied filters.
    res.json({
      emails: emails.map(email => ({
        ...email,
        // Truncate email text for preview purposes
        text: email.text?.substring(0, CONFIG.EMAIL_PREVIEW_LENGTH) +
              (email.text?.length > CONFIG.EMAIL_PREVIEW_LENGTH ? '...' : '')
      })),
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalEmails: totalCount,
        pageSize: limitNum,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1
      },
      folderStats: {
        ...folderStats,
        avgConfidence: Math.round(folderStats.avgConfidence * 100) / 100 // Round average confidence
      },
      filters: {
        folderId,
        minConfidence: parseFloat(minConfidence),
        search,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error(' Error fetching folder emails:', error);
    res.status(500).json({
      error: 'Failed to fetch emails',
      message: error.message
    });
  }
};

/**
 * @desc Manually categorize an email and optionally learn from the correction.
 * @route PUT /api/emails/:id/category
 * @access Public (or authenticated)
 */
const manualCategorization = async (req, res) => {
  const { id } = req.params; // Email ID from URL parameters
  const { folderId, learn = false } = req.body; // New folder ID and learn flag from request body

  // Validate the new folder ID.
  if (!VALID_FOLDER_IDS.includes(folderId)) {
    return res.status(400).json({
      error: 'Invalid folder ID',
      validFolders: VALID_FOLDER_IDS
    });
  }

  try {
    // Find the email to be categorized.
    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const oldCategory = email.folderId;
    const oldConfidence = email.confidenceScore || 0;

    // Recalculate confidence score for the manually assigned category.
    const sender = categorizer.extractSenderInfo(email);
    const subject = (email.subject || '').toLowerCase();
    const content = email.text ? email.text.toLowerCase().substring(0, CONFIG.MAX_CONTENT_LENGTH) : '';

    const newConfidence = categorizer.calculateCategoryScore(
      folderId, // Use the manually provided folderId for score calculation
      sender,
      subject,
      content
    );

    // Update the email's folderId, confidence score, and mark as manually classified.
    await Email.findByIdAndUpdate(id, {
      folderId,
      confidenceScore: newConfidence,
      updatedAt: new Date(),
      manuallyClassified: true // Flag to indicate manual classification
    });

    // If 'learn' flag is true and the category has changed, instruct the categorizer to learn.
    if (learn && oldCategory !== folderId) {
      categorizer.learnFromCorrection(email, folderId, oldCategory);
    }

    console.log(`👤 Manual categorization: "${email.subject?.substring(0, 30)}..." ${oldCategory} → ${folderId}`);

    // Respond with success message and details of the changes.
    res.json({
      message: 'Email categorization updated successfully',
      changes: {
        oldCategory,
        newCategory: folderId,
        oldConfidence,
        newConfidence,
        learned: learn && oldCategory !== folderId // Indicates if learning occurred
      }
    });

  } catch (error) {
    console.error(' Error updating email category:', error);
    res.status(500).json({
      error: 'Failed to update email category',
      message: error.message
    });
  }
};

/**
 * @desc Get detailed email statistics across categories and confidence levels.
 * @route GET /api/emails/statistics
 * @access Public (or authenticated)
 */
const getEmailStatistics = async (req, res) => {
  try {
    // Execute multiple aggregation queries in parallel for efficiency.
    const [categoryStats, confidenceStats, recentEmails] = await Promise.all([
      // 1. Category distribution: Group emails by folderId and calculate counts and average confidence.
      Email.aggregate([
        {
          $group: {
            _id: '$folderId', // Group by folderId
            count: { $sum: 1 }, // Count emails in each folder
            avgConfidence: { $avg: '$confidenceScore' }, // Calculate average confidence per folder
            maxConfidence: { $max: '$confidenceScore' }, // Max confidence per folder
            minConfidence: { $min: '$confidenceScore' } // Min confidence per folder
          }
        },
        { $sort: { count: -1 } } // Sort by count in descending order
      ]),

      // 2. Confidence distribution: Categorize emails into confidence buckets (low, medium, high).
      Email.aggregate([
        {
          $bucket: {
            groupBy: '$confidenceScore', // Field to group by
            boundaries: [0, 15, 30, 100], // Define score ranges for buckets
            default: 'other', // Category for scores outside defined boundaries
            output: {
              count: { $sum: 1 }, // Count emails in each bucket
              avgConfidence: { $avg: '$confidenceScore' } // Average confidence for emails in each bucket
            }
          }
        }
      ]),

      // 3. Recent emails count: Count emails received in the last 24 hours.
      Email.countDocuments({
        date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Emails from last 24 hours
      })
    ]);

    // Get additional category information from the categorization service.
    const categoryInfo = categorizer.getCategoryInfo();

    // Compile all statistics into a single response object.
    const statistics = {
      categories: categoryStats.map(stat => ({
        folderId: stat._id,
        count: stat.count,
        avgConfidence: Math.round(stat.avgConfidence * 100) / 100, // Round average confidence
        maxConfidence: stat.maxConfidence,
        minConfidence: stat.minConfidence
      })),
      confidenceDistribution: {
        // Map bucket results to named confidence levels
        low: confidenceStats.find(s => s._id === 0)?.count || 0,
        medium: confidenceStats.find(s => s._id === 15)?.count || 0,
        high: confidenceStats.find(s => s._id === 30)?.count || 0
      },
      recentEmails: recentEmails,
      categoryRules: categoryInfo, // Rules used by the categorization service
      totalEmails: categoryStats.reduce((sum, stat) => sum + stat.count, 0), // Sum of all emails across categories
      validFolders: VALID_FOLDER_IDS // List of all valid folder IDs
    };

    res.json(statistics);
  } catch (error) {
    console.error(' Error fetching statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
};

/**
 * @desc Validate categorization accuracy by re-categorizing a sample of emails and comparing results.
 * @route POST /api/emails/validate
 * @access Public (or authenticated)
 */
const validateCategorization = async (req, res) => {
  const { sampleSize = 100 } = req.body; // Number of emails to sample for validation

  try {
    // Get a random sample of emails from the database.
    const sampleEmails = await Email.aggregate([
      { $sample: { size: Math.min(sampleSize, 1000) } } // Limit sample size to 1000 for performance
    ]);

    if (sampleEmails.length === 0) {
      return res.json({
        message: 'No emails found for validation',
        validation: null
      });
    }

    // Use the email categorization service's validation method.
    // This method re-categorizes the sample and compares it to the stored categories,
    // providing insights into accuracy and potential miscategorizations.
    const validationResults = categorizer.validateCategorization(sampleEmails);

    // Respond with validation results and recommendations based on confidence distribution.
    res.json({
      message: `Validation completed on ${sampleEmails.length} emails`,
      validation: validationResults,
      recommendations: {
        lowConfidenceCount: validationResults.potentialMiscategorizations.length,
        // Suggest review if a significant portion of emails have low confidence
        needsReview: validationResults.confidenceDistribution.low > sampleEmails.length * 0.3,
        // Indicate if average confidence is generally good
        avgConfidenceGood: validationResults.confidenceDistribution.high > sampleEmails.length * 0.5
      }
    });

  } catch (error) {
    console.error(' Error validating categorization:', error);
    res.status(500).json({
      error: 'Failed to validate categorization',
      message: error.message
    });
  }
};


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
