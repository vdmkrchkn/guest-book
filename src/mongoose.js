const mongoose = require('mongoose');
const config = require('./config');
const log = require('./log');
const stream = require('./log').stream;

// eslint-disable-next-line require-jsdoc
async function connect() {
  await mongoose.connect(config.get('mongoose:uri'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: config.get('mongoose:dbname'),
  });
}

connect()
    .then(() =>
      stream.write(`Successfully connected to DB on port ${config.get('mongoose:port')}`)
    ).catch(error => log.error(error.message));

module.exports = mongoose;
