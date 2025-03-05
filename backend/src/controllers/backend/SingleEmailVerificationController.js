const { check, validationResult } = require("express-validator");
const axios = require("axios");
const EmailVerification = require("../../models/EmailVerificationSchema"); 
const Response = require('../../utils/Response');
const Logs = require('../../utils/Logs');
require("dotenv").config();
const CreditInfo = require('../../models/CreditSchema')

const validateEmail = [
  check("email").isEmail().withMessage("Please provide email in correct format, this will help us to save credit and fire unwanted api requests"),
];

const verifySingleEmail = async (req, res) => {
  try {
    console.log('the req parameter: ', req.user.id) //debugging
    // Validate input 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(Response.error('Invalid Email id', errors));
    }

    const { email } = req.body;
    const API_KEY = process.env.BOUNCIFY_API_KEY;


    // Checking if email was already verified before to avoid unnecessaru api calls

    const existingVerification = await EmailVerification.findOne({ email });

    if (existingVerification) {

      const responseCredits = await axios.get(
        `https://api.bouncify.io/v1/info?apikey=${API_KEY}`
      );
  
      const availableCredits = responseCredits.data.credits_info.credits_remaining
      // console.log('Current usable credits ', responseCredits.data.credits_info.credits_remaining) // for debugging


      return res.status(200).json({
        success: true,
        message: "Email verification result (cached)",
        data: existingVerification,
      });
    }

    
    const response = await axios.get(
      `https://api.bouncify.io/v1/verify?apikey=${API_KEY}&email=${email}`
    );

    const data = response.data;

    
    const emailVerification = new EmailVerification({
      user_id: req.user.id,
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

    const responseCredits = await axios.get(
      `https://api.bouncify.io/v1/info?apikey=${API_KEY}`
    );

    
    console.log('the credit response with data is: ',responseCredits.data)


    // const creditInfoUpdate = new CreditInfo({

    // })

    // Return response
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

module.exports = { verifySingleEmail, validateEmail };
