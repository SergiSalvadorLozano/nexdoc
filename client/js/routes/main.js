'use strict';


angular.module('nexdocApp').config(function ($routeProvider,
                                             $locationProvider) {

  $routeProvider
    // Home routes.
    .when('/home', {
      redirectTo: '/home/index'
    })
    .when('/home/index', {
      templateUrl: 'partials/home/index'
    })

    // Account routes.
    .when('/signUp', {
      templateUrl: 'partials/account/signUp',
      controller: 'SignUpController'
    })

    // Other routes.
    .otherwise({
      redirectTo: '/home'
    });

  $locationProvider.html5Mode(true);
});

