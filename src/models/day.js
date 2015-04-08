var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Data = require('../models/data');

var schema = new Schema({
    date: {
        type: String
    },
    data: [
        Schema.Types.Mixed
    ]
});

module.exports = mongoose.model('Day', schema);