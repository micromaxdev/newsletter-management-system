// const express = require("express");
// const dotenv = require("dotenv").config();
// const connectDB = require("./config/db");
// const path = require("path");
// const cors = require("cors");

// const POP3Client = require('poplib');
// const { simpleParser } = require('mailparser');
// const Email = require("./models/emailModel");


// // Initialize express app
// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));


// // User routes
// app.use("/api/users", require("./routes/userRoutes"));


// // POP3 Email API route
// app.get("/api/emails", async (req, res) => {
//   const host = 'pop.gmail.com';
//   const pop3Port = 995;
//   const username = 'newslettertester885@gmail.com';
//   const password = 'bssr xsrf tjvs pxyu';

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

//   function retrieveMessage(current, total) {
//     client.retr(current);
//     client.once('retr', function(status, msgnumber, data) {
//       if (status) {
//         simpleParser(data, (err, parsed) => {
//           if (!err) {
//             emails.push({
//               subject: parsed.subject,
//               from: parsed.from.text,
//               date: parsed.date,
//               text: parsed.text,
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
// const port = process.env.PORT || 5002;
// app.listen(port, () => console.log(`Server running on port ${port}`));

//working code

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

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // User routes
// app.use("/api/users", require("./routes/userRoutes"));

// // POP3 Email API route - Now saves to database
// app.get("/api/emails", async (req, res) => {
//   const host = 'pop.gmail.com';
//   const pop3Port = 995;
//   const username = 'newslettertester885@gmail.com';
//   const password = 'bssr xsrf tjvs pxyu';

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
//                 name: parsed.from?.name || '',
//                 address: parsed.from?.address || parsed.from?.text || ''
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
//               subject: parsed.subject,
//               from: parsed.from?.text || '',
//               date: parsed.date,
//               text: parsed.text,
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
// const port = process.env.PORT || 5003;
// app.listen(port, () => console.log(`Server running on port ${port}`));

const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');

// Import models and services
const Email = require("./models/emailModel");
const FolderService = require("./services/folderService");

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

// EXISTING EMAIL ROUTES

// POP3 Email API route - Enhanced with folder support
app.get("/api/emails", async (req, res) => {
  const host = 'pop.gmail.com';
  const pop3Port = 995;
  const username = 'newslettertester885@gmail.com';
  const password = 'bssr xsrf tjvs pxyu';

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

  async function retrieveMessage(current, total) {
    client.retr(current);
    client.once('retr', async function(status, msgnumber, data) {
      if (status) {
        simpleParser(data, async (err, parsed) => {
          if (!err) {
            const emailData = {
              subject: parsed.subject,
              from: {
                name: parsed.from?.name || '',
                address: parsed.from?.address || parsed.from?.text || ''
              },
              date: parsed.date,
              text: parsed.text,
              html: parsed.html,
              messageId: parsed.messageId
            };

            // Save to database with automatic folder assignment
            try {
              const existingEmail = await Email.findOne({ messageId: emailData.messageId });
              if (!existingEmail && emailData.messageId) {
                await Email.create(emailData);
                console.log(`Saved email to folder: ${emailData.subject}`);
              }
            } catch (dbError) {
              console.error('Error saving email:', dbError);
            }

            // Add to response array
            emails.push({
              subject: parsed.subject,
              from: parsed.from?.text || '',
              date: parsed.date,
              text: parsed.text,
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

// Get saved emails from database
app.get("/api/emails/saved", async (req, res) => {
  try {
    const savedEmails = await Email.find().sort({ date: -1 }).limit(50);
    res.json(savedEmails);
  } catch (error) {
    console.error('Error fetching saved emails:', error);
    res.status(500).json({ error: 'Failed to fetch saved emails' });
  }
});

// Get count of saved emails
app.get("/api/emails/count", async (req, res) => {
  try {
    const count = await Email.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting emails:', error);
    res.status(500).json({ error: 'Failed to count emails' });
  }
});

// NEW FOLDER MANAGEMENT ROUTES

// Get all sender folders
app.get("/api/folders", async (req, res) => {
  try {
    const folders = await FolderService.getAllFolders();
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// Get folders grouped by domain
app.get("/api/folders/by-domain", async (req, res) => {
  try {
    const foldersByDomain = await FolderService.getFoldersByDomain();
    res.json(foldersByDomain);
  } catch (error) {
    console.error('Error fetching folders by domain:', error);
    res.status(500).json({ error: 'Failed to fetch folders by domain' });
  }
});

// Get emails from a specific folder
app.get("/api/folders/:folderName/emails", async (req, res) => {
  try {
    const { folderName } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    
    const result = await FolderService.getEmailsByFolder(folderName, limit, skip);
    res.json(result);
  } catch (error) {
    console.error('Error fetching emails from folder:', error);
    res.status(500).json({ error: 'Failed to fetch emails from folder' });
  }
});

// Search folders
app.get("/api/folders/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const folders = await FolderService.searchFolders(q);
    res.json(folders);
  } catch (error) {
    console.error('Error searching folders:', error);
    res.status(500).json({ error: 'Failed to search folders' });
  }
});

// Get folder statistics
app.get("/api/folders/stats", async (req, res) => {
  try {
    const stats = await FolderService.getFolderStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching folder stats:', error);
    res.status(500).json({ error: 'Failed to fetch folder statistics' });
  }
});

// Organize existing emails into folders (migration utility)
app.post("/api/folders/organize", async (req, res) => {
  try {
    const result = await FolderService.organizeExistingEmails();
    res.json({
      message: 'Emails organized successfully',
      ...result
    });
  } catch (error) {
    console.error('Error organizing emails:', error);
    res.status(500).json({ error: 'Failed to organize emails' });
  }
});

// Mark email as read/unread
app.patch("/api/emails/:emailId/read", async (req, res) => {
  try {
    const { emailId } = req.params;
    const { isRead } = req.body;
    
    const email = await Email.findByIdAndUpdate(
      emailId,
      { isRead: Boolean(isRead) },
      { new: true }
    );
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json(email);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

// Star/unstar email
app.patch("/api/emails/:emailId/star", async (req, res) => {
  try {
    const { emailId } = req.params;
    const { isStarred } = req.body;
    
    const email = await Email.findByIdAndUpdate(
      emailId,
      { isStarred: Boolean(isStarred) },
      { new: true }
    );
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json(email);
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ error: 'Failed to update email' });
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

// Start server
const port = process.env.PORT || 5003;
app.listen(port, () => console.log(`Server running on port ${port}`));