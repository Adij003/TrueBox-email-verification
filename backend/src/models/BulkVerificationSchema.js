  const mongoose = require("mongoose");

  const BulkVerificationSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
  },
    job_id: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
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
    emails: [
      {
        email: { type: String, required: true },
        result: { type: String, enum: ["deliverable", "undeliverable", "accept-all", "unknown"] },
        verifiedAt: { type: Date },
      },
    ],
  });

  module.exports = mongoose.model("BulkVerification", BulkVerificationSchema);