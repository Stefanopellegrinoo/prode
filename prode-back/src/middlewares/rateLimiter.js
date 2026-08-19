import rateLimit from 'express-rate-limit';

// Público: IP-based, estricto
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  message: '🚫 Demasiados intentos desde esta IP. Intenta más tarde.',
});

// Privado: basado en el ID del usuario logueado
export const privateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100,
  keyGenerator: (req) =>  req.ip,
  message: '⛔️ Límite de peticiones alcanzado. Espera un momento.',
});
