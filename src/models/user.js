// lib/models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    email: String,
    password: String
});



module.exports = mongoose.model('User', schema);