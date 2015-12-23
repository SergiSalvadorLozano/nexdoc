'use strict';


angular.module('nexdocApp').controller('SignInUpController',
  function ($scope, $rootScope, $http, $location, $mdDialog) {

    // HELPERS

    // Resets the sign-in form.
    var _resetForms = function () {
      $scope.signInForm = {
        email: '',
        password: '',
        remember: false
      };
      $scope.signUpForm = {
        name: '',
        email: '',
        emailRepeat: '',
        password: '',
        passwordRepeat: '',
        acceptTerms: false
      };
    };


    // Initialises the controller.
    var _init = function () {
      $scope.showSignUp = false;
      _resetForms();
    };


    // FUNCTIONALITY

    $scope.signInEnabled = function () {
      return $scope.signInForm.email.length > 0 &&
        $scope.signInForm.password.length > 0;
    };


    $scope.signUpEnabled = function () {
      return $scope.signUpForm.email.length > 0 &&
        $scope.signUpForm.emailRepeat.length > 0 &&
        $scope.signUpForm.password.length > 0 &&
        $scope.signUpForm.passwordRepeat.length > 0 &&
        $scope.signUpForm.acceptTerms;
    };


    // Toggles the value of "remembember session" on sign in.
    $scope.toggleRemember = function () {
      $scope.signInForm.remember = !$scope.signInForm.remember;
    };


    // Shows the "terms and conditions" dialog.
    $scope.showTerms = function (event) {
      $mdDialog.show({
        controller: 'TermsDialogController',
        templateUrl: 'partials/account/termsDialog',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true
      })
        .then(function (answer) {
          $scope.signUpForm.acceptTerms = answer;
        });
    };


    // Switches between sign-in and sign-up forms.
    $scope.switchForm = function () {
      $scope.showSignUp = !$scope.showSignUp;
    };


    // Attempts to sign in with the information in the sign-in form.
    $scope.signIn = function () {
      $http.post('/api/account/signIn', $scope.signInForm)
        .success(function () {
          $location.path('/');
        })
        .finally(function () {
          _resetForms();
        });
    };


    $scope.signUp = function () {
      if ($scope.signUpForm.email !== $scope.signUpForm.emailRepeat) {
        // Show appropriate notification.
        console.log('Email fields don\'t coincide.');
        return;
      }
      if ($scope.signUpForm.password !== $scope.signUpForm.passwordRepeat) {
        // Show appropriate notification.
        console.log('Password fields don\'t coincide.');
        return;
      }

      $http.post('/api/account/signUp', {
        name: $scope.signUpForm.name,
        email: $scope.signUpForm.email,
        password: $scope.signUpForm.password
      })
        .success(function () {
          $location.path('/');
        })
        .finally(function () {
          _resetForms();
        });
    };


    // ACTIONS

    _init();

  });
