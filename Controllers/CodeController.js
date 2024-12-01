const codeService = require('../Services/CodeService');

// Controller to execute code
const executeCode = async (req, res) => {
    try {
        const { language, version, files } = req.body;

        // Validate request body
        if (!language || !version || !files || files.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid request body. 'language', 'version', and 'files' are required.",
            });
        }

        // Prepare the payload for the Docker container
        const payload = { language, version, files };

        // Call the service to execute the code
        const result = await codeService.executeCode(payload);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Error executing code:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { executeCode };
