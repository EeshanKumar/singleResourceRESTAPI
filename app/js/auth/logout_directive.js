'use strict';

module.exports = function(app) {
  app.directive('logoutDirective', function() {
    return {
      restrict: 'AC',
      replace: true,
      scope: {},
      template: '<button data-ng-show="isSignedIn()" data-ng-click="logout()">Log Out</button>',
      controller: ['$scope', '$location', 'auth_service', function($scope, $location, auth) {
        $scope.isSignedIn = function() {
          return auth.isSignedIn();
        };
        $scope.logout = function() {
          auth.logout();
          $location.path('/login');
        };
      }]
    };
  });

}
