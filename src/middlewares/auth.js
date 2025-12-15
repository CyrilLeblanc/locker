import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Middleware to verify JWT token from Authorization header (for API routes)
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findUserByEmail(decoded.email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

/**
 * Middleware to verify JWT token from cookie (for page routes)
 */
export const authenticatePage = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findUserByEmail(decoded.email);

    if (!user) {
      return res.redirect('/login');
    }

    req.user = user;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
};

/**
 * Middleware to check if user is admin (for page routes)
 */
export const isAdminPage = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).render('pages/login', { 
      title: 'Access Denied',
      error: 'Admin privileges required.' 
    });
  }
  next();
};

/**
 * Middleware to check if user is admin (for API routes)
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};
