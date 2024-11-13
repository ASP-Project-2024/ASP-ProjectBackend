const express = require('express');
const AudioController = require('../Controllers/AudioController');
const authenticateToken = require('../Middleware/Auth'); 

const router = express.Router();


router.post('/upload-webm', AudioController.uploadWebmFile);
router.post('/upload-txt', AudioController.uploadTxtFile);

module.exports = router;
