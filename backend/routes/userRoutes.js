const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Get current user
router.get("/me", getMe);

module.exports = router;
