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
      startDate: '2025-12-15T10:00:00Z',
      endDate: '2025-12-20T10:00:00Z',
    },
  },
};

const outputFile = './swagger-output.json';
const routes = [
  './src/routes/api/auth.js',
  './src/routes/api/lockers.js',
  './src/routes/api/reservations.js'
];

swaggerAutogen()(outputFile, routes, doc);
