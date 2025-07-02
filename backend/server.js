
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');

// Your Mongoose models
const Email = require("./models/emailModel");
const SenderPreference = require("./models/senderPreferenceModel"); // NEW: Import SenderPreference model

const app = express();
connectDB(); // Connect to MongoDB

// Middleware to enable Cross-Origin Resource Sharing (CORS) for all routes.
app.use(cors());
// Middleware to parse incoming JSON payloads.
app.use(express.json());
// Middleware to parse incoming URL-encoded payloads.
app.use(express.urlencoded({ extended: false }));

// Define valid folder IDs for email categorization.
const VALID_FOLDER_IDS = [
  'inbox', 'supplier', 'competitor', 'information',
  'customers', 'marketing', 'archive'
];

// POP3 Email API route - Fetch, categorize, and save emails
app.get("/api/emails", async (req, res) => {
  // Retrieve POP3 connection details from environment variables, with fallbacks.
  const host = process.env.POP3_HOST || 'pop.gmail.com';
  const pop3Port = 995;
  const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
  const password = process.env.POP3_PASS || 'your_app_password'; // Use an App Password for Gmail

  // Initialize POP3 client with TLS enabled for secure connection.
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

  // Cache sender preferences to avoid repeated DB lookups inside the 'retr' loop
  let senderPreferencesCache = {};

  // Event listener for POP3 client connection.
  client.on("connect", () => {
    client.login(username, password);
  });

  // Event listener for POP3 client login.
  client.on("login", async (status) => { // Made async to await DB call
    if (status) {
      try {
        // Load all sender preferences into a cache object (senderAddress to folderId)
        const preferences = await SenderPreference.find({});
        preferences.forEach(pref => {
          senderPreferencesCache[pref.senderAddress] = pref.folderId;
        });
        console.log(`Loaded ${preferences.length} sender preferences for categorization.`);
        client.list();
      } catch (dbError) {
        console.error("Error loading sender preferences:", dbError);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to load sender preferences for categorization." });
        }
        client.quit();
      }
    } else {
      console.error("POP3 Login failed for user:", username);
      if (!res.headersSent) {
          res.status(401).json({ message: "POP3 Login failed" });
      }
      client.quit();
    }
  });

  // Event listener for POP3 email list retrieval.
  client.on("list", (status, msgcount) => {
    if (!status) {
      console.error("Failed to list emails from POP3 server");
      if (!res.headersSent) {
          res.status(500).json({ message: "Failed to list emails" });
      }
      client.quit();
      return;
    }
    categorization.totalFetched = msgcount;
    if (msgcount === 0) {
      console.log("No new emails on POP3 server.");
      if (!res.headersSent) {
          res.json({ message: "No new emails.", categorization });
      }
      client.quit();
      return;
    }
    // Retrieve each email one by one.
    for (let i = 1; i <= msgcount; i++) {
      client.retr(i);
    }
  });

  // Event listener for retrieving individual emails.
  client.on("retr", async (status, msgnumber, data) => {
    if (!status) {
      console.warn(`Failed to retrieve email ${msgnumber}`);
      emailsProcessed++;
      if (emailsProcessed === categorization.totalFetched) {
        if (!res.headersSent) {
            res.json({ message: "Email sync complete.", categorization });
        }
        client.quit();
      }
      return;
    }
    try {
      // Parse the raw email data into a structured object.
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
      if (emailsProcessed === categorization.totalFetched) {
        console.log("All POP3 emails processed.");
        if (!res.headersSent) {
            res.json({ message: "Email sync complete.", categorization });
        }
        client.quit();
      }
    }
  });

  // Event listener for any POP3 client errors.
  client.on("error", (err) => {
    console.error("POP3 client experienced an error:", err);
    if (!res.headersSent) { // Prevent setting headers twice
      res.status(500).json({ message: "POP3 client error", error: err.message });
    }
    client.quit();
  });

  // Event listener for POP3 client disconnection.
  client.on("quit", () => {
    console.log("POP3 client disconnected.");
  });
});

// Mark email as read (Using PUT for idempotency and full resource update semantics)
app.put("/api/emails/:emailId/read", async (req, res) => {
  try {
    const { emailId } = req.params;
    // Find the email by ID and update its `isRead` status to true.
    const email = await Email.findByIdAndUpdate(
      emailId,
      {
        isRead: true,
        updatedAt: new Date() // Update timestamp
      },
      { new: true } // Return the updated document
    );

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ success: true, email, message: `Email ${emailId} marked as read` });
  } catch (error) {
    console.error('Error marking email as read:', error);
    res.status(500).json({ error: 'Failed to mark email as read' });
  }
});

// Mark email as unread
app.patch("/api/emails/:emailId/unread", async (req, res) => {
  try {
    const { emailId } = req.params;
    // Find the email by ID and update its `isRead` status to false.
    const email = await Email.findByIdAndUpdate(
      emailId,
      {
        isRead: false,
        updatedAt: new Date() // Update timestamp
      },
      { new: true }
    );

    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ success: true, email });
  } catch (error) {
    console.error('Error marking email as unread:', error);
    res.status(500).json({ error: 'Failed to mark email as unread' });
  }
});

// Get unread count with optional folder filter (can be deprecated by /unread-counts)
app.get("/api/emails/unread-count", async (req, res) => {
  try {
    const { folderId } = req.query;
    let filter = { isRead: false };

    // Apply folder filter if provided and valid.
    if (folderId && folderId !== 'all' && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    }

    // Count documents matching the filter.
    const count = await Email.countDocuments(filter);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Get unread counts for all folders (more comprehensive)
app.get("/api/emails/unread-counts", async (req, res) => {
  try {
    const counts = {};
    let totalUnread = 0;

    // Iterate through all valid folders and count unread emails for each.
    for (const folderId of VALID_FOLDER_IDS) {
      const count = await Email.countDocuments({ folderId, isRead: false });
      counts[folderId] = count;
      totalUnread += count;
    }

    counts.all = totalUnread;

    res.json({ unreadCounts: counts });
  } catch (error) {
    console.error('Error getting unread counts:', error);
    res.status(500).json({ error: 'Failed to get unread counts' });
  }
});

// Bulk mark emails as read
app.patch("/api/emails/bulk-read", async (req, res) => {
  try {
    const { emailIds, folderId } = req.body;

    let filter = {};

    // Determine the filter based on whether specific email IDs or a folder ID is provided.
    if (emailIds && Array.isArray(emailIds) && emailIds.length > 0) {
      filter._id = { $in: emailIds };
    } else if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
      filter.isRead = false; // Only mark unread emails in the folder as read
    } else {
      return res.status(400).json({ error: 'Either emailIds array with content or a valid folderId is required' });
    }

    // Update multiple emails matching the filter to `isRead: true`.
    const result = await Email.updateMany(
      filter,
      {
        isRead: true,
        updatedAt: new Date()
      }
    );

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} emails marked as read`
    });
  } catch (error) {
    console.error('Error bulk marking emails as read:', error);
    res.status(500).json({ error: 'Failed to bulk mark emails as read' });
  }
});


// Get saved emails from DB (with optional folder, search, pagination, and unread filter)
app.get("/api/emails/saved", async (req, res) => {
  try {
    const { folderId, limit = 50, page = 1, unreadOnly, q } = req.query;
    let filter = {};

    // Apply folder filter if a specific folder is requested.
    if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    } else if (folderId === 'all') {
      // No folder filter needed for 'all'
    }

    // Apply unread filter if `unreadOnly` is true.
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    // Apply search query across subject, sender name, sender address, and text content.
    if (q) {
      filter.$or = [
        { subject: { $regex: q, $options: 'i' } },
        { 'from.name': { $regex: q, $options: 'i' } },
        { 'from.address': { $regex: q, $options: 'i' } },
        { text: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Fetch emails based on filter, sort by date, apply limit and skip for pagination.
    const emails = await Email.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count of emails matching the filter.
    const total = await Email.countDocuments(filter);
    // Get total unread count of emails matching the filter.
    const unreadCount = await Email.countDocuments({ ...filter, isRead: false });

    res.json({
      emails,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
        unreadCount
      }
    });
  } catch (err) {
    console.error('Error fetching saved emails:', err);
    res.status(500).json({ error: 'Failed to fetch saved emails' });
  }
});

// Get email counts per folder (includes unread counts for each)
app.get("/api/emails/counts", async (req, res) => {
  try {
    const counts = {};
    const unreadCounts = {};
    let totalAllEmails = 0;
    let totalUnreadAllEmails = 0;

    totalAllEmails = await Email.countDocuments({});
    totalUnreadAllEmails = await Email.countDocuments({ isRead: false });

    // Populate counts and unread counts for each valid folder.
    for (const folderId of VALID_FOLDER_IDS) {
      const count = await Email.countDocuments({ folderId });
      const unreadCount = await Email.countDocuments({ folderId, isRead: false });

      counts[folderId] = count;
      unreadCounts[folderId] = unreadCount;
    }

    counts.all = totalAllEmails;
    unreadCounts.all = totalUnreadAllEmails;

    res.json({
      counts,
      unreadCounts,
      total: totalAllEmails,
      totalUnread: totalUnreadAllEmails,
      categories: VALID_FOLDER_IDS
    });
  } catch (err) {
    console.error('Error getting counts:', err);
    res.status(500).json({ error: 'Failed to get counts' });
  }
});

// Move email to different folder - UPDATED TO SAVE SENDER PREFERENCE AND RE-CATEGORIZE PAST EMAILS
app.put("/api/emails/:emailId/folder", async (req, res) => {
  try {
    const { emailId } = req.params;
    const { folderId: newFolderId } = req.body;

    // Validate the new folder ID.
    if (!newFolderId || !VALID_FOLDER_IDS.includes(newFolderId)) {
      return res.status(400).json({ error: 'Invalid folder ID' });
    }

    // Find the email to get its sender's address
    const emailToMove = await Email.findById(emailId);
    if (!emailToMove) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const senderAddress = emailToMove.from.address.toLowerCase();

    //  Update the specific email's folderId
    const updatedEmail = await Email.findByIdAndUpdate(
      emailId,
      {
        folderId: newFolderId,
        updatedAt: new Date()
      },
      { new: true }
    );

    // 3Save or update the sender's preference for future categorization
    // This creates or updates a document in SenderPreference to remember the user's chosen folder for this sender.
    await SenderPreference.findOneAndUpdate(
      { senderAddress: senderAddress },
      { folderId: newFolderId },
      { upsert: true, new: true } // upsert creates if not found, new returns updated doc
    );
    console.log(`Sender preference saved for ${senderAddress} -> ${newFolderId}`);

    // Re-categorize all *other* existing emails from this sender to the new folder
    // This ensures consistency by moving all past emails from the same sender to the new preferred folder.
    const bulkUpdateResult = await Email.updateMany(
      {
        'from.address': senderAddress,
        _id: { $ne: emailId }, // Exclude the email we just moved
        folderId: { $ne: newFolderId } // Only update if not already in the target folder
      },
      {
        folderId: newFolderId,
        updatedAt: new Date()
      }
    );
    console.log(`Re-categorized ${bulkUpdateResult.modifiedCount} other emails from ${senderAddress}.`);


    res.json({
      message: `Email ${emailId} moved to folder ${newFolderId}. Also updated preference and re-categorized ${bulkUpdateResult.modifiedCount} other emails.`,
      email: updatedEmail
    });

  } catch (error) {
    console.error('Error moving email and updating preference:', error);
    res.status(500).json({ error: 'Failed to move email and update preference' });
  }
});

// Serve frontend in production
// In production, serve the static files of the React frontend.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"))
  );
} else {
  // Simple message for development
  app.get("/", (req, res) => res.send("Please set NODE_ENV to production to serve frontend, or access frontend via its own dev server (e.g., http://localhost:3000)"));
}

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));