import express from 'express';
import { renderPage, renderPageWithParams } from '../../utils/render.js';

const router = express.Router();

router.get('/forgot-password', renderPage('pages/forgot-password', 'Mot de passe oublié'));

router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.redirect('/forgot-password');
  }
  res.render('pages/reset-password', {
    title: 'Réinitialiser le mot de passe',
    user: null,
    token
  });
});

export default router;
