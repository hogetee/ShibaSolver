const express = require("express");
const usersCtrl = require("../controllers/usersController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

//GET
router.get("/", usersCtrl.getAllUsers);
router.get("/:username", usersCtrl.getUser);
//POST

//PUT
router.put("/", requireAuth, usersCtrl.updateUser);
router.put("/:id", usersCtrl.adminUpdateUser);

//DELETE
router.delete("/", requireAuth, usersCtrl.deleteUser);
router.delete("/:id", usersCtrl.adminDeleteUser);

// export router
module.exports = router;
