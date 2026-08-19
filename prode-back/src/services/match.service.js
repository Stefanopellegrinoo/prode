import MatchRepository from '../repositories/match.repository.js';
import { sequelize, Subdivision, Tournament } from '../models/models.js';
import { Op, fn, col, where, Sequelize } from 'sequelize';
import { Match } from '../models/match.model.js';
import { redis } from '../config/redis.js';
import { getTTLUntilNextSunday } from '../utils/redisCache.js';
import { format } from 'date-fns'

export default class MatchService {
  constructor() {
    this.repo = new MatchRepository();
  }

  async getAll(opts = {}) {
    return this.repo.findAll(opts);
  }

  async getById(id) {
    const match = await this.repo.findById(id);
    if (!match) throw new Error('Partido no encontrado');
    return match;
  }

  async getByTournamentAndSubdivision(tournamentId) {
    return this.repo.findByTournamentAndSubdivision(tournamentId);
  }

    async getGroupedEnrichedFixtureByTournamentAndUser(tournamentId, userId) {
      return this.repo.findGroupedEnrichedFixtureByTournamentAndUser(tournamentId, userId);
    }

  async create(data) {
    return sequelize.transaction(async (tx) => {
      // Obtener el torneo con las subdivisiones asociadas
      const tournament = await Tournament.findByPk(data.tournament_id, {
        include: 'Subdivisions',
        transaction: tx
      });

      if (!tournament) {
        throw new Error('Torneo no encontrado');
      }

      const createdMatches = [];

      for (const subdivision of tournament.Subdivisions) {
        const conflict = await Match.findOne({
          where: {
            tournament_id: data.tournament_id,
            subdivision_id: subdivision.id,
            [Op.and]: [
              where(fn('DATE', col('date')), '=', data.date),  // solo fecha
              {
                [Op.or]: [
                  { home_team_id: data.home_team_id },
                  { away_team_id: data.home_team_id },
                  { home_team_id: data.away_team_id },
                  { away_team_id: data.away_team_id }
                ]
              }
            ]
          },
          transaction: tx
        });

        if (conflict) {
          throw new Error(`Uno de los equipos ya tiene un partido para esta fecha`)
        }

        const match = await this.repo.create({
          home_team_id: data.home_team_id,
          away_team_id: data.away_team_id,
          date: data.date,
          round: data.round,
          tournament_id: data.tournament_id,
          subdivision_id: subdivision.id
        }, { transaction: tx });

        createdMatches.push(match);
      }

      return createdMatches;
    });
  }

  async update(id, data) {
    return sequelize.transaction(async (tx) => {
      const updated = await this.repo.update(id, data, { transaction: tx });
      return updated;
    });
  }

  async delete(id) {
    return this.repo.delete(id);
  }
  async getUpcomingMatches() {

    // const cacheKey = 'upcoming:matches';
    // const cached = await redis.get(cacheKey);

    // if (cached) {
    //   return JSON.parse(cached);
    // }
    // Paso 1: Buscar subdivisiones y elegir una sola por torneo
    const subdivisions = await Subdivision.findAll({
      attributes: ['id' ],
      // order: [[, 'ASC'], ['id', 'ASC']],
      raw: true
    });

    const firstSubByTournament = {};
    for (const sub of subdivisions) {
      if (!firstSubByTournament[sub.tournament_id]) {
        firstSubByTournament[sub.tournament_id] = sub.id;
      }
    }
    const allowedSubdivisionIds = Object.values(firstSubByTournament);

    // Paso 2: Buscar partidos solo de esas subdivisiones y el sábado próximo
    const matches = await Match.findAll({
      where: {
        subdivision_id: allowedSubdivisionIds,
        [Sequelize.Op.and]: Sequelize.literal(`
          DATE(date) = (
            CURRENT_DATE + ((6 - EXTRACT(DOW FROM CURRENT_DATE)) % 7) * INTERVAL '1 day'
          )
        `)
      },
      include: [
        { model: Tournament, attributes: ['id', 'name', 'season'] },
        { association: 'homeTeam', attributes: ['id', 'name', 'logo', "logo_updated_at"] },
        { association: 'awayTeam', attributes: ['id', 'name', 'logo', "logo_updated_at"] }
      ],
      order: [['tournament_id', 'ASC'], ['date', 'ASC']],
      raw: true,
      nest: true
    });

    // Paso 3: Agrupar partidos por torneo
    const groupedByTournament = {};

    for (const match of matches) {
      const tournamentId = match.Tournament.id;
      if (!groupedByTournament[tournamentId]) {
        groupedByTournament[tournamentId] = {
          tournament_id: tournamentId,
          tournament_name: match.Tournament.name,
          season: match.Tournament.season,
          matches: []
        };
      }

      groupedByTournament[tournamentId].matches.push({
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        date:  format(new Date(match.date), 'yyyy-MM-dd'),
        status: match.status,
        result: match.result
      });
    }

      const result = Object.values(groupedByTournament);

    // Guardar en Redis con TTL hasta el próximo domingo
    // const ttl = await getTTLUntilNextSunday();
    // await redis.set(cacheKey, JSON.stringify(result), 'EX', ttl);

    return result;
  }

}

