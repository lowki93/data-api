var curl = require('node-curl');
var User = require('../models/user');
var Day = require('../models/day');
var Experience = require('../models/experience');
var Data = require('../models/data');
var moment = require('moment');
var dateFormat = "YYYY-MM-DD";

module.exports = {

    saveData: function (req, res) {
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;
        var time = req.body.time;
        var currentDate = null;
        var atmosphere;
        var dayLength;

        User.findById(req.params.id).populate('currentData').exec(function (err, user) {
            if (!err) {
                if (user !== null) {
                    curl('http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude, function (err) {
                        if (!err) {
                            atmosphere = JSON.parse(this.body);
                            var data = new Data({
                                date: moment.unix(time).format('YYYY-MM-DD HH:mm:ss'),
                                atmosphere: atmosphere
                            });
                            if (user.currentData.day.length !== 0) {
                                dayLength = user.currentData.day.length - 1;
                                currentDate = user.currentData.day[dayLength].date;
                            }
                            var synchroTime = moment.unix(time).format(dateFormat);
                            if (user.currentData.day.length === 0 || synchroTime !== currentDate) {
                                console.log('new Day : ' + currentDate);
                                var day = new Day({
                                    date: synchroTime,
                                    data: data
                                });
                                user.currentData.day = user.currentData.day.concat(day);
                            } else {
                                console.log('update data for currentDay : ' + synchroTime);
                                var currentExperience = new Experience(user.currentData);
                                var currentDay = new Day(user.currentData.day[dayLength]);
                                currentDay.data = currentDay.data.concat(data);
                                currentExperience.day[dayLength] = currentDay;
                                user.currentData.day[dayLength] = currentDay;
                                user.currentData.markModified('day');
                            }
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