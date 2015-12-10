'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('cat', {

    'LANG_NAME_ENGLISH': 'Anglés',
    'LANG_NAME_SPANISH': 'Espanyol',
    'LANG_NAME_CATALAN': 'Català',
    'LANG_NAME_FRENCH': 'Francés',
    'LANG_NAME_GERMAN': 'Alemà',

    'ACCOUNT_SIGN_UP': 'Registrar-se',
    'ACCOUNT_SIGN_IN': 'Iniciar sessió',
    'ACCOUNT_SIGN_OUT': 'Tancar sessió',

    'USER_NAME': 'Nom',
    'USER_EMAIL': 'E-Mail',
    'USER_PASSWORD': 'Contrassenya',

  });
});
