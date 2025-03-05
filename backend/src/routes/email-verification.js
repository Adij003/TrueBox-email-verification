const express = require("express");
const { verifySingleEmail, validateEmail  } = require("../controllers/backend/SingleEmailVerificationController");


const router = express.Router();

router.post("/",  validateEmail, verifySingleEmail); // POST request for single email verification

module.exports = router;