const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // To forward the audio to the Flask API (if needed)
const FormData = require('form-data'); // To create multipart/form-data requests

const processAudio = async (base64Audio) => {
  try {
    // Decode the Base64 string into a Buffer (binary data)
    const audioBuffer = Buffer.from(base64Audio, 'base64');

    // Save the audio file to disk (optional)
    const audioPath = path.join(__dirname, '..', 'uploads', 'audio.webm'); // Path to save the audio file
    fs.writeFileSync(audioPath, audioBuffer);

    // Optionally, forward the audio to a Flask API (if needed)
    const flaskResponse = await forwardToFlaskAPI(audioBuffer);

    // Return a successful response after processing
    return {
      success: true,
      message: 'Audio processed successfully.',
      flaskResponse: flaskResponse,
    };
  } catch (error) {
    console.error('Error in audio processing service:', error);
    throw new Error('Error processing audio data');
  }
};

const forwardToFlaskAPI = async (audioBuffer) => {
  try {
    // Log the length of the audio buffer to ensure it's not empty
    console.log('Audio buffer size:', audioBuffer.length);

    // Create a FormData object and append the audio file
    const formData = new FormData();
    formData.append('audio_file', audioBuffer, { filename: 'audio.webm', contentType: 'audio/webm' });

    // Log FormData to check if the audio is correctly attached
    console.log('FormData object:', formData);

    // Make the API request to Flask
    const response = await fetch(`${process.env.WHISPER_URL}/api/process_audio`, {
      method: 'POST',
      body: formData, // Send FormData (multipart)
    });

    if (!response.ok) {
      throw new Error('Failed to forward audio to Flask API');
    }

    // Return Flask response data
    return await response.json();
  } catch (error) {
    console.error('Error forwarding audio to Flask API:', error);
    throw new Error('Error forwarding audio to Flask');
  }
};


module.exports = {
  processAudio,
};
