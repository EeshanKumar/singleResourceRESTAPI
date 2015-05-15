'use strict';

//Setup server using express
var express = require('express');
var app = express();
var router = express.Router();

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