const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

schema.methods.getContact = function() {
  return this.get('name') +
            ` (email = ${this.get('email')})`;
};

schema.methods.getPrettyDateTime = function() {
  return moment(this.get('dateTime')).format('DD-MM-YYYY HH:mm:ss');
};

exports.Comment = mongoose.model('Comment', schema);
