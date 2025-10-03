const express = require('express');
const { requireAuth } = require("../middleware/auth");
const commentsCtrl = require('../controllers/commentsController'); 

const router = express.Router();

//GET
router.get('/me', requireAuth, commentsCtrl.getMyComments);
router.get('/post/:postId/top', commentsCtrl.getTopComment);
router.get('/post/:postId', requireAuth, commentsCtrl.getComments);
router.get('/:id', requireAuth, commentsCtrl.getComment);

//POST
router.post('/', requireAuth, commentsCtrl.createComment);

//PUT
router.put('/:id', requireAuth, commentsCtrl.editComment);

// PATCH (toggle flag/unflag solution)
router.patch('/:commentId/solution', requireAuth, commentsCtrl.toggleMyCommentSolution);

//DELETE
router.delete('/:id', requireAuth, commentsCtrl.deleteComment);

// export router
module.exports = router;