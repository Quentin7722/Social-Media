require('dotenv').config();
const express = require("express");
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.post('/avatar', auth, userCtrl.avatar)
router.delete('/delete', auth, userCtrl.delete);

module.exports = router;


