/**
 * Session Authentication Middleware
 */

const Response = require('../utils/response-util');
const ActivityLog = require('../models/ActivityLog');

module.exports = async (req, res, next) => {

    if (!req.isAuthenticated()) {
        return res.status(400).json(Response.error("Please login first!"));
    }

    /**
     * Creating activity log
     */
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        let eventData = req.body;
        if (eventData && eventData.password) {
            delete eventData.password;
        }

        const newActivityLog = new ActivityLog({
            userId: req.user.id,
            moduleName: req.routeOptions && req.routeOptions.moduleName ? req.routeOptions.moduleName : '',
            eventSource: "user",
            action: req.method,
            url: req.originalUrl,
            data: JSON.stringify(eventData),
        });

        // Save the logs to the database
        await newActivityLog.save();
    }

    return next(); // User is authenticated, continue to the next middleware or route handler

};