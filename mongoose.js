var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));
console.log(`Successfully connected to DB on port ${config.get('mongoose:port')}`);

module.exports = mongoose;