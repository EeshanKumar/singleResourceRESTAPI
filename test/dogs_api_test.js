'use strict';

// process.env.MONGODB_URI = 'mongodb://localhost/dogs_test';
require('../server.js');

var mocha = require('mocha');
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var mongoose = require('mongoose');
var Dog = require('../models/Dog');

describe('dogs REST API', function() {

	//Drop test database when done with all testing
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	describe('tests that don\'t existing dogs in the database', function() {	
		it('should get an array of dogs on a GET request', function(done) {
			chai.request('localhost:3000')
				.get('/api/dogs')
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(Array.isArray(res.body)).to.eql(true);
					done();
				});
		});

		it('should save a dog on a POST request', function(done) {
			chai.request('localhost:3000')
				.post('/api/dogs')
				.send({name: 'Lassie', breed: 'golden retriver'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.name).to.eql('Lassie');
					expect(res.body.breed).to.eql('golden retriver');
					expect(res.body).to.have.property('_id');
					done();
				});
		});

		it('should have 500 server error on invalid data input', function(done) {
			chai.request('localhost:3000')
				.post('/api/dogs')
				.send({name: 'Brent'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('internal server error');
					done();
				});
		});
	});

	describe('tests that need existing dogs in the database', function() {
		beforeEach(function(done) {
			var testDog = new Dog({name: 'Buster', breed: 'dummy'});
			testDog.save(function(err, data) {
				if (err) {throw err;}
				this.testDog = data;
				done();
			}.bind(this));
		});

		it('should update a dog on a PUT request', function(done) {
			chai.request('localhost:3000')
				.put('/api/dogs/' + this.testDog._id)
				.send({name: 'Buster 4.0'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('dog updated');
					done();
				});
		});

		it('should delete a dog on a DEL request', function(done) {
			chai.request('localhost:3000')
				.del('/api/dogs/' + this.testDog._id)
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('dog deleted');
					done();
				});
		});
	});
});