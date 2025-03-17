/**
 * JWT Authentication Middleware
 */

const Response = require('../utils/response-util');
const ActivityLog = require('../models/ActivityLog');
const passport = require('passport');
const Logs = require('../utils/logs-util');

module.exports = async (req, res, next) => {

    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        try {
            if (err) {
                throw err;
            }

            if (!user) {
                throw "Invalid token!";
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
                    userId: user.id,
                    moduleName: req.routeOptions && req.routeOptions.moduleName ? req.routeOptions.moduleName : '',
                    eventSource: "api",
                    action: req.method,
                    url: req.originalUrl,
                    data: JSON.stringify(eventData),
                });

                // Save the logs to the database
                await newActivityLogs.save();
            }
            
            req.user = user;
            return next(); // User is authenticated, continue to the next middleware or route handler
        } catch (err) {
            Logs.error(err);
            res.status(401).json(Response.error(err));
        }
    })(req, res); // Pass req and res to the authenticate function
};