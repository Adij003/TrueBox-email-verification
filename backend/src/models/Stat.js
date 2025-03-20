const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        in_progress: {
            type: Number,
            default: 0
        },
        pending: {
            type: Number,
            default: 0
        },
        completed: {
            type: Number,
            default: 0
        }
    }

)

module.exports = mongoose.model("Stat", StatsSchema);
