// src/controllers/match.controller.js
import { calculatePointsQueue } from '../queues/calculatePoints.queue.js';
import MatchService from '../services/match.service.js';
import UserMatchPointsService from '../services/userMatchPoint.service.js';
import { invalidateCachedRanking } from '../utils/redisCache.js';
const userPointsService = new UserMatchPointsService();
export default class MatchController {
  constructor() {
    this.service = new MatchService();
  }

  getAll = async (req, res, next) => {
    try {
      const matches = await this.service.getAll();
      res.json(matches);
    } catch (err) {
      next(err);
    }
  }

  getById = async (req, res, next) => {
    try {
      const match = await this.service.getById(req.params.id);
      res.json(match);
    } catch (err) {
      next(err);
    }
  }

  getByTournamentAndSubdivision = async (req, res, next) => {
    try {
      const { tournamentId } = req.params;
      const fixtures = await this.service.getByTournamentAndSubdivision(tournamentId);
      res.json(fixtures);
    } catch (err) {
      next(err);
    }
  }

  async getEnrichedFixture(req, res, next) {
    try {
      const { tournamentId } = req.params;
      const userId = req.user.id; 
      // Suponemos que el middleware de autenticación deja el usuario en req.user
      const enrichedFixture = await this.service.getGroupedEnrichedFixtureByTournamentAndUser(tournamentId, userId);
      res.json(enrichedFixture);
    } catch (error) {
      next(error);
    }
  }

  create = async (req, res, next) => {
    try {
  
      if(!req.body.tournament_id ) {
        return res.status(400).json({ error: 'El ID del torneo es obligatorios' });
      }
      if(!req.body.date) {
        return res.status(400).json({ error: 'La fecha es obligatoria' });
      }
      if(!req.body.home_team_id || !req.body.away_team_id) {
        return res.status(400).json({ error: 'Los equipos son obligatorios' });
      }
      if(req.body.home_team_id === req.body.away_team_id) {
        return res.status(400).json({ error: 'Los equipos no pueden ser los mismos' });
      }

      const match = await this.service.create(req.body);
      res.status(201).json(match);
    } catch (err) {
      next(err);
    }
  }

  update = async (req, res, next) => {
    try {
      console.log(req.body);
      const updatedMatch = await this.service.update(req.params.id, req.body);
      if (
        updatedMatch.updatedMatch!== null
      ) {
        console.log("Calculando puntos para el partido:", updatedMatch);
        // await userPointsService.calculateAndStorePoints(updatedMatch); 
      await calculatePointsQueue.add('calculatePoints', {
        updatedMatch: updatedMatch 
      });
      await invalidateCachedRanking(updatedMatch.tournament_id, updatedMatch.subdivision_id);
 }

      res.json(updatedMatch);
    } catch (err) {
      next(err);
    }
  }

  delete = async (req, res, next) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  // match.controller.js
  getUpcomingMatches = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const data = await this.service.getUpcomingMatches(limit);
    res.json(data);
  } catch (error) {
    next(error);
  }
};


}