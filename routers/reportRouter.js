const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/admin");
const reportCtrl = require("../controllers/reportController");

const router = express.Router();

// User reports another user
router.post("/accounts", requireAuth, reportCtrl.reportAccount);

// Admin views account reports
//router.get("/accounts", requireAdmin, reportCtrl.adminGetAccountReports);

module.exports = router;