'use strict';

module.exports= function(app) {
  app.directive('myLoginFormDirective', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        submit: '&',
        user: '=',
        submitButtonText: '@'
      },
      transclude: true,
      templateUrl: '/templates/login_form_directive_template.html'
    };
  });
};
