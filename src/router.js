var express = require('express');
var bodyParser = require('body-parser');
var user = require('./controllers/user');
var authController = require('./controllers/auth');

module.exports = function (app) {

    var router = express.Router();

    //Users
    router.post('/user/create', user.create);
    router.post('/user/login', user.login);
    router.get('/user/profile/:id', authController.isAuthenticated, user.show);
    router.delete('/user/remove/:id', authController.isAuthenticated, user.remove);
    app.use('/api', bodyParser.json(), router);
};