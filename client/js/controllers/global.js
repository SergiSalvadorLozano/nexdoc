'use strict';


angular.module('nexdocApp').controller('GlobalController',
  function ($scope, $rootScope, $cookies, $location, $window, $translate,
            Utils) {

    _ = $window._;

    // HELPERS

    var _init = function () {
      var session = $cookies.session ? JSON.parse($cookies.session) : null;
      $rootScope.session = session;
      $rootScope.user = session ? session.User : null;

      $scope.languages = Utils.siteLanguages;
    };


    // EVENTS AND WATCHERS

    $rootScope.$on('$routeChangeSuccess', function () {
      var queryString = $location.search()
        , curLangCode = $rootScope.language ? $rootScope.language.code : null
        ;

      // Set site language.
      $rootScope.language =
        Utils.siteLanguages[queryString.lang || curLangCode || 'en'];
      $translate.use($rootScope.language.code);
      $location.search('lang', $rootScope.language.code);
    });


    // FUNCTIONALITY

    $rootScope.buildLink = function (path, search) {
      return path + '?' +
        _.map(_.extend(_.clone($location.search()), search || {}),
          function (value, key) {
            return key + '=' + value;
          }).join('&');
    };


    // ACTIONS

    _init();

  });
