const express = require('express');
const commentsCtrl = require('../controllers/comments_controller'); 

const router = express.Router();

router.get('/', commentsCtrl.getAllComments);
router.get('/:id', commentsCtrl.getComment);


// export router
module.exports = router;