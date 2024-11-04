// services/AuthService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

class AuthService {
    static async signup(emailid, firstname,lastname,phoneno,password) {
        // Check if the emailid already exists
        const userExists = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
        if (userExists.rows.length > 0) {
            throw new Error('emailid already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await pool.query('INSERT INTO users (firstname,lastname,phoneno,emailid, password) VALUES ($1, $2,$3,$4,$5)', [firstname,lastname,phoneno,emailid,hashedPassword]);

        return { message: 'User registered successfully' };
    }

    static async login(emailid, password) {
        // Check if the user exists
        const user = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
        if (user.rows.length === 0) {
            throw new Error('Invalid emailid or password');
        }

        // Validate the password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            throw new Error('Invalid emailid or password');
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { message: 'Login successful', token };
    }
    static async profile(emailid) {
        // Check if the user exists
        const user = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
        if (user.rows.length === 0) {
            throw new Error('Invalid emailid');
        }
        return user.rows[0];
    }
}

module.exports = AuthService;
