const { client } = require('../../startup/redis_client');

// Cache middleware
module.exports = function (req, res, next) {
  client.get('cards', (err, data) => {
    if (err) throw err;

    if (data !== null) {
      // console.log('getting from redis');

      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};
