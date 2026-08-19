import { redis } from "../config/redis.js";

export async function getOrSetCache(key, cb, ttlSeconds = 300) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const freshData = await cb();
  await redis.set(key, JSON.stringify(freshData), { ex: ttlSeconds }); // TTL opcional (default: 5min)
  return freshData;
}

export async function setCachedRanking(tournamentId, subdivisionId, data) {
  const key = `ranking:general:tournament:${tournamentId}:subdivision:${subdivisionId}`;
  await redis.set(key, JSON.stringify(data));
}

export async function getCachedRanking(tournamentId, subdivisionId) {
  const key = `ranking:general:tournament:${tournamentId}:subdivision:${subdivisionId}`;
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function invalidateCachedRanking(tournamentId, subdivisionId) {
  console.log("invalidando")
  const key = `ranking:general:tournament:${tournamentId}:subdivision:${subdivisionId}`;
  await redis.del(key);
}
export async function deleteByPatternStream(pattern) {
  const stream = redis.scanStream({
    match: pattern,
    count: 100 // cuántas claves devuelve por iteración (ajustable)
  });

  stream.on('data', async (keys = []) => {
    if (keys.length) {
      // Borra en batch
      await redis.del(...keys);
    }
  });

  stream.on('end', () => {
    console.log(`✅ Borrado completado para patrón: ${pattern}`);
  });

  stream.on('error', (err) => {
    console.error('❌ Error durante el borrado:', err);
  });
}

export async function getTTLUntilNextSunday() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = (7 - day) % 7;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(23, 59, 59, 999);
  return Math.floor((nextSunday.getTime() - now.getTime()) / 1000);
}