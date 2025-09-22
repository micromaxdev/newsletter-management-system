const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { initializeSocket } = require("./config/socket");
const { initializeGemini } = require("./config/gemini");
// Schedule tasks to be run on the server.
const cron = require("node-cron");
// Scheduled tasks.
const { deleteOldEmails } = require("./services/cleanUpService");
const { syncEmailsFromPOP3 } = require("./services/emailSyncService");
// Import Route Files
const emailRoutes = require("./routes/emailRoutes");
const folderRoutes = require("./routes/folderRoutes");
const userRoutes = require("./routes/userRoutes");
const summarizedEmailRoutes = require("./routes/summarizedEmailRoutes");
const app = express();
const server = http.createServer(app);


connectDB(); // Connect to MongoDB
// Initialize Socket.IO
initializeSocket(server);
// Initialize Gemini
initializeGemini();
// One-time cleanup: remove sender preferences with null senderAddress
const SenderPreference = require("./models/senderPreferenceModel");
SenderPreference.deleteMany({ senderAddress: null })
  .then(() =>
    console.log("[SYSTEM] Cleaned up sender preferences with null senderAddress")
  )
  .catch((err) => console.error("Cleanup error:", err));

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    credentials: true, // Allow cookies and authorization headers
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount API Routes
app.use("/api/emails", emailRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/summarized-emails", summarizedEmailRoutes);
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"))
  );
} else {
  app.get("/", (req, res) =>
    res.send(
      "Please set NODE_ENV to production to serve frontend, or access frontend via its own dev server (e.g., http://localhost:3000)"
    )
  );
}

const PORT = process.env.PORT || 5007;

// Run initial email sync when server starts
//console.log('[SYSTEM] Running initial email sync on server startup...');
//syncEmailsFromPOP3().catch(error => {
  //  console.error('[SYSTEM] Error during initial email sync:', error);
//});

// Schedule email cleanup to run once a day at midnight.
cron.schedule('0 0 * * *', () => {
    console.log('[CRON JOB] Running daily email cleanup...');
    deleteOldEmails();
});

// Schedule email sync to run every 10 minutes.
cron.schedule('*/10 * * * *', () => {
    console.log('[CRON JOB] Running scheduled email sync...');
    syncEmailsFromPOP3().catch(error => {
        console.error('[CRON JOB] Error during scheduled email sync:', error);
    });
});

server.listen(PORT, () => console.log(`[SYSTEM] Server running on port ${PORT}`));
