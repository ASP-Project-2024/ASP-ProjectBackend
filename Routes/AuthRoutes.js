// routes/auth.js
const express = require('express');
const AuthController = require('../Controllers/AuthController');
const authenticateToken = require('../Middleware/Auth');

const router = express.Router();

// Define signup and login routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/profile', authenticateToken,AuthController.profile);

module.exports = router;
