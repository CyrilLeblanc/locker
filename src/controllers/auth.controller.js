import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendPasswordResetEmail } from '../core/mailer.js';
import { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_MAX_AGE } from '../core/config.js';
import { validateEmail, validatePassword, PASSWORD_ERROR_MESSAGE } from '../utils/validation.js';

/**
 * Register a new user
 */
export const register = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register a new user'
  // #swagger.description = 'Create a new user account with username, email and password'
  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: '#/components/schemas/User' }
          }
        }
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
    res.status(201).json({ 
      message: 'User registered successfully.', 
      user: { username: user.username, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.', details: err.message });
  }
};

/**
 * Login user and return JWT token
 */
export const login = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Login user'
  // #swagger.description = 'Authenticate user and return user data'
  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: '#/components/schemas/Login' }
          }
        }
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
    
    const token = jwt.sign(
      { email: user.email, username: user.username, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Set token as HTTP-only cookie for page routes
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE
    });

    // Return JSON with redirect URL based on user role
    const redirectUrl = user.role === 'admin' ? '/admin' : '/';
    res.json({ message: 'Login successful.', user, redirectUrl });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.', details: err.message });
  }
};

/**
 * Logout user (clear cookie)
 */
export const logout = (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Logout user'
  // #swagger.description = 'Clear the authentication cookie'
  
  res.clearCookie('token');
  res.json({ message: 'Logout successful.' });
};

/**
 * Request password reset
 */
export const forgotPassword = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Request password reset'
  // #swagger.description = 'Send a password reset email to the user'
  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'user@example.com' }
              }
            }
          }
        }
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
};

/**
 * Reset password using token
 */
export const resetPassword = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Reset password'
  // #swagger.description = 'Reset user password using token from email'
  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string', example: 'reset-token-here' },
                password: { type: 'string', example: 'NewPassword123' }
              }
            }
          }
        }
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
};
