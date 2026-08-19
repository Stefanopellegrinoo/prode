import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const GroupMember = sequelize.define('GroupMember', {
  groupId: {
    field: 'group_id',
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  userId: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: 'group_members',
  timestamps: false
});
