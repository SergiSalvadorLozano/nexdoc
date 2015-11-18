'use strict';


angular.module('nexdocApp').controller('GlobalController',
  function ($scope, $rootScope, $http, $cookies) {

    // HELPERS

    var _resetForms = function () {
      $scope.loginForm = {
        email: '',
        password: '',
        remember: false
      };
    };

    var _init = function () {
      var session = $cookies.session ? JSON.parse($cookies.session) : null;
      $rootScope.session = session;
      $rootScope.user = session ? session.User : null;
      $rootScope.langCode = session ? session.langCode : 'en';
      _resetForms();
    };


    // FUNCTIONALITY

    // Attempts to sign in with the information in the login form.
    $scope.signIn = function () {
      $http.post('/api/account/signIn', $scope.loginForm)
        .success(function (res) {
          // Redirect wherever.
        })
        .finally(function () {
          _resetForms();
        });
    };

    // Signs out the current user.
    $scope.signOut = function () {
      $http.post('/api/account/signOut', {});
    };


    // ACTIONS

    _init();

  });
