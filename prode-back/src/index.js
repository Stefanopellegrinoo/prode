import './config/nodePolyfills.js';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import matchRoutes from './routes/match.routes.js';
import predictionRoutes from './routes/prediction.routes.js'; 
import groupRoutes from './routes/group.routes.js'; 
import rankingRoutes from './routes/ranking.routes.js'; 
// import fixtureRoutes from './routes/fixture.routes.js'; 
import tournamentRoutes from './routes/tournament.routes.js'; 
import teamRoutes from "./routes/team.routes.js";
import subdivisionRoutes from "./routes/subdivision.routes.js";
import userMatchPointsRoutes from "./routes/userMatchPoints.routes.js";
import notificationRoutes from './routes/notification.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { sequelize } from './config/database.js';
import './models/models.js'; // Asegúrate de importar todos los modelos aquí
import { privateLimiter } from './middlewares/rateLimiter.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1); 

app.use(express.json());

const allowedOrigins = [
  'https://prode-front-uxlb.vercel.app',
  'https://www.proderugbyargentina.fyi',
  'http://localhost:5173',
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : [])
];

const isLocalhostOrigin = (origin) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isLocalhostOrigin(origin)) {
      return callback(null, origin || true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(cookieParser());

// Definir rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', privateLimiter, matchRoutes);
app.use('/api/predictions', privateLimiter, predictionRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/ranking', privateLimiter, rankingRoutes);
app.use('/api/tournament', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/subdivisions', subdivisionRoutes);
app.use('/api/usermatchpoints', privateLimiter, userMatchPointsRoutes);
app.use('/api/notifications', privateLimiter, notificationRoutes);

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Datos de validación inválidos.',
      errors: err.errors
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Ha ocurrido un error interno.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3030;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}
export default app; 