const express = require('express');
const AuthController = require('../Controllers/AuthController');
const authenticateToken = require('../Middleware/Auth'); // For authenticated routes

const router = express.Router();

// Define signup, login, Google signup and Google login routes
router.post('/google-signup', AuthController.googleSignup);
router.post('/google-login', AuthController.googleLogin);
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/profile', authenticateToken, AuthController.profile); // Protected route
router.post('/logout', AuthController.logout);

module.exports = router;
