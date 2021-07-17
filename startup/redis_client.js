const redis = require('redis');
const fs = require('fs');

exports.client = redis.createClient(process.env.REDIS_URL);
