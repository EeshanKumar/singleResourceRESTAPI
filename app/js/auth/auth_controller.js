'use strict';

module.exports = function(app) {
  app.controller('authController', ['$scope', '$location', 'auth_service', function($scope, $location, auth_service) {
    $scope.errors = [];

    $scope.authSubmit = function(user) {
      auth_service.login(user, function(err) {
        if(err) {
          console.log(err);
          return $scope.errors.push({msg: 'could not sign in user'});
        }
        $location.path('/dogs');
      });
    };

    $scope.createNew = function(user) {
      auth_service.create(user, function(err) {
        if (err) {
          console.log(err);
          return $scope.errors.push({msg: 'could not create user'});
        }
        $location.path('/dogs');
      });
    };

    $scope.redirectTo = function(link) {
      $location.path('/' + link);
    };
  }]);
};
