// // //working code
// // const express = require("express");
// // const dotenv = require("dotenv").config();
// // const connectDB = require("./config/db");
// // const path = require("path");
// // const cors = require("cors");

// // const POP3Client = require('poplib');
// // const { simpleParser } = require('mailparser');

// // // Import Email model for database storage
// // const Email = require("./models/emailModel");

// // // Initialize express app
// // const app = express();

// // const folderRoutes = require("./routes/folderRoutes");
// // app.use("/api/folders", folderRoutes);

// // // Connect to database
// // connectDB();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: false }));

// // // User routes
// // app.use("/api/users", require("./routes/userRoutes"));

// // // POP3 Email API route - Now saves to database and returns parsed sender info
// // app.get("/api/emails", async (req, res) => {
// //   const host = process.env.POP3_HOST || 'pop.gmail.com';
// //   const pop3Port = 995;
// //   const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
// //   const password = process.env.POP3_PASS || 'bssr xsrf tjvs pxyu';

// //   const client = new POP3Client(pop3Port, host, {
// //     tlserrs: false,
// //     enabletls: true,
// //     debug: false,
// //     ignoretlserrs: true,
// //   });

// //   let emails = [];
// //   let responded = false;

// //   client.on('error', function(err) {
// //     if (!responded) {
// //       responded = true;
// //       return res.status(500).json({ error: err.message });
// //     }
// //   });

// //   client.on('connect', function() {
// //     client.login(username, password);
// //   });

// //   client.on('login', function(status) {
// //     if (status) {
// //       client.stat();
// //     } else {
// //       if (!responded) {
// //         responded = true;
// //         res.status(401).json({ error: "Login failed" });
// //       }
// //       client.quit();
// //     }
// //   });

// //   client.on('stat', function(status, data) {
// //     if (!status) {
// //       if (!responded) {
// //         responded = true;
// //         res.status(500).json({ error: "STAT failed" });
// //       }
// //       client.quit();
// //     } else {
// //       if (data.count > 0) {
// //         retrieveMessage(1, data.count);
// //       } else {
// //         if (!responded) {
// //           responded = true;
// //           res.json([]);
// //         }
// //         client.quit();
// //       }
// //     }
// //   });

// //   async function retrieveMessage(current, total) {
// //     client.retr(current);
// //     client.once('retr', async function(status, msgnumber, data) {
// //       if (status) {
// //         simpleParser(data, async (err, parsed) => {
// //           if (!err) {
// //             const emailData = {
// //               subject: parsed.subject,
// //               from: {
// //                 name: parsed.from?.value?.[0]?.name || parsed.from?.name || '',
// //                 address: parsed.from?.value?.[0]?.address || parsed.from?.address || parsed.from?.text || ''
// //               },
// //               date: parsed.date,
// //               text: parsed.text,
// //               html: parsed.html,
// //               messageId: parsed.messageId
// //             };

// //             // Save to database (avoid duplicates)
// //             try {
// //               const existingEmail = await Email.findOne({ messageId: emailData.messageId });
// //               if (!existingEmail && emailData.messageId) {
// //                 await Email.create(emailData);
// //                 console.log(`Saved email: ${emailData.subject}`);
// //               }
// //             } catch (dbError) {
// //               console.error('Error saving email:', dbError);
// //             }

// //             // Also add to response array for immediate return
// //             emails.push({
// //               subject: emailData.subject,
// //               from: emailData.from,
// //               date: emailData.date,
// //               text: emailData.text,
// //             });
// //           }
          
// //           if (current < total) {
// //             retrieveMessage(current + 1, total);
// //           } else {
// //             if (!responded) {
// //               responded = true;
// //               res.json(emails);
// //             }
// //             client.quit();
// //           }
// //         });
// //       } else {
// //         if (current < total) {
// //           retrieveMessage(current + 1, total);
// //         } else {
// //           if (!responded) {
// //             responded = true;
// //             res.json(emails);
// //           }
// //           client.quit();
// //         }
// //       }
// //     });
// //   }
// // });

// // //


// // // New route to get saved emails from database
// // app.get("/api/emails/saved", async (req, res) => {
// //   try {
// //     const savedEmails = await Email.find().sort({ date: -1 }).limit(50);
// //     res.json(savedEmails);
// //   } catch (error) {
// //     console.error('Error fetching saved emails:', error);
// //     res.status(500).json({ error: 'Failed to fetch saved emails' });
// //   }
// // });

// // // Route to get count of saved emails
// // app.get("/api/emails/count", async (req, res) => {
// //   try {
// //     const count = await Email.countDocuments();
// //     res.json({ count });
// //   } catch (error) {
// //     console.error('Error counting emails:', error);
// //     res.status(500).json({ error: 'Failed to count emails' });
// //   }
// // });


// // // Define the folder names
// // const FOLDERS = [
// //   'Supplier',
// //   'Competitor', 
// //   'Information',
// //   'Customers',
// //   'Marketing'
// // ];

// // // Create folders route
// // app.get("/api/folders/create", async (req, res) => {
// //   try {
// //     console.log('Creating email folders...');
    
// //     const folderStatus = [];
    
// //     for (const folderName of FOLDERS) {
// //       // Check if folder already has emails
// //       const existingEmails = await Email.countDocuments({ folder: folderName });
      
// //       folderStatus.push({
// //         name: folderName,
// //         exists: existingEmails > 0,
// //         emailCount: existingEmails
// //       });
// //     }
    
// //     res.json({
// //       message: 'Folders created successfully',
// //       folders: folderStatus
// //     });
    
// //   } catch (error) {
// //     console.error('Error creating folders:', error);
// //     res.status(500).json({ error: 'Failed to create folders' });
// //   }
// // });

// // // Move email to folder route
// // app.put("/api/emails/:emailId/folder", async (req, res) => {
// //   try {
// //     const { emailId } = req.params;
// //     const { folderName } = req.body;
    
// //     if (!FOLDERS.includes(folderName)) {
// //       return res.status(400).json({ 
// //         error: `Invalid folder name. Must be one of: ${FOLDERS.join(', ')}` 
// //       });
// //     }
    
// //     const result = await Email.findByIdAndUpdate(
// //       emailId, 
// //       { folder: folderName },
// //       { new: true }
// //     );
    
// //     if (result) {
// //       res.json({
// //         message: `Email moved to ${folderName} folder`,
// //         email: result
// //       });
// //     } else {
// //       res.status(404).json({ error: 'Email not found' });
// //     }
    
// //   } catch (error) {
// //     console.error('Error moving email:', error);
// //     res.status(500).json({ error: 'Failed to move email' });
// //   }
// // });

// // // Serve frontend
// // if (process.env.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname, "../frontend/build")));
// //   app.get("*", (req, res) =>
// //     res.sendFile(
// //       path.resolve(__dirname, "../", "frontend", "build", "index.html")
// //     )
// //   );
// // } else {
// //   app.get("/", (req, res) => res.send("Please set to production"));
// // }

// // // Error handling middleware
// // app.use((err, req, res, next) => {
// //   const statusCode = res.statusCode ? res.statusCode : 500;
// //   res.status(statusCode);
// //   res.json({
// //     message: err.message,
// //     stack: process.env.NODE_ENV === "production" ? null : err.stack,
// //   });
// // });

// // // Start server
// // const port = process.env.PORT || 5007;
// // app.listen(port, () => console.log(`Server running on port ${port}`));
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

// // Folder routes
// const folderRoutes = require("./routes/folderRoutes");
// app.use("/api/folders", folderRoutes);

// // Define valid folder IDs
// const VALID_FOLDER_IDS = [
//   'inbox', 'supplier', 'competitor', 'information', 
//   'customers', 'marketing', 'archive'
// ];

// // POP3 Email API route - Enhanced with folder assignment
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

//   // categorise emails based on sender or subject
//   function categorizeEmail(emailData) {
//     const sender = (emailData.from.address || '').toLowerCase();
//     const subject = (emailData.subject || '').toLowerCase();
    
//     // Define categorization rules
//     if (sender.includes('supplier') || subject.includes('supplier') || 
//         sender.includes('vendor') || subject.includes('invoice')) {
//       return 'supplier';
//     }
//     if (sender.includes('competitor') || subject.includes('competitor') ||
//         subject.includes('market analysis') || subject.includes('industry')) {
//       return 'competitor';
//     }
//     if (subject.includes('newsletter') || subject.includes('news') ||
//         subject.includes('update') || subject.includes('announcement')) {
//       return 'information';
//     }
//     if (sender.includes('customer') || subject.includes('customer') ||
//         subject.includes('support') || subject.includes('inquiry')) {
//       return 'customers';
//     }
//     if (subject.includes('marketing') || subject.includes('promo') ||
//         subject.includes('sale') || subject.includes('offer')) {
//       return 'marketing';
//     }
    
//     // Default to inbox
//     return 'inbox';
//   }

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
//               messageId: parsed.messageId,
//               folderId: null // Will be set by categorization
//             };

//             // Auto-categorize the email
//             emailData.folderId = categorizeEmail(emailData);

//             // Save to database (avoid duplicates)
//             try {
//               const existingEmail = await Email.findOne({ messageId: emailData.messageId });
//               if (!existingEmail && emailData.messageId) {
//                 await Email.create(emailData);
//                 console.log(`Saved email: ${emailData.subject} -> ${emailData.folderId} folder`);
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
//               folderId: emailData.folderId
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

// // Get saved emails from database with optional folder filtering
// app.get("/api/emails/saved", async (req, res) => {
//   try {
//     const { folderId } = req.query;
    
//     let filter = {};
//     if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
//       filter.folderId = folderId;
//     }
    
//     const savedEmails = await Email.find(filter).sort({ date: -1 }).limit(50);
//     res.json(savedEmails);
//   } catch (error) {
//     console.error('Error fetching saved emails:', error);
//     res.status(500).json({ error: 'Failed to fetch saved emails' });
//   }
// });

// // Move email to different folder
// app.put("/api/emails/:emailId/folder", async (req, res) => {
//   try {
//     const { emailId } = req.params;
//     const { folderId } = req.body;
    
//     if (!VALID_FOLDER_IDS.includes(folderId)) {
//       return res.status(400).json({ 
//         error: `Invalid folder ID. Must be one of: ${VALID_FOLDER_IDS.join(', ')}` 
//       });
//     }
    
//     const result = await Email.findByIdAndUpdate(
//       emailId, 
//       { folderId: folderId },
//       { new: true }
//     );
    
//     if (result) {
//       res.json({
//         message: `Email moved to folder`,
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

// // Get email counts per folder
// app.get("/api/emails/counts", async (req, res) => {
//   try {
//     const counts = {};
    
//     for (const folderId of VALID_FOLDER_IDS) {
//       counts[folderId] = await Email.countDocuments({ folderId });
//     }
    
//     res.json(counts);
//   } catch (error) {
//     console.error('Error counting emails:', error);
//     res.status(500).json({ error: 'Failed to count emails' });
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

// // Bulk categorize existing emails (utility endpoint)
// app.post("/api/emails/categorize", async (req, res) => {
//   try {
//     const emails = await Email.find({ folderId: { $exists: false } });
//     let categorized = 0;
    
//     for (const email of emails) {
//       const folderId = categorizeEmail(email);
//       await Email.findByIdAndUpdate(email._id, { folderId });
//       categorized++;
//     }
    
//     res.json({ 
//       message: `Successfully categorized ${categorized} emails`,
//       categorized 
//     });
//   } catch (error) {
//     console.error('Error categorizing emails:', error);
//     res.status(500).json({ error: 'Failed to categorize emails' });
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

// // Auto-categorize function (helper)
// function categorizeEmail(emailData) {
//   const sender = (emailData.from?.address || emailData.from || '').toLowerCase();
//   const subject = (emailData.subject || '').toLowerCase();
  
//   // Define categorization rules
//   if (sender.includes('supplier') || subject.includes('supplier') || 
//       sender.includes('vendor') || subject.includes('invoice')) {
//     return 'supplier';
//   }
//   if (sender.includes('competitor') || subject.includes('competitor') ||
//       subject.includes('market analysis') || subject.includes('industry')) {
//     return 'competitor';
//   }
//   if (subject.includes('newsletter') || subject.includes('news') ||
//       subject.includes('update') || subject.includes('announcement')) {
//     return 'information';
//   }
//   if (sender.includes('customer') || subject.includes('customer') ||
//       subject.includes('support') || subject.includes('inquiry')) {
//     return 'customers';
//   }
//   if (subject.includes('marketing') || subject.includes('promo') ||
//       subject.includes('sale') || subject.includes('offer')) {
//     return 'marketing';
//   }
  
//   // Default to inbox
//   return 'inbox';
// }

// // Start server
// const port = process.env.PORT || 5007;
// app.listen(port, () => console.log(`Server running on port ${port}`));


// //working code
// const express = require("express");
// const dotenv = require("dotenv").config();
// const connectDB = require("./config/db");
// const path = require("path");
// const cors = require("cors");

// const POP3Client = require('poplib');
// const { simpleParser } = require('mailparser');

// // Import Email model and categorization service
// const Email = require("./models/emailModel");
// const EmailCategorizationService = require("./services/emailCategorizationService");

// // Initialize express app
// const app = express();

// // Initialize categorization service
// const categorizer = new EmailCategorizationService();

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // User routes
// app.use("/api/users", require("./routes/userRoutes"));

// // Folder routes
// const folderRoutes = require("./routes/folderRoutes");
// app.use("/api/folders", folderRoutes);

// // Define valid folder IDs
// const VALID_FOLDER_IDS = [
//   'inbox', 'supplier', 'competitor', 'information', 
//   'customers', 'marketing', 'archive'
// ];

// // Enhanced POP3 Email API route with advanced categorization
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
//   let categorizationStats = {
//     total: 0,
//     categorized: {},
//     errors: 0
//   };

//   // Error handling
//   client.on('error', function(err) {
//     console.error('POP3 Client Error:', err);
//     if (!responded) {
//       responded = true;
//       return res.status(500).json({ error: err.message });
//     }
//   });

//   // Connection established
//   client.on('connect', function() {
//     console.log('Connected to POP3 server');
//     client.login(username, password);
//   });

//   // Login response
//   client.on('login', function(status) {
//     if (status) {
//       console.log('Login successful');
//       client.stat();
//     } else {
//       console.error('Login failed');
//       if (!responded) {
//         responded = true;
//         res.status(401).json({ error: "Login failed" });
//       }
//       client.quit();
//     }
//   });

//   // Stat response (message count)
//   client.on('stat', function(status, data) {
//     if (!status) {
//       console.error('STAT command failed');
//       if (!responded) {
//         responded = true;
//         res.status(500).json({ error: "STAT failed" });
//       }
//       client.quit();
//     } else {
//       console.log(`Found ${data.count} emails`);
//       categorizationStats.total = data.count;
      
//       if (data.count > 0) {
//         retrieveMessage(1, data.count);
//       } else {
//         if (!responded) {
//           responded = true;
//           res.json({
//             emails: [],
//             categorization: categorizationStats
//           });
//         }
//         client.quit();
//       }
//     }
//   });

//   // Enhanced message retrieval with advanced categorization
//   async function retrieveMessage(current, total) {
//     client.retr(current);
//     client.once('retr', async function(status, msgnumber, data) {
//       if (status) {
//         try {
//           const parsed = await new Promise((resolve, reject) => {
//             simpleParser(data, (err, result) => {
//               if (err) reject(err);
//               else resolve(result);
//             });
//           });

//           const emailData = {
//             subject: parsed.subject || '(No Subject)',
//             from: {
//               name: parsed.from?.value?.[0]?.name || parsed.from?.name || '',
//               address: parsed.from?.value?.[0]?.address || parsed.from?.address || parsed.from?.text || ''
//             },
//             date: parsed.date || new Date(),
//             text: parsed.text || '',
//             html: parsed.html || '',
//             messageId: parsed.messageId || `${Date.now()}-${current}`,
//             folderId: null
//           };

//           // Use advanced categorization service
//           emailData.folderId = categorizer.categorizeEmail(emailData);
          
//           // Update categorization stats
//           if (!categorizationStats.categorized[emailData.folderId]) {
//             categorizationStats.categorized[emailData.folderId] = 0;
//           }
//           categorizationStats.categorized[emailData.folderId]++;

//           // Save to database (avoid duplicates)
//           try {
//             const existingEmail = await Email.findOne({ messageId: emailData.messageId });
//             if (!existingEmail) {
//               await Email.create(emailData);
//               console.log(`✓ Saved email: "${emailData.subject}" → ${emailData.folderId} folder`);
//             } else {
//               console.log(`⚠ Email already exists: "${emailData.subject}"`);
//               // Update folder if it's different (for recategorization)
//               if (existingEmail.folderId !== emailData.folderId) {
//                 await Email.findByIdAndUpdate(existingEmail._id, { folderId: emailData.folderId });
//                 console.log(`📁 Updated folder: "${emailData.subject}" → ${emailData.folderId}`);
//               }
//             }
//           } catch (dbError) {
//             console.error('❌ Error saving email:', dbError);
//             categorizationStats.errors++;
//           }

//           // Add to response array
//           emails.push({
//             id: emailData.messageId,
//             subject: emailData.subject,
//             from: emailData.from,
//             date: emailData.date,
//             text: emailData.text.substring(0, 200) + (emailData.text.length > 200 ? '...' : ''),
//             folderId: emailData.folderId
//           });

//         } catch (parseError) {
//           console.error('❌ Error parsing email:', parseError);
//           categorizationStats.errors++;
//         }
//       } else {
//         console.error(`❌ Failed to retrieve email ${current}`);
//         categorizationStats.errors++;
//       }
      
//       // Continue with next email or finish
//       if (current < total) {
//         retrieveMessage(current + 1, total);
//       } else {
//         if (!responded) {
//           responded = true;
//           console.log('📊 Categorization Summary:', categorizationStats);
//           res.json({
//             emails: emails,
//             categorization: categorizationStats,
//             message: `Successfully processed ${emails.length} emails`
//           });
//         }
//         client.quit();
//       }
//     });
//   }

//   // Set timeout to prevent hanging
//   setTimeout(() => {
//     if (!responded) {
//       responded = true;
//       res.status(408).json({ 
//         error: 'Request timeout',
//         partialResults: {
//           emails: emails,
//           categorization: categorizationStats
//         }
//       });
//       client.quit();
//     }
//   }, 45000); // 45 second timeout
// });

// // Get saved emails from database with optional folder filtering
// app.get("/api/emails/saved", async (req, res) => {
//   try {
//     const { folderId, limit = 50, page = 1 } = req.query;
    
//     let filter = {};
//     if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
//       filter.folderId = folderId;
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const savedEmails = await Email.find(filter)
//       .sort({ date: -1 })
//       .limit(parseInt(limit))
//       .skip(skip);
    
//     const total = await Email.countDocuments(filter);
    
//     res.json({
//       emails: savedEmails,
//       pagination: {
//         total,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil(total / parseInt(limit))
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching saved emails:', error);
//     res.status(500).json({ error: 'Failed to fetch saved emails' });
//   }
// });

// // Move email to different folder
// app.put("/api/emails/:emailId/folder", async (req, res) => {
//   try {
//     const { emailId } = req.params;
//     const { folderId } = req.body;
    
//     if (!VALID_FOLDER_IDS.includes(folderId)) {
//       return res.status(400).json({ 
//         error: `Invalid folder ID. Must be one of: ${VALID_FOLDER_IDS.join(', ')}` 
//       });
//     }
    
//     const email = await Email.findById(emailId);
//     if (!email) {
//       return res.status(404).json({ error: 'Email not found' });
//     }

//     const oldFolderId = email.folderId;
//     const result = await Email.findByIdAndUpdate(
//       emailId, 
//       { folderId: folderId },
//       { new: true }
//     );
    
//     // Learn from user correction if it's different from predicted
//     if (oldFolderId !== folderId) {
//       categorizer.learnFromCorrection(email, folderId, oldFolderId);
//     }
    
//     res.json({
//       message: `Email moved to ${folderId} folder`,
//       email: result,
//       change: `${oldFolderId} → ${folderId}`
//     });
    
//   } catch (error) {
//     console.error('Error moving email:', error);
//     res.status(500).json({ error: 'Failed to move email' });
//   }
// });

// // Get email counts per folder
// app.get("/api/emails/counts", async (req, res) => {
//   try {
//     const counts = {};
//     let totalEmails = 0;
    
//     for (const folderId of VALID_FOLDER_IDS) {
//       const count = await Email.countDocuments({ folderId });
//       counts[folderId] = count;
//       totalEmails += count;
//     }
    
//     res.json({
//       counts,
//       total: totalEmails,
//       categories: VALID_FOLDER_IDS
//     });
//   } catch (error) {
//     console.error('Error counting emails:', error);
//     res.status(500).json({ error: 'Failed to count emails' });
//   }
// });

// // Enhanced bulk categorization endpoint
// app.post("/api/emails/recategorize", async (req, res) => {
//   try {
//     console.log('🔄 Starting email recategorization...');
    
//     const emails = await Email.find({});
    
//     if (emails.length === 0) {
//       return res.json({
//         message: 'No emails found to recategorize',
//         stats: { total: 0, updated: 0, errors: 0 }
//       });
//     }

//     let updated = 0;
//     let errors = 0;
//     const categoryChanges = {};

//     for (const email of emails) {
//       try {
//         const oldCategory = email.folderId;
//         const newCategory = categorizer.categorizeEmail(email);
        
//         if (oldCategory !== newCategory) {
//           await Email.findByIdAndUpdate(email._id, { folderId: newCategory });
//           updated++;
          
//           const changeKey = `${oldCategory} → ${newCategory}`;
//           categoryChanges[changeKey] = (categoryChanges[changeKey] || 0) + 1;
          
//           console.log(`📁 Updated: "${email.subject}" ${oldCategory} → ${newCategory}`);
//         }
//       } catch (error) {
//         console.error(`❌ Error recategorizing email ${email._id}:`, error);
//         errors++;
//       }
//     }

//     // Get final category counts
//     const finalCounts = {};
//     for (const folderId of VALID_FOLDER_IDS) {
//       finalCounts[folderId] = await Email.countDocuments({ folderId });
//     }

//     console.log('✅ Recategorization complete');
    
//     res.json({
//       message: `Recategorization complete: ${updated} emails updated`,
//       stats: {
//         total: emails.length,
//         updated: updated,
//         errors: errors,
//         unchanged: emails.length - updated - errors
//       },
//       changes: categoryChanges,
//       finalCounts: finalCounts
//     });
    
//   } catch (error) {
//     console.error('❌ Error during recategorization:', error);
//     res.status(500).json({ error: 'Failed to recategorize emails' });
//   }
// });

// // Get categorization statistics and insights
// app.get("/api/emails/categorization/stats", async (req, res) => {
//   try {
//     const stats = {
//       categories: categorizer.getCategoryInfo(),
//       emailCounts: {},
//       totalEmails: 0,
//       lastUpdated: new Date(),
//       validFolders: VALID_FOLDER_IDS
//     };
    
//     // Get email counts per category
//     for (const folderId of VALID_FOLDER_IDS) {
//       const count = await Email.countDocuments({ folderId });
//       stats.emailCounts[folderId] = count;
//       stats.totalEmails += count;
//     }
    
//     // Get recent categorization activity
//     const recentEmails = await Email.find({})
//       .sort({ createdAt: -1 })
//       .limit(100);
    
//     if (recentEmails.length > 0) {
//       const recentStats = categorizer.bulkCategorize(recentEmails);
//       stats.recentActivity = recentStats;
//     }
    
//     res.json(stats);
//   } catch (error) {
//     console.error('Error getting categorization stats:', error);
//     res.status(500).json({ error: 'Failed to get categorization stats' });
//   }
// });

// // Add custom categorization rules
// app.post("/api/emails/categorization/add-rule", async (req, res) => {
//   try {
//     const { categoryId, rules } = req.body;
    
//     if (!categoryId || !rules) {
//       return res.status(400).json({ 
//         error: 'categoryId and rules are required' 
//       });
//     }
    
//     // Validate rules structure
//     const validRuleTypes = ['senderKeywords', 'subjectKeywords', 'domainPatterns'];
//     const hasValidRules = validRuleTypes.some(ruleType => 
//       rules[ruleType] && Array.isArray(rules[ruleType])
//     );
    
//     if (!hasValidRules) {
//       return res.status(400).json({
//         error: `Rules must contain at least one of: ${validRuleTypes.join(', ')}`
//       });
//     }
    
//     categorizer.addCustomRule(categoryId, rules);
    
//     res.json({
//       message: `Custom categorization rule added for category: ${categoryId}`,
//       rules: rules,
//       categoryInfo: categorizer.getCategoryInfo()
//     });
    
//   } catch (error) {
//     console.error('Error adding custom rule:', error);
//     res.status(500).json({ error: 'Failed to add custom rule' });
//   }
// });

// // Get single email details
// app.get("/api/emails/:emailId", async (req, res) => {
//   try {
//     const { emailId } = req.params;
//     const email = await Email.findById(emailId);
    
//     if (!email) {
//       return res.status(404).json({ error: 'Email not found' });
//     }
    
//     res.json(email);
//   } catch (error) {
//     console.error('Error fetching email:', error);
//     res.status(500).json({ error: 'Failed to fetch email' });
//   }
// });

// // Route to get count of saved emails (backward compatibility)
// app.get("/api/emails/count", async (req, res) => {
//   try {
//     const count = await Email.countDocuments();
//     res.json({ count });
//   } catch (error) {
//     console.error('Error counting emails:', error);
//     res.status(500).json({ error: 'Failed to count emails' });
//   }
// });

// // Search emails
// app.get("/api/emails/search", async (req, res) => {
//   try {
//     const { q, folderId, limit = 20 } = req.query;
    
//     if (!q) {
//       return res.status(400).json({ error: 'Search query is required' });
//     }
    
//     let filter = {
//       $or: [
//         { subject: { $regex: q, $options: 'i' } },
//         { 'from.name': { $regex: q, $options: 'i' } },
//         { 'from.address': { $regex: q, $options: 'i' } },
//         { text: { $regex: q, $options: 'i' } }
//       ]
//     };
    
//     if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
//       filter.folderId = folderId;
//     }
    
//     const emails = await Email.find(filter)
//       .sort({ date: -1 })
//       .limit(parseInt(limit));
    
//     res.json({
//       query: q,
//       results: emails,
//       total: emails.length
//     });
    
//   } catch (error) {
//     console.error('Error searching emails:', error);
//     res.status(500).json({ error: 'Failed to search emails' });
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
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//   console.log(' Email categorization service initialized');
//   console.log(` Available folders: ${VALID_FOLDER_IDS.join(', ')}`);
// });

// const express = require("express");
// const dotenv = require("dotenv").config();
// const connectDB = require("./config/db");
// const path = require("path");
// const cors = require("cors");

// const POP3Client = require('poplib');
// const { simpleParser } = require('mailparser');

// const Email = require("./models/emailModel");
// const EmailCategorizationService = require("./services/emailCategorizationService");

// const app = express();
// const categorizer = new EmailCategorizationService();

// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // User routes
// app.use("/api/users", require("./routes/userRoutes"));

// // Folder routes
// const folderRoutes = require("./routes/folderRoutes");
// app.use("/api/folders", folderRoutes);

// const VALID_FOLDER_IDS = [
//   'inbox', 'supplier', 'competitor', 'information', 
//   'customers', 'marketing', 'archive'
// ];

// // ------------------ Email Fetching and Categorization ------------------
// // Enhanced GET /api/emails route
// app.get("/api/emails", async (req, res) => {
//   const host = process.env.POP3_HOST || 'pop.gmail.com';
//   const port = 995;
//   const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
//   const password = process.env.POP3_PASS || 'bssr xsrf tjvs pxyu';

//   const client = new POP3Client(port, host, {
//     tlserrs: false,
//     enabletls: true,
//     debug: false,
//     ignoretlserrs: true,
//   });

//   let emails = [];
//   let responded = false;
//   let categorizationStats = {
//     total: 0,
//     categorized: {},
//     errors: 0
//   };

//   client.on('error', (err) => {
//     console.error('POP3 Client Error:', err);
//     if (!responded) {
//       responded = true;
//       return res.status(500).json({ error: err.message });
//     }
//   });

//   client.on('connect', () => {
//     console.log('Connected to POP3 server');
//     client.login(username, password);
//   });

//   client.on('login', (status) => {
//     if (status) {
//       console.log('Login successful');
//       client.stat();
//     } else {
//       console.error('Login failed');
//       if (!responded) {
//         responded = true;
//         res.status(401).json({ error: "Login failed" });
//       }
//       client.quit();
//     }
//   });

//   client.on('stat', (status, data) => {
//     if (!status) {
//       console.error('STAT command failed');
//       if (!responded) {
//         responded = true;
//         res.status(500).json({ error: "STAT failed" });
//       }
//       client.quit();
//     } else {
//       console.log(`Found ${data.count} emails`);
//       categorizationStats.total = data.count;
//       if (data.count > 0) {
//         retrieveMessage(1, data.count);
//       } else {
//         if (!responded) {
//           responded = true;
//           res.json({ emails, categorization: categorizationStats });
//         }
//         client.quit();
//       }
//     }
//   });

//   async function retrieveMessage(current, total) {
//     client.retr(current);
//     client.once('retr', async (status, msgnumber, data) => {
//       if (status) {
//         try {
//           const parsed = await new Promise((resolve, reject) => {
//             simpleParser(data, (err, result) => {
//               if (err) reject(err);
//               else resolve(result);
//             });
//           });

//           const emailData = {
//             subject: parsed.subject || '(No Subject)',
//             from: {
//               name: parsed.from?.value?.[0]?.name || parsed.from?.name || '',
//               address: parsed.from?.value?.[0]?.address || parsed.from?.address || parsed.from?.text || ''
//             },
//             date: parsed.date || new Date(),
//             text: parsed.text || '',
//             html: parsed.html || '',
//             messageId: parsed.messageId || `${Date.now()}-${current}`,
//             folderId: null
//           };

//           // Categorize email
//           emailData.folderId = categorizer.categorizeEmail(emailData);

//           // Stats
//           if (!categorizationStats.categorized[emailData.folderId]) {
//             categorizationStats.categorized[emailData.folderId] = 0;
//           }
//           categorizationStats.categorized[emailData.folderId]++;

//           // Save to DB if not exists
//           try {
//             const existing = await Email.findOne({ messageId: emailData.messageId });
//             if (!existing) {
//               await Email.create(emailData);
//               console.log(`✓ Saved email: "${emailData.subject}" → ${emailData.folderId}`);
//             } else {
//               // Update folder if different
//               if (existing.folderId !== emailData.folderId) {
//                 await Email.findByIdAndUpdate(existing._id, { folderId: emailData.folderId });
//                 console.log(`📁 Updated folder: "${emailData.subject}" → ${emailData.folderId}`);
//               }
//             }
//           } catch (dbErr) {
//             console.error('❌ Error saving email:', dbErr);
//             categorizationStats.errors++;
//           }

//           // Add to response
//           emails.push({
//             id: emailData.messageId,
//             subject: emailData.subject,
//             from: emailData.from,
//             date: emailData.date,
//             text: emailData.text.substring(0, 200) + (emailData.text.length > 200 ? '...' : ''),
//             folderId: emailData.folderId
//           });

//         } catch (parseErr) {
//           console.error('❌ Error parsing email:', parseErr);
//           categorizationStats.errors++;
//         }
//       } else {
//         console.error(`❌ Failed to retrieve email ${current}`);
//         categorizationStats.errors++;
//       }

//       if (current < total) {
//         retrieveMessage(current + 1, total);
//       } else {
//         if (!responded) {
//           responded = true;
//           console.log('📊 Categorization Stats:', categorizationStats);
//           res.json({ emails, categorization: categorizationStats });
//         }
//         client.quit();
//       }
//     });
//   }

//   setTimeout(() => {
//     if (!responded) {
//       responded = true;
//       res.status(408).json({
//         error: 'Request timeout',
//         partialResults: { emails, categorization: categorizationStats }
//       });
//       client.quit();
//     }
//   }, 45000);
// });

// // GET saved emails with optional folder filter
// app.get("/api/emails/saved", async (req, res) => {
//   try {
//     const { folderId, limit = 50, page = 1 } = req.query;
//     let filter = {};
//     if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
//       filter.folderId = folderId;
//     }
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const emails = await Email.find(filter)
//       .sort({ date: -1 })
//       .limit(parseInt(limit))
//       .skip(skip);
//     const total = await Email.countDocuments(filter);
//     res.json({ emails, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
//   } catch (err) {
//     console.error('Error fetching saved emails:', err);
//     res.status(500).json({ error: 'Failed to fetch saved emails' });
//   }
// });

// // Move email to folder (learn from correction)
// app.put("/api/emails/:emailId/folder", async (req, res) => {
//   try {
//     const { emailId } = req.params;
//     const { folderId } = req.body;
//     if (!VALID_FOLDER_IDS.includes(folderId)) {
//       return res.status(400).json({ error: `Invalid folder ID.` });
//     }
//     const email = await Email.findById(emailId);
//     if (!email) return res.status(404).json({ error: 'Email not found' });
//     const oldFolderId = email.folderId;
//     await Email.findByIdAndUpdate(emailId, { folderId });
//     // Learn from correction
//     const senderEmail = typeof email.from === 'string' ? email.from : email.from?.address || '';
//     if (oldFolderId !== folderId) {
//       categorizer.learnFromCorrection(email, folderId, oldFolderId);
//     }
//     res.json({ message: `Folder updated`, email, change: `${oldFolderId} → ${folderId}` });
//   } catch (err) {
//     console.error('Error updating folder:', err);
//     res.status(500).json({ error: 'Failed to update folder' });
//   }
// });

// // Get email counts
// app.get("/api/emails/counts", async (req, res) => {
//   try {
//     const counts = {};
//     let total = 0;
//     for (const folderId of VALID_FOLDER_IDS) {
//       const count = await Email.countDocuments({ folderId });
//       counts[folderId] = count;
//       total += count;
//     }
//     res.json({ counts, total, categories: VALID_FOLDER_IDS });
//   } catch (err) {
//     console.error('Error getting counts:', err);
//     res.status(500).json({ error: 'Failed to get counts' });
//   }
// });

// // ... other routes, recategorize, stats, etc. remain unchanged

// // Serve frontend
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "../", "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => res.send("Please set to production"));
// }

// // Error handler
// app.use((err, req, res, next) => {
//   res.status(res.statusCode || 500).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
// });

// // Start server
// const port = process.env.PORT || 5007;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//   console.log('Email categorization service initialized');
// });


const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');

// Import Email model and categorization service
const Email = require("./models/emailModel");
const EmailCategorizationService = require("./services/emailCategorizationService");
// Import the new SenderPreference model
const SenderPreference = require("./models/senderPreferenceModel"); 

// Initialize express app
const app = express();
const categorizer = new EmailCategorizationService();

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

const VALID_FOLDER_IDS = [
  'inbox', 'supplier', 'competitor', 'information', 
  'customers', 'marketing', 'archive'
];

// ------------------ Email Fetching and Categorization ------------------
// Enhanced GET /api/emails route to fetch emails from POP3 and categorize them
app.get("/api/emails", async (req, res) => {
  const host = process.env.POP3_HOST || 'pop.gmail.com';
  const port = 995;
  const username = process.env.POP3_USER || 'newslettertester885@gmail.com';
  const password = process.env.POP3_PASS || 'bssr xsrf tjvs pxyu';

  const client = new POP3Client(port, host, {
    tlserrs: false,
    enabletls: true,
    debug: false,
    ignoretlserrs: true,
  });

  let emails = [];
  let responded = false;
  let categorizationStats = {
    total: 0,
    categorized: {},
    errors: 0
  };

  client.on('error', (err) => {
    console.error('POP3 Client Error:', err);
    if (!responded) {
      responded = true;
      return res.status(500).json({ error: err.message });
    }
  });

  client.on('connect', () => {
    console.log('Connected to POP3 server');
    client.login(username, password);
  });

  client.on('login', (status) => {
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

  client.on('stat', (status, data) => {
    if (!status) {
      console.error('STAT command failed');
      if (!responded) {
        responded = true;
        res.status(500).json({ error: "STAT failed" });
      }
      client.quit();
    } else {
      console.log(`Found ${data.count} emails`);
      categorizationStats.total = data.count;
      if (data.count > 0) {
        retrieveMessage(1, data.count);
      } else {
        if (!responded) {
          responded = true;
          res.json({ emails, categorization: categorizationStats });
        }
        client.quit();
      }
    }
  });

  async function retrieveMessage(current, total) {
    client.retr(current);
    client.once('retr', async (status, msgnumber, data) => {
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
            folderId: null // Will be set by categorization logic
          };

          // --- Automated Folder Assignment Logic ---
          let assignedFolderId = null;
          const senderAddress = emailData.from.address.toLowerCase();

          // 1. Check for existing sender preference
          if (senderAddress) {
            const senderPref = await SenderPreference.findOne({ senderEmail: senderAddress });
            if (senderPref) {
              assignedFolderId = senderPref.preferredFolderId;
              console.log(`🤖 Auto-categorized by preference: "${emailData.subject}" from ${senderAddress} → ${assignedFolderId}`);
            }
          }
          
          // 2. If no preference, use the EmailCategorizationService
          if (!assignedFolderId) {
            assignedFolderId = categorizer.categorizeEmail(emailData);
            console.log(`🧠 Auto-categorized by rules: "${emailData.subject}" → ${assignedFolderId}`);
          }

          emailData.folderId = assignedFolderId;

          // Stats
          if (!categorizationStats.categorized[emailData.folderId]) {
            categorizationStats.categorized[emailData.folderId] = 0;
          }
          categorizationStats.categorized[emailData.folderId]++;

          // Save to DB if not exists
          try {
            const existing = await Email.findOne({ messageId: emailData.messageId });
            if (!existing) {
              await Email.create(emailData);
              console.log(`✓ Saved new email: "${emailData.subject}" → ${emailData.folderId}`);
            } else {
              // Update folder if different (for recategorization on sync)
              if (existing.folderId !== emailData.folderId) {
                await Email.findByIdAndUpdate(existing._id, { folderId: emailData.folderId });
                console.log(`📁 Updated existing email folder: "${emailData.subject}" → ${emailData.folderId}`);
              }
            }
          } catch (dbErr) {
            console.error('❌ Error saving email to DB:', dbErr);
            categorizationStats.errors++;
          }

          // Add to response
          emails.push({
            id: emailData.messageId,
            subject: emailData.subject,
            from: emailData.from,
            date: emailData.date,
            text: emailData.text.substring(0, 200) + (emailData.text.length > 200 ? '...' : ''),
            folderId: emailData.folderId
          });

        } catch (parseErr) {
          console.error('❌ Error parsing email:', parseErr);
          categorizationStats.errors++;
        }
      } else {
        console.error(`❌ Failed to retrieve email ${current}`);
        categorizationStats.errors++;
      }

      if (current < total) {
        retrieveMessage(current + 1, total);
      } else {
        if (!responded) {
          responded = true;
          console.log('📊 Categorization Stats (POP3 Sync):', categorizationStats);
          res.json({ emails, categorization: categorizationStats });
        }
        client.quit();
      }
    });
  }

  setTimeout(() => {
    if (!responded) {
      responded = true;
      res.status(408).json({
        error: 'Request timeout',
        partialResults: { emails, categorization: categorizationStats }
      });
      client.quit();
    }
  }, 45000); // 45 second timeout
});

// GET saved emails with optional folder filter
app.get("/api/emails/saved", async (req, res) => {
  try {
    const { folderId, limit = 50, page = 1 } = req.query;
    let filter = {};
    if (folderId && VALID_FOLDER_IDS.includes(folderId)) {
      filter.folderId = folderId;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const emails = await Email.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    const total = await Email.countDocuments(filter);
    res.json({ emails, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    console.error('Error fetching saved emails:', err);
    res.status(500).json({ error: 'Failed to fetch saved emails' });
  }
});

// Move email to folder (learn from correction)
app.put("/api/emails/:emailId/folder", async (req, res) => {
  try {
    const { emailId } = req.params;
    const { folderId } = req.body; // The new folder ID
    
    if (!VALID_FOLDER_IDS.includes(folderId)) {
      return res.status(400).json({ error: `Invalid folder ID. Must be one of: ${VALID_FOLDER_IDS.join(', ')}` });
    }
    
    const email = await Email.findById(emailId);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const oldFolderId = email.folderId;
    const senderAddress = (email.from?.address || '').toLowerCase();

    // Update the email's folder
    const result = await Email.findByIdAndUpdate(
      emailId, 
      { folderId: folderId },
      { new: true }
    );
    
    // --- Learning from User Correction ---
    // If the folder was changed, save or update the sender preference
    if (oldFolderId !== folderId && senderAddress) {
      await SenderPreference.findOneAndUpdate(
        { senderEmail: senderAddress }, // Find by sender email
        { preferredFolderId: folderId }, // Set the new preferred folder
        { upsert: true, new: true } // Create if not exists, return new document
      );
      console.log(`🎯 Learned preference: Future emails from ${senderAddress} will go to ${folderId}`);
    }
    
    // Also, inform the categorization service about the correction for its internal learning
    // This part is specific to how your EmailCategorizationService handles learning.
    // Assuming it has a method to learn from user corrections.
    // categorizer.learnFromCorrection(email, folderId, oldFolderId); // Uncomment if EmailCategorizationService has this method

    res.json({
      message: `Email moved to ${folderId} folder`,
      email: result,
      change: `${oldFolderId} → ${folderId}`
    });
    
  } catch (err) {
    console.error('Error updating folder:', err);
    res.status(500).json({ error: 'Failed to update folder' });
  }
});

// Get email counts
app.get("/api/emails/counts", async (req, res) => {
  try {
    const counts = {};
    let total = 0;
    for (const folderId of VALID_FOLDER_IDS) {
      const count = await Email.countDocuments({ folderId });
      counts[folderId] = count;
      total += count;
    }
    res.json({ counts, total, categories: VALID_FOLDER_IDS });
  } catch (err) {
    console.error('Error getting counts:', err);
    res.status(500).json({ error: 'Failed to get counts' });
  }
});

// Bulk categorize existing emails (utility endpoint) - using updated categorization
app.post("/api/emails/recategorize", async (req, res) => {
  try {
    console.log('🔄 Starting email recategorization...');
    
    // Fetch all emails (or a batch if too many)
    const emailsToRecategorize = await Email.find({}); 
    
    if (emailsToRecategorize.length === 0) {
      return res.json({
        message: 'No emails found to recategorize',
        stats: { total: 0, updated: 0, errors: 0 }
      });
    }

    let updatedCount = 0;
    let errorsCount = 0;
    const categoryChanges = {};

    for (const email of emailsToRecategorize) {
      try {
        const oldFolderId = email.folderId;
        let newFolderId = null;

        const senderAddress = (email.from?.address || '').toLowerCase();

        // 1. Check for existing sender preference
        if (senderAddress) {
          const senderPref = await SenderPreference.findOne({ senderEmail: senderAddress });
          if (senderPref) {
            newFolderId = senderPref.preferredFolderId;
          }
        }
        
        // 2. If no preference, use the EmailCategorizationService
        if (!newFolderId) {
          newFolderId = categorizer.categorizeEmail(email);
        }

        if (oldFolderId !== newFolderId) {
          await Email.findByIdAndUpdate(email._id, { folderId: newFolderId });
          updatedCount++;
          
          const changeKey = `${oldFolderId || 'none'} → ${newFolderId}`;
          categoryChanges[changeKey] = (categoryChanges[changeKey] || 0) + 1;
          
          console.log(`📁 Recategorized: "${email.subject}" ${oldFolderId || 'unassigned'} → ${newFolderId}`);
        }
      } catch (error) {
        console.error(`❌ Error recategorizing email ${email._id}:`, error);
        errorsCount++;
      }
    }

    // Get final category counts
    const finalCounts = {};
    for (const folderId of VALID_FOLDER_IDS) {
      finalCounts[folderId] = await Email.countDocuments({ folderId });
    }

    console.log('✅ Recategorization complete');
    
    res.json({
      message: `Recategorization complete: ${updatedCount} emails updated`,
      stats: {
        total: emailsToRecategorize.length,
        updated: updatedCount,
        errors: errorsCount,
        unchanged: emailsToRecategorize.length - updatedCount - errorsCount
      },
      changes: categoryChanges,
      finalCounts: finalCounts
    });
    
  } catch (error) {
    console.error('❌ Error during recategorization:', error);
    res.status(500).json({ error: 'Failed to recategorize emails' });
  }
});

// Get categorization statistics and insights (remains largely the same, but now considering SenderPreference influence)
app.get("/api/emails/categorization/stats", async (req, res) => {
  try {
    const stats = {
      categories: categorizer.getCategoryInfo(), // Rules-based info
      senderPreferences: {}, // New: info about learned preferences
      emailCounts: {},
      totalEmails: 0,
      lastUpdated: new Date(),
      validFolders: VALID_FOLDER_IDS
    };
    
    // Get email counts per category
    for (const folderId of VALID_FOLDER_IDS) {
      const count = await Email.countDocuments({ folderId });
      stats.emailCounts[folderId] = count;
      stats.totalEmails += count;
    }

    // Get sender preference counts
    const senderPrefs = await SenderPreference.find({});
    senderPrefs.forEach(pref => {
        stats.senderPreferences[pref.senderEmail] = pref.preferredFolderId;
    });
    
    // Get recent categorization activity
    const recentEmails = await Email.find({})
      .sort({ createdAt: -1 })
      .limit(100);
    
    if (recentEmails.length > 0) {
      // This might need adjustment in EmailCategorizationService if its bulkCategorize
      // doesn't account for SenderPreference directly. For now, it reflects rule-based.
      const recentStats = categorizer.bulkCategorize(recentEmails); 
      stats.recentActivity = recentStats;
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting categorization stats:', error);
    res.status(500).json({ error: 'Failed to get categorization stats' });
  }
});

// Add custom categorization rules (remains the same, uses EmailCategorizationService)
app.post("/api/emails/categorization/add-rule", async (req, res) => {
  try {
    const { categoryId, rules } = req.body;
    
    if (!categoryId || !rules) {
      return res.status(400).json({ 
        error: 'categoryId and rules are required' 
      });
    }
    
    // Validate rules structure
    const validRuleTypes = ['senderKeywords', 'subjectKeywords', 'domainPatterns'];
    const hasValidRules = validRuleTypes.some(ruleType => 
      rules[ruleType] && Array.isArray(rules[ruleType])
    );
    
    if (!hasValidRules) {
      return res.status(400).json({
        error: `Rules must contain at least one of: ${validRuleTypes.join(', ')}`
      });
    }
    
    categorizer.addCustomRule(categoryId, rules);
    
    res.json({
      message: `Custom categorization rule added for category: ${categoryId}`,
      rules: rules,
      categoryInfo: categorizer.getCategoryInfo()
    });
    
  } catch (error) {
    console.error('Error adding custom rule:', error);
    res.status(500).json({ error: 'Failed to add custom rule' });
  }
});

// Get single email details
app.get("/api/emails/:emailId", async (req, res) => {
  try {
    const { emailId } = req.params;
    const email = await Email.findById(emailId);
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json(email);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// Route to get count of saved emails (backward compatibility)
app.get("/api/emails/count", async (req, res) => {
  try {
    const count = await Email.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error counting emails:', error);
    res.status(500).json({ error: 'Failed to count emails' });
  }
});

// Search emails
app.get("/api/emails/search", async (req, res) => {
  try {
    const { q, folderId, limit = 20 } = req.query;
    
    if (!q) {
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
    
    res.json({
      query: q,
      results: emails,
      total: emails.length
    });
    
  } catch (error) {
    console.error('Error searching emails:', error);
    res.status(500).json({ error: 'Failed to search emails' });
  }
});

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../", "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(res.statusCode || 500).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
});

// Start server
const port = process.env.PORT || 5007;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Email categorization service initialized');
  console.log(`Available folders: ${VALID_FOLDER_IDS.join(', ')}`);
});

