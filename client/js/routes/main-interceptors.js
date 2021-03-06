'use strict';


angular.module('nexdocApp').config(function ($httpProvider) {

  // Attach headers to every outgoing request.
  $httpProvider.interceptors.push(function ($rootScope) {
    return {
      request: function (req) {
        if ($rootScope.session && (!$rootScope.session.refreshExpiryDate ||
          new Date($rootScope.session.refreshExpiryDate) > new Date())) {
          if (!$rootScope.session.accessExpiryDate ||
            new Date($rootScope.session.accessExpiryDate) > new Date()) {
            req.headers['authentication'] = $rootScope.session.accessToken;
          }
          else {
            req.headers['authentication-refresh'] =
              $rootScope.session.refreshToken;
          }
        }
        return req;
      }
    }
  });

  // Refresh session (and related global variables) on every response.
  $httpProvider.interceptors.push(function ($rootScope, $cookies, $q, $window) {
    var _ = $window._;
    var _refreshSession = function (newSession) {
      var session = $cookies.getObject('session') || {};
      if (newSession && (!session.refreshExpiryDate ||
        new Date(newSession.refreshExpiryDate) >
        new Date(session.refreshExpiryDate))) {
        // Refresh session.
        _.extend(session, newSession);
        $cookies.putObject('session', session);
        $rootScope.session = session;
        $rootScope.user = session.User;
      }
      else if (newSession === null) {
        // Delete session.
        $cookies.remove('session');
        $rootScope.session = null;
        $rootScope.user = null;
      }
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
});

