const express = require("express");
const {
  uploadBulkEmails,
  startBulkVerification,
  checkBulkStatus,
  downloadBulkResults, 
  verifySingleEmail,
  getAllEmailLists
} = require("../controllers/backend/EmailListsController");
const router = express.Router();
const upload = require("../middlewares/multer"); 

// Route to upload bulk emails via CSV file
router.post("/bulk", upload.single("csv_file"), uploadBulkEmails);

// Route to start bulk email verification
router.patch("/verify/bulk/:job_id", startBulkVerification);

// Route to check the status of a bulk verification job
router.get("/status/:job_id", checkBulkStatus);

// Route to download the results of a bulk verification job
router.post("/download/:job_id", downloadBulkResults);

// Route to verify a single email
router.post("/verify/single", verifySingleEmail);

// Route to get all email lists
router.get("/", getAllEmailLists);

module.exports = router; 
