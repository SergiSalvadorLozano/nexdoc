'use strict';


angular.module('nexdocApp')
  .directive('ndSignInUp', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'partials/account/signInUp',
      controller: 'SignInUpController',
      css: '/css/account/signInUp.css'
    };
  });