import { Prediction } from '../models/prediction.model.js';
import { Match } from '../models/match.model.js';
import { User } from '../models/user.model.js';
import { sequelize } from '../config/database.js';
import { Sequelize } from 'sequelize';
import { UserMatchPoint } from '../models/userMatchPoint.model.js';
import { GroupMember } from '../models/groupMember.model.js';
import { redis } from '../config/redis.js';

export default class RankingRepository {

  async getRankingByTournamentAndSubdivision(tournament_id, subdivision_id) {
    return UserMatchPoint.findAll({
        where: {
          tournament_id,
          subdivision_id
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email',"username"],
          }
        ],
        attributes: [
          'user_id',
          [Sequelize.col('User.name'), 'userName'],
          [Sequelize.fn('SUM', Sequelize.col('points')), 'points']
        ],
        group: ['user_id', 'User.id', 'User.name'],
        order: [[Sequelize.literal('points'), 'DESC']]
      });
    
  }

  async getTotalPointsGroupedByUser(tournamentId, subdivisionId) {
    const results = await Prediction.findAll({
      include: [
        {
          model: Match,
          where: {
            tournament_id: tournamentId,
            subdivision_id: subdivisionId,
            status: 'finished',
          },
          attributes: [],
        },
        {
          model: User,
          attributes: [],
        },
      ],
      attributes: [
        'user_id',
        [sequelize.fn('SUM', sequelize.col('points')), 'totalPoints'],
      ],
      group: ['user_id'],
      order: [[sequelize.literal('totalPoints'), 'DESC']],
      raw: true,
    });

    return results;
  }

  async getGroupRanking(groupId, tournamentId, subdivisionId, members) {
    const cacheKey = `ranking:group:${groupId}:tournament:${tournamentId}:subdivision:${subdivisionId}`;
  

  
    // 2. Si no está en cache, calculamos

    const userIds = members.map(m => m.userId);
  
    const points = await UserMatchPoint.findAll({
      where: {
        user_id: userIds,
        tournament_id: tournamentId,
        subdivision_id: subdivisionId
      },
      attributes: [
        'user_id',
        [Sequelize.fn('SUM', Sequelize.col('points')), 'totalPoints']
      ],
      group: ['user_id'],
      raw: true
    });
  
    const merged = members.map(member => {
      const userPoints = points.find(p => p.user_id === member.userId);
      return {
        userId: member.userId,
        name: member.User.name,
        userName: member.User.username,
        points: userPoints ? parseInt(userPoints.totalPoints) : 0
      };
    });
  
    const sorted = merged.sort((a, b) => b.points - a.points);
  

  
    return sorted;
  }
  
  
}
