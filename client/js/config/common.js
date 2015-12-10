'use strict';


angular.module('nexdocApp')

  // CONFIGURATION CONSTANTS
  .constant('Config', {
    DEFAULT_LANGUAGE: 'en',
    SANITIZE_VALUE_STRATEGY: 'escape'
  })

  // PROVIDERS CONFIGURATION
  .config(function ($translateProvider, Config) {

    // ANGULAR TRANSLATE
    $translateProvider.preferredLanguage(Config.DEFAULT_LANGUAGE);
    $translateProvider.useSanitizeValueStrategy(Config.SANITIZE_VALUE_STRATEGY);

  });
