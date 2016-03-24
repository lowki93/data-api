var express = require('express');
var bodyParser = require('body-parser');
var user = require('./controllers/user');
var data = require('./controllers/data');
var experience = require('./controllers/experience');
var authController = require('./controllers/auth');
var files = require('./controllers/files');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {

    var router = express.Router();

    // Users
    router.post('/user/create', user.create);
    router.post('/user/login', user.login);
    router.post('/user/update/:id/deviceToken', authController.isAuthenticated, user.updateToken);
    router.get('/user/profile/:id', authController.isAuthenticated, user.show);
    router.delete('/user/remove/:id', authController.isAuthenticated, user.remove);

    // Experience
    router.get('/experience/:id/create', authController.isAuthenticated, experience.create);
    router.post('/experience/:id/update-date', authController.isAuthenticated, experience.updateDate);

    // save Data
    router.post('/data/:id/first-geoloc', authController.isAuthenticated, data.firstGeoloc);
    router.post('/data/:id/pedometer', authController.isAuthenticated, data.pedometer);
    router.post('/data/:id/save', authController.isAuthenticated, data.saveData);
    router.post('/data/test', data.lauchNotification);

    // Files
    router.post('/files/uploads/:id', authController.isAuthenticated, multipartMiddleware, files.upload);

    router.post('aircall/notification', data.testAircall);

    app.use('/api', bodyParser.json(), router);
};