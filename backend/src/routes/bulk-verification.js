const express = require("express");
// const multer = require("multer");
const {
  uploadBulkEmails,
  startBulkVerification,
  checkBulkStatus, 
  downloadBulkResults,
} = require("../controllers/backend/BulkEmailVerificationController");

const router = express.Router();
const upload  = require("../middlewares/multer");

router.post('/bulk', upload.single('csv_file'), uploadBulkEmails);


router.patch("/start/:job_id", startBulkVerification); 
router.get("/status/:job_id", checkBulkStatus);
router.post("/download/:job_id", downloadBulkResults);

module.exports = router;