'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('en', {

    'LANG_NAME_ENGLISH': 'English',
    'LANG_NAME_SPANISH': 'Spanish',
    'LANG_NAME_CATALAN': 'Catalan',
    'LANG_NAME_FRENCH': 'French',
    'LANG_NAME_GERMAN': 'German',

    'ACCOUNT_SIGN_UP': 'Sign up',
    'ACCOUNT_SIGN_IN': 'Sign in',
    'ACCOUNT_SIGN_OUT': 'Sign out',

    'USER_NAME': 'Name',
    'USER_EMAIL': 'E-Mail',
    'USER_PASSWORD': 'Password',

  });
});
