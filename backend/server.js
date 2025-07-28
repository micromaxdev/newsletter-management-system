const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import Route Files
const emailRoutes = require("./routes/emailRoutes");
const folderRoutes = require("./routes/folderRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
connectDB(); // Connect to MongoDB
// One-time cleanup: remove sender preferences with null senderAddress
const SenderPreference = require("./models/senderPreferenceModel");
connectDB();
SenderPreference.deleteMany({ senderAddress: null })
  .then(() =>
    console.log("Cleaned up sender preferences with null senderAddress")
  )
  .catch((err) => console.error("Cleanup error:", err));

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount API Routes
app.use("/api/emails", emailRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/users", userRoutes);

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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
