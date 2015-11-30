'use strict';


angular.module('nexdocApp').controller('SignInController',
  function ($scope, $rootScope, $http, $location) {

    // HELPERS

    // Resets the sign-in form.
    var _resetForm = function () {
      $scope.signInForm = {
        email: '',
        password: '',
        remember: false
      };
    };


    // Initialises the controller.
    var _init = function () {
      _resetForm();
    };


    // FUNCTIONALITY

    // Attempts to sign in with the information in the sign-in form.
    $scope.signIn = function () {
      $http.post('/api/account/signIn', $scope.signInForm)
        .success(function () {
          $location.url('/');
        })
        .finally(function () {
          _resetForm();
        });
    };


    // ACTIONS

    _init();

  });
