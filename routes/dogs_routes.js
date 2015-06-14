'use strict';

var bodyparser = require('body-parser');
var Dog = require('../models/Dog');
var eatAuth = require('../lib/eat_auth');

function returnError(err, res) {
	console.log(err);
	return res.status(500).json({msg: "internal server error"});
}

module.exports = function(router) {

	router.use(bodyparser.json());

	router.get('/dogs', eatAuth, function(req, res) {
		Dog.find({}, function(err, data) {
			if (err) { return returnError(err, res); }
			res.json(data);
		});
	});

	router.put('/dogs/:id', eatAuth, function(req, res) {
		var updatedDog = req.body;
		delete updatedDog._id;
		Dog.update({'_id': req.params.id}, updatedDog, function(err, data){
			if (err) { return returnError(err, res); }
			res.json({msg: 'dog updated'});
		});
	});

	router.post('/dogs', eatAuth, function(req, res) {
		var newDog = new Dog(req.body);
		newDog.save(function(err, data) {
			if (err) { return returnError(err, res); }
			res.json(data);
		});
	});

	router.delete('/dogs/:id', eatAuth, function(req, res) {
		Dog.remove({'_id': req.params.id}, function(err, data) {
			if (err) { return returnError(err, res); }
			res.json({msg: 'dog deleted'});
		});
	});
};
