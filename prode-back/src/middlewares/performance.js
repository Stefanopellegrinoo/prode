// src/middlewares/performance.js
import rateLimit from 'express-rate-limit';
import compression from 'compression';

export const applyPerformanceMiddlewares = (app) => {
  // 🔒 Rate Limiting
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 100, // Máximo 100 requests por IP por minuto
    keyGenerator: (req) => req.ip, // 👈 importante si estás en entornos con múltiples usuarios
    message: '⛔️ Demasiadas solicitudes. Intenta más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  app.use(limiter);

  // 📦 GZIP Compression
//   app.use(compression());
};
