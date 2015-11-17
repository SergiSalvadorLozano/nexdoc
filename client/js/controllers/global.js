'use strict';


angular.module('nexdocApp').controller('GlobalController',
  function ($scope, $rootScope, $http, $window) {

    // HELPERS

    var _resetForms = function () {
      $scope.loginForm = {
        email: '',
        password: ''
      };
    };

    var _init = function () {
      $rootScope.session = null;
      $rootScope.user = null;
      $rootScope.langCode = 'en';
      _resetForms();
    };


    // FUNCTIONALITY

    // Attempts to sign in with the information in the login form.
    $scope.signIn = function () {
      //console.log('a');
      $http.post('/api/account/signIn', {
        email: $scope.loginForm.email,
        password: $scope.loginForm.password
      })
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
