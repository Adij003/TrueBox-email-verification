const express = require("express");
const { getCreditInfo } = require("../controllers/backend/CreditsController");

const router = express.Router();

router.get("/", getCreditInfo);

module.exports = router;
