var mongoose = require('../mongoose'),
    Schema = mongoose.Schema;

var schema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        default: Date.now
    }
});

schema.methods.Contact = function(){
    return this.get(name) + '(email = ' + this.get(email) + ')';
};

exports.Comment = mongoose.model('Comment', schema);