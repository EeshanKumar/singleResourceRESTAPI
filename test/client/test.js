'use strict';

var expect = require('chai').expect;
var greet = require('../../app/js/greet');

describe('greet module', function() {
	it('should return a greeting', function() {
		expect(greet()).to.eql('This app lets you save dogs to a database');
	});
});