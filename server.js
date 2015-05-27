'use strict';

//Setup server using express
var express = require('express');
var app = express();
var dogsRouter = express.Router();
var usersRouter = express.Router();

process.env.APP_SECRET = process.env.APP_SECRET || 'changethischangethischangethis';

//Setup mongoDB
var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/dog_development_db');

db.on('error', function() {
	console.log('Mongo DB connection error');
});
db.once('open', function() {
	console.log('connection to Mongo DB successful');
});

//Setup passport
var passport = require('passport');
app.use(passport.initialize());
require('./lib/passport_strat')(passport);

//Setup Client Side
app.use(express.static('./build'));

//setup api routing
require('./routes/dogs_routes')(dogsRouter);
app.use('/api', dogsRouter);
require('./routes/users_routes')(usersRouter, passport);
app.use('/api', usersRouter);

//404 Catch All
app.use(function(req, res, next) {
	res.status(404).send('404 - page not found');
});

//Turn on server
app.listen(3000, function() {
	console.log('Server started');
});