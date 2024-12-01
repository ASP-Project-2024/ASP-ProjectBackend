const AuthService = require('../Services/AuthService'); // Import AuthService

class AuthController {
    // Google Signup
    static async googleSignup(req, res) {
        try {
            const { emailid, firstname, lastname } = req.body;
            const result = await AuthService.googleSignup(res, { emailid, firstname, lastname });
            return res.status(201).json(result); // Send success message
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Send error message
        }
    }

    // Google Login
    static async googleLogin(req, res) {
        try {
            const { emailid } = req.body;
            const result = await AuthService.googleLogin(res, { emailid });
            return res.status(200).json(result); // Send success message
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Send error message
        }
    }

    // Manual Signup
    static async signup(req, res) {
        try {
            console.log("hi");
            const { emailid, firstname, lastname, phoneno, password } = req.body;
            const result = await AuthService.signup(res, { emailid, firstname, lastname, phoneno, password });
            return res.status(201).json(result); // Send success message
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Send error message
        }
    }

    // Manual Login
    static async login(req, res) {
        try {
            const { emailid, password } = req.body;
            const result = await AuthService.login(res, { emailid, password });
            return res.status(200).json(result); // Send success message
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Send error message
        }
    }

    // Profile
    static async profile(req, res) {
        try {
            const profileData = await AuthService.profile(req);
            return res.status(200).json({ profile: profileData }); // Send profile data
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Send error message
        }
    }

    // Logout
    static async logout(req, res) {
        try {
            const result = await AuthService.logout(res);
            return res.status(200).json(result); // Send success message
        } catch (error) {
            return res.status(400).json({ error: error.message }); // Send error message
        }
    }
}

module.exports = AuthController;
