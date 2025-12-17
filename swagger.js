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
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT token (format: Bearer <token>)',
    },
  },
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/api/index.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
