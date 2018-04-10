var mongoose = require('mongoose'),
    config = require('./config'),
    log = require('./log');

mongoose.connect(config.get('mongoose:uri'));
log.info(`Successfully connected to DB on port ${config.get('mongoose:port')}`);

module.exports = mongoose;