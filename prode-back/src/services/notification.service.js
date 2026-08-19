import NotificationRepository from '../repositories/notification.repository.js';

export default class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
  }

  async getUserNotifications(userId) {
    return this.repo.findByUserId(userId);
  }

  async markAsRead(id, userId) {
    const updated = await this.repo.markAsRead(id, userId);
    if (!updated) throw new Error('Notificación no encontrada o no pertenece al usuario');
    return updated;
  }

  async sendNotification({ userId, title, message }) {
    return this.repo.create({ userId, title, message });
  }
}
