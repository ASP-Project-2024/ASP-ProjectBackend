// controllers/AuthController.js
const AuthService = require('../Services/AuthService');

class AuthController {
    static async signup(req, res) {
        const { emailid,firstname,lastname,phoneno, password } = req.body;

        try {
            const result = await AuthService.signup(emailid,firstname,lastname,phoneno, password);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req, res) {
        const { emailid, password } = req.body;

        try {
            const result = await AuthService.login(emailid, password);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async profile(req, res) {
        const { emailid} = req.body;

        try {
            const result = await AuthService.profile(emailid);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AuthController;
