const express = require('express');
const router = express.Router();
const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');
const Email = require('../models/emailModel');

// Define valid folder IDs
const VALID_FOLDER_IDS = [
  'inbox', 'supplier', 'competitor', 'information', 
  'customers', 'marketing', 'archive'
];

// Auto-categorize function
const categorizeEmail = (emailData) => {
  const sender = (emailData.from?.address || emailData.from || '').toLowerCase();
  const subject = (emailData.subject || '').toLowerCase();
  
  // Define categorization rules
  if (sender.includes('supplier') || subject.includes('supplier') || 
      sender.includes('vendor') || subject.includes('invoice') ||
      subject.includes('purchase') || subject.includes('order')) {
    return 'supplier';
  }
  if (sender.includes('competitor') || subject.includes('competitor') ||
      subject.includes('market analysis') || subject.includes('industry') ||
      subject.includes('benchmark') || subject.includes('analysis')) {
    return 'competitor';
  }
  if (subject.includes('newsletter') || subject.includes('news') ||
      subject.includes('update') || subject.includes('announcement') ||
      subject.includes('report') || subject.includes('insights')) {
    return 'information';
  }
  if (sender.includes('customer') || subject.includes('customer') ||
      subject.includes('support') || subject.includes('inquiry') ||
      subject.includes('feedback') || subject.includes('complaint')) {
    return 'customers';
  }
  if (subject.includes('marketing') || subject.includes('promo') ||
      subject.includes('sale') || subject.includes('offer') ||
      subject.includes('campaign') || subject.includes('advertisement')) {
    return 'marketing';
  }
  
  // Default to inbox
  return 'inbox';
};

// GET /api/emails - Fetch emails from POP3 server
router.get('/emails', async (req, res) => {
  const host = process.env.POP3_HOST || 'pop.gmail.com';
  const pop3Port = 995;
  const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
  const password = process.env.POP3_PASS || 'bssr xsrf tjvs pxyu';

  const client = new POP3Client(pop3Port, host, {
    tlserrs: false,
    enabletls: true,
    debug: false,
    ignoretlserrs: true,
  });

  let emails = [];
  let responded = false;

  // Error handling
  client.on('error', function(err) {
    console.error('POP3 Client Error:', err);
    if (!responded) {
      responded = true;
      return res.status(500).json({ error: err.message });
    }
  });

  // Connection established
  client.on('connect', function() {
    console.log('Connected to POP3 server');
    client.login(username, password);
  });

  // Login response
  client.on('login', function(status) {
    if (status) {
      console.log('Login successful');
      client.stat();
    } else {
      console.error('Login failed');
      if (!responded) {
        responded = true;
        res.status(401).json({ error: "Login failed" });
      }
      client.quit();
    }
  });

  // Stat response (message count)
  client.on('stat', function(status, data) {
    if (!status) {
      console.error('STAT command failed');
      if (!responded) {
        responded = true;
        res.status(500).json({ error: "STAT failed" });
      }
      client.quit();
    } else {
      console.log(`Found ${data.count} emails`);
      if (data.count > 0) {
        retrieveMessage(1, data.count);
      } else {
        if (!responded) {
          responded = true;
          res.json([]);
        }
        client.quit();
      }
    }
  });

  // Retrieve individual messages
  async function retrieveMessage(current, total) {
    client.retr(current);
    client.once('retr', async function(status, msgnumber, data) {
      if (status) {
        try {
          const parsed = await new Promise((resolve, reject) => {
            simpleParser(data, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          });

          const emailData = {
            subject: parsed.subject || '(No Subject)',
            from: {
              name: parsed.from?.value?.[0]?.name || parsed.from?.name || '',
              address: parsed.from?.value?.[0]?.address || parsed.from?.address || parsed.from?.text || ''
            },
            date: parsed.date || new Date(),
            text: parsed.text || '',
            html: parsed.html || '',
            messageId: parsed.messageId || `${Date.now()}-${current}`,
            folderId: null // Will be set by categorization
          };

          // Auto-categorize the email
          emailData.folderId = categorizeEmail(emailData);

          // Save to database (avoid duplicates)
          try {
            const existingEmail = await Email.findOne({ messageId: emailData.messageId });
            if (!existingEmail) {
              await Email.create(emailData);
              console.log(`Saved email: ${emailData.subject} -> ${emailData.folderId} folder`);
            } else {
              console.log(`Email already exists: ${emailData.subject}`);
            }
          } catch (dbError) {
            console.error('Error saving email:', dbError);
          }

          // Add to response array
          emails.push({
            subject: emailData.subject,
            from: emailData.from,
            date: emailData.date,
            text: emailData.text,
            folderId: emailData.folderId
          });

        } catch (parseError) {
          console.error('Error parsing email:', parseError);
        }
      } else {
        console.error(`Failed to retrieve email ${current}`);
      }
      
      // Continue with next email or finish
      if (current < total) {
        retrieveMessage(current + 1, total);
      } else {
        if (!responded) {
          responded = true;
          res.json(emails);
        }
        client.quit();
      }
    });
  }

  // Set timeout to prevent hanging
  setTimeout(() => {
    if (!responded) {
      responded = true;
      res.status(408).json({ error: 'Request timeout' });
      client.quit();
    }
  }, 30000); // 30 second timeout
});

// GET /api/emails/saved - Get saved emails from database
router.get('/emails/saved', async (req, res) => {
  try {
    const { folderId, limit = 50, offset = 0 } = req.query;
    
    let filter = {};
    if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    }
    
    const savedEmails = await Email.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    res.json(savedEmails);
  } catch (error) {
    console.error('Error fetching saved emails:', error);
    res.status(500).json({ error: 'Failed to fetch saved emails' });
  }
});

// GET /api/emails/count - Get total email count
router.get('/emails/count', async (req, res) => {
  try {
    const { folderId } = req.query;
    
    let filter = {};
    if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    }
    
    const count = await Email.countDocuments(filter);
    res.json({ count });
  } catch (error) {
    console.error('Error counting emails:', error);
    res.status(500).json({ error: 'Failed to count emails' });
  }
});

// GET /api/emails/counts - Get email counts per folder
router.get('/emails/counts', async (req, res) => {
  try {
    const counts = {};
    
    // Get counts for each folder
    for (const folderId of VALID_FOLDER_IDS) {
      counts[folderId] = await Email.countDocuments({ folderId });
    }
    
    // Get total count
    counts.total = await Email.countDocuments();
    
    res.json(counts);
  } catch (error) {
    console.error('Error counting emails:', error);
    res.status(500).json({ error: 'Failed to count emails' });
  }
});

// GET /api/emails/:id - Get specific email by ID
router.get('/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const email = await Email.findById(id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json(email);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// PUT /api/emails/:id/folder - Move email to different folder
router.put('/emails/:id/folder', async (req, res) => {
  try {
    const { id } = req.params;
    const { folderId } = req.body;
    
    if (!VALID_FOLDER_IDS.includes(folderId)) {
      return res.status(400).json({ 
        error: `Invalid folder ID. Must be one of: ${VALID_FOLDER_IDS.join(', ')}` 
      });
    }
    
    const email = await Email.findByIdAndUpdate(
      id, 
      { folderId: folderId },
      { new: true }
    );
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json({
      message: `Email moved to ${folderId} folder`,
      email: email
    });
    
  } catch (error) {
    console.error('Error moving email:', error);
    res.status(500).json({ error: 'Failed to move email' });
  }
});

// PUT /api/emails/:id/read - Mark email as read/unread
router.put('/emails/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    
    const email = await Email.findByIdAndUpdate(
      id,
      { isRead: Boolean(isRead) },
      { new: true }
    );
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json({
      message: `Email marked as ${isRead ? 'read' : 'unread'}`,
      email: email
    });
    
  } catch (error) {
    console.error('Error updating email read status:', error);
    res.status(500).json({ error: 'Failed to update email read status' });
  }
});

// DELETE /api/emails/:id - Delete email
router.delete('/emails/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const email = await Email.findByIdAndDelete(id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json({ message: 'Email deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

// POST /api/emails/categorize - Bulk categorize existing emails
router.post('/emails/categorize', async (req, res) => {
  try {
    const emails = await Email.find({ 
      $or: [
        { folderId: { $exists: false } },
        { folderId: null },
        { folderId: '' }
      ]
    });
    
    let categorized = 0;
    
    for (const email of emails) {
      const folderId = categorizeEmail(email);
      await Email.findByIdAndUpdate(email._id, { folderId });
      categorized++;
    }
    
    res.json({ 
      message: `Successfully categorized ${categorized} emails`,
      categorized 
    });
  } catch (error) {
    console.error('Error categorizing emails:', error);
    res.status(500).json({ error: 'Failed to categorize emails' });
  }
});

// POST /api/emails/bulk-move - Move multiple emails to folder
router.post('/emails/bulk-move', async (req, res) => {
  try {
    const { emailIds, folderId } = req.body;
    
    if (!Array.isArray(emailIds) || emailIds.length === 0) {
      return res.status(400).json({ error: 'Email IDs array is required' });
    }
    
    if (!VALID_FOLDER_IDS.includes(folderId)) {
      return res.status(400).json({ 
        error: `Invalid folder ID. Must be one of: ${VALID_FOLDER_IDS.join(', ')}` 
      });
    }
    
    const result = await Email.updateMany(
      { _id: { $in: emailIds } },
      { folderId: folderId }
    );
    
    res.json({
      message: `${result.modifiedCount} emails moved to ${folderId} folder`,
      modifiedCount: result.modifiedCount
    });
    
  } catch (error) {
    console.error('Error bulk moving emails:', error);
    res.status(500).json({ error: 'Failed to bulk move emails' });
  }
});

// GET /api/emails/search - Search emails
router.get('/emails/search', async (req, res) => {
  try {
    const { q, folderId, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    let filter = {
      $or: [
        { subject: { $regex: q, $options: 'i' } },
        { 'from.name': { $regex: q, $options: 'i' } },
        { 'from.address': { $regex: q, $options: 'i' } },
        { text: { $regex: q, $options: 'i' } }
      ]
    };
    
    if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    }
    
    const emails = await Email.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.json(emails);
  } catch (error) {
    console.error('Error searching emails:', error);
    res.status(500).json({ error: 'Failed to search emails' });
  }
});

module.exports = router;