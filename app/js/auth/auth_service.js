'use strict';

module.exports = function(app) {
  app.factory('auth_service', ['$http', '$base64', '$cookies', function($http, $base64, $cookies) {
    return {
      //Login function that makes request to server and then sets user's cookies
      //Callback should be in node stadard callback(err, data) form
      login: function(user, callback) {
        //Encode based on standard header encoding
        var encoded = $base64.encode(user.email + ':' + user.password);
        $http.get('/api/sign_in', {
          headers: {'Authorization': 'Basic ' + encoded}
        })
          .success(function(data) {
            $cookies.eat = data.token;
            callback(null);
          })
          .error(function(err) {
            callback(err);
          });
      },

      //Logout that sets eat cookie to null
      logout: function() {
        $cookies.eat = '';
      },

      create: function(user, callback) {
        //Encode based on standard header encoding
        $http.post('/api/new_user', user)
          .success(function(data) {
            $cookies.eat = data.token;
            callback(null);
          })
          .error(function(err) {
            callback(err);
          });
      },

      //isSignedIn that returns if there is an eat token in the cookies
      isSignedIn: function() {
        return !!($cookies.eat && $cookies.eat.length);
      }
    }
  }]);
};
