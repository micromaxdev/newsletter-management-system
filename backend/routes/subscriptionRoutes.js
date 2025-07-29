const express = require("express");
const router = express.Router();
const {
  addSubscription,
  getUserSubscriptions,
  updateSubscription,
  removeSubscription,
  getSubscribedContent,
} = require("../controllers/subscriptionController");

// Add new subscription
router.post("/", addSubscription);

// Get user's subscriptions
router.get("/", getUserSubscriptions);

// Update subscription preferences
router.put("/:id", updateSubscription);

// Remove subscription
router.delete("/:id", removeSubscription);

// Get content from subscribed sources
router.get("/content", getSubscribedContent);

module.exports = router;
