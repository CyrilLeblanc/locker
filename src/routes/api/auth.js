import express from 'express';
import * as authController from '../../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', authController.register);
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

router.post('/login', authController.login);
// #swagger.tags = ['Auth']
// #swagger.summary = 'Login user'
// #swagger.description = 'Authenticate user and return JWT token'
/* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/Login' }
        }
      }
} */

router.post('/logout', authController.logout);
// #swagger.tags = ['Auth']
// #swagger.summary = 'Logout user'
// #swagger.description = 'Clear the authentication cookie'

router.post('/forgot-password', authController.forgotPassword);
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

router.post('/reset-password', authController.resetPassword);
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

export default router;
