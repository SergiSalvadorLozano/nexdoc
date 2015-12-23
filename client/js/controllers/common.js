'use strict';


angular.module('nexdocApp').controller('CommonController',
  function ($scope, $rootScope, $cookies, $location, $window, $translate, $http,
            Utils) {

    _ = $window._;

    // HELPERS

    var _init = function () {
      var session = $cookies.getObject('session');
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


    $scope.onLanguageSelected = function () {
      $location.search('lang', $rootScope.language.code);
    };


    // FUNCTIONALITY

    $rootScope.buildQuery = function (newPairs) {
      return '?' + _.map(_.extend(_.clone($location.search()), newPairs || {}),
          function (value, key) {
            return key + '=' + value;
          }).join('&');
    };


    // Signs out the current user.
    $scope.signOut = function () {
      $http.delete('/api/account/signOut')
        .finally(function () {
          $location.path('/');
        });
    };


    // ACTIONS

    _init();

  });
