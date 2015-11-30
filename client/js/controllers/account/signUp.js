'use strict';


angular.module('nexdocApp').controller('SignUpController',
  function ($scope, $rootScope, $http, $location) {

    // HELPERS

    // Resets the sign-in form.
    var _resetForm = function () {
      $scope.signUpForm = {
        name: '',
        email: '',
        password: ''
      };
    };


    // Initialises the controller.
    var _init = function () {
      _resetForm();
    };


    // FUNCTIONALITY

    // Attempts to sign in with the information in the sign-in form.
    $scope.signUp = function () {
      $http.post('/api/account/signUp', {user: $scope.signUpForm})
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
