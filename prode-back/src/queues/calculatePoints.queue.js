import { Queue } from 'bullmq';
import { redis } from '../config/redis.js';

export const calculatePointsQueue = new Queue('calculatePoints', {
  connection: redis
});
await calculatePointsQueue.clean(0, 0, 'completed') // elimin