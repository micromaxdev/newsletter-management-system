const asyncHandler = require("express-async-handler");
const UserSubscription = require("../models/userSubscriptionModel");
const Email = require("../models/emailModel");

/**
 * @desc    Add new subscription
 * @route   POST /api/subscriptions
 * @access  Private
 */
const addSubscription = asyncHandler(async (req, res) => {
  const { userId, type, value, frequency } = req.body;
  if (!userId) {
    res.status(400);
    throw new Error("userId is required");
  }
  // Check if subscription already exists
  const existingSubscription = await UserSubscription.findOne({
    userId,
    "subscriptions.type": type,
    "subscriptions.value": value,
  });
  if (existingSubscription) {
    res.status(400);
    throw new Error("Subscription already exists");
  }
  // Create or update user's subscriptions
  const subscription = await UserSubscription.findOneAndUpdate(
    { userId },
    {
      $push: {
        subscriptions: {
          type,
          value,
          frequency,
          lastChecked: new Date(),
        },
      },
    },
    { upsert: true, new: true }
  );
  res.status(201).json(subscription);
});

/**
 * @desc    Get user's subscriptions
 * @route   GET /api/subscriptions
 * @access  Private
 */
const getUserSubscriptions = asyncHandler(async (req, res) => {
  const userId = req.query.userId || req.body.userId;
  if (!userId) {
    res.status(400);
    throw new Error("userId is required");
  }
  const subscriptions = await UserSubscription.findOne({ userId });
  if (!subscriptions) {
    return res.status(200).json({ subscriptions: [] });
  }
  res.status(200).json(subscriptions);
});

/**
 * @desc    Update subscription preferences
 * @route   PUT /api/subscriptions/:id
 * @access  Private
 */
const updateSubscription = asyncHandler(async (req, res) => {
  const { userId, frequency } = req.body;
  const subscriptionId = req.params.id;
  if (!userId) {
    res.status(400);
    throw new Error("userId is required");
  }
  const subscription = await UserSubscription.findOneAndUpdate(
    {
      userId,
      "subscriptions._id": subscriptionId,
    },
    {
      $set: {
        "subscriptions.$.frequency": frequency,
        "subscriptions.$.lastChecked": new Date(),
      },
    },
    { new: true }
  );
  if (!subscription) {
    res.status(404);
    throw new Error("Subscription not found");
  }
  res.status(200).json(subscription);
});

/**
 * @desc    Remove subscription
 * @route   DELETE /api/subscriptions/:id
 * @access  Private
 */
const removeSubscription = asyncHandler(async (req, res) => {
  const subscriptionId = req.params.id;
  const userId = req.query.userId || req.body.userId;
  if (!userId) {
    res.status(400);
    throw new Error("userId is required");
  }
  const result = await UserSubscription.findOneAndUpdate(
    { userId },
    {
      $pull: {
        subscriptions: { _id: subscriptionId },
      },
    },
    { new: true }
  );
  if (!result) {
    res.status(404);
    throw new Error("Subscription not found");
  }
  res.status(200).json({ message: "Subscription removed successfully" });
});

/**
 * @desc    Get content from subscribed sources
 * @route   GET /api/subscriptions/content
 * @access  Private
 */
const getSubscribedContent = asyncHandler(async (req, res) => {
  const userId = req.query.userId || req.body.userId;
  const { page = 1, limit = 20 } = req.query;
  if (!userId) {
    res.status(400);
    throw new Error("userId is required");
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  // Get user's subscriptions
  const userSubscription = await UserSubscription.findOne({ userId });
  if (!userSubscription || !userSubscription.subscriptions.length) {
    return res.status(200).json({
      emails: [],
      total: 0,
      page: parseInt(page),
      pages: 0,
    });
  }
  // Build query based on subscriptions
  const folderSubscriptions = userSubscription.subscriptions
    .filter((sub) => sub.type === "folder")
    .map((sub) => sub.value);
  const senderSubscriptions = userSubscription.subscriptions
    .filter((sub) => sub.type === "sender")
    .map((sub) => sub.value);
  // Create query for both folder and sender subscriptions
  const query = {
    $or: [
      { folderId: { $in: folderSubscriptions } },
      { "from.address": { $in: senderSubscriptions } },
    ],
  };
  // Get emails matching subscriptions
  const [emails, total] = await Promise.all([
    Email.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
    Email.countDocuments(query),
  ]);
  // Update lastChecked for all subscriptions
  await UserSubscription.findOneAndUpdate(
    { userId },
    {
      $set: {
        "subscriptions.$[].lastChecked": new Date(),
      },
    }
  );
  res.status(200).json({
    emails,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  });
});

module.exports = {
  addSubscription,
  getUserSubscriptions,
  updateSubscription,
  removeSubscription,
  getSubscribedContent,
};
