const axios = require('axios');

// Service to handle communication with Docker container
const executeCode = async (payload) => {
    try {
        console.log('Sending payload to Docker container:', payload);

        const response = await axios.post(`${process.env.PISTON_URL}/api/v2/execute`, payload, {
            timeout: 20000, // Increase timeout to 10 seconds
        });

        console.log('Response from Docker container:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error communicating with Docker container:', error.message);

        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || 'Docker container execution failed');
        }

        throw new Error('Failed to execute the code in Docker container');
    }
};

module.exports = { executeCode };
