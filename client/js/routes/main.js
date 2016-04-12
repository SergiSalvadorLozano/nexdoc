'use strict';


angular.module('nexdocApp').config(function ($routeProvider,
                                             $locationProvider, Site) {


  _.each(Site.sections, function (sData, sName) {
    $routeProvider.when('/' + sName, {
      redirectTo: '/' + sName + '/' + sData.defaultSubsection
    });
    _.each(sData.subsections, function (ssData, ssName) {
      $routeProvider.when('/' + sName + '/' + ssName, {
        templateUrl: '/partials/' + sName + '/' + ssName
      });
    });
  });

  //$routeProvider
  //  // Home routes.
  //  .when('/home', {
  //    redirectTo: '/home/index'
  //  });
  //$routeProvider
  //  .when('/home/index', {
  //    templateUrl: 'partials/home/index'
  //  });

  // Account routes.

  // Other routes.
  $routeProvider
    .otherwise({
      redirectTo: '/home'
    });

  $locationProvider.html5Mode(true);
});

