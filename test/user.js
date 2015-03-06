var app = require('../src/app').app;
var request = require('supertest');
var assert = require('chai').assert;

describe("USER API", function () {

    var user;
    describe("POST USER", function () {

        it("should create user", function (done) {
            request(app)
                .post('/api/user')
                .send({
                    email: 'email2',
                    password: 'password'
                })
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    user = res.body;

                    done();
                });
        });

        it("should create user with email is already used", function (done) {
            request(app)
                .post('/api/user')
                .send({
                    email: 'email2',
                    password: 'password'
                })
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

    });

    describe("GET USER", function () {

        it("should get user", function (done) {
            request(app)
                .get('/api/user/' + user.id)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.user.email, user.email, 'name is a string');
                    done();
                });
        });

        it("should get user not exist", function (done) {
            request(app)
                .get('/api/user/' + user.id + 1)
                .expect(404)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.user, undefined, 'user is null');
                    done();
                });
        });

    });

    describe("REMOVE USER", function () {

        it("should remove user", function (done) {
            request(app)
                .delete('/api/user/remove/' + user.id)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

    });

});