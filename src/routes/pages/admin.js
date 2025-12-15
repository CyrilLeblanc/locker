import express from 'express';
import { authenticatePage, isAdminPage } from '../../middlewares/auth.js';
import { renderPage, renderPageWithParams } from '../../utils/render.js';

const router = express.Router();

// Apply authentication and admin check to all admin routes
router.use('/admin', authenticatePage, isAdminPage);

// Admin Dashboard
router.get('/admin', renderPage('pages/admin/dashboard', 'Admin Dashboard'));

// Locker Management - List
router.get('/admin/lockers', renderPage('pages/admin/lockers', 'Manage Lockers'));

// Locker Management - Create Form
router.get('/admin/lockers/new', renderPage('pages/admin/locker-form', 'Create Locker', {
  locker: null,
  isEdit: false
}));

// Locker Management - Edit Form
router.get('/admin/lockers/:id/edit', renderPageWithParams('pages/admin/locker-form', 'Edit Locker', (req) => ({
  lockerId: req.params.id,
  isEdit: true
})));

// Reservations Management - List
router.get('/admin/reservations', renderPage('pages/admin/reservations', 'Manage Reservations'));

export default router;
