import express from 'express';
import { login, register, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getProfile);

export default router;