const express = require("express");
const {getActivityLogs} = require("../controllers/backend/ActivityLogController")

const router = express.Router();

router.get("/", getActivityLogs);

module.exports = router;