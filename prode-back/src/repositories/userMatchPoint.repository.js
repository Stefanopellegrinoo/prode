import { UserMatchPoint } from '../models/userMatchPoint.model.js';

export default class UserMatchPointRepository {
  async create(data) {
    return UserMatchPoint.create(data);
  }

  async update(userId, matchId, points) {
    return UserMatchPoint.update(
      { points },
      { where: { user_id: userId, match_id: matchId } }
    );
  }

  async findByUserAndMatch(userId, matchId) {
    return UserMatchPoint.findOne({ where: { user_id: userId, match_id: matchId } });
  }

  async deleteByMatch(matchId) {
    return UserMatchPoint.destroy({ where: { match_id: matchId } });
  }

  async getUserPointsForTournament(userId, matchIds) {
    return UserMatchPoint.findAll({
      where: {
        user_id: userId,
        match_id: matchIds
      }
    });
  }
} 
