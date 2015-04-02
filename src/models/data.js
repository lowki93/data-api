var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheme = new Schema({
    date: {
        type: Date
    },
    environnement: {
        type: Array
    },
    deplacement: {
        type: Array
    },
    atmosphere: {
        type: Array
    }
});