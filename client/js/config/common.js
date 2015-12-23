'use strict';


angular.module('nexdocApp')

  // CONFIGURATION CONSTANTS
  .constant('Config', {
    DEFAULT_LANGUAGE: 'en',
    SANITIZE_VALUE_STRATEGY: 'escape'
  })

  // PROVIDERS CONFIGURATION
  .config(function ($translateProvider, $mdThemingProvider, Config) {

    // ANGULAR TRANSLATE
    $translateProvider.preferredLanguage(Config.DEFAULT_LANGUAGE);
    $translateProvider.useSanitizeValueStrategy(Config.SANITIZE_VALUE_STRATEGY);

    // ANGULAR MATERIAL
    $mdThemingProvider.theme('default')
    .primaryPalette('indigo', {
      'default': '500',
      'hue-1': '50',
      'hue-2': '800'
    })
    .accentPalette('light-blue', {
      'default': 'A100'
    })

  });
