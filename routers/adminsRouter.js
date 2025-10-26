const express = require('express');
const adminsCtrl = require('../controllers/adminsController'); 
const { adminProtect } = require('../middleware/adminAuth');
const router = express.Router();
router.use(adminProtect);

//GET
router.get('/', adminsCtrl.getAllAdmins);
router.get('/:id', adminsCtrl.getAdmin);
//DELETE
router.delete('/posts/:postId', adminsCtrl.adminDeletePost);

// export router
module.exports = router;