const axios = require("axios");
const FormData = require("form-data");
const Logs = require("../../utils/logs-util");
const Response = require("../../utils/response-util");
const ActivityLog = require("../../models/ActivityLog")

 /**
   * This method is used for retriving user Activity log details.
   * @param {*} req
   * @param {*} res
   * @returns Activity logs
   */
exports.getActivityLogs = async (req, res) => {
    try {
        const { search, page = 1, limit = 5 } = req.query;
        let filter = { user_id: req.user.id };

        if (search) {
            filter.$or = [
                { moduleName: { $regex: search, $options: 'i' } },
                { action: { $regex: search, $options: 'i' } }
            ];
        }

        const itemsPerPage = Math.min(Math.max(parseInt(limit), 1), 100);
        const skip = (Math.max(parseInt(page), 1) - 1) * itemsPerPage;

        const [activityLogsFiltered, totalCount] = await Promise.all([
            ActivityLog.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(itemsPerPage),
            ActivityLog.countDocuments(filter) // ✅ Fixed here
        ]);

        const totalPages = Math.ceil(totalCount / itemsPerPage);
        return res.status(200).json(
            Response.success("ActivityLogs fetched successfully", {
                activityLogsFiltered, 
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalItems: totalCount, 
                    itemsPerPage
                }
            })
        );
    } catch (error) {
        Logs.error("Error fetching activity logs", error);
        return res.status(500).json(Response.error("Error fetching Activity logs", error));
    }
};
