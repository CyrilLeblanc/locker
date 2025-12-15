import express from 'express';
import { authenticatePage } from '../../middlewares/auth.js';

const router = express.Router();

// User dashboard
router.get('/dashboard', authenticatePage, (req, res) => {
  res.render('pages/user/dashboard', {
    title: 'Mon Espace',
    user: req.user
  });
});

// Browse available lockers
router.get('/lockers', authenticatePage, (req, res) => {
  res.render('pages/user/lockers', {
    title: 'Casiers Disponibles',
    user: req.user
  });
});

// User reservations
router.get('/reservations', authenticatePage, (req, res) => {
  res.render('pages/user/reservations', {
    title: 'Mes Réservations',
    user: req.user
  });
});

export default router;
