const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { adminProtect } = require("../middleware/adminAuth");
const reportCtrl = require("../controllers/reportController");

const router = express.Router();

// User reports another user
router.post("/accounts", requireAuth, reportCtrl.reportAccount);
router.post("/content", requireAuth, reportCtrl.reportPostOrComment);

// Admin views account reports
router.get("/accounts", adminProtect, reportCtrl.adminGetAccountReports);
router.get("/posts", adminProtect, reportCtrl.adminGetPostReports);
router.get("/comments", adminProtect, reportCtrl.adminGetCommentReports);


router.patch("/accounts/:reportId/status", adminProtect, reportCtrl.adminUpdateReportStatus);

module.exports = router;