// import { Redis } from "@upstash/redis";

// export const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD
} = process.env;

const isTlsRequired = REDIS_HOST && !REDIS_HOST.includes('localhost') && !REDIS_HOST.includes('127.0.0.1');

export const redis = new Redis({
  host: REDIS_HOST || '127.0.0.1',
  port: Number(REDIS_PORT) || 6379,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  ...(isTlsRequired ? { tls: {} } : {}),
  maxRetriesPerRequest: 1,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 2) return null; // No reintentar indefinidamente
    return Math.min(times * 100, 1000);
  },
});

redis.on('error', (err) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('⚠️ Redis connection notice:', err.message);
  }
});