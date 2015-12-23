'use strict';


angular.module('nexdocApp').config(function ($translateProvider) {
  $translateProvider.translations('es', {

    'ACTION_ACCEPT': 'Aceptar',
    'ACTION_CANCEL': 'Cancelar',

    'LANG_NAME_ENGLISH': 'Inglés',
    'LANG_NAME_SPANISH': 'Español',
    'LANG_NAME_CATALAN': 'Catalán',
    'LANG_NAME_FRENCH': 'Francés',
    'LANG_NAME_GERMAN': 'Alemán',

    'ACCOUNT_SIGN_UP': 'Registrarse',
    'ACCOUNT_SIGN_IN': 'Acceder',
    'ACCOUNT_SIGN_OUT': 'Salir',
    'ACCOUNT_REMEMBER': 'Mantenerse conectado',

    'ACCOUNT_TERMS': 'Términos y condiciones',
    'ACCOUNT_TERMS_INTRO': 'Before creating an account, make sure you ' +
    'understand the following points. Non-compliance with the rules will ' +
    'usually result in a warning, but your account could be banned in some ' +
    'serious cases.',
    'ACCOUNT_TERMS_P1': 'First point.',
    'ACCOUNT_TERMS_P2': 'Second point.',
    'ACCOUNT_TERMS_P3': 'Third point.',
    'ACCOUNT_TERMS_P4': 'Fourth point.',
    'ACCOUNT_TERMS_P5': 'Fifth point.',

    'USER_NAME': 'Nombre',
    'USER_EMAIL': 'Email',
    'USER_EMAIL_REPEAT': 'Reescribir email',
    'USER_PASSWORD': 'Contraseña',
    'USER_PASSWORD_REPEAT': 'Reescribir contraseña',

  });
});
