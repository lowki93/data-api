var curl = require('node-curl');
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
                                date: strftime('%F %T'),
                                atmosphere: atmosphere
                            });
                            user.currentData.data = data;//user.currentData.data.concat(data);
                            user.currentData.save(function (err) {
                                if (!err) {
                                    res.status(200).json({
                                        user: {
                                            id: user.id,
                                            email: user.email,
                                            token: user.token,
                                            currentData: {
                                                id: user.currentData.id,
                                                title: user.currentData.title,
                                                descriptionContent:  user.currentData.descriptionContent,
                                                private: user.currentData.private,
                                                data: user.currentData.data
                                            }
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
                } else {
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