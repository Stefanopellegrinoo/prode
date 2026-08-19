// src/repositories/user.repository.js
import { User } from '../models/models.js';

export default class UserRepository {
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }
  async findByUserName(username) {
    return User.findOne({ where: { username } });
  }
  async findById(id) {
    return User.findByPk(id);
  }
  async create({ name, email, username, passwordHash, role = 'user' }) {
    return User.create({ name, email, username, passwordHash, role });
  }
  async update(id, attrs) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Usuario no encontrado');
    return user.update(attrs);
  }
  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Usuario no encontrado');
    await user.destroy();
  }
}
