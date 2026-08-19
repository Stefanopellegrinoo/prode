import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import NotificationController from '../controller/notification.controller.js';

const router = express.Router();
const notificationController = new NotificationController();

router.get('/', authenticate, (req, res, next) => notificationController.getNotifications(req, res, next));
router.put('/:id/read', authenticate, (req, res, next) => notificationController.markAsRead(req, res, next));

export default router;
