import NotificationService from '../services/notification.service.js';

export default class NotificationController {
  constructor() {
    this.service = new NotificationService();
  }

  getNotifications = async (req, res, next) => {
    try {
      const notifications = await this.service.getUserNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await this.service.markAsRead(Number(id), req.user.id);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };
}
