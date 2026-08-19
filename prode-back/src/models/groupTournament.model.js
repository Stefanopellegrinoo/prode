// src/models/groupTournament.model.js
// src/models/groupTournament.model.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const GroupTournament = sequelize.define('GroupTournament', {
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'group_id'
  },
  tournament_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tournament_id'
  },
}, {
  tableName: 'group_tournaments',
  timestamps: false
});
