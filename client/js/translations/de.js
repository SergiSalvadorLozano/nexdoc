'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('de', {

    'LANG_NAME_ENGLISH': 'Englisch',
    'LANG_NAME_SPANISH': 'Spanisch',
    'LANG_NAME_CATALAN': 'Katalanisch',
    'LANG_NAME_FRENCH': 'Französisch',
    'LANG_NAME_GERMAN': 'Deutsch',

    'ACCOUNT_SIGN_UP': 'Sich einschreiben',
    'ACCOUNT_SIGN_IN': 'Anmelden',
    'ACCOUNT_SIGN_OUT': 'Abmelden',

    'USER_NAME': 'Name',
    'USER_EMAIL': 'E-Mail',
    'USER_PASSWORD': 'Passwort',

  });
});
