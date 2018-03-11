var mongoose = require('mongoose');
var config = require('config');

console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));
mongoose.connect(config.get('mongoose_uri'));

module.exports = mongoose;