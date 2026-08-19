// import { Redis } from "@upstash/redis";

// export const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });
import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const {
  REDIS_URL,
  REDIS_HOST = '127.0.0.1',
  REDIS_PORT = 6379,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_TLS = 'false'
} = process.env;

const isTlsRequired = REDIS_TLS === 'true';

const redisOptions = {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  retryStrategy(times) {
    if (times > 2) return null; // No reintentar indefinidamente
    return Math.min(times * 100, 1000);
  },
  ...(isTlsRequired ? { tls: {} } : {}),
};

export const redis = REDIS_URL
  ? new Redis(REDIS_URL, redisOptions)
  : new Redis({
      ...redisOptions,
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
    });

redis.on('error', (err) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('⚠️ Redis connection notice:', err.message);
  }
});