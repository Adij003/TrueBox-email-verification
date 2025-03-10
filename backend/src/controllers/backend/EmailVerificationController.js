const axios = require("axios");
const FormData = require("form-data");
const Logs = require("../../utils/Logs");
const Response = require("../../utils/Response");
const { Readable } = require("stream"); // Import Readable for buffer stream
const EmailList = require("../../models/EmailList");
const Credit = require("../../models/Credit");

/**
 * Uploads a bulk email list for verification.
 * @param {Object} req - Express request object containing the uploaded file.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with job ID if successful, or error message.
 */
(exports.uploadBulkEmails = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(Response.error("CSV file is required"));
    }

    const { emailListName } = req.body;

    if (!emailListName) {
      return res.status(400).json(Response.error("Email list name is required"));
    }

    const fileStream = new Readable();
    fileStream.push(req.file.buffer);
    fileStream.push(null);

    const formData = new FormData();
    formData.append("local_file", fileStream, req.file.originalname);

    const API_KEY = process.env.BOUNCIFY_API_KEY;
    const response = await axios.post(
      `https://api.bouncify.io/v1/bulk?apikey=${API_KEY}`,
      formData,
      { headers: formData.getHeaders() }
    );

    const { job_id } = response.data;

    let userCreditInfo = await Credit.findOne({ user_id: req.user.id });
    const previousUserCredit = userCreditInfo.credits_remaining;
    console.log('Previous credits: ', previousUserCredit)

    const newBulkJob = new EmailList({
      type: "bulk",
      job_id,
      user_id: req.user.id,
      emailListName,
      previousCredits: previousUserCredit,
    });
    await newBulkJob.save();

    return res
      .status(200)
      .json(
        Response.success(
          "Bulk email verification list crated successfully",
          job_id
        )
      );
  } catch (error) {
    Logs.error("Erro in uploading bulk email", error);
    return res
      .status(500)
      .json(Response.error("Error in uploading bulk email", error));
  }
}),

  /**
   * Starts bulk email verification for a given job ID.
   * @param {Object} req - Express request object containing job_id in params.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response indicating whether the verification started.
   */

  (exports.startBulkVerification = async (req, res) => {
    try {
      const { job_id } = req.params;
      if (!job_id) {
        return res.status(400).json(Response.error("job_id is required"));
      }

      const API_KEY = process.env.BOUNCIFY_API_KEY;
      const url = `https://api.bouncify.io/v1/bulk/${job_id}?apikey=${API_KEY}`;
      const headers = { "Content-Type": "application/json" };
      const data = { action: "start" };

      const response = await axios.patch(url, data, { headers });

      await EmailList.findOneAndUpdate({ job_id }, { status: "in-progress" });

      return res
        .status(200)
        .json(Response.success("Email id verification started", response.data));
    } catch (error) {
      Logs.error("Error in starting email verification", error);
      return res
        .status(500)
        .json(Response.error("Error in starting email verification", error));
    }
  }),

  /**
   * Checks the status of a bulk email verification job.
   * @param {Object} req - Express request object containing job_id in params.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response with the job status and details.
   */

  (exports.checkBulkStatus = async (req, res) => {
    try {
      const { job_id } = req.params;

      if (!job_id) {
        return res.status(400).json(Response.error("Job_id is required..."));
      }

      const API_KEY = process.env.BOUNCIFY_API_KEY;
      const response = await axios.get(
        `https://api.bouncify.io/v1/bulk/${job_id}?apikey=${API_KEY}`
      );

      const data = response.data;
      let updateFields = {
        status: data.status,
        total: data.total,
        verified: data.verified,
        pending: data.pending,
        analysis: data.analysis,
        results: data.results,
        completedAt: data.status === "completed" ? new Date() : null,
      };

      if (data.status === "completed") {
        const responseCredits = await axios.get(
          `https://api.bouncify.io/v1/info?apikey=${API_KEY}`
        );
        const newUserCredits = responseCredits.data.credits_info.credits_remaining;
        console.log('new user current credits are: ', newUserCredits)
        const updatedRecord = await EmailList.findOneAndUpdate(
          { job_id },
          [
            {
              $set: updateFields,
            },
            {
              $set: {
                creditsConsumed: {
                  $subtract: ["$previousCredits", newUserCredits],
                },
              },
            },
          ],
          { new: true }
        );
        
        return res
          .status(200)
          .json(Response.success("Bulk job status retrieved", updatedRecord));
      }

      const updatedRecord = await EmailList.findOneAndUpdate(
        { job_id },
        updateFields,
        { new: true }
      );

      return res
        .status(200)
        .json(Response.success("Bulk job status retrieved", updatedRecord));
    } catch (error) {
      Logs.error("Error checking status of bulk emails", error);
      return res
        .status(500)
        .json(Response.error("Error in checking job", error.message));
    }
  });

/**
 * Downloads the results of a completed bulk email verification job.
 * @param {Object} req - Express request object containing job_id in params.
 * @param {Object} res - Express response object.
 * @returns {Object} CSV file as response stream if successful.
 */
(exports.downloadBulkResults = async (req, res) => {
  try {
    const { job_id } = req.params;

    if (!job_id) {
      return res.status(400).json(Response.error("Job_id is required..."));
    }

    const API_KEY = process.env.BOUNCIFY_API_KEY;
    const response = await axios.post(
      `https://api.bouncify.io/v1/download?jobId=${job_id}&apikey=${API_KEY}`,
      {
        filterResult: ["deliverable", "undeliverable", "accept_all", "unknown"],
      },
      { responseType: "stream" }
    );

    res.setHeader("Content-Disposition", `attachment; filename=${job_id}.csv`);
    res.setHeader("Content-Type", "text/csv");

    response.data.pipe(res);
  } catch (error) {
    console.error(
      "Error downloading results:",
      error.response?.data || error.message
    );
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
   *
   * @param {Object} req - Express request object containing the email and user details.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON response with verification result or an error message.
   */

  (exports.verifySingleEmail = async (req, res) => {
    try {
      const { email } = req.body;
      const API_KEY = process.env.BOUNCIFY_API_KEY;

      // Check if email was already verified to avoid unnecessary API calls
      const existingVerification = await EmailList.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") }, // Case-insensitive match
      });

      if (existingVerification) {

        const responseCredits = await axios.get(
          `https://api.bouncify.io/v1/info?apikey=${API_KEY}`
        );
        const availableCredits =
          responseCredits.data.credits_info.credits_remaining;

        return res.status(200).json({
          success: true,
          message: "Email verification result (cached)",
          data: existingVerification,
          availableCredits,
        });
      }

      // Call external email verification API
      const response = await axios.get(
        `https://api.bouncify.io/v1/verify?apikey=${API_KEY}&email=${email}`
      );
      const data = response.data;

      // Create a new verification record
      const newEmailVerificationRecord = new EmailList({
        user_id: req.user.id,
        type: "single", // Hardcoded type
        email: data.email,
        result: data.result,
        message: data.message,
        user: data.user,
        domain: data.domain,
        acceptAll: data.accept_all,
        role: data.role,
        freeEmail: data.free_email,
        disposable: data.disposable,
        spamtrap: data.spamtrap,
        success: data.success,
      });

      await newEmailVerificationRecord.save();

      // Fetch updated credit info
      const responseCredits = await axios.get(
        `https://api.bouncify.io/v1/info?apikey=${API_KEY}`
      );

      // Update user's credit info
      const updatedCreditInfo = await Credit.findOneAndUpdate(
        { user_id: req.user.id },
        {
          $inc: { credits_consumed: 1 }, // Increment credits consumed by 1
          $set: {
            credits_remaining:
              responseCredits.data.credits_info.credits_remaining,
          }, // Update remaining credits
        },
        { new: true, upsert: true } // Return the updated document, create one if not found
      );

      // Return response
      return res.status(200).json({
        success: true,
        message: "Email verification successful",
        data: newEmailVerificationRecord,
        updatedCreditInfo,
      });
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
  (
    exports.getAllEmailLists = async (req, res) => {
      try {
        const { type } = req.query; // (optional)
    
        let filter = { user_id: req.user.id }; 
    
        if (type) {
          if (!["single", "bulk"].includes(type)) {
            return res.status(400).json(Response.error("Invalid type. Use 'single' or 'bulk'"));
          }
          filter.type = type;
        }
    
        const emailLists = await EmailList.find(filter).sort({ createdAt: -1 }); 
    
        return res.status(200).json(Response.success("Email lists fetched successfully", emailLists));
      } catch (error) {
        Logs.error("Error fetching email lists", error);
        return res.status(500).json(Response.error("Error fetching email lists", error));
      }
    }
  );