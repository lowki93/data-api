var User = require('../models/user');
var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = {

    create: function (req, res) {
        var md5 = crypto.createHash('md5');
        var salt = 'dataapp';
        var token = md5.update((req.param('email') + salt)).digest('hex');

        var user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            token: token
        });

        user.save(function (err) {
            if (!err) {
                console.log('user create');
                delete user.password;
                res.status(201).json({
                    user: user
                });
            } else {
                /* istanbul ignore else */
                if (err.code === 11000) {
                    res.status(409).json({
                        error: 'email already used'
                    });
                } else {
                    res.status(500).json({
                        error: err
                    });
                }
            }
        });
    },

    login: function (req, res) {
        User.findOne({email: req.param('email')}).populate('currentData').exec(function (err, user) {
            /* istanbul ignore else */
            if (!err) {
                if (user !== null) {
                    user.verifyPassword(req.param('password'), function (err, isMatch) {
                        /* istanbul ignore else */
                        if (!err) {
                            if (isMatch) {
                                delete user.password;
                                res.status(200).json({
                                    user: user
                                });
                            } else {
                                res.status(409).json({
                                    error: 'bad password'
                                });
                            }
                        } else {
                            res.status(500).json({
                                error: err
                            });
                        }
                    });

                } else {
                    res.status(404).json({
                        error: 'email not find'
                    });
                }
            } else {
                res.status(500).json({
                    user: err
                });
            }
        });
    },

    show: function (req, res) {
        User.findById(req.params.id, function (err, user) {
            /* istanbul ignore else */
            if (!err) {
                if (user !== null) {
                    res.status(200).json({
                        user: user
                    });
                } else {
                    res.status(404).json({
                        error: 'user not find'
                    });
                }
            } else {
                res.status(500).json(err);
            }
        });
    },

    remove: function (req, res) {
        User.findById(req.params.id, function (err, user) {
            /* istanbul ignore else */
            if (!err) {
                if (user !== null) {
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
                                delete: false,
                                error: err
                            });
                        }
                    });
                } else {
                    res.status(404).json({
                        delete: false,
                        error: 'user undefined'
                    });
                }
            } else {
                res.status(500).json({
                    delete: false,
                    error: err
                });
            }
        });
    },

    updateToken: function (req, res) {
        User.findById(req.params.id).populate('currentData').exec(function (err, user) {
            /* istanbul ignore else */
            if (!err) {
                if (user !== null) {

                    user.deviceToken = req.body.deviceToken;
                    user.save(function (err) {
                        if (!err) {
                            console.log('user update tokenDevice');
                            delete user.password;
                            res.status(200).json({
                                user: user
                            });
                        } else {
                            res.status(500).json({
                                err: err
                            });
                        }
                    });
                } else {
                    res.status(404).json({
                        error: 'user not find'
                    });
                }
            } else {
                res.status(500).json(err);
            }
        });
    }

};