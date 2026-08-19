import { Notification } from '../models/notification.model.js';

export default class NotificationRepository {
  async findByUserId(userId) {
    return Notification.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      limit: 50,
    });
  }

  async markAsRead(id, userId) {
    const notification = await Notification.findOne({ where: { id, userId } });
    if (!notification) return null;
    return notification.update({ read: true });
  }

  async create(data) {
    return Notification.create(data);
  }
}
