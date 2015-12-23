'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('de', {

    'ACTION_ACCEPT': 'Akzeptieren',
    'ACTION_CANCEL': 'Absagen',

    'LANG_NAME_ENGLISH': 'Englisch',
    'LANG_NAME_SPANISH': 'Spanisch',
    'LANG_NAME_CATALAN': 'Katalanisch',
    'LANG_NAME_FRENCH': 'Französisch',
    'LANG_NAME_GERMAN': 'Deutsch',

    'ACCOUNT_SIGN_UP': 'Sich einschreiben',
    'ACCOUNT_SIGN_IN': 'Anmelden',
    'ACCOUNT_SIGN_OUT': 'Abmelden',
    'ACCOUNT_REMEMBER': 'Angemeldet bleiben',

    'ACCOUNT_TERMS': 'Geschäftsbedingungen',
    'ACCOUNT_TERMS_INTRO': 'Before creating an account, make sure you ' +
    'understand the following points. Non-compliance with the rules will ' +
    'usually result in a warning, but your account could be banned in some ' +
    'serious cases.',
    'ACCOUNT_TERMS_P1': 'First point.',
    'ACCOUNT_TERMS_P2': 'Second point.',
    'ACCOUNT_TERMS_P3': 'Third point.',
    'ACCOUNT_TERMS_P4': 'Fourth point.',
    'ACCOUNT_TERMS_P5': 'Fifth point.',

    'USER_NAME': 'Name',
    'USER_EMAIL': 'Email',
    'USER_EMAIL_REPEAT': 'Email wiederschreiben',
    'USER_PASSWORD': 'Passwort',
    'USER_PASSWORD_REPEAT': 'Passwort wiederschreiben',

  });
});
