import { FixtureService } from "../services/fixture.service.js";

export default class FixtureController {
  constructor() {
    this.fixtureService = new FixtureService();
  }

  // POST /api/fixtures/generate/:tournamentId (si se desea generar fixture automáticamente)
  async generateFixture(req, res, next) {
    try {
      const { tournamentId } = req.params;
      const generatedFixture = await this.fixtureService.generateFixture(tournamentId);
      res.status(201).json(generatedFixture);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/fixtures/tournament/:tournamentId
  async getByTournament(req, res, next) {
    try {
      const { tournamentId } = req.params;
      const fixture = await this.fixtureService.getFixtureByTournament(tournamentId);
      if (!fixture) return res.status(404).json({ message: "Fixture no encontrado." });
      res.json(fixture);
    } catch (error) {
      next(error);
    }
  }

  async getGroupedFixture(req, res, next) {
    try {
      const { tournamentId } = req.params;
      const groupedFixture = await this.fixtureService.getGroupedFixtureByTournament(tournamentId);
      res.json(groupedFixture);
    } catch (error) {
      next(error);
    }
  }

  async addMatch(req, res, next) {
    try {
      const { tournamentId } = req.params;
      const matchData = req.body;
      const updatedFixture = await this.fixtureService.addMatchToFixture(tournamentId, matchData);
      res.status(201).json(updatedFixture);
    } catch (error) {
      next(error);
    }
  }
  // Opcionales: Actualizar y eliminar match
  async updateMatch(req, res, next) {
    try {
      const { matchId } = req.params;
      const updatedMatch = await this.fixtureService.updateMatch(matchId, req.body);
      res.json(updatedMatch);
    } catch (error) {
      next(error);
    }
  }

    async getEnrichedFixture(req, res, next) {
    try {
      const { tournamentId } = req.params;
      const userId = req.user.id; // Suponemos que el middleware de autenticación deja el usuario en req.user
      const enrichedFixture = await this.fixtureService.getGroupedEnrichedFixtureByTournamentAndUser(tournamentId, userId);
      res.json(enrichedFixture);
    } catch (error) {
      next(error);
    }
  }

  async deleteMatch(req, res, next) {
    try {
      const { matchId } = req.params;
      const result = await this.fixtureService.deleteMatch(matchId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
