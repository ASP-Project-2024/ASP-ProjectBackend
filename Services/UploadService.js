// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');

// const sendFileToAPI = async (file, language) => {
//     const filePath = file.path;

//     try {
//         // Prepare the form-data
//         const formData = new FormData();
//         formData.append('file', fs.createReadStream(filePath));
//         formData.append('language', language);

//         // Send to external API
//         const response = await axios.post('https://external.api/endpoint', formData, {
//             headers: formData.getHeaders(),
//         });

//         // Return the response
//         return response;
//     } finally {
//         // Cleanup the temporary file
//         fs.unlinkSync(filePath);
//     }
// };

// module.exports = { sendFileToAPI };
