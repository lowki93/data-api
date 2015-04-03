var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    private: {
        type: Boolean
    },
    data: [
        Schema.Types.Mixed
    ]
});

module.exports = mongoose.model('Experience', schema);