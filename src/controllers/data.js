var curl = require('node-curl');
var User = require('../models/user');
var Day = require('../models/day');
var Experience = require('../models/experience');
var Data = require('../models/data');
var apn = require('apn');

module.exports = {

    saveData: function (req, res) {
        var geoloc = req.body.geolo;
        var time = req.body.time;
        var currentDate = null;
        var dayLength;

        User.findById(req.params.id).populate('currentData').exec(function (err, user) {
            if (!err) {
                if (user !== null) {
                    console.log("start update");
                    var i = 0, arrayGeoloc = [];
                    for (i = 0; i < geoloc.length; i++) {
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
    test: function () {

        var options = {
            cert: __dirname + '/../../certificat/cert.pem',
            key:  __dirname + '/../../certificat/key.pem',
            production: (process.env.NODE_ENV === "prod")
        };
        var apnConnection = new apn.Connection(options);
        var myDevice = new apn.Device('<75fedbaa f43d810d e308bf55 1862c25c d464de93 27b2a763 5aab8b38 0ad1fdc0>');
        var note = new apn.Notification();

        note.badge = '';
        note.sound = "";
        note.alert = "";
        note.payload = {};
        note.contentAvailable = 1;

        apnConnection.pushNotification(note, myDevice);

        console.log("send silentNotification");

    }
};