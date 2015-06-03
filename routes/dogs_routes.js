'use strict';

var bodyparser = require('body-parser');
var Dog = require('../models/Dog');

function returnError(err, res) {
	console.log(err);
	return res.status(500).json({msg: "internal server error"});
}

module.exports = function(router) {

	router.use(bodyparser.json());

	router.get('/dogs', function(req, res) {
		Dog.find({}, function(err, data) {
			if (err) { return returnError(err, res); }
			setTimeout(function() {res.json(data);}, 1000);
		});
	});

	router.put('/dogs/:id', function(req, res) {
		var updatedDog = req.body;
		delete updatedDog._id;
		Dog.update({'_id': req.params.id}, updatedDog, function(err, data){
			if (err) { return returnError(err, res); }
			setTimeout(function() {res.json({msg: 'dog updated'});}, 1000);
		});
	});

	router.post('/dogs', function(req, res) {
		var newDog = new Dog(req.body);
		newDog.save(function(err, data) {
			if (err) { return returnError(err, res); }
			setTimeout(function() {res.json(data);}, 1000)
		});
	});

	router.delete('/dogs/:id', function(req, res) {
		Dog.remove({'_id': req.params.id}, function(err, data) {
			if (err) { return returnError(err, res); }
			setTimeout(function() {res.json({msg: 'dog deleted'});}, 1000);
		});
	});
};