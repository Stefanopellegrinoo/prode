import '../config/nodePolyfills.js';
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import {
  sequelize,
  User,
  Tournament,
  Subdivision,
  TournamentSubdivision,
  Team,
  Match,
  Group,
  GroupMember
} from '../models/models.js';

async function setupDatabase() {
  console.log('🔄 Conectando a la base de datos y sincronizando modelos...');
  await sequelize.authenticate();
  console.log('✅ Conexión establecida con éxito.');

  // Sincronizar esquemas (crea o actualiza tablas sin borrar datos existentes)
  await sequelize.sync({ alter: true });
  console.log('✅ Tablas creadas / sincronizadas correctamente.');

  console.log('🌱 Verificando y poblando datos iniciales (Seed)...');

  // 1. Crear Subdivisiones si no existen
  const defaultSubdivisions = [
    { id: 1, name: 'Primera' },
    { id: 2, name: 'Intermedia' },
    { id: 3, name: 'Preintermedia A' },
    { id: 4, name: 'Preintermedia B' },
    { id: 5, name: 'Preintermedia C' }
  ];

  for (const sub of defaultSubdivisions) {
    await Subdivision.findOrCreate({
      where: { name: sub.name },
      defaults: sub
    });
  }
  console.log('✅ Subdivisiones inicializadas.');

  // 2. Crear Torneo Top 12
  const [top12] = await Tournament.findOrCreate({
    where: { name: 'Top 12 URBA' },
    defaults: {
      name: 'Top 12 URBA',
      description: 'Torneo principal de la Unión de Rugby de Buenos Aires',
      season: '2025'
    }
  });

  // Asociar subdivisiones al torneo Top 12
  const allSubdivisions = await Subdivision.findAll();
  for (const sub of allSubdivisions) {
    await TournamentSubdivision.findOrCreate({
      where: {
        tournamentId: top12.id,
        subdivisionId: sub.id
      },
      defaults: {
        tournamentId: top12.id,
        subdivisionId: sub.id
      }
    });
  }
  console.log('✅ Torneo Top 12 y subdivisiones asociadas.');

  // 3. Crear Equipos de Top 12
  const teamsTop12 = [
    { name: 'Club Atlético de San Isidro', shortName: 'CASI' },
    { name: 'San Isidro Club', shortName: 'SIC' },
    { name: 'Hindú Club', shortName: 'Hindú' },
    { name: 'Belgrano Athletic', shortName: 'Belgrano' },
    { name: 'Asociación Alumni', shortName: 'Alumni' },
    { name: 'Club Universitario de Buenos Aires', shortName: 'CUBA' },
    { name: 'Club Newman', shortName: 'Newman' },
    { name: 'Club San Luis', shortName: 'San Luis' },
    { name: 'Club Regatas de Bella Vista', shortName: 'Regatas' },
    { name: 'Buenos Aires Cricket & Rugby Club', shortName: 'BIEI' },
    { name: 'Club Champagnat', shortName: 'Champagnat' },
    { name: 'Club Los Tilos', shortName: 'Los Tilos' }
  ];

  for (const team of teamsTop12) {
    await Team.findOrCreate({
      where: { shortName: team.shortName, tournamentId: top12.id },
      defaults: {
        name: team.name,
        shortName: team.shortName,
        tournamentId: top12.id
      }
    });
  }
  console.log('✅ Equipos del Top 12 cargados.');

  // 4. Crear Usuarios de prueba (Admin y User)
  const adminPasswordHash = await bcrypt.hash('Admin1234!', 10);
  const userPasswordHash = await bcrypt.hash('User1234!', 10);

  await User.findOrCreate({
    where: { email: 'admin@prode.com' },
    defaults: {
      name: 'Admin URBA',
      username: 'admin',
      email: 'admin@prode.com',
      passwordHash: adminPasswordHash,
      role: 'admin'
    }
  });

  await User.findOrCreate({
    where: { email: 'demo@prode.com' },
    defaults: {
      name: 'Usuario Demo',
      username: 'demo',
      email: 'demo@prode.com',
      passwordHash: userPasswordHash,
      role: 'user'
    }
  });
  console.log('✅ Usuarios iniciales creados:');
  console.log('   - Admin: admin@prode.com / Admin1234!');
  console.log('   - Demo:  demo@prode.com  / User1234!');

  console.log('\n🚀 ¡Base de datos inicializada y lista para jugar!');
  process.exit(0);
}

setupDatabase().catch(err => {
  console.error('❌ Error inicializando base de datos:', err);
  process.exit(1);
});
