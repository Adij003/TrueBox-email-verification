const mongoose = require("mongoose");

const CreditSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  total_credits: {
    type: Number,
    default: 100,
  },
  credits_remaining: {
    type: Number,
    default: 100,
  },
  credits_consumed: {
    type: Number,
    default: 0,
  },
  creditsAddingHistory: {
    type: [
      {
        amountAdded: {
          type: Number,
          default: 100,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [{ amountAdded: 100, timestamp: Date.now() }],
  },
});

module.exports = mongoose.model("CreditInfo", CreditSchema);
