const express = require("express");
const postsCtrl = require("../controllers/posts_controller");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/", postsCtrl.refreshFeed);
router.get("/:id", postsCtrl.getPost);
router.post("/bookmarks", requireAuth, postsCtrl.addBookmark);
router.get("/bookmarks/:user_id", requireAuth, postsCtrl.getBookmarks);
// export router
module.exports = router;
