const axios = require('axios');
const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();


function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
  
}

sub.on('message', async (channel, message) => {
  //redisClient.hset('values', message,await fibb(parseInt(message))
  const foodmess= String(fib(message))
  await redisClient.hset('values', message,foodmess)
})
sub.subscribe('insert');
