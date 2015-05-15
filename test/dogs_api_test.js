'use strict';

process.env.POSTGRES_DBNAME = 'dogs_test';
process.env.POSTGRES_DBUSER = 'dogs_test';
process.env.POSTGRES_DBPASS = 'foobar123';

require('../server.js');

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

var Dog = require('../models/Dog');


describe('dogs REST API', function() {

	// Drop test database when done with all testing
	after(function(done) {
		Dog.destroy({ truncate: true })
			.then(function() { done(); })
			.catch(function(err) { throw err; });
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
					expect(res.body).to.have.property('id');
					done();
				});
		});
	});

	describe('tests that need existing dogs in the database', function() {
		var testDog;

		beforeEach(function(done) {
			Dog.create({name: 'Buster', breed: 'dummy'})
				.then(function(dog) {
					testDog = dog;
					done();
				})
				.catch(function(err) {throw err;});
		});

		it('should update a dog on a PUT request', function(done) {
			chai.request('localhost:3000')
				.put('/api/dogs/' + testDog.id)
				.send({name: 'Buster 4.0'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('dog updated');
					done();
				});
		});

		it('should delete a dog on a DEL request', function(done) {
			chai.request('localhost:3000')
				.del('/api/dogs/' + testDog.id)
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('dog deleted');
					done();
				});
		});
	});
});