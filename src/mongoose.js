var mongoose = require('mongoose'),
    config = require('./config'),
    log = require('./log'),
    stream = require('./log').stream;

mongoose.connect(config.get('mongoose:uri'))
    .then(
        stream.write(`Successfully connected to DB on port ${config.get('mongoose:port')}`)
    )
    .catch(error => log.error(error.message));
;

module.exports = mongoose;