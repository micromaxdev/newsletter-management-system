// working code
const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");

router.post("/", registerUser);

module.exports = router;

 
// routes/emailRoutes.js
// const express = require("express");
// const router = express.Router();
// const Email = require("../models/Email");

// // @desc    Get all saved emails from MongoDB
// // @route   GET /api/emails/saved
// // @access  Public
// router.get("/saved", async (req, res) => {
//   try {
//     const emails = await Email.find().sort({ date: -1 });
//     res.json(emails);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch saved emails" });
//   }
// });

// module.exports = router;

