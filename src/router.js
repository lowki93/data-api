var express = require('express');
var bodyParser = require('body-parser');
var user = require('./controllers/user');

module.exports = function (app, passport) {

    var router = express.Router();

    //Users
    router.post('/user', user.create);
    router.get('/user/:id', user.show);
    router.delete('/user/remove/:id', user.remove);
    //
    //router.post('/login',
    //    passport.authenticate('local', { successRedirect: '/',
    //        failureRedirect: '/login',
    //        failureFlash: true })
    //);

    app.use('/api', bodyParser.json(), router);
};