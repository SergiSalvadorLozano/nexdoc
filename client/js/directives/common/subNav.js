'use strict';


angular.module('nexdocApp')
  .directive('ndSubNav', function () {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'partials/common/subNav',
      controller: 'SubNavController',
      css: '/css/common/subNav.css'
    };
  });
