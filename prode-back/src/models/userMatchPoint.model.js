import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const UserMatchPoint = sequelize.define('UserMatchPoint', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE'
  },
  match_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'match_id',
    references: { model: 'matches', key: 'id' },
    onDelete: 'CASCADE'
  },
  tournament_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'tournament_id'
  },
  subdivision_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'subdivision_id'
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'user_match_points',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'match_id']
    }
  ]
});

  

export { UserMatchPoint };
