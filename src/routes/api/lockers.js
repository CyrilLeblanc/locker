import express from 'express';
import Locker from '../../models/locker.js';
import { authenticate, isAdmin } from '../../middlewares/auth.js';

const router = express.Router();

// Get all lockers
router.get('/', async (req, res) => {
  // #swagger.tags = ['Lockers']
  // #swagger.summary = 'Get all lockers'
  // #swagger.description = 'Retrieve a list of all lockers. Optionally filter by status.'
  /* #swagger.parameters['status'] = {
        in: 'query',
        description: 'Filter by status (available, reserved, maintenance)',
        required: false,
        type: 'string'
  } */
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const lockers = await Locker.find(filter);
    res.json(lockers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lockers.', details: err.message });
  }
});

// Get a single locker by ID
router.get('/:id', async (req, res) => {
  // #swagger.tags = ['Lockers']
  // #swagger.summary = 'Get locker by ID'
  // #swagger.description = 'Retrieve a single locker by its ID'
  try {
    const locker = await Locker.findById(req.params.id);
    if (!locker) {
      return res.status(404).json({ error: 'Locker not found.' });
    }
    res.json(locker);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch locker.', details: err.message });
  }
});

// Create a new locker (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  // #swagger.tags = ['Lockers']
  // #swagger.summary = 'Create a new locker'
  // #swagger.description = 'Create a new locker (Admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Locker data',
        required: true,
        schema: { $ref: '#/definitions/Locker' }
  } */
  const { number, size, status, price } = req.body;

  if (!number || !size || price === undefined) {
    return res.status(400).json({ error: 'Number, size and price are required.' });
  }

  if (!['small', 'medium', 'large'].includes(size)) {
    return res.status(400).json({ error: 'Size must be small, medium or large.' });
  }

  if (price < 0) {
    return res.status(400).json({ error: 'Price must be a positive number.' });
  }

  try {
    const existingLocker = await Locker.findByNumber(number);
    if (existingLocker) {
      return res.status(409).json({ error: 'Locker number already exists.' });
    }

    const locker = new Locker({ number, size, status: status || 'available', price });
    await locker.save();
    res.status(201).json({ message: 'Locker created successfully.', locker });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create locker.', details: err.message });
  }
});

// Update a locker (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  // #swagger.tags = ['Lockers']
  // #swagger.summary = 'Update a locker'
  // #swagger.description = 'Update an existing locker (Admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Locker data to update',
        required: true,
        schema: { $ref: '#/definitions/Locker' }
  } */
  const { number, size, status, price } = req.body;

  if (size && !['small', 'medium', 'large'].includes(size)) {
    return res.status(400).json({ error: 'Size must be small, medium or large.' });
  }

  if (status && !['available', 'reserved', 'maintenance'].includes(status)) {
    return res.status(400).json({ error: 'Status must be available, reserved or maintenance.' });
  }

  if (price !== undefined && price < 0) {
    return res.status(400).json({ error: 'Price must be a positive number.' });
  }

  try {
    const locker = await Locker.findById(req.params.id);
    if (!locker) {
      return res.status(404).json({ error: 'Locker not found.' });
    }

    // Check if new number already exists (if changing number)
    if (number && number !== locker.number) {
      const existingLocker = await Locker.findByNumber(number);
      if (existingLocker) {
        return res.status(409).json({ error: 'Locker number already exists.' });
      }
    }

    if (number) locker.number = number;
    if (size) locker.size = size;
    if (status) locker.status = status;
    if (price !== undefined) locker.price = price;

    await locker.save();
    res.json({ message: 'Locker updated successfully.', locker });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update locker.', details: err.message });
  }
});

// Delete a locker (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  // #swagger.tags = ['Lockers']
  // #swagger.summary = 'Delete a locker'
  // #swagger.description = 'Delete a locker by ID (Admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const locker = await Locker.findByIdAndDelete(req.params.id);
    if (!locker) {
      return res.status(404).json({ error: 'Locker not found.' });
    }
    res.json({ message: 'Locker deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete locker.', details: err.message });
  }
});

export default router;
