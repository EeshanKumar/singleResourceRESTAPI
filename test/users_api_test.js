'use strict';

process.env.MONGODB_URI = 'mongodb://localhost/dogs_test';

require('../server.js');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

var mongoose = require('mongoose');
var User = require('../models/User');

describe('users REST api', function() {
	// Drop test database when done with all testing
	after(function(done) {
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	describe('tests not requiring existing users', function() {
		it('should create a new user', function(done) {
			chai.request('localhost:3000')
				.post('/api/new_user')
				.send({email: 'testPerson@example.com', password: 'password123'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body).to.have.property('token');
					done();
				});
		});

		it('should fail to create user with no email', function(done) {
			chai.request('localhost:3000')
				.post('/api/new_user')
				.send({password: 'password123'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('internal server error');
					done();
				});
		});

		it('should fail to create user with no password', function(done) {
			chai.request('localhost:3000')
				.post('/api/new_user')
				.send({email: 'test1234@example.com'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('internal server error');
					done();
				});
		});

		it('should fail to sign in a non-exsting user', function(done) {
			chai.request('localhost:3000')
				.get('/api/sign_in')
	  		.auth('me@imaginary.com', 'password123')
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body).to.eql({});
					done();
				});
		});
	});

	describe('tests that require an existing user', function() {
		before(function(done) {
			chai.request('localhost:3000')
				.post('/api/new_user')
				.send({email: 'existing@example.com', password: 'password123'})
				.end(function(err, res) {
					done();
				});
		});

		it('should fail to create a user with an existing email', function(done) {
			chai.request('localhost:3000')
				.post('/api/new_user')
				.send({email: 'existing@example.com', password: 'password123'})
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body.msg).to.eql('internal server error');
					done();
				});
		});

		it('should sign in an exsting user', function(done) {
			chai.request('localhost:3000')
				.get('/api/sign_in')
	  		.auth('existing@example.com', 'password123')
				.end(function(err, res) {
					expect(err).to.eql(null);
					expect(res.body).to.have.property('token');
					done();
				});
		});
	});
});