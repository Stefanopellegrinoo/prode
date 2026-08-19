// src/models/tournament.model.js
// export class Tournament {
//   constructor(id, name, description, season, allowedSubdivisionIds = [], teamIds = []) {
//     this.id = id;
//     this.name = name;                   // Ej: "Top 12" o "Primera A"
//     this.description = description;
//     this.season = season, 
//     this.allowedSubdivisionIds = allowedSubdivisionIds; // Array de IDs de subdivisiones permitidas
//     this.teamIds = teamIds;             // Equipos inscritos en el torneo
//   }
// }

// export const tournaments = [
//   new Tournament(
//     1,
//     "Top 12",
//     "Torneo de los 12 mejores equipos",
//     "2025",
//     [1, 2, 3, 4, 5],
//     [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]
//   ),
//   new Tournament(
//     2,
//     "Primera A",
//     "Torneo de Primera A con 14 equipos",
//     "2025",
//    [1, 2, 3],
//    [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214]
//   )
// ];
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Tournament = sequelize.define('Tournament', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  season: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  tableName: 'tournaments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});