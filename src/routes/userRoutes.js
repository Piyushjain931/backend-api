const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', requireAuth, logoutUser);

module.exports = router;
