const mongoose = require("mongoose");

const EmailVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["single", "bulk"],
    required: true,
  },
  // Single Email Verification Fields
  email: {
    type: String,
    required: function () {
      return this.type === "single";
    },
    sparse: true,
  },
  result: {
    type: String,
    enum: ["deliverable", "undeliverable", "accept-all", "unknown"],
    required: function () {
      return this.type === "single";
    },
  }, 
  message: { type: String },
  user: { type: String },
  domain: { type: String },
  acceptAll: { type: Number },
  role: { type: Number },
  freeEmail: { type: Number },
  disposable: { type: Number },
  spamtrap: { type: Number },
  success: { type: Boolean },
  
  // Bulk Email Verification Fields
  jobId: {
    type: String,
    unique: true,
    required: function () {
      return this.type === "bulk";
    },
    sparse: true,
  }, 
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "ready", "verifying"],
    default: "pending",
  },
  emailListName: { type: String },
  
  previousCredits: { type: Number, default: 0 },
  creditsConsumed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  total: { type: Number },
  verified: { type: Number, default: 0 },
  pending: { type: Number, default: 0 },
  analysis: {
    common_isp: { type: Number, default: 0 },
    role_based: { type: Number, default: 0 },
    disposable: { type: Number, default: 0 },
    spamtrap: { type: Number, default: 0 },
    syntax_error: { type: Number, default: 0 },
  },
  results: {
    deliverable: { type: Number, default: 0 },
    undeliverable: { type: Number, default: 0 },
    acceptAll: { type: Number, default: 0 },
    unknown: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("EmailList", EmailVerificationSchema);
