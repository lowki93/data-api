var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy   ;
var User = require('../models/user');

passport.use(new BearerStrategy(
    function (token, done) {
        User.findOne({ token: token }, function (err, user) {
            /* istanbul ignore if */
            if (err) {
                return done(err);
            }
            /* istanbul ignore if */
            if (!user) {
                return done(null, false);
            }
            return done(null, user, { scope: 'all' });
        });
    }
));

exports.isAuthenticated = passport.authenticate('bearer', { session : false });