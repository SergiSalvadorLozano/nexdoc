'use strict';


angular.module('nexdocApp').config(function ($routeProvider, $httpProvider) {

  // INTERCEPTORS

  // Attach headers to every outgoing request.
  $httpProvider.interceptors.push(function ($rootScope) {
    return {
      request: function (req) {
        // Attach headers.
        if ($rootScope.session) {
          req.headers['authentication'] = $rootScope.session.id_token;
        }
        return req;
      }
    }
  });

  // Refresh session (and related global variables) on every response.
  $httpProvider.interceptors.push(function ($rootScope, $q) {
    var _refreshSession = function (session) {
      $rootScope.session = session;
      $rootScope.user = session ? session.User : null;
      $rootScope.langCode = session ? session.langCode : 'en';
    };

    return {
      response: function (res) {
        _refreshSession(res.data.session);
        return res;
      },
      responseError: function (res) {
        _refreshSession(res.data.session);
        return $q.reject(res);
      }
    }
  });


  // ROUTING

  $routeProvider
    // Home routes.
    .when('/home', {
      redirectTo: '/home/index'
    })
    .when('/home/index', {
      templateUrl: 'partials/home/index'
    })
    // Other routes.
    .otherwise({
      redirectTo: '/home'
    });
});

