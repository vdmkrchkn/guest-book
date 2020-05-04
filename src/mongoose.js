const mongoose = require('mongoose');
const config = require('./config');
const log = require('./log');
const stream = require('./log').stream;

mongoose.connect(config.get('mongoose:uri'), {useNewUrlParser: true, useUnifiedTopology: true})
    .then(
        stream.write(`Successfully connected to DB on port ${config.get('mongoose:port')}`),
    )
    .catch(error => log.error(error.message));
;

module.exports = mongoose;
