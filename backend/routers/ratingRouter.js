const express = require("express");
const ratingCtrl = require("../controllers/ratingController");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

//GET
router.get("/summary", requireAuth, ratingCtrl.getSummaryBatch);

//POST
router.post("/", requireAuth, ratingCtrl.rate);

//PUT


//DELETE
router.delete("/", requireAuth, ratingCtrl.unrate);

// export router
module.exports = router;