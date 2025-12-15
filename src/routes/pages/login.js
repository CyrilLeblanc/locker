import express from 'express';
import { renderPage } from '../../utils/render.js';

const router = express.Router();

router.get('/login', renderPage('pages/login', 'Login Page'));

export default router;