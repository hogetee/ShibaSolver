const express = require("express");
const usersCtrl = require("../controllers/usersController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { getShibaMeter } = require("../controllers/ratingController");

const router = express.Router();

//GET
router.get("/:username", usersCtrl.getUser);
router.get("/:username/shibameter", getShibaMeter);
router.get("/:userID/posts",optionalAuth, usersCtrl.getPostbyUserId);
//POST

//PUT
router.put("/premium", requireAuth, usersCtrl.updatePremium);
router.put("/", requireAuth, usersCtrl.updateUser);


//DELETE
router.delete("/", requireAuth, usersCtrl.deleteUser);

// export router
module.exports = router;
