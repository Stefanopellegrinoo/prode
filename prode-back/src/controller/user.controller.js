// user.controller.js
import UserService from '../services/user.service.js';

export default class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async updateProfile(req, res, next) {
    try {
      const updated = await this.userService.updateProfile(req.user.id, req.body);
      res.json({ message: 'Perfil actualizado', user: updated });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await this.userService.changePassword(req.user.id, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.userService.getProfile(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await this.userService.getStats(req.user.id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
