/**
 * Validation utilities for user input
 */

export const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^()_+=\-]{8,}$/;

export const validateEmail = (email) => EMAIL_REGEX.test(email);
export const validatePassword = (password) => PASSWORD_REGEX.test(password);

export const PASSWORD_ERROR_MESSAGE =
    "Password must be at least 8 characters long and contain at least one letter and one number.";
