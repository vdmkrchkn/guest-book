var mongoose = require('mongoose'),
    config = require('./config'),
    stream = require('./log').stream;

mongoose.connect(config.get('mongoose:uri'));
stream.write(`Successfully connected to DB on port ${config.get('mongoose:port')}`);

module.exports = mongoose;