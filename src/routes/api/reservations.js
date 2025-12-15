import express from 'express';
import { authenticate } from '../../middlewares/auth.js';
import * as reservationController from '../../controllers/reservation.controller.js';

const router = express.Router();

router.get('/all', authenticate, reservationController.getAllReservations);
// #swagger.tags = ['Reservations']
// #swagger.summary = 'Get all reservations (Admin)'
// #swagger.description = 'Retrieve all reservations from all users (admin only)'
// #swagger.security = [{ "bearerAuth": [] }]

router.get('/', authenticate, reservationController.getUserReservations);
// #swagger.tags = ['Reservations']
// #swagger.summary = 'Get user reservations'
// #swagger.description = 'Retrieve all reservations for the authenticated user'
// #swagger.security = [{ "bearerAuth": [] }]

router.get('/:id', authenticate, reservationController.getReservationById);
// #swagger.tags = ['Reservations']
// #swagger.summary = 'Get reservation by ID'
// #swagger.description = 'Retrieve a single reservation by its ID'
// #swagger.security = [{ "bearerAuth": [] }]

router.post('/', authenticate, reservationController.createReservation);
// #swagger.tags = ['Reservations']
// #swagger.summary = 'Create a reservation'
// #swagger.description = 'Create a new locker reservation'
// #swagger.security = [{ "bearerAuth": [] }]
/* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/Reservation' }
        }
      }
} */

router.delete('/:id', authenticate, reservationController.cancelReservation);
// #swagger.tags = ['Reservations']
// #swagger.summary = 'Cancel a reservation'
// #swagger.description = 'Cancel an existing reservation'
// #swagger.security = [{ "bearerAuth": [] }]

export default router;
