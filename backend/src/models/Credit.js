const mongoose = require("mongoose");

const CreditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalCredits: {
    type: Number,
    default: 100,
  },
  creditsRemaining: {
    type: Number,
    default: 100,
  },
  creditsConsumed: {
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
        status: {
          type: String,
          default: 'completed'
        },
      },
    ],
    default: [{ amountAdded: 100, timestamp: Date.now() }],
  },
});

module.exports = mongoose.model("Credits", CreditSchema);
