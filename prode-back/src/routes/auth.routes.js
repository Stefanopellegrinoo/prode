// src/routes/auth.routes.js
import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import AuthController from '../controller/auth.controller.js';
import { publicLimiter } from '../middlewares/rateLimiter.js';


const router = express.Router();
const authController = new AuthController();

// POST /api/auth/register
router.post('/register', publicLimiter, (req, res, next) => authController.register(req, res, next));

// POST /api/auth/login
router.post('/login', publicLimiter, (req, res, next) => authController.login(req, res, next));

// GET /api/auth/me (requiere autenticación)
router.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));

router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));


router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));


// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));

export default router;
