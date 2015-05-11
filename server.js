'use strict';

//Setup server using express
var express = require('express');
var app = express();
var router = express.Router();

//Setup mongoDB
var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/dog_development_db');

db.on('error', function() {
	console.log('connection error');
});
db.once('open', function() {
	console.log('connection to Mongo DB successful');
});

//setup dogs routing
require('./routes/dogs_routes')(router);

//api router
app.use('/api', router);

//404 Catch All
app.use(function(req, res, next) {
	res.status(404).send('404 - page not found');
});

//Turn on server
app.listen(3000, function() {
	console.log('Server started');
});