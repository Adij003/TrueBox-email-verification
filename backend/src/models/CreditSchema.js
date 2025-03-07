const mongoose = require('mongoose')

const CreditSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  
        required: true
    },
    total_credits: {
        type: Number,
        default: 100
    },
    credits_remaining: {
        type: Number,
        default: 100
    },
    credits_consumed: {
        type: Number,
        default: 0
    },
    credits_adding_history: {
        type: [
            {
                amount_added: {
                    type: Number,
                    default: 100
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        default: [{ amount_added: 100, timestamp: Date.now() }] 
    }
});

module.exports = mongoose.model("CreditInfo", CreditSchema)
