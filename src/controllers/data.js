var curl = require('node-curl');
var User = require('../models/user');
var Day = require('../models/day');
var Experience = require('../models/experience');
var Data = require('../models/data');
var moment = require('moment');
var dateFormat = "YYYY-MM-DD";

module.exports = {

    saveData: function (req, res) {
        var geoloc = req.body.geolo;
        var time = req.body.time;
        var currentDate = null;
        var dayLength;

        User.findById(req.params.id).populate('currentData').exec(function (err, user) {
            if (!err) {
                if (user !== null) {
                    var i = 0, arrayGeoloc = [];
                    for (i = 0; i < geoloc.length; i++) {
                        (function (i) {
                            setTimeout(function () {
                                var curlRequest = curl.create();
                                curlRequest('http://api.openweathermap.org/data/2.5/weather?lat=' + geoloc[i].latitude + '&lon=' + geoloc[i].longitude, function (err) {
                                    if (!err) {
                                        var geolocTime = geoloc[i].time;
                                        var atmosphere = JSON.parse(this.body);
                                        atmosphere['time'] = moment.unix(geolocTime).format('YYYY-MM-DD HH:mm:ss');
                                        arrayGeoloc.push(atmosphere);
                                        curlRequest.close();
                                        if (geoloc.length === arrayGeoloc.length) {
                                            var data = new Data({
                                                date: moment.unix(time).format('YYYY-MM-DD HH:mm:ss'),
                                                atmosphere: arrayGeoloc
                                            });
                                            if (user.currentData.day.length !== 0) {
                                                dayLength = user.currentData.day.length - 1;
                                                currentDate = user.currentData.day[dayLength].date;
                                            }
                                            var synchroTime = moment.unix(time).format(dateFormat);
                                            if (user.currentData.day.length === 0 || synchroTime !== currentDate) {
                                                console.log('new Day : ' + synchroTime);
                                                var day = new Day({
                                                    date: synchroTime,
                                                    data: data
                                                });
                                                user.currentData.day = user.currentData.day.concat(day);
                                                user.currentData.markModified('day');
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
                                        }

                                    } else {
                                        console.log("error");
                                    }
                                });
                            }, 1000 * i);
                        }(i));
                    }
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