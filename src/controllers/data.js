var curl = require('node-curl');
var User = require('../models/user');
var Day = require('../models/day');
var Experience = require('../models/experience');
var Data = require('../models/data');
var apn = require('apn');

module.exports = {

    saveData: function (req, res) {
        var geoloc = req.body.geoloc;
        var time = req.body.time;
        var currentDate = null;
        var dayLength;

        User.findById(req.params.id).populate('currentData').exec(function (err, user) {
            if (!err) {
                if (user !== null) {
                    console.log("start update");
                    var arrayGeoloc = [];
                    if (geoloc.length !== 0) {
                        var i = 0;
                        for (i; i < geoloc.length; i++) {
                            (function (i) {
                                setTimeout(function () {
                                    var curlRequest = curl.create();
                                    //'http://api.openweathermap.org/data/2.5/weather?lat=' + geoloc[i].latitude + '&lon=' + geoloc[i].longitude
                                    var timeRequest = geoloc[i].time.replace(" ", "T");
                                    var url = 'https://api.forecast.io/forecast/4baa73d4868c17a6a2f4e1289590a7e0/' + geoloc[i].latitude + ',' + geoloc[i].longitude + ',' + timeRequest;
                                    curlRequest(url, function (err) {
                                        if (!err) {
                                            console.log("latitude : " + geoloc[i].latitude, 'longitude : ' + geoloc[i].longitude);
                                            var geolocTime = geoloc[i].time;
                                            var atmosphere;
                                            atmosphere = JSON.parse(this.body).currently;
                                            atmosphere['time'] = geolocTime;
                                            atmosphere['distance'] = geoloc[i].distance;
                                            atmosphere['longitude'] = geoloc[i].longitude;
                                            atmosphere['latitude'] = geoloc[i].latitude;
                                            atmosphere['address'] = geoloc[i].address;
                                            arrayGeoloc.push(atmosphere);
                                            curlRequest.close();
                                            if (geoloc.length === arrayGeoloc.length) {
                                                module.exports.updateData(req, res, time, user, dayLength, currentDate, arrayGeoloc);
                                            }

                                        } else {
                                            res.status(500).json({
                                                error: err
                                            });
                                        }
                                    });
                                }, 5000);
                            }(i));
                        }

                    } else {
                        module.exports.updateData(req, res, time, user, dayLength, currentDate, arrayGeoloc);
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
    },
    lauchNotification: function () {

        User.find({ deviceToken: { $exists: true } }, function (err, users) {
            var i = 0;
            var options = {
                cert: __dirname + '/../../certificat/cert.pem',
                key:  __dirname + '/../../certificat/key.pem',
                production: (process.env.NODE_ENV === "prod"),
                "batchFeedback": true,
                "interval": 300
            };
            var apnConnection = new apn.Connection(options);
            var myDevice,note;

            for (i; i < users.length; i++) {
                myDevice = new apn.Device(users[i].deviceToken);
                note = new apn.Notification();
                note.badge = '';
                note.sound = "";
                note.alert = "";
                note.payload = {};
                note.contentAvailable = 1;
                apnConnection.pushNotification(note, myDevice);
            }

            var feedback = new apn.Feedback(options);
            feedback.on("feedback", function (devices) {
                devices.forEach(function (item) {
                    console.log(item);
                    // Do something with item.device and item.time;
                });
            });
            console.log("send silentNotification");

        });
    },
    updateData: function (req, res, time, user, dayLength, currentDate, arrayGeoloc) {
        console.log('time : ' + time);
        var data = new Data({
            date: time,
            atmosphere: arrayGeoloc,
            deplacement: req.body.pedometer

        });
        if (user.currentData.day.length !== 0) {
            dayLength = user.currentData.day.length - 1;
            currentDate = user.currentData.day[dayLength].date;
        }
        var synchroTime = req.body.day;
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
                console.log('save');
                res.status(200).json({
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        deviceToken: user.deviceToken,
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
};