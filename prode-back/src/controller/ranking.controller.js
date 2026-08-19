import RankingService from '../services/ranking.service.js';

export default class RankingController {
  constructor() {
    this.rankingService = new RankingService();
  }

  async getSubdivisionRanking(req, res, next) {
    try {
      const { subdivisionId, tournamentId } = req.params;
      const ranking = await this.rankingService.getSubdivisionRanking(Number(tournamentId), Number(subdivisionId));
      res.json(ranking);
    } catch (error) {
      next(error);
    }
  }
  async getGroupRanking(req, res, next) {
    try {
      const groupId = Number(req.params.groupId);
      const tournamentId = Number(req.params.tournamentId);
      const subdivisionId = Number(req.params.subdivisionId);
 
      console.log(tournamentId,
  subdivisionId)
      if (!groupId || !tournamentId || !subdivisionId) {
        return res.status(400).json({ message: "Faltan parámetros requeridos" });
      }

      const ranking = await this.rankingService.getGroupRanking(
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