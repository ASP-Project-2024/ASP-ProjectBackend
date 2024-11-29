const express = require('express');
const router = express.Router();
const codeController = require('../Controllers/CodeController');

// Route to handle code execution
router.post('/execute-code', codeController.executeCode);

module.exports = router;
