const express = require("express");
const { requireAuth } = require("../middleware/auth");
const reportCtrl = require("../controllers/reportController");

const router = express.Router();

// User reports another user
router.post("/accounts", requireAuth, reportCtrl.reportAccount);
router.post("/content", requireAuth, reportCtrl.reportPostOrComment);


module.exports = router;