// src/routes/user.routes.js
import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import UserController from '../controller/user.controller.js';

const router = express.Router();
const userController = new UserController();

// PUT /api/users/profile (actualizar perfil)
router.put('/profile', authenticate, (req, res, next) => userController.updateProfile(req, res, next));

// GET /api/users/profile (obtener perfil completo)
router.get('/profile', authenticate, (req, res, next) => userController.getProfile(req, res, next));

// PUT /api/users/password (cambiar contraseña)
router.put('/password', authenticate, (req, res, next) => userController.changePassword(req, res, next));

// GET /api/users/stats (obtener estadísticas del usuario)
router.get('/stats', authenticate, (req, res, next) => userController.getStats(req, res, next));

export default router;
