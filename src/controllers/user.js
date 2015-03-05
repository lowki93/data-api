var User = require('../models/user');
var mongoose = require('mongoose');

module.exports = {

    create: function (req, res) {
        //var md5 = crypto.createHash('md5');
        //var salt = 'syrupsappsforyou';
        //var token = md5.update((req.param('name') + salt)).digest('hex');

        User.create({
            name: req.param('name'),
            avatar: req.param('avatar')
        }, function (err, user) {
            /* istanbul ignore else */
            if (!err) {
                res.status(201).json({
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                });
            } else {
                res.status(500).json({
                    error: err
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
                res.status(500).json(err);
            }
        });
    }

    //delete: function (req, res) {
    //    User.remove({
    //        _id: req.params.id
    //    }, function (err) {
    //        if (!err)
    //            res.status(201).json({
    //                delete: true
    //            });
    //        else {
    //            res.status(500).json({
    //                delete: true,
    //                error: err
    //            });
    //        }
    //    });
    //}
};