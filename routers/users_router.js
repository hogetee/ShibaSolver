const express = require('express');
const usersCtrl = require('../controllers/users_controller'); 

const router = express.Router();

router.get('/', usersCtrl.getAllUsers);
router.get('/:id', usersCtrl.getUser);
router.delete('/:id', usersCtrl.deleteUser);



// export router
module.exports = router;