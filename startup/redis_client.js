const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT;

exports.client = redis.createClient(REDIS_PORT);
