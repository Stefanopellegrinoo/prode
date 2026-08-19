import TeamService from '../services/team.service.js';

export default class TeamController {
  constructor() {
    this.service = new TeamService();
  }

  getAll = async (req, res, next) => {
    try {
      const teams = await this.service.getAll();
      res.json(teams);
    } catch (err) {
      next(err);
    }
  }

  getById = async (req, res, next) => {
    try {
      const team = await this.service.getById(req.params.id);
      res.json(team);
    } catch (err) {
      next(err);
    }
  }

  getByTournament = async (req, res, next) => {
    try {
      const { tournamentId } = req.params;
      const teams = await this.service.getByTournament(tournamentId);
      res.json(teams);
    } catch (err) {
      next(err);
    }
  }

  create = async (req, res, next) => {
    try {
      const { name, logo, tournamentId, shortName } = req.body;
      console.log(req.body.tournamentId);
      const team = await this.service.create({ name, logo, tournamentId, shortName });
      res.status(201).json(team);
    } catch (err) {
      next(err);
    }
  }

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, logo, tournamentId, shortName } = req.body;
      console.log(req.body,  id)
      const team = await this.service.update(id, { name, logo, tournamentId, shortName });
      res.json(team);
    } catch (err) {
      next(err);
    }
  }

   uploadTeamLogo = async (req, res, next) => {
    try {
      const { id } = req.params;
      const file = req.file; // multer ya lo parseó

      const logoUrl = await this.service.uploadLogo(id, file);
  
      return res.json({
        message: "Logo actualizado correctamente.",
        url: logoUrl,
      });
    } catch (error) {
      console.error("Error en uploadTeamLogo:", error);
      next(error);
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
}
