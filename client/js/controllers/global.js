'use strict';


angular.module('nexdocApp').controller('GlobalController',
  function ($scope, $rootScope, $http, $cookies, $location) {

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
      $rootScope.languageCode = session ? session.languageCode : 'en';
    };


    // FUNCTIONALITY

    // Signs out the current user.
    $scope.signOut = function () {
      $http.delete('/api/account/signOut')
        .finally(function () {
          $location.url('/');
        });
    };


    // ACTIONS

    _init();

  });
