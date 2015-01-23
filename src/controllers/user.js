var User = require('../models/user');
var mongoose = require('mongoose');

module.exports = {

	create: function (req, res, next) {
		//var md5 = crypto.createHash('md5');
		//var salt = 'syrupsappsforyou';
		//var token = md5.update((req.param('name') + salt)).digest('hex');

		User.create({
			name: req.param('name'),
			avatar: req.param('avatar')
		}, function (err, user) {
			if (!err) {
				res.status(201).json({
					message: "User created.",
					id: user.id,
					name: user.name,
					avatar: user.avatar
				});
			} else {
				res.status(201).json({
					error: err
				});
			}
		});
	},
	login: function (req, res, next) {
		res.status(500).json({

		});
	},

	show: function (req, res, next) {
		User.findById(req.user.id, function (err, user) {
			if (!err) {
				res.status(200).json({
					code: 200,
					data: user
				});
			} else {
				res.status(500).json(err);
			}
		});
	},



	delete: function (req, res, next) {
		User.remove({
			_id: req.params.id
		}, function (err) {
			if (!err)
				res.status(201).json({
					delete: true
				});
			else {
				res.status(500).json({
					delete: true,
					error: err
				});
			}
		});
	}
};