const winston = require('winston');
const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

require('./startup/prod')(app);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const port = process.env.PORT || 3000;

app.listen(port, function () {
  winston.info('Server has started successfully');
});
