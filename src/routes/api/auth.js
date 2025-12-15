import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import { sendPasswordResetEmail } from '../../core/mailer.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Validation helpers
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^()_+=\-]{8,}$/;

const validateEmail = (email) => EMAIL_REGEX.test(email);
const validatePassword = (password) => PASSWORD_REGEX.test(password);

const PASSWORD_ERROR_MESSAGE = 'Password must be at least 8 characters long and contain at least one letter and one number.';

// Registration endpoint
router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.post('/register', async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register a new user'
  // #swagger.description = 'Create a new user account with username, email and password'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User registration data',
        required: true,
        schema: { $ref: '#/definitions/User' }
  } */
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  // Email format validation
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  // Password strength validation
  if (!validatePassword(password)) {
    return res.status(400).json({ error: PASSWORD_ERROR_MESSAGE });
  }
  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const user = await User.createUser({ username, email, password });
    res.status(201).json({ message: 'User registered successfully.', user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.', details: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login user'
  // #swagger.description = 'Authenticate user and return JWT token'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User login credentials',
        required: true,
        schema: { $ref: '#/definitions/Login' }
  } */
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = jwt.sign({ email: user.email, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    
    // Set token as HTTP-only cookie for page routes
    res.cookie('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    // Redirect admin users to their area
    if (user.role === 'admin') {
      return res.redirect('/admin');
    }

    // Redirect to homepage if the request comes from a form submission
    if (req.headers['accept'] && req.headers['accept'].includes('text/html')) {
      return res.redirect('/');
    }

    res.json({ message: 'Login successful.', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.', details: err.message });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Logout user'
  // #swagger.description = 'Clear the authentication cookie'
  res.clearCookie('token');
  res.json({ message: 'Logout successful.' });
});

// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Request password reset'
  // #swagger.description = 'Send a password reset email to the user'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Email address',
        required: true,
        schema: { email: 'user@example.com' }
  } */
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }
    
    const resetToken = user.generateResetToken();
    await user.save();
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    await sendPasswordResetEmail(email, resetToken, baseUrl);
    
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process password reset request.', details: err.message });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Reset password'
  // #swagger.description = 'Reset user password using token from email'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Reset token and new password',
        required: true,
        schema: { token: 'reset-token', password: 'newpassword123' }
  } */
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required.' });
  }
  
  // Password strength validation
  if (!validatePassword(password)) {
    return res.status(400).json({ error: PASSWORD_ERROR_MESSAGE });
  }
  
  try {
    const user = await User.findByResetToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }
    
    await user.resetPassword(password);
    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password.', details: err.message });
  }
});

export default router;
