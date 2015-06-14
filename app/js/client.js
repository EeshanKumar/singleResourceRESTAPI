'use strict';

require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');

var dogsApp = angular.module('dogsApp', ['ngRoute', 'ngCookies', 'base64']);

//Services
require('./auth/auth_service')(dogsApp);

//Controllers
require('./auth/auth_controller')(dogsApp);
require('./dogs/dogs_controller')(dogsApp);

//Directives
