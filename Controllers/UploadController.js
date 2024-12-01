// const uploadService = require('../Services/UploadService');

// const uploadCodeFile = async (req, res) => {
//     try {
//         const { file, body: { language } } = req;

//         // Delegate the logic to the service
//         const apiResponse = await uploadService.sendFileToAPI(file, language);

//         res.status(apiResponse.status).send(apiResponse.data);
//     } catch (error) {s
//         console.error('Controller error:', error);
//         res.status(500).send({ error: 'Failed to process the file' });
//     }
// };

// module.exports = { uploadFile };
