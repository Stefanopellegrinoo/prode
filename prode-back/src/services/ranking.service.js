import { GroupMember } from '../models/groupMember.model.js';
import { User } from '../models/user.model.js';
import RankingRepository from '../repositories/ranking.repository.js';
import { getCachedRanking, setCachedRanking } from '../utils/redisCache.js';

class RankingService {
  constructor() {
    this.rankingRepository = new RankingRepository();
  }

  async getSubdivisionRanking(tournamentId, subdivisionId) {
    if (!tournamentId || !subdivisionId) {
      throw new Error("El ID del torneo y de la subdivisión son obligatorios");
    }

    const data = await this.rankingRepository.getRankingByTournamentAndSubdivision(Number(tournamentId), Number(subdivisionId));
    return data;
  }

  async getGroupRanking(groupId, tournamentId, subdivisionId) {
    try {
      const members = await GroupMember.findAll({
        where: { group_id: groupId },
        include: [{
          model: User,
          attributes: ['id', 'name', 'username', 'email']
        }]
      });

      if (!members || members.length === 0) {
        return [];
      }

      return await this.rankingRepository.getGroupRanking(groupId, Number(tournamentId), Number(subdivisionId), members);
    } catch (error) {
      console.error('Error fetching group ranking:', error);
      throw new Error('No se pudo obtener el ranking del grupo.');
    }
  }
}

export default RankingService;