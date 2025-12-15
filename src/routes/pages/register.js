import express from 'express';
import { renderPage } from '../../utils/render.js';

const router = express.Router();

router.get('/register', renderPage('pages/register', 'Register Page'));

export default router;
