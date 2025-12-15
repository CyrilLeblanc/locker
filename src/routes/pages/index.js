import express from 'express';
import loginRouter from './login.js';
import registerRouter from './register.js';
import adminRouter from './admin.js';
import userRouter from './user.js';
import { authenticatePage } from '../../middlewares/auth.js';

const router = express.Router();

router.use('/', loginRouter);
router.use('/', registerRouter);
router.use('/', adminRouter);
router.use('/', userRouter);

// Define the logout route
router.get('/logout', authenticatePage, (req, res) => {
  // Clear the session or cookie
  res.clearCookie('token');
  // Redirect to the login page
  res.redirect('/login');
});

export default router;