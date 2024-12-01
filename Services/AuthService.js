const pool = require('../db'); // Database connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    // Google Signup
    static async googleSignup(res, { emailid, firstname, lastname }) {
        const userExists = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
        if (userExists.rows.length > 0) {
            const existingUser = userExists.rows[0];
            if (existingUser.auth_method === 'manual') {
                throw new Error('This email is registered manually. Please use manual login.');
            } else {
                throw new Error('User already exists. Please log in using Google.');
            }
        }

        await pool.query(
            'INSERT INTO users (firstname, lastname, emailid, auth_method) VALUES ($1, $2, $3, $4)',
            [firstname, lastname, emailid, 'google']
        );



        // Set token in cookie

        return { message: 'Google sign-up successful' };
    }

    // Google Login
    static async googleLogin(res, { emailid }) {
        const user = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
        if (user.rows.length === 0) {
            throw new Error('User not found. Please sign up using Google.');
        }

        const existingUser = user.rows[0];
        if (existingUser.auth_method !== 'google') {
            throw new Error('This email is registered manually. Please use manual login.');
        }

        const tokenPayload = { emailid };
        const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '8h' });

        // Set token in cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite:'None',
            path: '/',
        });

        return { message: 'Google login successful' };
    }

    // Manual Signup
    static async signup(res, { emailid, firstname, lastname, phoneno, password }) {
        console.log(emailid, firstname, lastname, phoneno, password);
        const userExists = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
        if (userExists.rows.length > 0) {
            const existingUser = userExists.rows[0];
            if (existingUser.auth_method === 'google') {
                throw new Error('This email is registered via Google. Please use Google login.');
            } else {
                throw new Error('Email ID already exists. Please log in manually.');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (firstname, lastname, phoneno, emailid, password, auth_method) VALUES ($1, $2, $3, $4, $5, $6)',
            [firstname, lastname, phoneno, emailid, hashedPassword, 'manual']
        );

        return { message: 'User registered successfully' };
    }

    // Manual Login
    static async login(res, { emailid, password }) {
        const user = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
        if (user.rows.length === 0) {
            throw new Error('Invalid email ID or password');
        }

        const existingUser = user.rows[0];
        if (existingUser.auth_method !== 'manual') {
            throw new Error('This email is registered via Google. Please use Google login.');
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            throw new Error('Invalid email ID or password');
        }

        const tokenPayload = { userId: existingUser.id, emailid };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '8h' });

        // Set token in cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite:'None',
            path: '/',
        });

        return { message: 'Login successful' };
    }

    // Profile
    static async profile(req) {
        const emailid = req.user.emailid; // Extracted from JWT token middleware
        const user = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
        if (user.rows.length === 0) {
            throw new Error('User not found');
        }
        return user.rows[0];
    }

    // Logout
    static async logout(res) {
        // Clear the JWT token cookie
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
        });

        return { message: 'Logout successful' };
    }
}

module.exports = AuthService;
