import bcrypt from "bcryptjs";
import UserRepository from "../repositories/user.repository.js";
import { redis } from "../config/redis.js";
import { UserMatchPoint } from "../models/userMatchPoint.model.js";
import { Sequelize } from "sequelize";
import { Subdivision } from "../models/subdivision.model.js";
import { Tournament } from "../models/tournament.model.js";

const MIN_PASSWORD_LENGTH = 8;

export default class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async updateProfile(userId, { name, email }) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("Usuario no encontrado.");

    const updatedUser = await this.userRepo.update(userId, {
      name: name || user.name,
      email: email || user.email,
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      const error = new Error(
        `La contraseña nueva necesita al menos ${MIN_PASSWORD_LENGTH} caracteres.`
      );
      error.status = 400;
      throw error;
    }

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("Usuario no encontrado.");

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new Error("La contraseña actual es incorrecta.");

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(userId, { passwordHash: newHash });
    return { message: "Contraseña actualizada correctamente." };
  }

  async getProfile(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("Usuario no encontrado.");
    return { id: user.id, name: user.name, email: user.email, username: user.username };
  }

 async getStats(userId) {
    // const cacheKey = `user:stats:${userId}`;
    // const cached = await redis.get(cacheKey);
    // if (cached) return JSON.parse(cached);

    const rows = await UserMatchPoint.findAll({
      where: { user_id: userId },
      attributes: [
        'tournament_id',
        'subdivision_id',
        [Sequelize.fn('COUNT', '*'), 'total'],
        [Sequelize.fn('SUM', Sequelize.col('points')), 'totalPoints']
      ],
      group: ['tournament_id', 'subdivision_id'],
      raw: true
    });

    const tournamentIds = [...new Set(rows.map(r => r.tournament_id))];
    const subdivisionIds = [...new Set(rows.map(r => r.subdivision_id))];

    const tournaments = await Tournament.findAll({
      where: { id: tournamentIds },
      attributes: ['id', 'name', 'season'],
      raw: true
    });

    const subdivisions = await Subdivision.findAll({
      where: { id: subdivisionIds },
      attributes: ['id', 'name'],
      raw: true
    });

    const response = tournaments.map(tournament => {
      const subStats = subdivisions
        .filter(sub => rows.find(r => r.subdivision_id === sub.id && r.tournament_id === tournament.id))
        .map(sub => {
          const data = rows.find(r => r.subdivision_id === sub.id && r.tournament_id === tournament.id);
          return {
            id: sub.id,
            name: sub.name,
            stats: {
              totalPredictions: parseInt(data.total),
              totalPoints: parseInt(data.totalPoints),
              correctPredictions: parseInt(data.totalPoints / 3),
              accuracy: data.total > 0 ? Math.round(((data.totalPoints/3) / data.total) * 100) : 0
            }
          };
        });

      return {
        id: tournament.id,
        name: tournament.name,
        season: tournament.season,
        subdivisions: subStats
      };
    });

    // await redis.set(cacheKey, JSON.stringify(response), 'EX', 300);
    return response;
  }
}
