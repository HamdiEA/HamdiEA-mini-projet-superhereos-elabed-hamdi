import { Router } from 'express';
import * as authController from '../controllers/authController';
import { auth } from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', authController.registerValidation, authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.loginValidation, authController.login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', auth, authController.getCurrentUser);

// GET /api/auth/users-count - Get total users (public)
router.get('/users-count', authController.getUsersCount);

export default router;