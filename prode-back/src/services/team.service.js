import { redis } from '../config/redis.js';
import supabase from '../config/supabase.js';
import { Tournament } from '../models/tournament.model.js';
import TeamRepository from '../repositories/team.repository.js';

export default class TeamService {
  constructor() {
    this.repo = new TeamRepository();
  }

  async getAll() {
    // const cacheKey = "teams:all";

    // const cached = await redis.get(cacheKey);
    // if (cached) {
    //   return JSON.parse(cached);
    // }

    const teams = await this.repo.findAll({
      attributes: ["id", "name", "short_name", "tournament_id", "logo", "logo_updated_at"],
      include: [
        {
          model: Tournament,
          attributes: ["name"] // o podés poner ['id', 'name'] si querés también el id
        }
      ],
      order: [["name", "ASC"]]
    });
    

    // await redis.set(cacheKey, JSON.stringify(teams));
    return teams;
  
  }

  // async clearCache() {
  //   await redis.del("teams:all");
  // }

  async getById(id) {
    const team = await this.repo.findById(id);
    if (!team) throw new Error('Equipo no encontrado');
    return team;
  }

  async getByTournament(tournamentId) {
    return this.repo.findByTournament(tournamentId);
  }
  
  async create(dto) {
    const result = await this.repo.create(dto);
    // await this.clearCache();
    return result;
  }

  async update(id, dto) {
    const result = await this.repo.update(id, dto);
    // await this.clearCache();
    return result;
  }

  async uploadLogo(teamId, file) {
    if (!file) {
      throw new Error("No se envió archivo.");
    }

    // Validaciones de tipo y tamaño
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSizeBytes = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error("Solo se permiten imágenes JPG o PNG.");
    }

    if (file.size > maxSizeBytes) {
      throw new Error("La imagen no puede pesar más de 2MB.");
    }

    const fileExt = file.originalname.split('.').pop();
    const filePath = `${teamId}.${fileExt}`;

    if (!supabase) {
      throw new Error("Supabase Storage no está configurado en las variables de entorno.");
    }

    const { error: uploadError } = await supabase.storage
      .from('teams')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });
  
    if (uploadError) {
      console.error(uploadError);
      throw new Error("Error subiendo imagen a Supabase Storage.");
    }

    const {data}= supabase.storage.from('teams').getPublicUrl(filePath);
  const logo ={
      logo: data.publicUrl,
      logo_updated_at: new Date(), // Ahora!
  } 
    await  this.repo.update(teamId, logo);
    // await this.clearCache();
    return data.publicUrl;
  }

  async delete(id) {
    await this.repo.delete(id);
    // await this.clearCache();
  }
}