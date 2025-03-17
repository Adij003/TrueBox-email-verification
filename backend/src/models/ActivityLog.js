const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    moduleName: { type: String },
    eventSource: { type: String },
    action: { type: String, required: true },
    url: { type: String, required: true },
    data: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const ActivityLogs = mongoose.model('ActivityLog', activitySchema);

module.exports = ActivityLogs;