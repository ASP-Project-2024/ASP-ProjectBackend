const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SpeechClient } = require('@google-cloud/speech');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { Readable } = require('stream');

const app = express();

app.use(bodyParser.json({ limit: '100mb' })); // Increase the limit for large audio files
app.use(bodyParser.urlencoded({ extended: true }));
const authRoutes = require('./Routes/AuthRoutes');
const uploadRoutes=require('./Routes/UploadRoutes')
const audioRoutes = require('./Routes/AudioRoutes');
const codeRoutes =require('./Routes/CodeRoutes')
const port = 4000;
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Allow only localhost:3000
  credentials: true, // Allow credentials (cookies, headers)
}));


// Use AuthRoutes with a prefix for authentication routes
app.use('/auth', authRoutes);
app.use('/audio', audioRoutes);
app.use('/code', codeRoutes);
//app.use('/upload', uploadRoutes);
// Set up multer to handle audio file uploads in memory
const upload = multer();


// Create a SpeechClient instance
const client = new SpeechClient();

// Route to handle audio file upload and transcription
app.post('/upload-audio', upload.single('audioFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Access the uploaded audio file data as a Buffer
  const audioBuffer = req.file.buffer;

  // Configure the audio data for transcription
  const audio = {
    content: audioBuffer.toString('base64'), // Convert Buffer to Base64
  };

  const config = {
    encoding: 'LINEAR16', // Specify the audio encoding
    sampleRateHertz: 16000, // Set the sample rate
    languageCode: 'en-US', // Set the language code
  };

  const request = {
    audio: audio,
    config: config,
  };

  try {
    // Call the Speech-to-Text API
    const [response] = await client.longRunningRecognize(request);
    const [operation] = await response.promise();
    
    const transcription = operation.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Send the transcription back to the client
    res.json({
      message: 'Audio file processed successfully',
      transcription: transcription,
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).send('Error transcribing audio.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
