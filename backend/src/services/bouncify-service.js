const axios = require("axios");
const FormData = require("form-data");

const API_KEY = process.env.BOUNCIFY_API_KEY;
const BASE_URL = "https://api.bouncify.io/v1";

const BouncifyService = {
  /**
   * Upload bulk emails to Bouncify
   */
  uploadBulkEmails: async (fileBuffer, fileName) => {
    try {
      const fileStream = require("stream").Readable.from(fileBuffer);
      const formData = new FormData();
      formData.append("local_file", fileStream, fileName);

      const response = await axios.post(
        `${BASE_URL}/bulk?apikey=${API_KEY}`,
        formData,
        { headers: formData.getHeaders() }
      );

      return response.data; 
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Start bulk email verification
   */
  startBulkVerification: async (jobId) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/bulk/${jobId}?apikey=${API_KEY}`,
        { action: "start" },
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Check bulk verification status
   */
  checkBulkStatus: async (jobId) => {
    try {
      const response = await axios.get(`${BASE_URL}/bulk/${jobId}?apikey=${API_KEY}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Download bulk verification results
   */
  downloadBulkResults: async (jobId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/download?jobId=${job_id}&apikey=${API_KEY}`,
        { filterResult: ["deliverable", "undeliverable", "accept_all", "unknown"] },
        { responseType: "stream" }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Verify a single email
   */
  verifySingleEmail: async (email) => {
    try {
      const response = await axios.get(`${BASE_URL}/verify?apikey=${API_KEY}&email=${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch user credit information
   */
  getCreditInfo: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/info?apikey=${API_KEY}`);
      return response.data.credits_info.credits_remaining;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

module.exports = BouncifyService;
