var express = require('express');
var bodyParser = require('body-parser');
var user = require('./controllers/user');

module.exports = function (app, passport) {

	var router = express.Router();

	//Users
	router.post('/user', user.create);
	router.get('/user/:id', user.show);
	router.delete('/user/:id', user.show);

	app.use('/api', bodyParser.json(), router);

	app.get('/', function (req, res, next) {
		res.json({
			syrups: [
				"Léo",
				"Glenn"
			]
		});
	});
};