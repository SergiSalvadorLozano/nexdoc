'use strict';


angular.module('nexdocApp').factory('Utils', function () {
  var Utils = {};

  // CONSTANTS

  Utils.siteLanguages = {
    'en': {
      id: 1,
      code: 'en',
      name: 'LANG_NAME_ENGLISH'
    },
    'es': {
      id: 2,
      code: 'es',
      name: 'LANG_NAME_SPANISH'
    },
    'cat': {
      id: 3,
      code: 'cat',
      name: 'LANG_NAME_CATALAN'
    },
    'fr': {
      id: 4,
      code: 'fr',
      name: 'LANG_NAME_FRENCH'
    },
    'de': {
      id: 5,
      code: 'de',
      name: 'LANG_NAME_GERMAN'
    }
  };


  return Utils;
});
