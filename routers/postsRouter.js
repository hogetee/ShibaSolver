const express = require("express");
const postsCtrl = require("../controllers/postsController");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

//GET
router.get("/", postsCtrl.refreshFeed);
router.get("/:id", postsCtrl.getPost);
router.get("/bookmarks/:user_id", requireAuth, postsCtrl.getBookmarks);

//POST
router.post("/bookmarks", requireAuth, postsCtrl.addBookmark);

//PUT
router.put("/", postsCtrl.createPost);
//DELETE

// export router
module.exports = router;
