/**
 * Application configuration
 */

export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
export const JWT_EXPIRES_IN = '1h';
export const COOKIE_MAX_AGE = 3600000; // 1 hour in milliseconds
