const express = require('express');
const router = express.Router();
const { uploadAudio} = require('../Controllers/AudioController');

// POST route to handle audio upload
router.post('/upload-audio',  uploadAudio);

module.exports = router;
