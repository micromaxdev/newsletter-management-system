// //working code
// const express = require("express");
// const dotenv = require("dotenv").config();
// const connectDB = require("./config/db");
// const path = require("path");
// const cors = require("cors");

// const POP3Client = require('poplib');
// const { simpleParser } = require('mailparser');

// // Import Email model for database storage
// const Email = require("./models/emailModel");

// // Initialize express app
// const app = express();

// const folderRoutes = require("./routes/folderRoutes");
// app.use("/api/folders", folderRoutes);

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // User routes
// app.use("/api/users", require("./routes/userRoutes"));

// // POP3 Email API route - Now saves to database and returns parsed sender info
// app.get("/api/emails", async (req, res) => {
//   const host = process.env.POP3_HOST || 'pop.gmail.com';
//   const pop3Port = 995;
//   const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
//   const password = process.env.POP3_PASS || 'bssr xsrf tjvs pxyu';

//   const client = new POP3Client(pop3Port, host, {
//     tlserrs: false,
//     enabletls: true,
//     debug: false,
//     ignoretlserrs: true,
//   });

//   let emails = [];
//   let responded = false;

//   client.on('error', function(err) {
//     if (!responded) {
//       responded = true;
//       return res.status(500).json({ error: err.message });
//     }
//   });

//   client.on('connect', function() {
//     client.login(username, password);
//   });

//   client.on('login', function(status) {
//     if (status) {
//       client.stat();
//     } else {
//       if (!responded) {
//         responded = true;
//         res.status(401).json({ error: "Login failed" });
//       }
//       client.quit();
//     }
//   });

//   client.on('stat', function(status, data) {
//     if (!status) {
//       if (!responded) {
//         responded = true;
//         res.status(500).json({ error: "STAT failed" });
//       }
//       client.quit();
//     } else {
//       if (data.count > 0) {
//         retrieveMessage(1, data.count);
//       } else {
//         if (!responded) {
//           responded = true;
//           res.json([]);
//         }
//         client.quit();
//       }
//     }
//   });

//   async function retrieveMessage(current, total) {
//     client.retr(current);
//     client.once('retr', async function(status, msgnumber, data) {
//       if (status) {
//         simpleParser(data, async (err, parsed) => {
//           if (!err) {
//             const emailData = {
//               subject: parsed.subject,
//               from: {
//                 name: parsed.from?.value?.[0]?.name || parsed.from?.name || '',
//                 address: parsed.from?.value?.[0]?.address || parsed.from?.address || parsed.from?.text || ''
//               },
//               date: parsed.date,
//               text: parsed.text,
//               html: parsed.html,
//               messageId: parsed.messageId
//             };

//             // Save to database (avoid duplicates)
//             try {
//               const existingEmail = await Email.findOne({ messageId: emailData.messageId });
//               if (!existingEmail && emailData.messageId) {
//                 await Email.create(emailData);
//                 console.log(`Saved email: ${emailData.subject}`);
//               }
//             } catch (dbError) {
//               console.error('Error saving email:', dbError);
//             }

//             // Also add to response array for immediate return
//             emails.push({
//               subject: emailData.subject,
//               from: emailData.from,
//               date: emailData.date,
//               text: emailData.text,
//             });
//           }
          
//           if (current < total) {
//             retrieveMessage(current + 1, total);
//           } else {
//             if (!responded) {
//               responded = true;
//               res.json(emails);
//             }
//             client.quit();
//           }
//         });
//       } else {
//         if (current < total) {
//           retrieveMessage(current + 1, total);
//         } else {
//           if (!responded) {
//             responded = true;
//             res.json(emails);
//           }
//           client.quit();
//         }
//       }
//     });
//   }
// });

// //


// // New route to get saved emails from database
// app.get("/api/emails/saved", async (req, res) => {
//   try {
//     const savedEmails = await Email.find().sort({ date: -1 }).limit(50);
//     res.json(savedEmails);
//   } catch (error) {
//     console.error('Error fetching saved emails:', error);
//     res.status(500).json({ error: 'Failed to fetch saved emails' });
//   }
// });

// // Route to get count of saved emails
// app.get("/api/emails/count", async (req, res) => {
//   try {
//     const count = await Email.countDocuments();
//     res.json({ count });
//   } catch (error) {
//     console.error('Error counting emails:', error);
//     res.status(500).json({ error: 'Failed to count emails' });
//   }
// });


// // Define the folder names
// const FOLDERS = [
//   'Supplier',
//   'Competitor', 
//   'Information',
//   'Customers',
//   'Marketing'
// ];

// // Create folders route
// app.get("/api/folders/create", async (req, res) => {
//   try {
//     console.log('Creating email folders...');
    
//     const folderStatus = [];
    
//     for (const folderName of FOLDERS) {
//       // Check if folder already has emails
//       const existingEmails = await Email.countDocuments({ folder: folderName });
      
//       folderStatus.push({
//         name: folderName,
//         exists: existingEmails > 0,
//         emailCount: existingEmails
//       });
//     }
    
//     res.json({
//       message: 'Folders created successfully',
//       folders: folderStatus
//     });
    
//   } catch (error) {
//     console.error('Error creating folders:', error);
//     res.status(500).json({ error: 'Failed to create folders' });
//   }
// });

// // Move email to folder route
// app.put("/api/emails/:emailId/folder", async (req, res) => {
//   try {
//     const { emailId } = req.params;
//     const { folderName } = req.body;
    
//     if (!FOLDERS.includes(folderName)) {
//       return res.status(400).json({ 
//         error: `Invalid folder name. Must be one of: ${FOLDERS.join(', ')}` 
//       });
//     }
    
//     const result = await Email.findByIdAndUpdate(
//       emailId, 
//       { folder: folderName },
//       { new: true }
//     );
    
//     if (result) {
//       res.json({
//         message: `Email moved to ${folderName} folder`,
//         email: result
//       });
//     } else {
//       res.status(404).json({ error: 'Email not found' });
//     }
    
//   } catch (error) {
//     console.error('Error moving email:', error);
//     res.status(500).json({ error: 'Failed to move email' });
//   }
// });

// // Serve frontend
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));
//   app.get("*", (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, "../", "frontend", "build", "index.html")
//     )
//   );
// } else {
//   app.get("/", (req, res) => res.send("Please set to production"));
// }

// // Error handling middleware
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode ? res.statusCode : 500;
//   res.status(statusCode);
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// });

// // Start server
// const port = process.env.PORT || 5007;
// app.listen(port, () => console.log(`Server running on port ${port}`));
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');

// Import Email model for database storage
const Email = require("./models/emailModel");

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// User routes
app.use("/api/users", require("./routes/userRoutes"));

// Folder routes
const folderRoutes = require("./routes/folderRoutes");
app.use("/api/folders", folderRoutes);

// Define valid folder IDs
const VALID_FOLDER_IDS = [
  'inbox', 'supplier', 'competitor', 'information', 
  'customers', 'marketing', 'archive'
];

// POP3 Email API route - Enhanced with folder assignment
app.get("/api/emails", async (req, res) => {
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

  client.on('error', function(err) {
    if (!responded) {
      responded = true;
      return res.status(500).json({ error: err.message });
    }
  });

  client.on('connect', function() {
    client.login(username, password);
  });

  client.on('login', function(status) {
    if (status) {
      client.stat();
    } else {
      if (!responded) {
        responded = true;
        res.status(401).json({ error: "Login failed" });
      }
      client.quit();
    }
  });

  client.on('stat', function(status, data) {
    if (!status) {
      if (!responded) {
        responded = true;
        res.status(500).json({ error: "STAT failed" });
      }
      client.quit();
    } else {
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

  // categorise emails based on sender or subject
  function categorizeEmail(emailData) {
    const sender = (emailData.from.address || '').toLowerCase();
    const subject = (emailData.subject || '').toLowerCase();
    
    // Define categorization rules
    if (sender.includes('supplier') || subject.includes('supplier') || 
        sender.includes('vendor') || subject.includes('invoice')) {
      return 'supplier';
    }
    if (sender.includes('competitor') || subject.includes('competitor') ||
        subject.includes('market analysis') || subject.includes('industry')) {
      return 'competitor';
    }
    if (subject.includes('newsletter') || subject.includes('news') ||
        subject.includes('update') || subject.includes('announcement')) {
      return 'information';
    }
    if (sender.includes('customer') || subject.includes('customer') ||
        subject.includes('support') || subject.includes('inquiry')) {
      return 'customers';
    }
    if (subject.includes('marketing') || subject.includes('promo') ||
        subject.includes('sale') || subject.includes('offer')) {
      return 'marketing';
    }
    
    // Default to inbox
    return 'inbox';
  }

  async function retrieveMessage(current, total) {
    client.retr(current);
    client.once('retr', async function(status, msgnumber, data) {
      if (status) {
        simpleParser(data, async (err, parsed) => {
          if (!err) {
            const emailData = {
              subject: parsed.subject,
              from: {
                name: parsed.from?.value?.[0]?.name || parsed.from?.name || '',
                address: parsed.from?.value?.[0]?.address || parsed.from?.address || parsed.from?.text || ''
              },
              date: parsed.date,
              text: parsed.text,
              html: parsed.html,
              messageId: parsed.messageId,
              folderId: null // Will be set by categorization
            };

            // Auto-categorize the email
            emailData.folderId = categorizeEmail(emailData);

            // Save to database (avoid duplicates)
            try {
              const existingEmail = await Email.findOne({ messageId: emailData.messageId });
              if (!existingEmail && emailData.messageId) {
                await Email.create(emailData);
                console.log(`Saved email: ${emailData.subject} -> ${emailData.folderId} folder`);
              }
            } catch (dbError) {
              console.error('Error saving email:', dbError);
            }

            // Also add to response array for immediate return
            emails.push({
              subject: emailData.subject,
              from: emailData.from,
              date: emailData.date,
              text: emailData.text,
              folderId: emailData.folderId
            });
          }
          
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
      } else {
        if (current < total) {
          retrieveMessage(current + 1, total);
        } else {
          if (!responded) {
            responded = true;
            res.json(emails);
          }
          client.quit();
        }
      }
    });
  }
});

// Get saved emails from database with optional folder filtering
app.get("/api/emails/saved", async (req, res) => {
  try {
    const { folderId } = req.query;
    
    let filter = {};
    if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    }
    
    const savedEmails = await Email.find(filter).sort({ date: -1 }).limit(50);
    res.json(savedEmails);
  } catch (error) {
    console.error('Error fetching saved emails:', error);
    res.status(500).json({ error: 'Failed to fetch saved emails' });
  }
});

// Move email to different folder
app.put("/api/emails/:emailId/folder", async (req, res) => {
  try {
    const { emailId } = req.params;
    const { folderId } = req.body;
    
    if (!VALID_FOLDER_IDS.includes(folderId)) {
      return res.status(400).json({ 
        error: `Invalid folder ID. Must be one of: ${VALID_FOLDER_IDS.join(', ')}` 
      });
    }
    
    const result = await Email.findByIdAndUpdate(
      emailId, 
      { folderId: folderId },
      { new: true }
    );
    
    if (result) {
      res.json({
        message: `Email moved to folder`,
        email: result
      });
    } else {
      res.status(404).json({ error: 'Email not found' });
    }
    
  } catch (error) {
    console.error('Error moving email:', error);
    res.status(500).json({ error: 'Failed to move email' });
  }
});

// Get email counts per folder
app.get("/api/emails/counts", async (req, res) => {
  try {
    const counts = {};
    
    for (const folderId of VALID_FOLDER_IDS) {
      counts[folderId] = await Email.countDocuments({ folderId });
    }
    
    res.json(counts);
  } catch (error) {
    console.error('Error counting emails:', error);
    res.status(500).json({ error: 'Failed to count emails' });
  }
});

// Route to get count of saved emails
app.get("/api/emails/count", async (req, res) => {
  try {
    const count = await Email.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting emails:', error);
    res.status(500).json({ error: 'Failed to count emails' });
  }
});

// Bulk categorize existing emails (utility endpoint)
app.post("/api/emails/categorize", async (req, res) => {
  try {
    const emails = await Email.find({ folderId: { $exists: false } });
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

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Auto-categorize function (helper)
function categorizeEmail(emailData) {
  const sender = (emailData.from?.address || emailData.from || '').toLowerCase();
  const subject = (emailData.subject || '').toLowerCase();
  
  // Define categorization rules
  if (sender.includes('supplier') || subject.includes('supplier') || 
      sender.includes('vendor') || subject.includes('invoice')) {
    return 'supplier';
  }
  if (sender.includes('competitor') || subject.includes('competitor') ||
      subject.includes('market analysis') || subject.includes('industry')) {
    return 'competitor';
  }
  if (subject.includes('newsletter') || subject.includes('news') ||
      subject.includes('update') || subject.includes('announcement')) {
    return 'information';
  }
  if (sender.includes('customer') || subject.includes('customer') ||
      subject.includes('support') || subject.includes('inquiry')) {
    return 'customers';
  }
  if (subject.includes('marketing') || subject.includes('promo') ||
      subject.includes('sale') || subject.includes('offer')) {
    return 'marketing';
  }
  
  // Default to inbox
  return 'inbox';
}

// Start server
const port = process.env.PORT || 5007;
app.listen(port, () => console.log(`Server running on port ${port}`));