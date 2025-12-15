import express from 'express';
import { authenticate, isAdmin } from '../../middlewares/auth.js';
import * as lockerController from '../../controllers/locker.controller.js';

const router = express.Router();

router.get('/', lockerController.getAllLockers);
// #swagger.tags = ['Lockers']
// #swagger.summary = 'Get all lockers'
// #swagger.description = 'Retrieve a list of all lockers. Optionally filter by status.'
/* #swagger.parameters['status'] = {
      in: 'query',
      description: 'Filter by status (available, reserved, maintenance)',
      required: false,
      schema: { type: 'string' }
} */

router.get('/:id', lockerController.getLockerById);
// #swagger.tags = ['Lockers']
// #swagger.summary = 'Get locker by ID'
// #swagger.description = 'Retrieve a single locker by its ID'

router.post('/', authenticate, isAdmin, lockerController.createLocker);
// #swagger.tags = ['Lockers']
// #swagger.summary = 'Create a new locker'
// #swagger.description = 'Create a new locker (Admin only)'
// #swagger.security = [{ "bearerAuth": [] }]
/* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/Locker' }
        }
      }
} */

router.put('/:id', authenticate, isAdmin, lockerController.updateLocker);
// #swagger.tags = ['Lockers']
// #swagger.summary = 'Update a locker'
// #swagger.description = 'Update an existing locker (Admin only)'
// #swagger.security = [{ "bearerAuth": [] }]
/* #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/Locker' }
        }
      }
} */

router.delete('/:id', authenticate, isAdmin, lockerController.deleteLocker);
// #swagger.tags = ['Lockers']
// #swagger.summary = 'Delete a locker'
// #swagger.description = 'Delete a locker by ID (Admin only)'
// #swagger.security = [{ "bearerAuth": [] }]

export default router;
