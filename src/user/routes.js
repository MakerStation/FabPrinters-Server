const express = require('express');
const router = express.Router();
const UserController = require('./controller')

router.post('/login', UserController.login)
router.post('/register', UserController.register)

module.exports = router;
