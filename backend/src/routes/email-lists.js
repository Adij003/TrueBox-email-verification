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
const upload = require("../middlewares/multer-middleware"); 

// Route to upload bulk emails via CSV file
// router.post("/bulk", upload.single("csv_file"), uploadBulkEmails);

router.post("/bulk", (req, res, next) => {
  next();
}, upload.single("csv_file"), uploadBulkEmails);

// Route to start bulk email verification
router.patch("/verify/bulk/:jobId", startBulkVerification);

// Route to check the status of a bulk verification job
router.get("/status/:jobId", checkBulkStatus);

// Route to download the results of a bulk verification job
router.post("/download/:jobId", downloadBulkResults);

// Route to verify a single email
router.post("/verify/single", verifySingleEmail);

// Route to get all email lists
router.get("/", getAllEmailLists);

module.exports = router; 
