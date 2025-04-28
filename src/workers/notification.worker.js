const { Worker } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
});

console.log('connected to redis')

// Create Worker
const notificationWorker = new Worker(
  'notification-queue',
  async (job) => {
    console.log(`Processing Notification Job:`, job.data);

    // Here you can integrate Email/SMS/Push Notifications
    console.log(`Sending notification to user: ${job.data.userId}`);
  },
  { connection }
);

notificationWorker.on('completed', (job) => {
  console.log(`Notification Job ${job.id} completed`);
});

notificationWorker.on('failed', (job, err) => {
  console.error(`Notification Job ${job.id} failed:`, err);
});

module.exports = { notificationWorker };