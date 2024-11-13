class AuthService {
  // Google Signup
  static async googleSignup({ emailid, firstname, lastname }) {
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

      return { message: 'Google sign-up successful', accessToken };
  }

  // Google Login
  static async googleLogin({ emailid }) {
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

      return { message: 'Google login successful', accessToken };
  }

  // Manual Signup
  static async signup(emailid, firstname, lastname, phoneno, password) {
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
  static async login(emailid, password) {
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
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { message: 'Login successful', token };
  }

  // Profile
  static async profile(emailid) {
      const user = await pool.query('SELECT * FROM users WHERE emailid = $1', [emailid]);
      if (user.rows.length === 0) {
          throw new Error('User not found');
      }
      return user.rows[0];
  }
}

module.exports = AuthService;
