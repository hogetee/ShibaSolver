const express = require("express");
const usersCtrl = require("../controllers/usersController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { getShibaMeter } = require("../controllers/ratingController");

const router = express.Router();

//GET
router.get("/", usersCtrl.getAllUsers);
router.get("/:username", usersCtrl.getUser);
router.get("/:username/shibameter", getShibaMeter);
router.get("/:userID/posts",optionalAuth, usersCtrl.getPostbyUserId);
//POST

//PUT
router.put("/", requireAuth, usersCtrl.updateUser);
router.put("/:id", usersCtrl.adminUpdateUser);

//DELETE
router.delete("/", requireAuth, usersCtrl.deleteUser);
router.delete("/:id", usersCtrl.adminDeleteUser);

// export router
module.exports = router;
