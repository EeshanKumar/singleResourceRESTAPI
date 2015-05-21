'use strict';

var eat = require('eat');
var User = require('../models/User');

function returnError(err, res) {
	console.log(err);
	return res.status(401).json({msg: 'not authorized'});
}

module.exports = function(secret) {
		return function(req, res, next) {
			var token = req.headers.eat || req.body.eat;
			if (!token) { return returnError('unauthorized no token in request', res); }

			eat.decode(token, secret, function(err, decoded) {
				if (err) { return returnError(err, res); }

				User.findOne({_id: decoded.id}, function(err, user) {
					if (err) { return returnError(err, res); }

					if (!user) {return returnError('no user found with that token', res); }

					req.user = user;
					next();
				});
			});
		};
};