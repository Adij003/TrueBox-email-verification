const axios = require("axios");
const Logs = require('../../utils/Logs');
const Response = require('../../utils/Response');
const CreditInfo = require("../../models/CreditSchema");
require("dotenv").config();

exports.getCreditInfo = async (req, res) => {
    try{

        const API_KEY = process.env.BOUNCIFY_API_KEY;

        const responseCredits = await axios.get(
            `https://api.bouncify.io/v1/info?apikey=${API_KEY}`
          );
      
          
          console.log('the credit response with data is: ',responseCredits.data) // for debugging

          let userCreditInfo = await CreditInfo.findOne({ user_id: req.user.id });

          if (!userCreditInfo) {
              // If no record exists, create a new one with default total_credits (100)
              userCreditInfo = new CreditInfo({
                  user_id: req.user.id,
                  total_credits: 100, // Default total credits
                  credits_remaining: responseCredits.data.credits_info.credits_remaining,
                  credits_consumed: 100 - responseCredits.data.credits_info.credits_remaining
              });
  
              await userCreditInfo.save();
          }else {
            // Update existing record
            userCreditInfo.credits_remaining = responseCredits.data.credits_info.credits_remaining;
            userCreditInfo.credits_consumed = userCreditInfo.total_credits - userCreditInfo.credits_remaining;
            await userCreditInfo.save();
        }
        return res.status(200).json(Response.success('Credit infor fetched successfuly', userCreditInfo));
      
    } catch (error) {
        Logs.error('Error fetching user credit info', error)
        return res.status(500).json(Response.error('Error fetching user credit info', error))
    }
}