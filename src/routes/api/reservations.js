import express from 'express';
import Reservation from '../../models/reservation.js';
import Locker from '../../models/locker.js';
import { authenticate, canAccessResource } from '../../middlewares/auth.js';
import { sendReservationConfirmedEmail, sendReservationReturnedEmail } from '../../core/mailer.js';

const router = express.Router();

// Get all reservations (admin only)
router.get('/all', authenticate, async (req, res) => {
  // #swagger.tags = ['Reservations']
  // #swagger.summary = 'Get all reservations (Admin)'
  // #swagger.description = 'Retrieve all reservations from all users (admin only)'
  // #swagger.security = [{ "bearerAuth": [] }]
  
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }

  try {
    const reservations = await Reservation.find()
      .populate('locker', 'number location')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations.', details: err.message });
  }
});

// Get current user's reservations
router.get('/', authenticate, async (req, res) => {
  // #swagger.tags = ['Reservations']
  // #swagger.summary = 'Get user reservations'
  // #swagger.description = 'Retrieve all reservations for the authenticated user'
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const reservations = await Reservation.findByUser(req.user._id);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations.', details: err.message });
  }
});

// Get a single reservation by ID
router.get('/:id', authenticate, async (req, res) => {
  // #swagger.tags = ['Reservations']
  // #swagger.summary = 'Get reservation by ID'
  // #swagger.description = 'Retrieve a single reservation by its ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const reservation = await Reservation.findById(req.params.id).populate('locker');
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // Only allow user to view their own reservations (or admin)
    if (!canAccessResource(req.user, reservation.user)) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservation.', details: err.message });
  }
});

// Create a new reservation
router.post('/', authenticate, async (req, res) => {
  // #swagger.tags = ['Reservations']
  // #swagger.summary = 'Create a reservation'
  // #swagger.description = 'Create a new locker reservation'
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Reservation data',
        required: true,
        schema: { $ref: '#/definitions/Reservation' }
  } */
  const { lockerId, hours } = req.body;

  if (!lockerId || !hours) {
    return res.status(400).json({ error: 'Locker ID and hours are required.' });
  }

  const hoursNum = parseInt(hours, 10);
  if (isNaN(hoursNum) || hoursNum < 1 || hoursNum > 72) {
    return res.status(400).json({ error: 'Hours must be between 1 and 72.' });
  }

  // Reservation always starts now
  const start = new Date();
  const end = new Date(start.getTime() + hoursNum * 60 * 60 * 1000);

  try {
    // Check if locker exists
    const locker = await Locker.findById(lockerId);
    if (!locker) {
      return res.status(404).json({ error: 'Locker not found.' });
    }

    // Check if locker is available
    if (locker.status !== 'available') {
      return res.status(409).json({ error: 'Locker is not available.' });
    }

    // Check for overlapping reservations
    const overlapping = await Reservation.findOne({
      locker: lockerId,
      status: 'active',
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } }
      ]
    });

    if (overlapping) {
      return res.status(409).json({ error: 'Locker is already reserved for this period.' });
    }

    // Create reservation
    const reservation = new Reservation({
      user: req.user._id,
      locker: lockerId,
      startDate: start,
      endDate: end,
      status: 'active'
    });

    await reservation.save();

    // Update locker status
    locker.status = 'reserved';
    await locker.save();

    // Populate locker info for response
    await reservation.populate('locker');

    // Send confirmation email
    try {
      await sendReservationConfirmedEmail(req.user.email, reservation, locker);
    } catch (emailErr) {
      console.error('Failed to send reservation confirmation email:', emailErr.message);
    }

    res.status(201).json({ 
      message: 'Reservation created successfully.', 
      reservation 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reservation.', details: err.message });
  }
});

// Cancel a reservation
router.delete('/:id', authenticate, async (req, res) => {
  // #swagger.tags = ['Reservations']
  // #swagger.summary = 'Cancel a reservation'
  // #swagger.description = 'Cancel an existing reservation'
  // #swagger.security = [{ "bearerAuth": [] }]
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // Only allow user to cancel their own reservations (or admin)
    if (!canAccessResource(req.user, reservation.user)) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (reservation.status !== 'active') {
      return res.status(400).json({ error: 'Only active reservations can be cancelled.' });
    }

    // Update reservation status
    reservation.status = 'cancelled';
    await reservation.save();

    // Update locker status back to available
    const locker = await Locker.findById(reservation.locker);
    if (locker) {
      locker.status = 'available';
      await locker.save();
    }

    // Send return confirmation email
    try {
      await sendReservationReturnedEmail(req.user.email, reservation, locker);
    } catch (emailErr) {
      console.error('Failed to send reservation return email:', emailErr.message);
    }

    res.json({ message: 'Reservation cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel reservation.', details: err.message });
  }
});

export default router;
