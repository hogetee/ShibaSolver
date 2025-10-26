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
//PATCH
router.patch('/users/:userId/ban', adminsCtrl.adminBanUser);
router.patch('/users/:userId/unban', adminsCtrl.adminUnbanUser);

// export router
module.exports = router;