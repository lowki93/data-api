var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    date: {
        type: String
    },
    environnement: {
        type: Array
    },
    deplacement: {
        type: Array
    },
    atmosphere: {
        type: Object
    },
    photos: {
        type: Array
    }
});

module.exports = mongoose.model('Data', schema);