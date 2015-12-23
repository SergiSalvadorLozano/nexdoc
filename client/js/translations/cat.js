'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('cat', {

    'ACTION_ACCEPT': 'Acceptar',
    'ACTION_CANCEL': 'Cancel·lar',

    'LANG_NAME_ENGLISH': 'Anglés',
    'LANG_NAME_SPANISH': 'Espanyol',
    'LANG_NAME_CATALAN': 'Català',
    'LANG_NAME_FRENCH': 'Francés',
    'LANG_NAME_GERMAN': 'Alemà',

    'ACCOUNT_SIGN_UP': 'Registrar-se',
    'ACCOUNT_SIGN_IN': 'Accedir',
    'ACCOUNT_SIGN_OUT': 'Eixir',
    'ACCOUNT_REMEMBER': 'Mantenir-se connectat',

    'ACCOUNT_TERMS': 'Termes i condicions',
    'ACCOUNT_TERMS_INTRO': 'Before creating an account, make sure you ' +
    'understand the following points. Non-compliance with the rules will ' +
    'usually result in a warning, but your account could be banned in some ' +
    'serious cases.',
    'ACCOUNT_TERMS_P1': 'First point.',
    'ACCOUNT_TERMS_P2': 'Second point.',
    'ACCOUNT_TERMS_P3': 'Third point.',
    'ACCOUNT_TERMS_P4': 'Fourth point.',
    'ACCOUNT_TERMS_P5': 'Fifth point.',

    'USER_NAME': 'Nom',
    'USER_EMAIL': 'Email',
    'USER_EMAIL_REPEAT': 'Reescriure email',
    'USER_PASSWORD': 'Contrassenya',
    'USER_PASSWORD_REPEAT': 'Reescriure contrassenya',

  });
});
