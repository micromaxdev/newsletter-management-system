const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["sender", "folder"],
    index: true, // Add index for faster filtering by type
  },
  value: {
    type: String,
    required: true,
    // For sender type: will store email address
    // For folder type: will store folder ID from your existing folder enum
    index: true, // Add index for faster lookups
  },
  frequency: {
    type: String,
    required: true,
    enum: ["immediate", "daily", "weekly"],
    default: "immediate",
  },
  lastChecked: {
    type: Date,
    default: Date.now,
  },
});

const userSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for faster user lookups
    },
    subscriptions: [subscriptionSchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Compound index for userId + subscription type + value
// This ensures a user can't subscribe to the same thing twice
userSubscriptionSchema.index(
  {
    userId: 1,
    "subscriptions.type": 1,
    "subscriptions.value": 1,
  },
  { unique: true }
);

// Validate folder IDs when type is 'folder'
subscriptionSchema.pre("save", function (next) {
  if (this.type === "folder") {
    const validFolders = [
      "inbox",
      "supplier",
      "competitor",
      "information",
      "customers",
      "marketing",
      "archive",
    ];
    if (!validFolders.includes(this.value)) {
      next(new Error("Invalid folder ID"));
    }
  }
  next();
});

module.exports = mongoose.model("UserSubscription", userSubscriptionSchema);
