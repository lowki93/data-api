var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
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