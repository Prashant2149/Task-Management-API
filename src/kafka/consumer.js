const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'task-api',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'task-service' });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'task-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
      // Process events here (like sending notifications, etc.)
    },
  });
};

module.exports = { connectConsumer };