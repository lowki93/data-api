/*
 *
 * https://github.com/Syrups/nodejs-starter
 *
 * Copyright (c) 2014
 * Licensed under the MIT license.
 */

process.env.PWD = process.cwd();

var env = process.env.NODE_ENV || 'dev';

var bootstrap = require('./middlewares/bootstrap');

var app = require('express')();
var express = require('express');
var mongoose = require('mongoose');
var compression = require('compression');
var bodyParser = require('body-parser');
//var passport = require('passport'),
//    LocalStrategy = require('passport-local').Strategy;

// mongodb config ======================================================================

var db = require('../config/db/' + env + '.js');

mongoose.connect('mongodb://' + db.url + '/' + db.name);

// express config ======================================================================

app.use(bootstrap());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use("/media", express.static( __dirname + '/../uploads'));



// passport config ======================================================================
//passport.use(new LocalStrategy(
//    function(username, password, done) {
//        User.findOne({ username: username }, function(err, user) {
//            if (err) { return done(err); }
//            if (!user) {
//                return done(null, false, { message: 'Incorrect username.' });
//            }
//            if (!user.validPassword(password)) {
//                return done(null, false, { message: 'Incorrect password.' });
//            }
//            return done(null, user);
//        });
//    }
//));


// routes ======================================================================
require('./router.js')(app);

exports.app = app;