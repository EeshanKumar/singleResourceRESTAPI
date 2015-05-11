'use strict';

var mongoose = require('mongoose');

var dogSchema = mongoose.Schema({
	name: String,
	breed: String
});

module.exports = mongoose.model('Dog', dogSchema);