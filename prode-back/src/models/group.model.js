// src/models/group.model.js
// export class Group {
//     constructor(id, name, description, code, creatorId) {
//       this.id = id;                 // ID único del grupo
//       this.name = name;             // Nombre del grupo
//       this.description = description; // Descripción o detalles del grupo
//       this.code = code;             // Código de invitación único para unirse
//       this.creatorId = creatorId;   // ID del usuario creador del grupo
//       this.members = [];            // Array de IDs de usuarios que forman parte del grupo
//       // Se pueden agregar propiedades adicionales como fecha de creación, etc.
//     }
//   }
  
//   // Simulación en memoria de la "tabla" de grupos
//   export const groups = [];
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Group = sequelize.define('Group', {
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
  inviteCode: {
    field: 'invite_code',
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  createdBy: {
    field: 'created_by',
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});
