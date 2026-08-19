
// src/repositories/tournament.repository.js
import {  Tournament, Subdivision } from '../models/models.js';
import { sequelize } from "../config/database.js";

export default class TournamentRepository {
  /** Crea un torneo y sus relaciones con subdivisiones en una transacción */
  async create({ name, description, season, subdivisionIds }) {
    return sequelize.transaction(async (trx) => {
      // 1) Inserta la fila principal
      const tournament = await Tournament.create(
        { name, description, season },
        { transaction: trx }
      );

      // 2) Asocia subdivisiones (bulk‐insert en tabla puente)
      if (subdivisionIds?.length) {
        await tournament.setSubdivisions(subdivisionIds, { transaction: trx });
      }

      return await Tournament.findByPk(tournament.id, {
        include: { model: Subdivision, through: { attributes: [] } },
        transaction: trx
      });
    });
  }

  /** Actualiza torneo y vuelve a asignar sus subdivisiones dentro de la misma transacción */
  async update(id, { name, description, season, subdivisionIds }) {
    return sequelize.transaction(async (trx) => {
      const tournament = await Tournament.findByPk(id, { transaction: trx });
      if (!tournament) throw new Error('Torneo no encontrado');

      await tournament.update(
        { name, description, season },
        { transaction: trx }
      );

      // Reemplaza todas las relaciones (borra viejas y bulk‐insert de nuevas)
      await tournament.setSubdivisions(subdivisionIds || [], { transaction: trx });

      return tournament;
    });
  }

  /** Opcional: findAll / findById si las necesitas */
  async findAll(opts = {}) {
    return Tournament.findAll(opts);
  }

  async findById(id, opts = {}) {
    return Tournament.findByPk(id, opts);
  }

  async delete(id) {
    return sequelize.transaction(async (trx) => {
      const t = await Tournament.findByPk(id, { transaction: trx });
      if (!t) throw new Error('Torneo no encontrado');
      await t.destroy({ transaction: trx });
    });
  }
}
