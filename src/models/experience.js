var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {
        type: String
    },
    descriptionContent: {
        type: String
    },
    private: {
        type: Boolean
    },
    day: [
        Schema.Types.Mixed
    ]
});

module.exports = mongoose.model('Experience', schema);