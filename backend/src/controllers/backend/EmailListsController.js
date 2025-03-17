const axios = require("axios");
const FormData = require("form-data");
const Logs = require("../../utils/logs-util");
const Response = require("../../utils/response-util");
const { Readable } = require("stream"); // Import Readable for buffer stream 
const EmailList = require("../../models/EmailList");
const Credit = require("../../models/Credit");
const BouncifyService = require("../../services/bouncify-service");

/**
 * Uploads a bulk email list for verification.
 * @param {Object} req - Express request object containing the uploaded file.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with job ID if successful, or error message.
 */

  (exports.uploadBulkEmails = async (req, res) => {
    try {
      if (!req.file) return res.status(400).json(Response.error("CSV file is required"));
      if (!req.body.emailListName) return res.status(400).json(Response.error("Email list name is required"));

      const { emailListName } = req.body;
      const { buffer, originalname } = req.file;

      const { job_id } = await BouncifyService.uploadBulkEmails(buffer, originalname);

      const userCreditInfo = await Credit.findOne({ userId: req.user.id });

      const newBulkJob = new EmailList({ 
        type: "bulk",
        jobId: job_id,
        userId: req.user.id,
        emailListName,
        previousCredits: userCreditInfo.creditsRemaining,
      });
      await newBulkJob.save();

      return res.status(200).json(Response.success("Bulk email verification list created", job_id));

    } catch (error) {
      Logs.error("Erro in uploading bulk email", error);
      return res
        .status(500)
        .json(Response.error("Error in uploading bulk email", error));
    }
  }),

/**
* Starts bulk email verification for a given job ID.
* @param {Object} req - Express request object containing jobId in params.
* @param {Object} res - Express response object.
* @returns {Object} JSON response indicating whether the verification started.
*/
  (exports.startBulkVerification = async (req, res) => {
    try {
      if (!req.params.jobId) return res.status(400).json(Response.error("jobId is required"));

    const response = await BouncifyService.startBulkVerification(req.params.jobId);
    await EmailList.findOneAndUpdate({ jobId: req.params.jobId }, { status: "in-progress" });

    return res.status(200).json(Response.success("Email verification started", response));
    } catch (error) {
      Logs.error("Error in starting email verification", error);
      return res
        .status(500)
        .json(Response.error("Error in starting email verification", error));
    }
  }),

/**
* Checks the status of a bulk email verification job.
* @param {Object} req - Express request object containing jobId in params.
* @param {Object} res - Express response object.
* @returns {Object} JSON response with the job status and details.
*/
  (exports.checkBulkStatus = async (req, res) => {
    try {
      if (!req.params.jobId) {
        return res.status(400).json(Response.error("jobId is required"));
    }

    const data = await BouncifyService.checkBulkStatus(req.params.jobId);

    const updateFields = {
        status: data.status,
        total: data.total,
        verified: data.verified,
        pending: data.pending,
        analysis: data.analysis,
        results: data.results,
        completedAt: data.status === "completed" ? new Date() : null,
    };

    if (data.status === "completed") {
        const newUserCredits = await BouncifyService.getCreditInfo();
        const emailListRecord = await EmailList.findOne({ jobId: req.params.jobId });

        if (emailListRecord) {
            updateFields.creditsConsumed = emailListRecord.previousCredits - newUserCredits;
        }
    }

    const updatedRecord = await EmailList.findOneAndUpdate(
        { jobId: req.params.jobId },
        updateFields,
        { new: true }
    );

    return res.status(200).json(Response.success("Bulk job status retrieved", updatedRecord));
    } catch (error) {
      Logs.error("Error checking status of bulk emails", error);
      return res
        .status(500)
        .json(Response.error("Error in checking job", error.message));
    }
  });

/**
 * Downloads the results of a completed bulk email verification job.
 * @param {Object} req - Express request object containing jobId in params.
 * @param {Object} res - Express response object.
 * @returns {Object} CSV file as response stream if successful.
 */

(exports.downloadBulkResults = async (req, res) => {
    try {
      if (!req.params.jobId) return res.status(400).json(Response.error("jobId is required"));

      const responseStream = await BouncifyService.downloadBulkResults(req.params.jobId);

      res.setHeader("Content-Disposition", `attachment; filename=${req.params.jobId}.csv`);

      res.setHeader("Content-Type", "text/csv");

      responseStream.pipe(res);
    } catch (error) {
   
      Logs.error("Error in downloading data", error);
      return res
        .status(500)
        .json(Response.error("Error in downloading data", error));
    }
  }),

/**
* Verifies an email using the Bouncify API. If the email was previously verified,
* returns the cached result; otherwise, it makes an API request, saves the result,
* and updates the user's credit info.
* @param {Object} req - Express request object containing the email and user details.
* @param {Object} res - Express response object.
* @returns {Object} JSON response with verification result or an error message.
*/
  
(exports.verifySingleEmail = async (req, res) => {
    try {
      if (!req.body.email) return res.status(400).json(Response.error("Email is required"));
      const existingVerification = await EmailList.findOne({ email: req.body.email });

      if (existingVerification) {
      const availableCredits = await BouncifyService.getCreditInfo();
      return res.status(200).json(Response.success("Email verification result (cached)", { data: existingVerification, availableCredits }));
      }

      const data = await BouncifyService.verifySingleEmail(req.body.email);
      const newVerification = new EmailList({ userId: req.user.id, type: "single", ...data, creditsConsumed: 1, status: 'completed' });
      await newVerification.save(); 

      const updatedCreditInfo = await Credit.findOneAndUpdate(
        { userId: req.user.id },
        { $inc: { creditsConsumed: 1 }, $set: { creditsRemaining: await BouncifyService.getCreditInfo() } },
        { new: true, upsert: true }
      );

      return res.status(200).json(Response.success("Email verification successful", { newVerification, updatedCreditInfo }));
      } catch (error) {
      console.error(
        "Error verifying email:",
        error.response?.data || error.message
      );
      return res.status(500).json({
        success: false,
        message: "Error verifying email",
        error: error.response?.data || error.message,
      });
    }
  }),

/**
* Gets all Email-lists including single, bulk or both
*`@param {Object} req - object containing user details and optional type, single or bulk
* @param {Object} res - response object.
* @returns {Object} JSON response with the list of emails or an error message.
*/

exports.getAllEmailLists = async (req, res) => {
    try {
        const { type, status, search, page = 1, limit = 5 } = req.query;
        let filter = { userId: req.user.id };

        // Validate type if provided
        if (type) {
            if (!["single", "bulk"].includes(type)) {
                return res
                    .status(400)
                    .json(Response.error("Invalid type. Use 'single' or 'bulk'"));
            }
            filter.type = type;
        }

        if (status) {
            if (!["completed", "pending", "in-progress"].includes(status)) {
                return res
                    .status(400)
                    .json(Response.error("Invalid status. Use 'completed', 'pending', or 'in-progress'"));
            }
            filter.status = status;
        }

        if (search) {
          filter.$or = [
              { emailListName: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
          ];
      }

        const itemsPerPage = Math.min(Math.max(parseInt(limit), 1), 100);
        const skip = (Math.max(parseInt(page), 1) - 1) * itemsPerPage;

        const [emailLists, totalCount] = await Promise.all([
            EmailList.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(itemsPerPage),
            EmailList.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        return res.status(200).json(
            Response.success("Email lists fetched successfully", {
                emailLists,
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalItems: totalCount,
                    itemsPerPage,
                },
            })
        );
    } catch (error) {
        Logs.error("Error fetching email lists", error);
        return res
            .status(500)
            .json(Response.error("Error fetching email lists", error.message));
    }
};
