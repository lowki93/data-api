var curl = require('node-curl');
var strftime = require('strftime');
var User = require('../models/user');
var Experience = require('../models/experience');
var Data = require('../models/data');

module.exports = {

    saveData: function (req, res) {
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;
        var atmosphere;

        User.findById(req.params.id).populate('currentData').exec(function (err, user) {
            if (!err) {
                if (user !== null) {
                    curl('http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude, function (err) {
                        if (!err) {
                            atmosphere = JSON.parse(this.body);
                            var data = new Data({
                                date: strftime('%F %T', new Date(Date.now())),
                                atmosphere: atmosphere
                            });
                            user.currentData.data = user.currentData.data.concat(data);
                            user.currentData.save(function (err) {
                                if (!err) {
                                    res.status(200).json({
                                        user: {
                                            id: user.id,
                                            email: user.email,
                                            token: user.token,
                                            currentData: user.currentData
                                        }
                                    });
                                } else {
                                    res.status(500).json({
                                        error: err
                                    });
                                }
                            });
                        } else {
                            res.status(500).json({
                                error: err
                            });
                        }
                    });
                    res.status(404).json({
                        error: 'user undefined'
                    });
                }
            } else {
                res.status(500).json({
                    error: err
                });
            }
        });
    }
};