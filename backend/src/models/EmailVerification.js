const mongoose = require("mongoose");

const EmailVerificationSchema = new mongoose.Schema({
  user_id: {
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
  email: { type: String, required: function() { return this.type === "single"; } },
  result: {
    type: String,
    enum: ["deliverable", "undeliverable", "accept-all", "unknown"],
    required: function() { return this.type === "single"; },
  },
  message: { type: String },
  user: { type: String },
  domain: { type: String },
  accept_all: { type: Number },
  role: { type: Number },
  free_email: { type: Number },
  disposable: { type: Number },
  spamtrap: { type: Number },
  success: { type: Boolean },

  // Bulk Email Verification Fields
  job_id: { type: String, unique: true, required: function() { return this.type === "bulk"; } },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  credits_consumed: { type: Number, default: 0 },
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
    accept_all: { type: Number, default: 0 },
    unknown: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("EmailVerification", EmailVerificationSchema);
