// src/controllers/groupRanking.controller.js
import GroupRankingService from '../services/groupRanking.service.js';

export default class GroupRankingController {
  constructor() {
    this.groupRankingService = new GroupRankingService();
  }

  async getGroupRanking(req, res, next) {
    try {
      const groupId = Number(req.params.groupId);
      const tournamentId = Number(req.query.tournamentId);
      const subdivisionId = Number(req.query.subdivisionId);

      if (!groupId || !tournamentId || !subdivisionId) {
        return res.status(400).json({ message: "Faltan parámetros requeridos" });
      }

      const ranking = await this.groupRankingService.getGroupRankingByTournamentSubdivision(
        groupId,
        tournamentId,
        subdivisionId
      );

      res.json(ranking);
    } catch (error) {
      next(error);
    }
  }
}
