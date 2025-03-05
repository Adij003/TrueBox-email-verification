const mongoose = require('mongoose')

const CreditSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },

    credits_remaining: {
        type: Number,
        default: 100
    },
    credits_consumed: {
        type: Number
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
})

exports.module = mongoose.model("CreditInfo", CreditSchema)