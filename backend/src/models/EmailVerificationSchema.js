const mongoose = require("mongoose");

const EmailVerificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
},
  email: { type: String, required: true, unique: true },
  result: { type: String, enum: ["deliverable", "undeliverable", "accept-all", "unknown"], required: true },
  message: { type: String },
  user: { type: String },
  domain: { type: String },
  accept_all: { type: Number },
  role: { type: Number },
  free_email: { type: Number },
  disposable: { type: Number },
  spamtrap: { type: Number },
  success: { type: Boolean, required: true },
  verifiedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EmailVerification", EmailVerificationSchema);