const axios = require("axios");
const FormData = require("form-data");
const Logs = require('../../utils/Logs');
const Response = require('../../utils/Response');
const { Readable } = require("stream"); // Import Readable for buffer stream
const BulkVerification = require("../../models/BulkVerificationSchema");
require("dotenv").config();


    exports.uploadBulkEmails = async (req, res) => {
      try {
        console.log("Received file:", req.file); // Debugging
    
        if (!req.file) {
          return res.status(400).json(Response.error("CSV file is required"));
      }
          
        // Create a readable stream from buffer
        const fileStream = new Readable();
        fileStream.push(req.file.buffer);
        fileStream.push(null); // End stream
    
        // Prepare form data
        const formData = new FormData();
        formData.append("local_file", fileStream, req.file.originalname);
    
        // Call Bouncify API
        const API_KEY = process.env.BOUNCIFY_API_KEY;
        const response = await axios.post(
          `https://api.bouncify.io/v1/bulk?apikey=${API_KEY}`, // Fix the query param syntax
          formData,
          { headers: formData.getHeaders() }
        );
    
        const { job_id } = response.data;
    
        // Store job in DB
        const newBulkJob = new BulkVerification({ job_id });
        await newBulkJob.save();
    
       
        return res.status(200).json(Response.success("Bulk email verification list crated successfully", job_id));
    
      } catch (error) {
       Logs.error('Erro in uploading bulk email', error)
        return res.status(500).json(Response.error('Error in uploading bulk email', error));

      }
    },

    exports.startBulkVerification = async (req, res) => {
      try {
        const { job_id } = req.params;
  
        if (!job_id) {
            return res.status(400).json(Response.error('job_id is required'));
        }

        Logs.info('job_id is: ', job_id)
  
        // Prepare API request
        const API_KEY = process.env.BOUNCIFY_API_KEY;
        const url = `https://api.bouncify.io/v1/bulk/${job_id}?apikey=${API_KEY}`;
        const headers = { 'Content-Type': 'application/json' };
        const data = { "action": "start" }; // ✅ Include required body
  
        // Make API request
        const response = await axios.patch(url, data, { headers });
  
        // Update status in DB
        await BulkVerification.findOneAndUpdate(
            { job_id },
            { status: "in-progress" }
        );
  
        return res.status(200).json(Response.success('Email id verification started', job_id));
  
    } catch (error) {
        Logs.error('Error in starting email verification', error)
        return res.status(500).json(Response.error('Error in starting email verification', error));
    }
    },

    exports.checkBulkStatus = async (req, res) => {
      try {
        const { job_id } = req.params;
    
        if (!job_id) {
          return res.status(400).json(Response.error('Job_id is required...'));
        }
    
        // Call Bouncify API
        const API_KEY = process.env.BOUNCIFY_API_KEY;
        const response = await axios.get(
          `https://api.bouncify.io/v1/bulk/${job_id}?apikey=${API_KEY}`
        );
    
        const data = response.data;
    
        // Update status and results in DB
        await BulkVerification.findOneAndUpdate(
          { job_id },
          {
            status: data.status,
            total: data.total,
            verified: data.verified,
            pending: data.pending,
            analysis: data.analysis,
            results: data.results,
            completedAt: data.status === "completed" ? new Date() : null,
          }
        );
    
        return res.status(200).json(Response.success('"Bulk job status retrieved: ', data));
    
      } catch (error) {
        
        Logs.error('Error checking status of bulk emails', error)
        return res.status(500).json(Response.error('Error in checking job', error));
      }
    },
    exports.downloadBulkResults = async (req, res) => {
      try {
        const { job_id } = req.params;
  
    
        if (!job_id) {
          return res.status(400).json(Response.error('Job_id is required...'));
        }
    
        // Call Bouncify API
        const API_KEY = process.env.BOUNCIFY_API_KEY;
        const response = await axios.post(
          `https://api.bouncify.io/v1/download?jobId=${job_id}&apikey=${API_KEY}`,
          { filterResult: ["deliverable", "undeliverable", "accept_all", "unknown"] }, 
          { responseType: "stream" }
       );
    
        // Set response headers for file download
        res.setHeader("Content-Disposition", `attachment; filename=${job_id}.csv`);
        res.setHeader("Content-Type", "text/csv");
    
        // Pipe the response directly to the client
        response.data.pipe(res);
    
      } catch (error) {
        console.error("Error downloading results:", error.response?.data || error.message);
        Logs.error('Error in downloading data', error)
        return res.status(500).json(Response.error('Error in downloading data', error));
      }
    }




