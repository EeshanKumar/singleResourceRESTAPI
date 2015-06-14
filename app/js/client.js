'use strict';

require('angular/angular');

var dogsApp = angular.module('dogsApp', []);

require('./dogs/controllers/dogs_controller')(dogsApp);
