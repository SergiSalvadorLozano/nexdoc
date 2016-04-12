'use strict';


angular.module('nexdocApp').factory('Utils', function ($window) {
  var Utils = {};

  var _ = $window._;

  // CONSTANTS


  Utils.characterGroups = {
    basicLetters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789'
  };


  // FUNCTIONALITY

  // If $mode == true, validates that the string $source exclusively contains
  // characters in the string $chars.
  // If $mode == false, validates that $source doesn't contain any of them.
  Utils.validateString = function (source, chars, mode) {
    var sourceArr = _.uniq(source.split(''))
      , charsArr = _.uniq(chars.split(''))
      ;

    if (mode && _.union(sourceArr, charsArr).length > charsArr.length ||
      !mode && _.intersection(sourceArr, charsArr).length > 0) {
      return false;
    }
    return true;
  };


  return Utils;
});
