const express = require("express");
const { verifySingleEmail } = require("../controllers/backend/SingleEmailVerificationController");

const router = express.Router();

router.post("/", verifySingleEmail); // POST request for single email verification

module.exports = router;