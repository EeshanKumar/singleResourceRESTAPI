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
require('./auth/logout_directive')(dogsApp);

dogsApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  var $cookies;
  angular.injector(['ngCookies']).invoke(function(_$cookies_) {
    $cookies = _$cookies_;
  });
  $routeProvider
    .when('/dogs', {
      templateUrl: 'templates/notes_view.html'
    })
    .when('/login', {
      templateUrl: 'templates/login_view.html'
    })
    .when('/create_new_user', {
      templateUrl: 'templates/create_new_user_view.html'
    })
    .otherwise({
      redirectTo: function() {
        if (!!($cookies.eat && $cookies.eat.length)) {
          return '/dogs';
        }
        return '/login';
      }
    });
}]);
