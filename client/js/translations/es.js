'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('es', {

    'LANG_NAME_ENGLISH': 'Inglés',
    'LANG_NAME_SPANISH': 'Español',
    'LANG_NAME_CATALAN': 'Catalán',
    'LANG_NAME_FRENCH': 'Francés',
    'LANG_NAME_GERMAN': 'Alemán',

    'ACCOUNT_SIGN_UP': 'Registrarse',
    'ACCOUNT_SIGN_IN': 'Iniciar sesión',
    'ACCOUNT_SIGN_OUT': 'Cerrar sesión',

    'USER_NAME': 'Nombre',
    'USER_EMAIL': 'E-Mail',
    'USER_PASSWORD': 'Contraseña',

  });
});
