require('dotenv').config();
require('../src/workers/notification.worker');
const { app } = require('./app');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
// const { connectProducer } = require('../src/kafka/producer');
// const { connectConsumer } = require('../src/kafka/consumer');



const startServer = async () => {
  await connectDB();
  await connectRedis();
  //connectProducer();
  //connectConsumer();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();