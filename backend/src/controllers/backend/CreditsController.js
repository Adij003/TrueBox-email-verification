const axios = require("axios");
const Logs = require("../../utils/Logs");
const Response = require("../../utils/Response");
const Credit = require("../../models/Credit");

  /**
   * This method is used for retriving user's credit details.
   * @param {*} req
   * @param {*} res
   * @returns Credits
   */
exports.getCreditInfo = async (req, res) => {
  try {
    const API_KEY = process.env.BOUNCIFY_API_KEY;

    const responseCredits = await axios.get(
      `https://api.bouncify.io/v1/info?apikey=${API_KEY}`
    );

    let userCreditInfo = await Credit.findOne({ user_id: req.user.id });

    if (!userCreditInfo) {
      userCreditInfo = new Credit({
        user_id: req.user.id,
        total_credits: 100, 
        credits_remaining: responseCredits.data.credits_info.credits_remaining,
        credits_consumed:
          100 - responseCredits.data.credits_info.credits_remaining,
      });

      await userCreditInfo.save();
    } else {
      userCreditInfo.credits_remaining =
        responseCredits.data.credits_info.credits_remaining;
      userCreditInfo.credits_consumed =
        userCreditInfo.total_credits - userCreditInfo.credits_remaining;
      await userCreditInfo.save();
    }
    return res
      .status(200)
      .json(
        Response.success("Credit infor fetched successfuly", userCreditInfo)
      );
  } catch (error) {
    Logs.error("Error fetching user credit info", error);
    return res
      .status(500)
      .json(Response.error("Error in fetching user credit details", error));
  }
};
