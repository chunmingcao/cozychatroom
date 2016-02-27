var mongoose = require('mongoose');

var ActionSchema = new mongoose.Schema({
    name: String,
    time: {
        type: Date,
        default: Date.now
    }
});

var MessageSchema = new mongoose.Schema({
    content: String,
    time: {
        type: Date,
        default: Date.now
    }
});

var UserSchema = new mongoose.Schema({
    name: String,
    actions: [ActionSchema],
    messages: [MessageSchema],
    room: String,
    ip: String
});

var model = mongoose.model('Users', UserSchema);
module.exports = model;
