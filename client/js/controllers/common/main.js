'use strict';


angular.module('nexdocApp').controller('MainController',
  function ($scope, $rootScope, $cookies, $location, $window, $translate, $http,
            Site) {

    _ = $window._;

    // HELPERS

    var _init = function () {
      var session = $cookies.getObject('session');
      $rootScope.session = session;
      $rootScope.user = session ? session.User : null;
      $rootScope.sections = Site.sections;
      $scope.languages = Site.languages;
    };


    // EVENTS AND WATCHERS

    $rootScope.$on('$routeChangeSuccess', function () {
      var pathParts = $location.path().split('/')
        , queryString = $location.search()
        , curLangCode = $rootScope.language ? $rootScope.language.code : null
        ;

      // Determine section and subsection.
      $rootScope.section = pathParts[1];
      $rootScope.subsection = pathParts[2];

      // Set site language.
      $rootScope.language =
        Site.languages[queryString.lang || curLangCode || 'en'];
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


    // Checks whether a section or subsection is to be shown in a menu.
    $scope.inMenu = function (sName, ssName) {
      var section = Site.sections[sName];
      // It is a subsection.
      if (ssName) {
        var subsection = section.subsections[ssName];
        if (subsection.inMenu && typeof subsection.inMenu === 'function'
          && subsection.inMenu($rootScope)) {
          return true;
        }
        else if (subsection.inMenu && typeof subsection.inMenu !== 'function') {
          return true;
        }
        return false;
      }
      // It is a section.
      if (section.inMenu && typeof section.inMenu === 'function'
        && section.inMenu($rootScope)) {
        return true;
      }
      else if (section.inMenu && typeof section.inMenu !== 'function') {
        return true;
      }
      return false;
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
