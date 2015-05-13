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
var access = require('./middlewares/access');

var app = require('express')();
var express = require('express');
var mongoose = require('mongoose');
var compression = require('compression');
var bodyParser = require('body-parser');
var crontab = require('node-crontab');
var data = require('./controllers/data');

// mongodb config ======================================================================

var db = require('../config/db/' + env + '.js');

mongoose.connect('mongodb://' + db.url + '/' + db.name);

// express config ======================================================================

app.use(bootstrap());
app.use(access());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//app.options('/', function (req, res) {
//    res.header("Access-Control-Allow-Origin", "*");
//});


app.use("/media", express.static( __dirname + '/../uploads'));

// routes ======================================================================
require('./router.js')(app);

// cron task ======================================================================
//crontab.scheduleJob("*/1 * * * *", function () {  //This will call this function every 2 minutes
//    console.log('cron task');
//    data.test();
//});

exports.app = app;