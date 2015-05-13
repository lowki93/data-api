var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Experience = require('../models/experience');

var schema = new Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        index: { unique: true },
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    deviceToken: {
        type: String
    },
    currentData: {
        type: Schema.Types.ObjectId,
        ref: 'Experience'
    }
});

schema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    /* istanbul ignore if */
    if (!user.isModified('password')) {
        return callback();
    }

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        /* istanbul ignore if */
        if (err) {
            return callback(err);
        }

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            /* istanbul ignore if */
            if (err) {
                return callback(err);
            }
            user.password = hash;
            callback();
        });
    });
});

schema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        /* istanbul ignore if */
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', schema);