import { Team } from '../models/models.js';

export default class TeamRepository {
  async findAll(opts = {}) {
    return Team.findAll({ order: [['id', 'ASC']], ...opts });
  }

  async findById(id) {
    return Team.findByPk(id);
  }

  async findByTournament(tournamentId) {
    return Team.findAll({ where: { tournament_id: tournamentId }, order: [['name', 'ASC']] });
  }

  async create(data) {
    // data: { name, logo, tournament_id }
    if (!data.name ||  !data.tournamentId) {
      throw new Error('Faltan datos requeridos para crear el equipo');
    }
    return Team.create(data);
  }

  async update(id, data) {
    const team = await Team.findByPk(id);
    if (!team) throw new Error('Equipo no encontrado');
    console.log(data)
    return team.update(data);
  }

  async delete(id) {
    const team = await Team.findByPk(id);
    if (!team) throw new Error('Equipo no encontrado');
    await team.destroy();
    return { message: 'Equipo eliminado correctamente' };
  }
}