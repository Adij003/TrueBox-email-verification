const express = require("express");
const {getCreditInfo} = require('../controllers/backend/CreditInfoController')

const router = express.Router();

router.get("/", getCreditInfo)

module.exports = router;