const express = require('express');
const AuthController = require('../Controllers/AuthController');
const authenticateToken = require('../Middleware/Auth'); // For authenticated routes

const router = express.Router();

// Define signup, login, Google signup and Google login routes
router.post('/signup', (req, res) => AuthController.signup(req, res)); // Manual signup
router.post('/login', (req, res) => AuthController.login(req, res)); // Manual login
router.post('/profile', authenticateToken, (req, res) => AuthController.profile(req, res)); // Authenticated profile

// Google Signup and Login routes
router.post('/google-signup', (req, res) => AuthController.googleSignup(req, res)); // Google Signup
router.post('/google-login', (req, res) => AuthController.googleLogin(req, res)); // Google Login

module.exports = router;
