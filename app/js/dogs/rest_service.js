'use strict';

module.exports = function(app) {
  var handleError = function(callback) {
    return function(data) {
      console.log(data);
      callback(data);
    }
  };

  var handleSuccess = function(callback) {
    return function(data) {
      callback(null, data);
    }
  };

  app.factory('RESTResource', ['$http', '$cookies', function($http, $cookies) {
    return function(resource) {
      resource = '/api/' + resource;
      $http.defaults.headers.common.eat = $cookies.eat;
      return {
        get: function(callback) {
          $http.get(resource)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },
        post: function(resourceData, callback) {
          $http.post(resource, resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },
        put: function(resourceData , callback) {
          $http.put(resource + '/' + resourceData._id, resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },
        delete: function(resourceData, callback) {
          $http.delete(resource + '/' + resourceData._id)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        }
      };
    };
  }]);
};
