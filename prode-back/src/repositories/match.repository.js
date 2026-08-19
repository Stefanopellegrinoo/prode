import { Match, Prediction, Subdivision, Team } from '../models/models.js'; // Asegúrate de importar el modelo correcto
import { format } from 'date-fns'

export default class MatchRepository {
  /**
   * Obtiene todos los partidos, opcionalmente con filtros
   */
  async findAll(opts = {}) {
    console.log('findAll', opts)
    return Match.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id','name','logo'] },
        { model: Team, as: 'awayTeam', attributes: ['id','name','logo'] }
      ],
      order: [['round','ASC'], ['date','ASC']],
      ...opts
    });
  }

  /**
   * Obtiene un partido por su ID
   */
  async findById(id) {
    console.log('findById', id)
    return Match.findByPk(id, {
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id','name','logo'] },
        { model: Team, as: 'awayTeam', attributes: ['id','name','logo'] }
      ]
    });
  }

  /**
   * Obtiene partidos filtrados por torneo y subdivisión
   */
  async findByTournamentAndSubdivision(tournamentId) {
    const matches = await Match.findAll({
      where: { tournament_id : tournamentId },
      
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name', 'logo'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name', 'logo'] },
        { model: Subdivision, attributes: ['id','name'] }
      ],
      order: [['date', 'ASC']] // o [['round', 'ASC']] si querés orden por ronda
    });
  
    // Agrupar por subdivision y por fecha
    const grouped = {};
  
    for (const match of matches) {
      const subName = match.Subdivision.name;
      const roundKey = format(new Date(match.date), 'yyyy-MM-dd')
  
      if (!grouped[subName]) grouped[subName] = {};
      if (!grouped[subName][roundKey]) grouped[subName][roundKey] = [];
  
      grouped[subName][roundKey].push(match);
    }


    return grouped
  }

  async findGroupedEnrichedFixtureByTournamentAndUser(tournamentId, userId) {
    const matches = await Match.findAll({
      where: { tournament_id: tournamentId },
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name', 'logo'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name', 'logo'] },
        { model: Subdivision, attributes: ['id', 'name'] },
        {
          model: Prediction,
          where: { user_id: userId },
          required: false,
          attributes: ['predicted_winner'],
        },
      ],
      order: [['date', 'ASC']],
    });

    const grouped = {};

    for (const match of matches) {
      const subdivisionName = match.Subdivision?.name || 'Sin Subdivisión';
      const roundKey = format(new Date(match.date), 'yyyy-MM-dd')


      if (!grouped[subdivisionName]) grouped[subdivisionName] = {};
      if (!grouped[subdivisionName][roundKey]) grouped[subdivisionName][roundKey] = [];

      grouped[subdivisionName][roundKey].push({
        ...match.toJSON(),
        userPrediction: match.Predictions?.[0] || null
      });
    }

    return grouped;
  }

  /**
   * Crea un nuevo partido
   * data: { tournament_id, subdivision_id, home_team_id, away_team_id, date, round }
   */
  async create(data) {
    return Match.create(data);
  }

  /**
   * Actualiza un partido existente
   */
  async update(id, data) {
    const match = await Match.findByPk(id);
    console.log(data)
    if (!match) throw new Error('Partido no encontrado');
    return match.update(data);
  }

  /**
   * Elimina un partido por ID
   */
  async delete(id) {
    const match = await Match.findByPk(id);
    if (!match) throw new Error('Partido no encontrado');
    await match.destroy();
  }
}