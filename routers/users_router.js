const express = require("express");
const usersCtrl = require("../controllers/users_controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", usersCtrl.getAllUsers);
router.get("/:id", usersCtrl.getUser);
router.delete("/:id", requireAuth, usersCtrl.deleteUser);
router.put("/:id", requireAuth, usersCtrl.updateUser);

// export router
module.exports = router;
