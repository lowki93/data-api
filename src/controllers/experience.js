var User = require('../models/user');
var ExperienceModel = require('../models/experience');

module.exports = {

    create: function (req, res) {

        User.findById(req.params.id, function (err, user) {
            if (!err) {
                if (user !== null) {
                    var newExperience = {
                        title: '',
                        descriptionContent: '',
                        private: false
                    };
                    if (user.currentData === undefined) {
                        ExperienceModel.create(newExperience, function (err, experience) {

                            if (!err) {
                                user.currentData = experience;
                                user.save(function (err) {
                                    if (!err) {
                                        delete user.password;
                                        res.status(201).json({
                                            //user
                                            user: {
                                                _id: user.id,
                                                username: user.username,
                                                isActive: user.isActive,
                                                email: user.email,
                                                deviceToken: user.deviceToken,
                                                token: user.token,
                                                currentData: {
                                                    _id: experience.id,
                                                    private: experience.private
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
                        res.status(409).json({
                            error: 'Experience Already Existed'
                        });
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
    updateDate: function (req, res) {

        User.findById(req.params.id).populate('currentData').exec(function (err, user) {
            if (!err) {
                if (user !== null) {
                    console.log(req.body);
                    user.currentData.startDate = req.body.startDate;
                    user.currentData.endDate = req.body.endDate;
                    user.currentData.save(function (err) {
                        if (!err) {
                            user.isActive = true;
                            user.save(function (err) {
                                if (!err) {
                                    console.log('save');
                                    res.status(200).json({
                                        user: user
                                    });
                                } else {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                }
                            });
                        } else {
                            console.log(err);
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