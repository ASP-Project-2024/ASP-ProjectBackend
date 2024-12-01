const AudioService = require('../Services/AudioService'); // Import the AudioService

const uploadAudio = async (req, res) => {
  try {
    console.log(req.body)
    // Get the Base64 encoded audio from the request body
    const { audio } = req.body;

    if (!audio) {
      return res.status(400).json({ error: 'No audio provided in the request.' });
    }

    console.log('Received Base64 audio data.');

    // Pass the audio data to the AudioService for processing
    const response = await AudioService.processAudio(audio);

    // Send the response back to the client
    res.json(response);
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Error processing the audio request.' });
  }
};

module.exports = {
  uploadAudio,
};
