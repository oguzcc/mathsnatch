const { client } = require('../../startup/redis_client');

// Cache middleware
module.exports = function (req, res, next) {
  client.get('topics', (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};
