'use strict';


angular.module('nexdocApp').config(function ($routeProvider) {

  $routeProvider
    // Home routes.
    .when('/home', {
      redirectTo: '/home/index'
    })
    .when('/home/index', {
      templateUrl: 'partials/home/index'
    })
    // Other routes.
    .otherwise({
      redirectTo: '/home'
    });
});

