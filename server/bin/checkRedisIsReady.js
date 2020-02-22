const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const redisClient = redis.createClient(process.env.REDIS_URL);

const connect = async () => {
  await redisClient.getAsync("test");
};

connect().then(() => {
  process.exit(0);
}).catch((error) => {
  console.log(error);
  process.exit(1);
});

