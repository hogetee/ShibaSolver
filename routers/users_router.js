const express = require("express");
const usersCtrl = require("../controllers/users_controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", usersCtrl.getAllUsers);
router.get("/:id", usersCtrl.getUser);
router.delete("/", requireAuth, usersCtrl.deleteUser);
router.put("/", requireAuth, usersCtrl.updateUser);
router.delete("/:id", usersCtrl.adminDeleteUser);
router.put("/:id", usersCtrl.adminUpdateUser);

// export router
module.exports = router;
