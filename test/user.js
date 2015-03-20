var app = require('../src/app').app;
var request = require('supertest');
var assert = require('chai').assert;

describe("USER API", function () {

    var user;
    describe("POST USER", function () {

        it("should create user", function (done) {
            request(app)
                .post('/api/user/create')
                .send({
                    email: 'email@gmail.com',
                    password: 'password'
                })
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    user = res.body.user;

                    done();
                });
        });

        it("should create user with email is already used", function (done) {
            request(app)
                .post('/api/user/create')
                .send({
                    email: 'email@gmail.com',
                    password: 'password'
                })
                .expect(409)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

    });

    describe("LOGIN USER", function () {

        it("should login user not exist", function (done) {
            request(app)
                .post('/api/user/login')
                .send({
                    email: 'email2@gmail.com',
                    password: 'password'
                })
                .expect(404)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it("should login with wrong password", function (done) {
            request(app)
                .post('/api/user/login')
                .send({
                    email: 'email@gmail.com',
                    password: 'password2'
                })
                .expect(409)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it("should login with good credential", function (done) {
            request(app)
                .post('/api/user/login')
                .send({
                    email: 'email@gmail.com',
                    password: 'password'
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.user.email, 'email@gmail.com', 'email is a string');
                    done();
                });
        });

    });

    describe("GET USER", function () {

        it("should get user without access_token", function (done) {
            request(app)
                .get('/api/user/profile/' + user.id)
                .expect(401)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it("should get user not exist", function (done) {
            request(app)
                .get('/api/user/profile/' + '1234rfsgnfgbfwvhbhbwbwhw' + '?access_token=' + user.token)
                .expect(404)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it("should get user ", function (done) {
            request(app)
                .get('/api/user/profile/' + user.id + '?access_token=' + user.token)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.user.email, user.email, 'name is a string');
                    done();
                });
        });

    });

    describe("REMOVE USER", function () {

        it("should remove user without token", function (done) {
            request(app)
                .delete('/api/user/remove/' + user.id)
                .expect(401)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it("should remove user not exist", function (done) {
            request(app)
                .delete('/api/user/remove/' + '1234rfsgnfgbfwvhbhbwbwhw'  + '?access_token=' + user.token)
                .expect(404)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it("should remove user", function (done) {
            request(app)
                .delete('/api/user/remove/' + user.id  + '?access_token=' + user.token)
                .expect(200)
                .end(function (err) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

    });

});