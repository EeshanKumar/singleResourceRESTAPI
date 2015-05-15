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
		Dog.findAll()
			.then(function(dogs) {
				res.json(dogs);
			})
			.catch(function(err) {
				returnError(err, res);
			});
	});

	router.put('/dogs/:id', function(req, res) {
		Dog.find(req.params.id)
			.then(function(dog) {
				dog.updateAttributes(req.body)
					.then(function() {
						res.json({msg: 'dog updated'});
					})
					.catch(function(err) {
						returnError(err, res);
					});
			})
			.catch(function(err) {
				returnError(err, res);
			});
	});

	router.post('/dogs', function(req, res) {
		Dog.create(req.body)
			.then(function(dog) {
				res.json(dog);
			})
			.catch(function(err) {
				returnError(err, res);
			});
	});

	router.delete('/dogs/:id', function(req, res) {
		Dog.find(req.params.id)
			.then(function(dog) {
				dog.destroy()
					.then(function() {
						res.json({msg: 'dog deleted'});
					})
					.catch(function(err) {
						returnError(err, res);
					})
			})
			.catch(function(err) {
				returnError(err, res);
			});
	});
};