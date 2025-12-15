import express from 'express';
import { renderPage, renderPageWithParams } from '../../utils/render.js';

const router = express.Router();

router.get('/forgot-password', renderPage('pages/forgot-password', 'Mot de passe oublié'));

router.get('/reset-password', (req, res, next) => {
  if (!req.query.token) {
    return res.redirect('/forgot-password');
  }
  next();
}, renderPageWithParams('pages/reset-password', 'Réinitialiser le mot de passe', (req) => ({
  token: req.query.token
})));

export default router;
