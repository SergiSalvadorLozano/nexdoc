'use strict';

(function () {

  angular.module('nexdocApp').config(function ($routeProvider, $httpProvider) {

    // INTERCEPTORS

    $httpProvider.interceptors.push(function ($rootScope, $location, $q,
      $cookies) {

      return {
        // For every outgoing request.
        request: function (req) {
          // Attach headers.
          //req.headers['session-id'] = $rootScope.sessionId;
          req.headers['auth-username'] = $rootScope.user.username;
          req.headers['auth-password'] = $rootScope.user.password;
          req.headers['lang-code'] = $rootScope.langCode;

          // Refresh session cookie for 1 hour.
          //if ($cookies.get('permanentSession') !== 'true')
          //$cookies.

          return req;
        },

        // For every response with an error code.
        responseError: function (res) {
          // Handle errors.
          if (res.status === 401)
            $location.path('/').search('');
          return $q.reject(res);
        }
      }
    });

    // ROUTING

    $routeProvider
      // Home routes.
      .when ('/home', {
        redirectTo: '/home/index'
      })
      .when ('/home/index', {
        templateUrl: 'partials/home/index'
      })
      // Other routes.
      .otherwise ({
        redirectTo: '/home'
      });
  });

})();
