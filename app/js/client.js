'use strict';

var greet = require('./greet');
document.write(greet());

require('angular/angular');

var dogsApp = angular.module('dogsApp', []);

require('./dogs/controllers/dogs_controller')(dogsApp);