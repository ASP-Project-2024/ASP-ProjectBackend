// authenticateToken.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const token = req.cookies['accessToken']; // access the token from cookies

    if (!token) return res.status(401).send('Unauthorized'); // No token, return Unauthorized

    // Verify the token using the JWT_SECRET
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token'); // If token is invalid
        req.user = user; // Attach the user object to the request for later use
        next(); // Proceed to the next middleware/route handler
    });
}

module.exports = authenticateToken;
