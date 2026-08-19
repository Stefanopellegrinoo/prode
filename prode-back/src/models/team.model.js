// src/models/team.model.js
// src/models/team.model.js
// export class Team {
//   constructor(id, name, emblemUrl, abbreviation, tournamentId = null) {
//     this.id = id;
//     this.name = name;
//     this.emblemUrl = emblemUrl;
//     this.abbreviation = abbreviation;
//     this.tournamentId = tournamentId; // Indica a qué torneo pertenece el equipo
//   }
// }

// // Simulación en memoria de equipos
// export const teams = [
//   // Ejemplos para el torneo Top 12 (id: 1)
//   new Team(101, "Equipo A", "A", "https://example.com/equipo-a.png", 1),
//   new Team(102, "Equipo B", "B", "https://example.com/equipo-b.png", 1),
//   // Ejemplos para el torneo Primera A (id: 2)
//   new Team(201, "Equipo X", "X", "https://example.com/equipo-x.png", 2),
//   new Team(202, "Equipo Y", "Y","https://example.com/equipo-y.png", 2)
// ];
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  shortName: {
    type: DataTypes.STRING(100),
    allowNull: false,

  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  logo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo_updated_at: { type: DataTypes.DATE }, // 👈 NUEVO CAMPO
  tournamentId: {
    field: 'tournament_id',
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'teams',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['tournament_id'] },
    // (opcional) índice para short_name
    { fields: ['short_name'] }
  ]
});