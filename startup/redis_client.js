const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;

exports.client = redis.createClient(REDIS_PORT);
