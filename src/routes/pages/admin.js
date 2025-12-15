import express from 'express';
import { authenticatePage, isAdminPage } from '../../middlewares/auth.js';

const router = express.Router();

// Apply authentication and admin check to all admin routes
router.use('/admin', authenticatePage, isAdminPage);

// Admin Dashboard
router.get('/admin', (req, res) => {
  res.render('pages/admin/dashboard', {
    title: 'Admin Dashboard',
    user: req.user
  });
});

// Locker Management - List
router.get('/admin/lockers', (req, res) => {
  res.render('pages/admin/lockers', {
    title: 'Manage Lockers',
    user: req.user
  });
});

// Locker Management - Create Form
router.get('/admin/lockers/new', (req, res) => {
  res.render('pages/admin/locker-form', {
    title: 'Create Locker',
    user: req.user,
    locker: null,
    isEdit: false
  });
});

// Locker Management - Edit Form
router.get('/admin/lockers/:id/edit', (req, res) => {
  res.render('pages/admin/locker-form', {
    title: 'Edit Locker',
    user: req.user,
    lockerId: req.params.id,
    isEdit: true
  });
});

// Reservations Management - List
router.get('/admin/reservations', (req, res) => {
  res.render('pages/admin/reservations', {
    title: 'Manage Reservations',
    user: req.user
  });
});

export default router;
