const pool = require('../db'); // Your database connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    // Manual Signup
    static async signup(req, res) {
        const { emailid, firstname, lastname, phoneno, password } = req.body;
        try {
            // Check if user exists
            const userExists = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
            if (userExists.rows.length > 0) {
                const existingUser = userExists.rows[0];
                if (existingUser.auth_method === 'google') {
                    throw new Error('This email is registered via Google. Please use Google login.');
                } else {
                    throw new Error('Email ID already exists. Please log in manually.');
                }
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            await pool.query(
                'INSERT INTO users (firstname, lastname, phoneno, emailid, password, auth_method) VALUES ($1, $2, $3, $4, $5, $6)',
                [firstname, lastname, phoneno, emailid, hashedPassword, 'manual']
            );

            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Manual Login
    static async login(req, res) {
        const { emailid, password } = req.body;
        try {
            // Check if user exists
            const user = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
            if (user.rows.length === 0) {
                throw new Error('Invalid email ID or password');
            }

            const existingUser = user.rows[0];
            if (existingUser.auth_method !== 'manual') {
                throw new Error('This email is registered via Google. Please use Google login.');
            }

            // Compare the password with the stored hash
            const validPassword = await bcrypt.compare(password, existingUser.password);
            if (!validPassword) {
                throw new Error('Invalid email ID or password');
            }

            // Generate JWT token
            const tokenPayload = { userId: existingUser.id, emailid };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // User Profile
    static async profile(req, res) {
        const userId = req.user.userId; // This comes from the JWT token
        try {
            // Fetch the user details from the database using the user ID
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
            if (user.rows.length === 0) {
                throw new Error('User not found');
            }

            return res.status(200).json({ profile: user.rows[0] });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Google Signup
    static async googleSignup(req, res) {
        const { emailid, firstname, lastname } = req.body;
        try {
            // Check if user exists
            const userExists = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
            if (userExists.rows.length > 0) {
                const existingUser = userExists.rows[0];
                if (existingUser.auth_method === 'manual') {
                    throw new Error('This email is registered manually. Please use manual login.');
                } else {
                    throw new Error('User already exists. Please log in using Google.');
                }
            }

            // Insert new user as Google user
            await pool.query(
                'INSERT INTO users (firstname, lastname, emailid, auth_method) VALUES ($1, $2, $3, $4)',
                [firstname, lastname, emailid, 'google']
            );

            // Generate JWT token
            const tokenPayload = { emailid };
            const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(201).json({ message: 'Google sign-up successful', accessToken });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // Google Login
    static async googleLogin(req, res) {
        const { emailid } = req.body;
        try {
            // Check if user exists
            const user = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
            if (user.rows.length === 0) {
                throw new Error('User not found. Please sign up using Google.');
            }

            const existingUser = user.rows[0];
            if (existingUser.auth_method !== 'google') {
                throw new Error('This email is registered manually. Please use manual login.');
            }

            // Generate JWT token
            const tokenPayload = { emailid };
            const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Google login successful', accessToken });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AuthController;
