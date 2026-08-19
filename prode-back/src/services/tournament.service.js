// src/services/tournament.service.js
import TournamentRepository from '../repositories/tournament.repository.js';
// import {redis} from '../config/redis.js';
import { Subdivision } from '../models/subdivision.model.js';

export default class TournamentService {
  constructor() {
    this.repo = new TournamentRepository();
  }

  async create(data) {
    // aquí podrías validar input, lanzar errores de negocio, etc.

    const tournament = await this.repo.create({
      name: data.name,
      description: data.description,
      season: data.season
    });
  
    if (data.subdivisionIds?.length) {
      await tournament.setSubdivisions(data.subdivisionIds);
    }
  
    // ❌ Invalido el cache
    // await redis.del("tournaments:all");
  
    return tournament;

  }

  async update(id, data) {
    
    if (data.subdivisionIds) {
   throw new Error("No se puede actualizar las subdiviciones una vez creeado el torneo.");
  } 
  
  const tournament = await this.findById(id);
  if (!tournament) throw new Error("Torneo no encontrado");

  await tournament.update(data);

  // await redis.del("tournaments:all");

  return tournament;

  }

  async findAll() {
    // const cached = await redis.get("tournaments:all");
  // if (cached) return JSON.parse(cached);

  const tournaments = await this.repo.findAll({
    include: [{ model: Subdivision, through: { attributes: [] } }],
    order: [['season', 'DESC']]
  });

  // await redis.set("tournaments:all", JSON.stringify(tournaments), "EX", 3600);
  return tournaments;

  }

  async findById(id) {
    return this.repo.findById(id, {
      include: ['Subdivisions']
    });
  }

  async delete(id) {
    return this.repo.delete(id);
  }
}
