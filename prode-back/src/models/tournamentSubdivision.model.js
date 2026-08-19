import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const TournamentSubdivision = sequelize.define('TournamentSubdivision', {
  tournamentId: {
    field: 'tournament_id',
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  subdivisionId: {
    field: 'subdivision_id',
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'tournament_subdivisions',
  timestamps: false
});
