'use strict';


angular.module('nexdocApp')
  .directive('ndSignIn', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'partials/account/signIn',
      controller: 'SignInController'
    };
  });