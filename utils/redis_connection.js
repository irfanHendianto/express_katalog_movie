const config = require('../config');
const redis = require('redis');

// connect to redis
const redis_client = redis.createClient(config.redis_port, config.redis_host);

redis_client.on('connect', function () {
    console.log('redis client connected');
});

module.exports = redis_client;