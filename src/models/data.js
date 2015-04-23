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
        type: Object
    },
    atmosphere: {
        type: Array
    },
    photos: {
        type: Array
    }
});

module.exports = mongoose.model('Data', schema);