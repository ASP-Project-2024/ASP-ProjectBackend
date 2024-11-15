const multer = require('multer');
const audioService = require('../services/audioService');

// Multer configuration for `.webm` files (disk storage)
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

// Multer configuration for `.txt` files (memory storage)
const uploadTxt = multer({
    storage: multer.memoryStorage(),
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
            if (!req.file) {
                return res.status(400).json({ error: 'No WebM file uploaded.' });
            }

            const filePath = req.file.path; // Path to the uploaded `.webm` file

            // Process the audio file
            const transcription = await audioService.transcribeAudio(filePath);

            res.status(200).json({
                message: 'WebM file processed successfully',
                transcription,
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error processing WebM file',
                details: error.message,
            });
        } finally {
            // Clean up uploaded file
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            }
        }
    });
};

// API for handling `.txt` files
const uploadTxtFile = async (req, res) => {
    try {
        const { paragraph } = req.body; // Extract paragraph from the request body

        if (!paragraph || typeof paragraph !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing paragraph.' });
        }

        // Process the text content (e.g., summarization)
        const summary = await audioService.summarizeText(paragraph);

        res.status(200).json({
            message: 'Paragraph processed successfully',
            summary,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error processing paragraph',
            details: error.message,
        });
    }
};


module.exports = {
    uploadWebmFile,
    uploadTxtFile,
};
