'use strict';

var bodyparser = require('body-parser');
var User = require('../models/User');

function returnError(err, res) {
	console.log(err);
	return res.status(500).json({msg: 'internal server error'});
}

module.exports = function(router, passport) {

	router.use(bodyparser.json());

	router.post('/new_user', function(req, res) {
		var user = new User();
		user.basic.email = req.body.email;

		if (req.body.password === undefined) { return returnError('No password', res); }

		user.createHash(req.body.password, function(err, hash) {
			if (err) { return returnError(err, res); }
			
			user.basic.password = hash;
			
			user.save(function(err, data) {
				if (err) { return returnError(err, res); }

				user.generateToken(process.env.APP_SECRET, function(err, token) {
					if (err) { return returnError(err, res); }

					res.json({token: token});
				});
			});
		});
	});

	router.get('/sign_in', passport.authenticate('basic', {session: false}), function(req, res) {
		req.user.generateToken(process.env.APP_SECRET, function(err, token) {
			if (err) { return returnError(err, res); }
			res.json({token: token});
		});
	});
};