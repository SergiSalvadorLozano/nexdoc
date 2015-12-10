'use strict';


angular.module('nexdocApp').controller('SignInOutController',
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
          $location.path('/');
        })
        .finally(function () {
          _resetForm();
        });
    };


    // Signs out the current user.
    $scope.signOut = function () {
      $http.delete('/api/account/signOut')
        .finally(function () {
          $location.path('/');
        });
    };


    // ACTIONS

    _init();

  });
