// // src/models/match.model.js
// export class Match {
//   constructor(id, homeTeamId, awayTeamId, date, subdivisionId, homeScore, awayScore,   round) {
//     this.id = id;                 // Identificador único (puede ser una cadena compuesta)
//     this.homeTeamId = homeTeamId;
//     this.awayTeamId = awayTeamId;
//     this.date = date;             // Fecha del partido (puede quedar en blanco para editar después)
//     this.subdivisionId = subdivisionId; // Indica a qué subdivisión (categoría) corresponde este match
//     this.homeScore = homeScore;   // Resultado (inicialmente null)
//     this.awayScore = awayScore;   // Resulta
//     this.round = round; 
//   }
// }

// // Simulación en memoria de matches (por separado)
// export const matches = [];
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tournament_id: {
    field: 'tournament_id',
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subdivision_id: {
    field: 'subdivision_id',
    type: DataTypes.INTEGER,
    allowNull: false
  },
  home_team_id: {
    field: 'home_team_id',
    type: DataTypes.INTEGER,
    allowNull: false
  },
  away_team_id: {
    field: 'away_team_id',
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  home_score: {
    field: 'home_score',
    type: DataTypes.INTEGER,
    allowNull: true
  },
  away_score: {
    field: 'away_score',
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'UPCOMING'
  },
  result: {
    type: DataTypes.ENUM('home', 'away', 'draw'),
    allowNull: true 
  }
}, {
  tableName: 'matches',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: false
});