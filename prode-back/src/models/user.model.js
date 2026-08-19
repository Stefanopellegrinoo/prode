// src/models/user.model.js
// export class User {
//     constructor(id, name, email, password, role = 'user', club, points) {
//       this.id = id;
//       this.name = name;
//       this.email = email;
//       this.password = password; // Se espera que esté hasheado
//       this.role = role;
//       this.club = club; 
//       this.points = points; // Relación con el club
//       // Agregar otros campos según sea necesario, como stats, etc.
//     }
//   }
  
//   // Simulación en memoria (para efectos de ejemplo)
//   export const users = [
//      new User(1, "Stefano", "stefanopellegrino490@gmail.com", "$2b$10$Qbyo77x.9CcqNhs/Ka21o.8pQoeK7/WAsag9j69qcI72mNDZG2SBu", "admin", "olivos", 100),
//      new User(2, "Stefano1", "stefanop@gmail.com", "$2b$10$/03Gx/4uCKfJ.AO.X19ER.qevpU2Qgx7S4YUrTl0mO2rQD0RqIzz.", "user", "olivos", 100),
//      new User(3, 'Alice', 'alice@example.com', 'hashed', 'user', "olivos", 120),
//      new User(4, 'Bob', 'bob@example.com', 'hashed', 'user', "olivos", 200),
//      new User(5, 'Charlie', 'charlie@example.com', 'hashed', 'user', "olivos", 150),
//      new User(6, 'aGUS', 'cubita1511@gmail.com', 'hashed', 'user', "olivos", 200000)

//   ];
  // src/models/User.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  name:         { type: DataTypes.STRING,  allowNull: false },
  username:         { type: DataTypes.STRING,  allowNull: false },
  email:        { type: DataTypes.STRING,  allowNull: false, unique: true },
  passwordHash: { type: DataTypes.TEXT,    allowNull: false, field: 'password_hash' },
  role:         { type: DataTypes.STRING,  defaultValue: 'user' },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});
