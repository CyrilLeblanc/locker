import authRouter from './auth.js';
import lockersRouter from './lockers.js';
import reservationsRouter from './reservations.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/lockers', lockersRouter);
router.use('/reservations', reservationsRouter);

export default router;