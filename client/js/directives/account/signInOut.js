'use strict';


angular.module('nexdocApp')
  .directive('ndSignInOut', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'partials/account/signInOut',
      controller: 'SignInOutController'
    };
  });