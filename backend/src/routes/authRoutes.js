import express from 'express';
import { getProfile, login } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateToken, getProfile);

export default router;
