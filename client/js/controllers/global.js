'use strict';

(function () {

  angular.module('nexdocApp').controller('GlobalController',
    function ($scope, $rootScope, $http, $window) {

    // INITIALISATION

    $scope.init = function () {
      $rootScope.user = {};
      $rootScope.langCode = 'en';
      $rootScope.isLoggedIn = false;
      $scope.loginForm = {
        username: '',
        password: ''
      };
    };

    $scope.init();

    // FUNCTIONALITY

    // Attempts to sign in with the information in the login form.
    $scope.signIn = function () {
      $http.post('/api/login', {
        username: $scope.loginForm.username,
        password: $scope.loginForm.password
      })
        .success(function (res) {
          $rootScope.user = {
            username: $scope.loginForm.username,
            password: $scope.loginForm.password
          };
          $rootScope.isLoggedIn = true;
        })
        .error(function (err) {
          $scope.init();
          console.log(err);
        })
    };

    // Signs out the current user.
    $scope.signOut = function () {
      $window.location.reload();
    };
  });

})();