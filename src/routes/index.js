import express from 'express';
import apiRouter from './api/index.js';
import pageRouter from './pages/index.js';

const router = express.Router();

router.use('/api', apiRouter);
router.use('/', pageRouter);

export default router;