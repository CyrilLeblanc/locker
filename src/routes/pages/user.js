import express from 'express';
import { authenticatePage } from '../../middlewares/auth.js';
import { renderPage } from '../../utils/render.js';

const router = express.Router();

// User dashboard
router.get('/dashboard', authenticatePage, renderPage('pages/user/dashboard', 'Mon Espace'));

// Browse available lockers
router.get('/lockers', authenticatePage, renderPage('pages/user/lockers', 'Casiers Disponibles'));

// User reservations
router.get('/reservations', authenticatePage, renderPage('pages/user/reservations', 'Mes Réservations'));

export default router;
