var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheme = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    private: {
        type: Boolean
    },
    data: {
        type: Array
    }
});