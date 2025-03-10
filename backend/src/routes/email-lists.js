const express = require("express");
// const multer = require("multer");
const {
  uploadBulkEmails,
  startBulkVerification,
  checkBulkStatus,
  downloadBulkResults,
  verifySingleEmail,
} = require("../controllers/backend/EmailVerificationController");

const router = express.Router();
const upload = require("../middlewares/multer");

router.post("/upload-bulk", upload.single("csv_file"), uploadBulkEmails);

router.patch("/verify/bulk/:job_id", startBulkVerification);
router.get("/status/:job_id", checkBulkStatus);
router.post("/download/:job_id", downloadBulkResults);
router.post("/verify/single", verifySingleEmail);

module.exports = router;
