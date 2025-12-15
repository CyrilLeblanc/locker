import express from 'express';

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Login Page',
    user: null
  });
});

export default router;