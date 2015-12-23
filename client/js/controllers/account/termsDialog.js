'use strict';


angular.module('nexdocApp').controller('TermsDialogController',
  function ($scope, $mdDialog) {
    $scope.answer = function (acceptTerms) {
      $mdDialog.hide(acceptTerms);
    };
  });