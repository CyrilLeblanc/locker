import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Locker API',
    description: 'API for the Locker Reservation System - Reserve lockers online with automatic expiration and email notifications.',
  },
  host: 'localhost:3000',
  basePath: '/api',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints (register, login, password reset)',
    },
    {
      name: 'Lockers',
      description: 'Locker management endpoints',
    },
    {
      name: 'Reservations',
      description: 'Reservation management endpoints',
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT token (format: Bearer <token>)',
    },
  },
  definitions: {
    User: {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123',
    },
    Login: {
      email: 'john@example.com',
      password: 'Password123',
    },
    Locker: {
      number: 'A001',
      size: 'medium',
      status: 'available',
      price: 10.0,
    },
    Reservation: {
      lockerId: '60d5ec49f1b2c72b8c8e1234',
      hours: 24,
    },
  },
  '@definitions': {
    User: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'johndoe' },
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'Password123' }
      }
    },
    Login: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'Password123' }
      }
    },
    Locker: {
      type: 'object',
      properties: {
        number: { type: 'string', example: 'A001' },
        size: { type: 'string', enum: ['small', 'medium', 'large'], example: 'medium' },
        status: { type: 'string', enum: ['available', 'reserved', 'maintenance'], example: 'available' },
        price: { type: 'number', example: 10.0 }
      }
    },
    Reservation: {
      type: 'object',
      properties: {
        lockerId: { type: 'string', example: '60d5ec49f1b2c72b8c8e1234' },
        hours: { type: 'number', example: 24 }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/api/index.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
