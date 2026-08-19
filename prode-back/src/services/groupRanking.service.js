// src/services/groupRanking.service.js
import GroupRankingRepository from '../repositories/groupRanking.repository.js';

class GroupRankingService {
  constructor() {
    this.groupRankingRepository = new GroupRankingRepository();
  }

  async getGroupRanking(groupId) {
    try {
      return await this.groupRankingRepository.getGroupRanking(groupId);
    } catch (error) {
      console.error('Error fetching group ranking:', error);
      throw new Error('No se pudo obtener el ranking del grupo.');
    }
  }
}

export default GroupRankingService;
