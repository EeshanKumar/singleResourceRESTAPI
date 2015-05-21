'use strict';

var Basic = require('passport-http').BasicStrategy;
var User = require('../models/User');

module.exports = function(passport) {
	passport.use('basic', new Basic(
		function(email, password, done) {
			User.findOne({'basic.email': email}, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done('no such user'); }
				user.verifyPassword(password, function(err, data) {
					if (err) { return done('database error'); }
					if (!data) { return done('wrong password'); }
					return done(null, user);
				});
			});
		}
	));
};