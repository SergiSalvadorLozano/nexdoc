'use strict';


angular.module('nexdocApp').config(function ($httpProvider) {

  // Attach headers to every outgoing request.
  $httpProvider.interceptors.push(function ($rootScope) {
    return {
      request: function (req) {
        if ($rootScope.session && (!$rootScope.session.refresh_expiry_date ||
          new Date($rootScope.session.refresh_expiry_date) > new Date())) {
          if (!$rootScope.session.expiry_date ||
            new Date($rootScope.session.expiry_date) > new Date()) {
            req.headers['authentication'] = $rootScope.session.id_token;
          }
          else {
            req.headers['authentication-refresh'] =
              $rootScope.session.refresh_token;
          }
        }
        return req;
      }
    }
  });

  // Refresh session (and related global variables) on every response.
  $httpProvider.interceptors.push(function ($rootScope, $cookies, $q) {
    var _refreshSession = function (session) {
      if (session) {
        // Refresh session.
        $cookies.session = JSON.stringify(session);
        $rootScope.session = session;
        $rootScope.user = session.User;
        $rootScope.langCode = session.langCode;
      }
      else if (session === null) {
        // Delete session.
        delete $cookies.session;
        $rootScope.session = null;
        $rootScope.user = null;
        $rootScope.langCode = null;
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

