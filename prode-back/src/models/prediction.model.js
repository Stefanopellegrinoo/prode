// src/models/prediction.model.js
// export class Prediction {
//   constructor(id, userId, matchId, predictedHomeScore, predictedAwayScore, createdAt, updatedAt, points = null) {
//     this.id = id;
//     this.userId = userId;
//     this.matchId = matchId;
//     this.predictedHomeScore = predictedHomeScore;
//     this.predictedAwayScore = predictedAwayScore;
//     this.createdAt = createdAt;
//     this.updatedAt = updatedAt;
//     this.points = points;
//   }
// }


// // Simulación en memoria (para prototipo)
// export const predictions = [];
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Prediction = sequelize.define('Prediction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  match_id: {
    field: 'match_id',
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // predicted_home_score: {
  //   field: 'predicted_home_score',
  //   type: DataTypes.INTEGER,
  //    defaultValue: 0
  // },
  // predicted_away_score: {
  //   field: 'predicted_away_score',
  //   type: DataTypes.INTEGER,
  //    defaultValue: 0
  // },
  points_awarded: {
    field: 'points_awarded',
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
   predicted_winner: {
    field: 'predicted_winner',
    type: DataTypes.ENUM('home', 'away', 'draw'),
    allowNull: false
  }
}, {
  tableName: 'predictions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [{ unique: true, fields: ['match_id', 'user_id'] }]
});