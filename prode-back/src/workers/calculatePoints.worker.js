import { Worker } from 'bullmq';
import { redis } from '../config/redis.js';
import UserMatchPointService from '../services/userMatchPoint.service.js';

const service = new UserMatchPointService();

const worker = new Worker('calculatePoints', async job => {
  const { updatedMatch } = job.data;
  await service.calculateAndStorePoints(updatedMatch);
}, {
  connection: redis,
  concurrency: 2,
});

worker.on('completed', job => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});
 