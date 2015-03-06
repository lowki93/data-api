var User = require('../models/user');
var mongoose = require('mongoose');

module.exports = {

    create: function (req, res) {
        //var md5 = crypto.createHash('md5');
        //var salt = 'syrupsappsforyou';
        //console.log(md5);
        //var token = md5.update((req.param('name') + salt)).digest('hex');

        User.find({email: req.param('email')}, function (err, user) {
            if (user.length > 0) {
                /* istanbul ignore else */
                if (!err) {
                    res.status(201).json({
                        user: 'email already used'
                    });
                } else {
                    res.status(500).json({
                        error: err
                    });
                }
            } else {
                User.create({
                    email: req.param('email'),
                    password: req.param('password')
                }, function (err, user) {
                    /* istanbul ignore else */
                    if (!err) {
                        res.status(201).json({
                            id: user.id,
                            email: user.email,
                            password: user.password
                        });
                    } else {
                        res.status(500).json({
                            error: err
                        });
                    }
                });
            }
        });
    },
    //
    //login: function (req, res) {
    //    res.status(500).json({
    //
    //    });
    //},

    show: function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (!err) {
                res.status(200).json({
                    user: user
                });
            } else {
                res.status(404).json(err);
            }
        });
    },

    remove: function (req, res) {
        User.remove({
            _id: req.params.id
        }, function (err) {
            /* istanbul ignore else */
            if (!err) {
                res.status(200).json({
                    delete: true
                });
            } else {
                res.status(500).json({
                    delete: true,
                    error: err
                });
            }
        });
    }
};