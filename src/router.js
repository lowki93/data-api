var express = require('express');
var bodyParser = require('body-parser');
var user = require('./controllers/user');
var authController = require('./controllers/auth');
var files = require('./controllers/files');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {

    var router = express.Router();

    // Users
    router.post('/user/create', user.create);
    router.post('/user/login', user.login);
    router.get('/user/profile/:id', authController.isAuthenticated, user.show);
    router.delete('/user/remove/:id', authController.isAuthenticated, user.remove);

    // Files
    router.post('/files/uploads', authController.isAuthenticated, multipartMiddleware, files.upload);

    app.use('/api', bodyParser.json(), router);
};