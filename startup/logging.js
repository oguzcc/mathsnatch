const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
  });

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  // winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db: 'mongodb://localhost/mathbrand',
  //   level: 'info'
  // });
};
