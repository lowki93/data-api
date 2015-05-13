var fs = require('fs');
var unzip = require('unzip');
var fsExtra = require('fs-extra');
var User = require('../models/user');
var Day = require('../models/day');
var Experience = require('../models/experience');
var Data = require('../models/data');
var curl = require('node-curl');

module.exports = {

    upload: function (req, res) {
        console.log("start upload");
        User.findById(req.params.id).populate('currentData').exec(function (err, user) {
            if (!err) {
                if (user !== null) {
                    if (req.files.zip) {
                        fs.readFile(req.files.zip.path, function (err, data) {
                            if (!err) {
                                var name = req.files.zip.name;
                                //var newPath = "./uploads/" + name;
                                //var unzipPath = "./uploads/" + name.split('.')[0];
                                var newPath = "/home/lowki/instances/data-api/uploads/" + name;
                                var unzipPath = "/home/lowki/instances/data-api/uploads/" + name.split('.')[0];
                                var token = req.params.id;
                                var urlSite = req.get('host');
                                fs.writeFile(newPath, data, function (err) {
                                    if (err) {
                                        res.status(500).json({
                                            'error': err
                                        });
                                    } else {
                                        fs.createReadStream(newPath).pipe(unzip.Extract({path: unzipPath}));
                                        setTimeout(function () {
                                            fs.readdir(unzipPath, function (err, files) {
                                                if (!err) {
                                                    console.log(files);
                                                    content = files;
                                                    var url = '';
                                                    var i;
                                                    for (i = 0; i < files.length; i++) {
                                                        url += 'urls=http://' + urlSite + '/media/' + name.split('.')[0] + '/' + files[i];
                                                        if ((i + 1) !== files.length) {
                                                            url += '&';
                                                        }
                                                    }
                                                    var curlRequest = curl.create();
                                                    //url = "urls=http://cdn-parismatch.ladmedia.fr/var/news/storage/images/paris-match/people/sport/teddy-riner-au-musee-grevin-183480/2122502-1-fre-FR/Teddy-Riner-au-musee-Grevin.jpg&urls=http://www.eklecty-city.fr/wp-content/uploads/2014/11/The-Fast-and-The-Furious-2001-Movie-Picture-02.jpg";
                                                    curlRequest('http://api.skybiometry.com/fc/faces/detect.json?api_key=72ffa0b78e304ce78aefadcbae99ccaf&api_secret=3c5d9728327d40e18053d08b6ff37536&' + url + '&attributes=all', function (err) {
                                                        if (!err) {
                                                            fs.unlink(newPath);
                                                            if (fsExtra.existsSync(unzipPath)) {
                                                                fsExtra.readdirSync(unzipPath).forEach(function (file, index) {
                                                                    var curPath = unzipPath + "/" + file;
                                                                    if (fsExtra.lstatSync(curPath).isDirectory()) { // recurse
                                                                        deleteFolderRecursive(curPath);
                                                                    } else { // delete file
                                                                        fsExtra.unlinkSync(curPath);
                                                                    }
                                                                });
                                                                fs.rmdir(unzipPath);
                                                            }
                                                            var response = this.body;
                                                            var newReponse = response.replace(/null/gi, "\"\"");
                                                            var photo = JSON.parse(newReponse);
                                                            var photos = [];
                                                            for (var i = 0; i < photo["photos"].length; i++) {
                                                                var persons = [];
                                                                for (var j = 0; j < photo["photos"][i]["tags"].length; j++) {
                                                                    persons = persons.concat(photo["photos"][i]["tags"][j]["attributes"])
                                                                }
                                                                photos.push(persons);
                                                            }
                                                            var currentDay = new Day(user.currentData.day[user.currentData.day.length - 1]);
                                                            var currentData = new Data(currentDay.data[currentDay.data.length - 1]);
                                                            currentData.photos = photos;
                                                            currentDay.data[currentDay.data.length - 1] = currentData;
                                                            user.currentData.day[user.currentData.day.length - 1] = currentDay;
                                                            user.currentData.markModified('day');
                                                            user.currentData.save(function (err) {
                                                                console.log("save");
                                                                if (!err) {
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
                                                    });
                                                } else {
                                                    res.status(500).json({
                                                        'error': err
                                                    });
                                                }
                                            });
                                        }, 10000);
                                    }
                                });
                            } else {
                                res.status(500).json({
                                    'error': err
                                });
                            }
                        });
                    } else {
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
                    }
                } else {
                    res.status(404).json({
                        'error': 'User not found'
                    });
                }
            } else {
                res.status(500).json({
                    'error': err
                });
            }
        });
    }
};