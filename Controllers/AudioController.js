const multer = require('multer');
const fs = require('fs');
const audioService = require('../services/audioService');

// Multer configuration for `.webm` files
const uploadWebm = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'audio/webm') {
            cb(null, true);
        } else {
            cb(new Error('Only .webm audio files are allowed!'), false);
        }
    },
});

// Multer configuration for `.txt` files
const uploadTxt = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Only .txt files are allowed!'), false);
        }
    },
});

// API for handling `.webm` files
const uploadWebmFile = (req, res) => {
    uploadWebm.single('audio')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path; // Path to the uploaded .webm file
            const response = await audioService.forwardFile(filePath, 'audio/webm'); // Forward file
            res.status(200).json({ message: 'WebM file forwarded successfully', response });
        } catch (error) {
            res.status(500).json({ error: 'Error processing WebM file', details: error.message });
        } finally {
            fs.unlinkSync(req.file.path); // Clean up uploaded file
        }
    });
};

// API for handling `.txt` files
const uploadTxtFile = (req, res) => {
    uploadTxt.single('textFile')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path; // Path to the uploaded .txt file
            const fileContent = fs.readFileSync(filePath, 'utf8'); // Read .txt content
            const response = await audioService.forwardText(fileContent); // Forward text
            res.status(200).json({ message: 'Text file forwarded successfully', response });
        } catch (error) {
            res.status(500).json({ error: 'Error processing text file', details: error.message });
        } finally {
            fs.unlinkSync(req.file.path); // Clean up uploaded file
        }
    });
};

module.exports = {
    uploadWebmFile,
    uploadTxtFile,
};
