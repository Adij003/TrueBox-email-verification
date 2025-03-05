const axios = require("axios");
const EmailVerification = require("../../models/EmailVerificationSchema"); // Import the schema
require("dotenv").config(); // To use environment variables

const verifySingleEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Validate input
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // 2️⃣ Check if email was already verified before (to avoid duplicate API calls)
    const existingVerification = await EmailVerification.findOne({ email });
    if (existingVerification) {
      return res.status(200).json({
        success: true,
        message: "Email verification result (cached)",
        data: existingVerification,
      });
    }

    // 3️⃣ Call Bouncify API
    const API_KEY = process.env.BOUNCIFY_API_KEY; // Store this in .env
    const response = await axios.get(
      `https://api.bouncify.io/v1/verify?apikey=${API_KEY}&email=${email}`
    );

    const data = response.data;

    // 4️⃣ Store in DB
    const emailVerification = new EmailVerification({
      email: data.email,
      result: data.result,
      message: data.message,
      user: data.user,
      domain: data.domain,
      accept_all: data.accept_all,
      role: data.role,
      free_email: data.free_email,
      disposable: data.disposable,
      spamtrap: data.spamtrap,
      success: data.success,
    });

    await emailVerification.save();

    // 5️⃣ Return response
    return res.status(200).json({
      success: true,
      message: "Email verification successful",
      data: emailVerification,
    });

  } catch (error) {
    console.error("Error verifying email:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Error verifying email",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = { verifySingleEmail };