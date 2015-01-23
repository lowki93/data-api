// lib/models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	name: String,
	password: String,
	avatar: String
});

module.exports = mongoose.model('User', schema);