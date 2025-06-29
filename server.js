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

// POP3 Email API route - Now saves to database and returns parsed sender info
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
              messageId: parsed.messageId
            };

            // Save to database (avoid duplicates)
            try {
              const existingEmail = await Email.findOne({ messageId: emailData.messageId });
              if (!existingEmail && emailData.messageId) {
                await Email.create(emailData);
                console.log(`Saved email: ${emailData.subject}`);
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

// New route to get saved emails from database
app.get("/api/emails/saved", async (req, res) => {
  try {
    const savedEmails = await Email.find().sort({ date: -1 }).limit(50);
    res.json(savedEmails);
  } catch (error) {
    console.error('Error fetching saved emails:', error);
    res.status(500).json({ error: 'Failed to fetch saved emails' });
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
const port = process.env.PORT || 5007;
app.listen(port, () => console.log(`Server running on port ${port}`));