const express = require('express');
const { requireAuth } = require("../middleware/auth");
const commentsCtrl = require('../controllers/commentsController'); 

const router = express.Router();

//GET
router.get('/post/:postId/popular', requireAuth, commentsCtrl.getCommentsByPopularity);
router.get('/:id', commentsCtrl.getComment);
//POST
router.post('/', requireAuth, commentsCtrl.createComment);
//PUT

//DELETE

// export router
module.exports = router;