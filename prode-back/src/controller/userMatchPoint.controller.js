import UserMatchPointsService from '../services/userMatchPoint.service.js';
import MatchRepository from '../repositories/match.repository.js';

export default class UserMatchPointController {
  constructor() {
    this.service = new UserMatchPointsService();
    this.matchRepository = new MatchRepository();
  }

  assignPoints = async (req, res, next) => {
    try {
      const { matchId } = req.body;
      if (!matchId) {
        return res.status(400).json({ message: 'matchId es requerido' });
      }

      const match = await this.matchRepository.findById(Number(matchId));
      if (!match) {
        return res.status(404).json({ message: 'Partido no encontrado' });
      }

      await this.service.calculateAndStorePoints(match);
      res.json({ message: 'Puntos calculados y asignados correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
