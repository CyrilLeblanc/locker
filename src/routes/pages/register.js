import express from 'express';

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('pages/register', {
    title: 'Register Page',
    user: null
  });
});

export default router;
