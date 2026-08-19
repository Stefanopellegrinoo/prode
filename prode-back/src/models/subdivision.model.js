// src/models/subdivision.model.js
// export class Subdivision {
//   constructor(id, name) {
//     this.id = id;
//     this.name = name; // Ej: "Primera", "Intermedia", "Intermedia A", "Intermedia B", "Pre C", "Pre B", etc.
//   }
// }

// // Simulación en memoria de subdivisiones fijas
// export const subdivisions = [
//   new Subdivision(1, "Primera"),
//   new Subdivision(2, "Intermedia"),
//   new Subdivision(3, "Pre A"),
//   new Subdivision(4, "Pre B"),
//   new Subdivision(5, "Pre C"),
// ];
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Subdivision = sequelize.define('Subdivision', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'subdivisions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});