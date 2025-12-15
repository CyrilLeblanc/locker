import express from 'express';

const router = express.Router();

router.get('/forgot-password', (req, res) => {
  res.render('pages/forgot-password', {
    title: 'Mot de passe oublié',
    user: null
  });
});

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
