const express = require('express');
const adminsCtrl = require('../controllers/admins_controller'); 

const router = express.Router();

router.get('/', adminsCtrl.getAllAdmins);
router.get('/:id', adminsCtrl.getAdmin);

// export router
module.exports = router;